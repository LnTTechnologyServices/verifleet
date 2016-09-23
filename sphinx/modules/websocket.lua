-- websocket wser
-- expects messages with this format:
-- {
--   "command": "subscribe" | "unsubscribe",
--   "sn": <sn>,
--   "id": <request id>
-- }
-- it uses the session to check that the user has access to
-- <sn>, and if so subscribes this websocket to them. Once
-- subscribed, any time the device gateway service receives
-- a datapoint from device <sn> it sends it back to the
-- websocket client in this format:
-- {
--   "sn": <sn>,
--   "alias": <resource-alias>,
--   "timestamp": <timestamp>,
--   "value": <value>
-- }
-- Responses to request
--   {"id": <request id>, "status": "ok"}       - success
--   {"id": <request id>, "status": "badargs"}  - invalid arguments
--   {"id": <request id>, "status": "noauth"}   - user does not have
--                                                access to this device
--   {"status": "error"}                        - there was a big
--                                                problem (e.g. bad message
--                                                format)

function ws_response(message, id)
  if id ~= nil then
    message.id = id
  end
  return message
end

function ws_authenticated(websocket)
  return true
  -- TODO AUTH: make this actually work / verify Keystore authenticated value
  -- it simply doesn't work - so make it work

  -- local key = websocket_info.server_ip..'.'..websocket_info.socket_id
  -- local response = Keystore.get({key=key})
  -- if response ~= nil and response.value == 'ok' then
  --   return true
  -- end
  -- return false
end

function websocket(websocket_info)
  if websocket_info.type == "open" then
    -- websocket initialized here, next message should be {type:'auth', auth:authorizationToken}
    return ws_response({status="ok", type="open"})
  elseif websocket_info.type == "close" then
    -- cleanup websocket stuff
    -- remove socket_id from websocket so it doesn't get new messages
    -- TODO TSDB_DELETE: this does NOT work - the command for the timeseries does not work yet
    local query = 'drop series websocket_connections_1 where socket_id="'..websocket_info.socket_id..'"'
    print(Timeseries.command({q=query}))
    -- remove websocket authentication
    local key = websocket_info.server_ip..'.'..websocket_info.socket_id
    Keystore.delete({key=key}) -- remove websocket authenticated
    Websocket.close({socket_id=websocket_info.socket_id, server_ip=websocket_info.server_ip})
    return {}
  end

  -- we didnt get a close / open request, so it must be a websocket message
  local message = websocket_info.message
  if message == nil then
    return {type="error", message="message is null"}
  end

  local message = from_json(message)
  if message == nil then
    return {type="error", message="cannot parse json"}
  end

  -- the switch is based on message.type, so if there isn't a type on the message nothing can happen
  if message.type == nil then
    return {type="error", message="no command given"}
  end

  -- available types are ['authenticate', 'subscribe', 'unsubscribe']
  -- I think these are the ONLY types that should be used, so make sure
  -- if you add a new type that it is actually necessary
  local type = tostring(message.type)
  if type == 'authenticate' then
    -- TODO AUTH: hardcoded auth token for the moment, do something user specific here
    if message.auth == "Bearer testAuthToken" then
      -- if the user has authenticated, put a value into the keystore that shows they're authenticated
      -- and that they can send additional websocket messages
      -- this keystore will be accessed only in this file, and only on other message types
      local key = websocket_info.server_ip..'.'..websocket_info.socket_id
      Keystore.set({key=key, value="ok"})
      return ws_response({type="auth_response", authenticated=true})
    else
      return ws_response({type="auth_response", message="invalid auth"})
    end
  elseif type == 'subscribe' then
    -- subscribe to device data
    if ws_authenticated(websocket_info) then
      message.socket_id = websocket_info.socket_id
      message.server_ip = websocket_info.server_ip
      return ws_subscribe(message)
    else
      return ws_response({type="error", message="not authenticated"})
    end
  elseif type == 'unsubscribe' then
    -- unsubscribe from device data
    -- TODO: implement unsubscribe (this may not necessarily be very useful, but it should be implemented)
    if ws_authenticated(websocket_info) then
      return ws_unsubscribe(message)
    end
    return ws_response({type="error", message="not authenticated"})
  else
    -- if you have a message.type but it's not ['authenticate', 'subscribe', 'unsubscribe'] then
    -- the type isn't implemented
    return ws_response({type="error", message="unknown message type"})
  end
  -- dont know how you'd get here, but if you can hit this error message file a bug
  return ws_response({type="error", message="shouldnt have gotten here"})
end

function ws_subscribe(message)
  -- TODO: get subscriptions from global user state and modify
  -- this would unfortunately match multiple websockets to global state
  -- OR put the subscriptions on the websocket object (not sure if doable, but best option)
  local subscriptions = {}

  -- the subscribe message should be formatted as follows
  --[[
   {
    type: 'subscribe',
    devices: ['pid.sn1', 'pid.sn2'],
    aliases: ['alias1', 'alias2']
  }
  --]]

  -- TODO AUTH: ensure user has access to the devices / aliases being subscribed
  if message.devices ~= nil then
    for idx_or_device, dataports_or_device in pairs(message.devices) do
      if type(idx_or_device) == "string" then
        local device = idx_or_device
        local dataports = dataports_or_device
        local payload = {}
        if type(dataports) == "table" then
          for idx, dp in pairs(dataports) do
            payload[dp] = true
          end
        end
        -- write messages into the timeseries to store which websockets should receive data for which device
        -- this is how information is passed to the event_handler about which websocket_ids to send new device data to
        local query = TSW.write("websocket_connections_1", {socket_id=message.socket_id, device=device, server_ip=message.server_ip}, payload)
        Keystore.set({key='query', value=query})
        local resp = Timeseries.write({query=tostring(query)})
        subscriptions[idx_or_device] = dataports
      else
        -- we got an integer as the idx_or_key value,
        -- so that means we were just given a string RID
        -- subscriptions[dataports_or_device] = true
      end
    end
  end
  -- return a message to the websocket
  return {type="subscription_response", message="subscribed", subscriptions=subscriptions}
end

-- TODO WEBSOCKET_UNSUBSCRIBE: implement this
function ws_unsubscribe(user, message)
  return ws_response({status="not implemented", type="unsubscribe"})
end

-- TODO AUTH: modify & use this when authentication scheme changes
function ws_user_has_access(user, sn)
  local isowner = User.hasUserRoleParam({
    id = user.id, role_id = "owner", parameter_name = "sn", parameter_value = sn
  })
  local isguest = User.hasUserRoleParam({
    id = user.id, role_id = "guest", parameter_name = "sn", parameter_value = sn
  })
  return isowner == 'OK' or isguest == 'OK'
end

--[[
  data
  The data from the device

  data.api enum string (write|record)
  Provider API

  data.rid string
  Unique device resource id

  data.seq integer
  The message sequence number for specific resource id

  data.alias string
  Device resource alias

  data.value table{1 = "live"|timestamp, 2 = value}
  Data transmitted by the device

  data.vendor string
  Device vendor identifier

  data.device_sn string
  Device Serial number

  data.source_ip string
  The device source ip

  data.timestamp integer
  Event time
--]]

-- TODO MURANO: remove this once it's fixed (no idea what issue it is)
local hack = to_json(data)
local rdata = from_json(hack)



print("RID: "..rdata.rid)

local alias = rdata.alias
local payload = {}
local point = rdata.value[2]
if alias == "raw_data" or alias == "alarm_log" or alias == "gps" then
  datapoint = from_json(rdata.value[2])
  if datapoint ~= nil then
    if type(datapoint) == "table" then
      for key, value in pairs(datapoint) do
        if type(value) == "string" then
          value = '"'..value..'"'
        end
        payload[tostring(key)] = value
      end
    end
  end
else
  payload['value'] = point
end


-- Write the data to the Timeseries into a measurement of alias name (this needs checking / verification to see if it's a good idea)
local q = tostring(TSW.write(alias, {sn=tostring(rdata.device_sn), pid=rdata.pid}, payload))
local r = Timeseries.write({query=q})

-- TODO TSDB_DELETE: cannot currently run the delete command from the timeseries (Timeseries.command({}) doesn't work), so
-- need to limit to 5minutes so we don't get a flood of websocket connections that no longer exist
-- This should be refactored to not use the timeseries for storing the subscribed websockets
local query = tostring(TSQ:q():from('websocket_connections_1'):where_field_is(alias, true):groupby('socket_id', 'server_ip'):where_time_ago('5m'))
local response = Timeseries.query({q=query})

-- get the socketID / serverID pair for users that are listening for changes to the alias that was written to
-- and send them the message that we received here in the event handler
-- this will let us more easily send the messages out later
local socket_ids = {}
if response ~= nil and response.results ~= nil then
  for x, timeseries in pairs(response.results) do
    if timeseries ~= nil and timeseries.series ~= nil then
      for index, series in pairs(timeseries.series) do
        -- a device is returned for each of the series elements
        local tags = series.tags
        if tags ~= nil and tags.socket_id ~= nil then
          table.insert(socket_ids, {socket_id=tags.socket_id, server_ip=tags.server_ip})
        end
      end
    end
  end
end

-- if we have any websockets listening to changes for this device / alias pair, then send the live data to the websocket
if #socket_ids > 0 then
  local message = {
    payload = {
    sn = rdata.device_sn,
    pid = rdata.pid,
    did = rdata.pid..'.'..rdata.device_sn,
    alias = rdata.alias,
    timestamp = os.date("!%Y-%m-%dT%H:%M:%S.000000000Z"), -- need to add 0's so the timestamp is properly rendered by
    data = rdata.value[2], -- send the raw data that we received
    },
    type = "live_data"
  }

  for idx, socket in pairs(socket_ids) do
    -- for each websocket, send them a message with the data payload above
    Websocket.send({
      socket_id = socket.socket_id,
      server_ip = socket.server_ip,
      message = to_json(message),
      type="data-text"
    })
  end
end

-- update the devices table - this is where the API gets information about the available devices,
-- if this is not written to (something errors, things take a long time), then no devices will be
-- available to the API
-- It only needs to be written once to be accessible to the API (the last_heard isn't used anywhere yet)
local q = tostring(TSW.write('devices', {sn=tostring(rdata.device_sn), pid=rdata.pid}, {last_heard=(os.time()*1000)}))
local r = Timeseries.write({query=q})

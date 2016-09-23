--#ENDPOINT GET /api/v1/products
-- returns an object of {pid: [sn1,sn2]} pairs for all product ids that have written to the raw_data metric
if verifyRequestToken(response, request) then
  response.message = Product:list()
end
--#ENDPOINT GET /api/v1/products/{pid}
-- Get Device.productInfo() for a product id
-- returns a JSON object containing information about the PID (useful for getting aliases)
if verifyRequestToken(response, request) then
  local options = getOptionsFromRequest(request, {"pid"})
  if options.ok == true then
    response.message = Product:info(options.pid)
  else
    response.message = {status="Missing required parameter pid"}
  end
end
--#ENDPOINT GET /api/v1/devices
-- GET /api/v1/devices
-- Get a list of all available devices to the solution
-- @return A list of device objects [ {deviceA}, {deviceB} ]
if verifyRequestToken(response, request) then
  local options = getOptionsFromRequest(request)
  response.message = Device:list(options)
end
--#ENDPOINT GET /api/v1/devices/{pid}
-- @param pid - filter the device list by specific PID
if verifyRequestToken(response, request) then
  local options = getOptionsFromRequest(request, {"pid"})
  if options.ok == true then
    response.message = Device:list(options)
  else
    response.message = {status="Missing required parameter pid"}
  end
end
--#ENDPOINT GET /api/v1/devices/{pid}/{sn}
-- @param pid - pid of device
-- @param sn - sn of device
if verifyRequestToken(response, request) then
  local options = getOptionsFromRequest(request, {"pid", "sn"})
  if options.ok == true then
    response.message = Device:list(options)
  else
    response.message = {status="Missing required parameters pid and sn"}
  end
end
--#ENDPOINT GET /api/v1/devices/{pid}/{sn}/{alias}
-- @param pid - pid of device
-- @param sn - sn of device
-- @param alias - alias of device to read
-- @param limit - query string limit to specify how many datapoints to read
if verifyRequestToken(response, request) then
  local options = getOptionsFromRequest(request, {"pid", "sn", "alias"})
  if options.ok == true then
    response.message = Device:read(options)
  else
    response.message = {status="Missing required parameters pid, sn, and alias"}
  end
end
--#ENDPOINT GET /api/v1/users
-- GET /api/v1/users
-- Get a list of users
-- @return A list of user objects
if verifyRequestToken(response, request) then
  response.message = User:list()
end
--#ENDPOINT GET /api/v1/users/{id}
-- GET /api/v1/users/{id}
-- Get a user by ID
-- @param id - user ID
-- @return a success or error message
if verifyRequestToken(response, request) then
    local id = request.parameters.id
    if id == nil then
        response.code = 400
        response.message = "User ID required"
    else
        local user = User:get(id)
        response.message = user.message
        response.code = user.status
    end
end
--#ENDPOINT PUT /api/v1/users
-- PUT /api/v1/users
-- Create a user
-- @return a success or error message
if verifyRequestToken(response, request) then
    local options = {}
    options.email = request.body.email
    options.name = request.body.name
    options.password = request.body.password
    options.domain = string.gsub(request.uri, 'https?://(.-/)(.*)', '%1')

    if options.email == nil or options.name == nil or options.password == nil then
        response.code = 400
        response.message = "The following properties are all required: email, password, name"
    else
        response.message = User:create(options)
    end
end
--#ENDPOINT DELETE /api/v1/users/{id}
-- DELETE /api/v1/users/{id}
-- Delete a user
-- @param id - user ID
-- @return a success or error message
if verifyRequestToken(response, request) then
local id = request.parameters.id
    if id == nil then
        response.code = 400
        response.message = "User ID required"
    else
        response.message = User:delete(id)
    end
end
--#ENDPOINT GET /api/v1/users/roles
-- GET /api/v1/users/roles
-- Get a list of user roles
-- @return A list of user role objects
if verifyRequestToken(response, request) then
    response.message = User:listRoles()
end
--#ENDPOINT GET /api/v1/test
response.message = request
--#ENDPOINT GET /api/v1/authtest
if verifyRequestToken(response, request) then
  response.message = request
end
--#ENDPOINT POST /api/v1/email
local key = request.body.key
if key == "NxeFWQfXBUvaC4VB5ECLc9FW3MidBq3mZtREvRSwMpiFUnbwjZ" then
  local email = request.body.email
  local subject = request.body.subject
  local message = request.body.message

  Email.send({
    from = 'PooF Example App <mail@exosite.com>',
    to = email,
    subject = (subject),
    text = message
  })
  return "{\"status\":\"ok\"}"
end
response.message = request.body
--#ENDPOINT WEBSOCKET /api/v1/ws
--if verifyRequestToken(response, websocketInfo) then
  response.message = websocket(websocketInfo)
--end
--#ENDPOINT GET /debug-command/{cmd}
response.message = debug(request.parameters.cmd)
--#ENDPOINT WEBSOCKET /debug
response.message = debug(websocket_info.message)
--#ENDPOINT POST /api/v1/ts/debug
if verifyRequestToken(response, request) then
  local query = request.body.query
  if query == nil then
    return to_json({status="no query"})
  end
  response.message = Timeseries.query({q=query})
end
--#ENDPOINT POST /api/v1/ts/command
if verifyRequestToken(response, request) then
  local query = request.body.query
  if query == nil then
    return to_json({status="no query"})
  end
  response.message = Timeseries.command({q=query})
end
--#ENDPOINT GET /api/v1/kv/debug
if verifyRequestToken(response, request) then
  local keys = Keystore.list()
  local kvs = {}
  for index, key in pairs(keys.keys) do
    local value = Keystore.get({key=key})
    kvs[key] = value.value
  end
  return kvs
end
--#ENDPOINT GET /api/v1/kv/get/{key}
if verifyRequestToken(response, request) then
  response.message = Keystore.get({key=request.parameters.key})
end
--#ENDPOINT GET /api/v1/test/200
response.code = 200
--#ENDPOINT POST /api/v1/test/keystore
if verifyRequestToken(response, request) then
  local message = request.body
  local key = message.key
  local value = message.value
  Keystore.set({key=key, value=value})
  return Keystore.get({key=key})
end
--#ENDPOINT POST /api/v1/test/timeseries
if verifyRequestToken(response, request) then
  print("Timeseries")
  local message = request.body
  local tags = message.tags
  local values = message.values
  local write_query = TSW.write('testing', tags, values)
  response.message = Timeseries.write({query=tostring(write_query)})
end
-- local query = TSQ:q():from('testing'):limit(1)
-- for tag, value in pairs(tags) do
--   query = query:where_tag_is(tag, value)
-- end
-- for value_key, value in pairs(tags) do
--   query = query:where_tag_is(tag, value)
-- end
-- return Timeseries.query({q=tostring(query)})

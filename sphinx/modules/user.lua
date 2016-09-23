-- get current logged in user from webservice request
-- returns user table or nil if no user is contained
-- in headers
function currentUser(request)
  return currentUserFromHeaders(request.headers)
end

-- determine the current user from the session information
-- stored in webservice or websocket request headers.
-- returns user table or nil if no user is contained
-- in headers
function currentUserFromHeaders(headers)
  if type(headers.cookie) ~= "string" then
    return nil
  end
  local _, _, sid = string.find(headers.cookie, "sid=([^;]+)")
  if type(sid) ~= "string" then
    return nil
  end
  local user = User.getCurrentUser({token = sid})
  if user ~= nil and user.id ~= nil then
    user.token = sid
    return user
  end
  return nil
end

function User:list(options)
  return User.listUsers(options)
end

function User:create(options)
  local email = options.email
  local name = options.name
  local password = options.password
  local domain = options.domain

  local ret = User.createUser({
    email = email,
    name = name,
    password = password
  })

  local response = {}

  if ret.message ~= nil or ret.status_code ~= nil then
    response.code = ret.status_code
    response.message = ret.message
  else
    local text = "Hi " .. email .. ",\n"
    text = text .. "Click this link to verify your account:\n"
    text = text .. "https://" .. domain .. "verify/" .. ret;
    Email.send({
      from = 'Sample App <mail@exosite.com>',
      to = email,
      subject = ("Signup on " .. domain),
      text = text
    })
    response.code = 200
    response.message = "success"
  end

  return response
end

function User:delete(id)
  local response = {}

  if id == nil then
    response.code = 400
    response.message = "User ID is required"
    return response
  end

  local options = {}
  options.id = id

  local ret = User.deleteUser(options)

  if ret.message ~= nil or ret.status_code ~= nil then
    response.code = ret.status_code
    response.message = ret.message
  else
    response.code = 200
    response.message = "The user with id " .. id .. " was deleted. "
  end

  return response
end

function User:get(id)
  local options = {}
  options.id = id
  return User.getUser(options)
end

function User:listRoles()
--  local ret = User.listRoles()   TODO: Figure out why User.listRoles() doesn't work.

  local response = {}

  return response
end

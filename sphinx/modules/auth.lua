-- TODO AUTH: verifyRequestToken uses a hardcoded API token to verify the user has access to the endpoint
-- when the frontend moves to using Murano authentication, change verifyRequestToken to actually verify the user
function verifyRequestToken(response, request)
  -- TODO AUTH_USER: verify the user a valid token and the user has access to the endpoint requested
  if request.headers["authorization"] == "Bearer testAuthToken" then
    return true
  end
  response.code = 401
  response.message = {status="error", message="invalid auth"}
  return false
end

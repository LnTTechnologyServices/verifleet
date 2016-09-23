
function table:reverse(t)
  local reversed = {}
  local itemCount = #t
  for k, v in ipairs(t) do
      reversed[itemCount + 1 - k] = v
  end
  return reversed
end

function table.contains(table, element)
  for _, value in pairs(table) do
    if value == element then
      return true
    end
  end
  return false
end

-- default a particular key in a table to value
-- if that index already exists, otherwise does nothing.
function default(t, key, defaultValue)
  if not table.contains(t, key) then
    t[key] = defaultValue
  end
end

http_error_codes = {
  [400] = {
    code = 400,
    message = "Bad Request",
    headers = {}
  },
  [403] = {
    code = 403,
    message = "Permission Denied",
    headers = {}
  },
  [404] = {
    code = 404,
    message = "Not Found",
    headers = {}
  }
}

function http_error(code, response)
  if http_error_codes[code] ~= nil then
    for key, value in pairs(http_error_codes[code]) do
      response[key] = value
    end
  else
    response.code = code
    response.message = "No prepared message for this code"
  end
end

function trigger(alert, timerid)
  Timer.sendAfter({
    message = alert.message,
    duration = alert.timer * 60 * 1000,
    timer_id = timerid
  })
  alert.timer_running = true
  alert.timer_id = timerid
end

function cancel_trigger(alert)
  Timer.cancel({timer_id = alert.timer_id})
  alert.timer_running = false
end

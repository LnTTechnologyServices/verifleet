
-- A request object can have properties on it (pid, sn, alias, limits, timespans, etc.)
-- look at the request parameters (this includes query strings and actual request URLs)
-- and try to grab the options that are given
-- also verify that all requiredParams are on the request
function getOptionsFromRequest(request, requiredParams)
--[[
Get options from request object

All options can be passed in as URL parameters or query string args

Arguments: raw request and requiredParams - this will ensure the
included arguments are in the request object

Allowable Parameters:
  pid (string)
  sn (string)
  alias (string)
  limit (integer)
  starttime (epoch integer in ms)
  endtime (epoch integer in ms)
--]]

  local pid = request.parameters.pid
  local sn = request.parameters.sn
  local alias = request.parameters.alias
  local limit = request.parameters.limit
  local starttime = request.parameters.starttime
  local endtime = request.parameters.endtime

  local options = {}

  if pid ~= nil then options.pid = tostring(pid) end
  if sn ~= nil then options.sn = tostring(sn) end
  if alias ~= nil then options.alias = tostring(alias) end
  if limit ~= nil then options.limit = tonumber(limit) end
  if starttime ~= nil then options.starttime = tonumber(starttime) end
  if endtime ~= nil then options.endtime = tostring(endtime) end

  options.required = requiredParams
  options.params = request.parameters
  options.req = {}

  if requiredParams ~= nil then
    for idx, requiredParam in pairs(requiredParams) do
      if options[requiredParam] == nil then
        return {ok=false, invalid=requiredParam}
      end
    end
  end
  options.ok = true
  return options
end

-- Read a single device alias
-- TODO: refactor to support multiple aliases
function Device:read(options)
  local pid = options.pid
  local sn = options.sn
  local alias = options.alias
  local limit = options.limit or 1

  if pid == nil or sn == nil or alias == nil then
    return {data=false}
  end

  local query = TSQ:q():from(alias):limit(limit):where_tag_is("pid",pid):where_tag_is("sn",sn)
  if options.starttime ~= nil then
    query = query:where_time_after(options.starttime)
  end
  if options.endtime ~= nil then
    query = query:where_time_before(options.endtime)
  end

  query = query:groupby("pid","sn"):orderby("DESC")

  local response = Timeseries.query({q=tostring(query)})

  local data = {}

  for x, timeseries in pairs(response.results) do
    for index, series in pairs(timeseries.series) do
      -- a device is returned for each of the series elements
      local tags = series.tags
      local columns = series.columns
      local values = series.values
      local datapoints = {}

      for rindex, value in pairs(values) do
        local datapoint = {}
        for kindex, key in pairs(columns) do
          if key == "time" then key = "ts" end
          datapoint[key] = value[kindex]
        end
        table.insert(datapoints, datapoint)
      end
      data[alias] = table:reverse(datapoints)
    end
  end
  -- data will be a JSON object of {alias:datapoints, alias:datapoints}
  return data
end

-- get a list of all devices, devices that have a particular PID / SN
-- this builds the device object that the API expects
-- if a PID is given, read all dataports associated with a device,
-- if a PID is NOT given, read hardcoded datapoints below
function Device:list(options)
  --[[
    The logic here is slightly hard to follow because a bug in the TSDB makes general requests hard.
    Input:
    options.pid? -> get product info and read each alias given by the product
    options.aliases -> {$aliasName:{limit=1}} read these aliases w/ the limits defined

    The loop goes a little like

  --]]


  local devices = {}
  local aliases = options.aliases or {}

  -- if we get a PID, then read all the aliases for the PID
  -- if we don't, then read the hardcoded aliases below
  -- each alias call is a separate call to the timeseries, so as the number of dataports increases,
  -- the performance will decrease (N calls per M devices = N*M TSDB service calls)
  if options.pid ~= nil then
    local product_info = Product:info(options.pid)
    for idx, dataport_info in pairs(product_info.resources) do
      aliases[dataport_info.alias] = {limit=(options.limit or 1)}
    end
  else
    aliases = {['moisture']={limit=10}, ['temperature']={limit=10}, ['light']={limit=10}, ['alarm_log']={limit=10}}
  end

  if aliases == {} then
    return {status="No aliases set in options and no PID, so I can't find what you're looking for!"}
  end

  --[[
    for each alias in aliases
      build query grouped by PID / SN
      fire query
      check if there's data in the response
        -- the response looks a little bit like [{results:[{series1}]}]
        for each device in the series
          get the device from the device list or create a new one
          zip the values and the columns for the alias
          update the device to include that list of datapoints
    return the devices
  --]]

  local device_index = 0
  for alias, alias_options in pairs(aliases) do
    local limit = alias_options.limit or options.limit or 1
    local starttime = alias_options.starttime or options.starttime or nil
    local endtime = alias_options.endtime or options.endtime or nil

    local query = TSQ:q():from(alias):limit(limit):groupby("pid","sn")

    if starttime ~= nil then
      query = query:where_time_after(starttime)
    end

    if endtime ~= nil then
      query = query:where_time_before(endtime)
    end

    if options.pid then
      query = query:where_tag_is('pid', options.pid)
      if options.sn then
        query = query:where_tag_is('sn', options.sn)
      end
    end
    query = query:orderby("DESC")

    local response = Timeseries.query({q=tostring(query)})

    if response == nil then
      return {status="Unable to access TSDB!"}
    end

    -- parse the response received from the TSDB
    for x, timeseries in pairs(response.results) do
      if timeseries ~= nil and timeseries.series ~= nil then
        for index, series in pairs(timeseries.series) do
          -- a device is returned for each of the series elements
          local tags = series.tags
          local device = {pid=tags.pid, sn=tags.sn, data={}}
          local device_found = false

          -- since we're looping over dataports multiple times for the same device,
          -- we need to see if we already have this device in the device list
          for idx, found_device in pairs(devices) do
            if found_device.pid == device.pid and found_device.sn == device.sn then
              device = found_device
              device_index = idx
              device_found = true
              break
            end
          end
          if device_found ~= true then
            device_index = 0
          end

          local columns = series.columns
          local values = series.values
          local datapoints = {}

          for rindex, value in pairs(values) do
            local datapoint = {}
            for kindex, key in pairs(columns) do
              -- TSDB calls timestamp time, we'll use ts for the timestamp key
              if key == "time" then key = "ts" end
              datapoint[key] = value[kindex]
            end
            table.insert(datapoints, datapoint)
          end
          -- data is returned big timestamp to small timestamp, so we have to reverse it
          device.data[alias] = table:reverse(datapoints)
          -- did is the unique key that corresponds to the device (like an RID)
          device.did = device.pid..'.'..device.sn
          -- if this device doesn't exist in our table yet, add it
          -- otherwise, update the device with the new data
          if device_index == 0 then
            table.insert(devices, device)
          else
            devices[device_index] = device
          end
        end
      end
    end
  end

  -- if sn is given, return single device object rather than a list of devices
  if options.sn ~= nil then
    if #devices == 1 then
      return devices[1]
    end
  end
  return devices
end

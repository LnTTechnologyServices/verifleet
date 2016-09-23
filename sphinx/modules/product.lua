function Product:list(options)
  local pids = {}

  local query = "select last_heard from devices group by pid,sn limit 1"
  local response = Timeseries.query({q=query})

  for x, timeseries in pairs(response.results) do
    for index, series in pairs(timeseries.series) do
      -- a device is returned for each of the series elements
      local tags = series.tags
      if pids[tags.pid] == nil then
        pids[tags.pid] = {}
      end
      table.insert(pids[tags.pid], tags.sn)
    end
  end
  return pids
end

function Product:info(pid)
  return Device.productInfo({pid=pid})
end

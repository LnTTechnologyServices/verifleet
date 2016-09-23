
interface Datapoint {
  timestamp: number,
  [propName: string]: any;
}

interface Dataports {
  [index: string]: Datapoint[]; // {alias: [data, data]}
  // JSON objects encoded w/ 1P timestamp - if JSON object then override timestamp in object with 1P timestamp, if not json then {"timestamp": 1P_timestamp_in_ms, "value": dataport_value}
}

interface Read {
  rid: string
  model: string
  sn: string
  alias: string
  data: Dataports;
}

interface ReadOptions {
  limit?:number
  start?:number
  end?:number
}

interface Write {
  rid: string
  data: any
  alias: string
}

interface CreateDevice {
  sn: (string)
  model: string
  vendor?: string
  name: (string)
}

interface DeleteDevice {
  sn: string
  model: string
  rid: string
}

export {CreateDevice, DeleteDevice, Write, Read, ReadOptions, Dataports, Datapoint};

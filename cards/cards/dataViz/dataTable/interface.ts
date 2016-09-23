interface DataPoint {
  timestamp: number,
  value: any
}

interface Row {
  name: string,
  data: DataPoint[];
  rowColorFunction?: (data: DataPoint[]) => (string|undefined);
}

interface DataTable {
  title: string,
  rows: Row[],
  // default row color function if not supplied with row
  rowColorFn?: (data: DataPoint[]) => (string|undefined);
}

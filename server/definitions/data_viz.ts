interface Datapoint {
  x: number;
  y: number;
}

interface Line {
  data: (number | Datapoint[]);
  title?: string;
  class?: string;
}

interface Bar {
  value: number;
  title: number;
  max?: number;
  min?: number;
}

interface BarChart {
  lines: Line[];
  bars: Bar[];
}

interface BigIcon {
  iconUrl?: string;
  iconClass?: string;
  onClick?: () => void;
}

interface BigNumber {
  value: number;
  text: string;
  unit?: string;
}

interface FleetStatus {
  name: string;
  value: number;
  class?: string;
}

interface FleetHealth {
  states: FleetStatus[];
}

interface HalfMoonGauge {
  value: number;
  text: string;
  min?: number;
  max?: number;
  unit?: string;
}

interface LineChart {
  data: Line[];
}

export {Datapoint, Line, Bar, BarChart, BigIcon, BigNumber, FleetStatus, FleetHealth, HalfMoonGauge, LineChart};

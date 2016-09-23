
interface Switch {
  state: boolean;
  onClick: () => void;
}

interface TernerySwitch {
  state: number;
  states: string[];
}

export {Switch, TernerySwitch};


type State = "on" | "off" | number;

interface BigIcon {
  icon: string, // icon class
  state?: State, // default on state / off state or 1/0
  coloron?: string, // default to #ECC800 if state is truthy
  coloroff?: string, // default to #424242 @ 54% opacity if state is falsey
};

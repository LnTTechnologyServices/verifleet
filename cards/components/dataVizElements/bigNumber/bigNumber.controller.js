class BigNumberController {
  constructor() {
    // set the default values for the component
    this.name = 'bigNumber';
    this.decimals = 2;
  }

  $onChanges(changes) {
    // if the values is number then set else reset back to old value
    if (changes.value) {
      let value = changes.value.currentValue
      if(typeof changes.value.currentValue === "string") {
        value = parseFloat(value);
        if(isNaN(value)) {
          return
        }
      }
      let pow = Math.pow(10, this.decimals);
      this.value = Math.round(value*pow)/pow;
    }
  }
}

export default BigNumberController;

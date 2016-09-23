class listItemStatusController {
  constructor() {
    this.state = 'healthy';
  }
  $onChanges(changes) {
    if(changes.status) {
      this.state = changes.status.currentValue
    }
  }
}

export default listItemStatusController;

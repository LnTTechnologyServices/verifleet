export default class controller {
  constructor($log) {
    let vm = this

    vm.item = {
      description: 'description',
      subtitle: 'test subtitle',
      timestamp: 1467259277863,
      title: 'Title',
      lastReported: '30 sec in the future',
      status: 'healthy',
      icon: 'power',
      sideText: '30 cases',
      onClick: function() {
        $log.log('you clicked me!')
      }
    }
  }
}


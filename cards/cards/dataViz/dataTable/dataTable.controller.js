class DataTableController  {
  constructor() {
    this.name = 'dataTable';

    this.rowColorFn = function(data) {
      if(_.isArray(data) && data.length != 0) {
        if(data[0].value == data[data.length - 1].value) {
          return "#FFFFFF";
        } else {
          return "#FF0000";
        }
      }
    }

    this.getTimestamps();
  }

  getTimestamps() {
    var result = [];
    _.forEach(this.rows, function (value) {
      _.forEach(value.data, function (inner) {
        if (inner !== '') {
          if (moment(new Date(inner.timestamp)).isValid()) {
            // Parse timestamp if its not in the expected format
            result.push(moment(inner.timestamp).format("H:mmA"));
          } else {
            result.push(inner.timestamp);
          }
        }
      });
    });
    this.timestamps = _.uniq(result);
  }

  $onChanges(changes) {
    if (changes.rows) {
      this.rows = changes.rows.currentValue;
      this.getTimestamps();
    }
  }

}

export default DataTableController;

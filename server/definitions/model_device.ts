import * as Q from 'q';
import * as _ from 'lodash';
import {ReadOptions, Datapoint} from './device'
import {exo, exoDefer} from '../simplep/simplep'

module.exports = function(sequelize, DataTypes) {
  let Device = sequelize.define('device', {
    rid: {type: DataTypes.STRING, unique: true, primaryKey: true},
    created: {type: DataTypes.FLOAT, defaultValue: new Date().getTime()},
    model: DataTypes.STRING,
    name: DataTypes.STRING,
    sn: DataTypes.STRING,
    vendor: DataTypes.STRING,
    updated: {type: DataTypes.FLOAT, defaultValue: new Date().getTime()},
    type: {type: DataTypes.STRING, defaultValue: "device"}
  }, {
    classMethods: {
      associate: function(models) {
        Device.hasMany(models.Notifications);
        Device.hasMany(models.Permissions);
      }
    },
    instanceMethods: {
      read: function(alias: string, options?: ReadOptions) {
        console.log("This: ", this)
      },
      write: function(alias: string, payload: (Object|number|string)) {
        let auth = {"cik": process.env['CIK'], "client_id": this.rid};
        return exo.write(auth, alias, payload).then(function(result) {
          //console.log("exo write result:" , result);
          return result
        })
      },
      getDataports: function() {
        let defer = Q.defer();
        let auth = {"cik": process.env['CIK'], "client_id": this.rid};
        let infoDefer = new exoDefer(auth);
        infoDefer.info().then(function(info) {
          let aliases = _.map(info[0].result.aliases, function(value, key) {
            return value[0];
          });
          defer.resolve(aliases);
        })
        return defer.promise;
      },
      readData: function(options?: ReadOptions) {
        let defer = Q.defer();
        if(!options) { options = {limit:1}}
        let auth = {"cik": process.env['CIK'], "client_id": this.rid};
        let infoDefer = new exoDefer(auth);
        infoDefer.info().then(function(info) {
          let aliases = _.map(info[0].result.aliases, function(value, key) {
            return value[0];
          });
          if(aliases.length) {
            let data = {};
            let readDefer = new exoDefer(auth);
            _.each(aliases, function(alias) {
              //console.log("Reading alias: ", alias);
              readDefer.read(alias, options);
            })
            readDefer.then(function(results) {
              _.each(results, function(result) {
                let alias = aliases[result.id];
                let datapoints = _.map(result.result, function(datapoint) {
                  var point;
                  try {
                    point = JSON.parse(datapoint[1]);
                    if(!point['timestamp']) {
                      point['timestamp'] = datapoint[0]*1000;
                    }
                  } catch(e) {
                    point = {
                      'value': datapoint[1],
                      'timestamp': datapoint[0]*1000
                    }
                  }
                  return point as Datapoint
                })
                datapoints = _.filter(datapoints, function(x) { return x.timestamp });

                data[alias] = datapoints;
              })
              //console.log("Results from read defer: ", data);
              defer.resolve(data);
            })
          } else {
            defer.resolve({});
          }
        })
        return defer.promise;
      }
    },
  });
  return Device;
};

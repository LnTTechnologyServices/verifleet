module.exports = function(sequelize, DataTypes) {
  let Notification = sequelize.define('notification', {
    name: DataTypes.STRING,
    receive_sms: DataTypes.BOOLEAN,
    receive_email: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Notification.hasOne(models.User, {'foreignKey': 'email'})
        Notification.hasOne(models.Device, {'foreignKey': 'rid'})
      }
    }
  });
  return Notification;
};

module.exports = function (sequelize, DataTypes) {
    var Permission = sequelize.define('permission', {
        write: DataTypes.BOOLEAN,
        read: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function (models) {
                Permission.hasOne(models.User, { 'foreignKey': 'email' });
                Permission.hasOne(models.Device, { 'foreignKey': 'rid' });
            }
        }
    });
    return Permission;
};
//# sourceMappingURL=model_permission.js.map
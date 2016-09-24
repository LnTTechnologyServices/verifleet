module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user', {
        email: { type: DataTypes.STRING, primaryKey: true, unique: true },
        name: { type: DataTypes.STRING, defaultValue: "" },
        role: { type: DataTypes.STRING, defaultValue: "guest" },
        phone: { type: DataTypes.STRING, defaultValue: "" },
        created: { type: DataTypes.FLOAT, defaultValue: new Date().getTime() },
        logins: { type: DataTypes.INTEGER, defaultValue: 0 },
        data: { type: DataTypes.JSONB },
        updated: { type: DataTypes.FLOAT, defaultValue: new Date().getTime() },
        type: { type: DataTypes.STRING, defaultValue: "user" }
    }, {
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Notifications);
                User.hasMany(models.Permissions);
            }
        },
        instanceMethods: {}
    });
    return User;
};
//# sourceMappingURL=model_user.js.map
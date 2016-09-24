// user interface / class definitions
"use strict";
;
var User = (function () {
    function User(user) {
        this.type = "user";
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.created = user.created;
        this.logins = user.logins;
        this.role = user.role;
        this.devices = user.devices;
        this.notifications = user.notifications;
    }
    User.prototype.isAdmin = function () {
        return this.role === "manager";
    };
    User.prototype.canView = function (deviceRid) {
        return this.devices.indexOf(deviceRid) > -1;
    };
    //
    // API calls required for user
    //
    User.prototype.set = function (key, value) {
        // emit API call to store user phone
        console.log("Setting ", this.email, " key: ", key, " to ", value);
        this[key] = value;
    };
    User.prototype.get = function (key) {
        console.log("Getting key for user: ", this.email, " key: ", key);
        return this[key];
    };
    User.prototype.setPermissions = function (permission) {
        // emit API call to set user permissions
        console.log("Setting device permission for user: ", this.email, " permission: ", permission);
    };
    User.prototype.setNotifications = function (notification) {
        // TODO: Emit API call to store user notification settings. Notification is an object with {rid: "", sms: boolean, email: boolean, report: boolean}
        console.log("Setting device notifications for user ", this.email, " with notifications: ", notification);
    };
    User.prototype.setRole = function (role) {
        // emit API call to set user role
        console.log("Setting user role: ", this.email, " ", role);
        this.role = role;
    };
    return User;
}());
exports.User = User;
;
var CurrentUser = (function () {
    function CurrentUser(user) {
        this.type = "current_user";
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
    }
    CurrentUser.prototype.isAdmin = function () {
        return this.role === "admin";
    };
    CurrentUser.prototype.setUserRole = function (user, role) {
        if (this.isAdmin() || user.email === this.email) {
            console.log("Modifying user: ", user, " setting role: ", role);
            user.set('role', role);
        }
    };
    ;
    CurrentUser.prototype.setUserNotifications = function (user, notification) {
        // emit API call to save notifications for device
        if (this.isAdmin() || user.email === this.email) {
            user.setNotifications(notification);
            console.log("Setting notification for user: ", this.email, " ", notification);
        }
    };
    CurrentUser.prototype.setUserPermission = function (user, permission) {
        if (this.isAdmin() || user.email === this.email) {
            user.setPermissions(permission);
        }
    };
    ;
    CurrentUser.prototype.set = function (user, key, value) {
        if (this.isAdmin() || user.email === this.email) {
            console.log("Setting key: ", key, " to value ", value, " for user: ", user);
            user.set(key, value);
        }
    };
    CurrentUser.prototype.logout = function () {
        console.log("Logging user out! ", this.email);
        this.loggedIn = false;
    };
    CurrentUser.prototype.login = function () {
        console.log("Logging user in! ", this.email);
        this.loggedIn = true;
    };
    return CurrentUser;
}());
exports.CurrentUser = CurrentUser;
//# sourceMappingURL=user.js.map
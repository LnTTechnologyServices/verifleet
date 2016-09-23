// user interface / class definitions

import {CreateUser, DeleteUser} from './user_actions';

interface Notification {
  rid: string
  sms: boolean
  email: boolean
  report: boolean
  name?: string
}

interface Permission {
  rid: string
  write: boolean
  read: boolean
}

// user object returned from API
interface UserFromAPI {
  email: string
  name?: string
  role: string
  phone?: string
  created?: number
  logins?: number
  devices?: string[]; // rids for devices
  notifications?: Notification[];
  permissions?: Permission[];

  type?: string
}


interface UserAPI {
  // store user data
  load(userID: number): User

  get(userID: number, key: string): string | number
  set(userID: number, key: string, value: any): boolean
  add(userID: number, key: string, value: any): boolean // add to grouping (permissions)
  remove(userID: number, key: string, value: any): boolean // remove item from grouping

  delete(userID: number): boolean // delete user

  // set user device permissions
  getPermission(userID: number, deviceID?: string): Permission[]
  setPermission(userID: number, permission: Permission): any // (uid, did, permission) -> true/false/error

  getNotification(userID: number, deviceID?: string): Notification[]
  setNotification(userID: number, notification: Notification): any
}

interface User extends UserFromAPI {};
class User {
  constructor(user: UserFromAPI) {
    this.type = "user"
    this.name = user.name
    this.email = user.email
    this.phone = user.phone
    this.created = user.created
    this.logins = user.logins
    this.role = user.role
    this.devices = user.devices
    this.notifications = user.notifications
  }

  isAdmin(): boolean {
    return this.role === "manager"
  }

  canView(deviceRid: string): boolean {
    return this.devices.indexOf(deviceRid) > -1
  }
  //
  // API calls required for user
  //

  set(key: string, value: any): void {
    // emit API call to store user phone
    console.log("Setting ", this.email, " key: ", key, " to ", value)
    this[key] = value
  }

  get(key: string): any {
    console.log("Getting key for user: ", this.email, " key: ", key)
    return this[key]
  }

  setPermissions(permission: Permission): void {
    // emit API call to set user permissions
    console.log("Setting device permission for user: ", this.email, " permission: ", permission)

  }

  setNotifications(notification: Notification): void {
    // TODO: Emit API call to store user notification settings. Notification is an object with {rid: "", sms: boolean, email: boolean, report: boolean}
    console.log("Setting device notifications for user ", this.email, " with notifications: ", notification)
  }

  setRole(role: string): void {
    // emit API call to set user role
    console.log("Setting user role: ", this.email, " ", role)
    this.role = role
  }

}

interface CurrentUser extends UserFromAPI {
  loggedIn: boolean
};

class CurrentUser {
  constructor(user: User) {
    this.type = "current_user"
    this.name = user.name
    this.email = user.email
    this.role = user.role
  }

  isAdmin(): boolean {
    return this.role === "admin"
  }

  setUserRole(user: User, role: string): void {
    if(this.isAdmin() || user.email === this.email) {
      console.log("Modifying user: ", user, " setting role: ", role)
      user.set('role', role)
    }
  };

  setUserNotifications(user: User, notification: Notification): void {
    // emit API call to save notifications for device
    if(this.isAdmin() || user.email === this.email) {
      user.setNotifications(notification)
      console.log("Setting notification for user: ", this.email, " ", notification)
    }
  }

  setUserPermission(user: User, permission: Permission): void {
    if(this.isAdmin() || user.email === this.email) {
      user.setPermissions(permission);
    }
  };

  set(user: User, key: string, value: any) {
    if(this.isAdmin() || user.email === this.email) {
      console.log("Setting key: ", key, " to value ", value, " for user: ", user)
      user.set(key, value)
    }
  }

  logout(): void {
    console.log("Logging user out! ", this.email)
    this.loggedIn = false
  }

  login(): void {
    console.log("Logging user in! ", this.email)
    this.loggedIn = true
  }
}

export {User, CurrentUser, UserFromAPI, CreateUser, DeleteUser, Permission, Notification};

import * as _ from 'lodash';

import {getDB} from '../common/db';

import {User, UserFromAPI, Permission, Notification} from '../definitions/user';
import {CreateUser, DeleteUser} from '../definitions/user_actions';


function exo_user_create(createUser: CreateUser): any {
  return getDB().User.create(createUser);
}

function exo_user_delete(deleteUser: DeleteUser): any {
  return getDB().User.destroy({
    where: deleteUser
  });
}

function exo_user_get(email?: string): any {
  let attributes = ['email', 'role', 'name', 'logins', 'createdAt', 'phone']
  if(!email) {
    return getDB().User.findAll({attributes: attributes}).then(function(users) {
      let us =  _.each(users, function(user) {
        return new User(user as UserFromAPI);
      });
      return us
    })
  } else {
    return getDB().User.findOne({where: {email: email}, attributes: attributes}).then(function(user) {
      return new User(user as UserFromAPI);
    })
  }
}

function exo_user_kv_get(email: string, keys: string[]): any {
  return getDB().User.findOne({where: {email: email}, attributes: ['data', 'email']}).then(function(user) {
    return _.pick(user.data, keys)
  })
}

function exo_user_kv_set(email: string, payload: any): any {
  return getDB().User.update({data: payload}, {where: {email: email}})
}

function exo_user_ts_read(email: string, key: string): any {}

function exo_user_ts_write(email: string, key: string, value: any): any {}

function exo_user_roles_set(email: string, role: string): any {
  return getDB().User.update({role: role}, {where: {email: email}})
}

function exo_user_notifications_add(email: string, notification: Notification): any {

}

function exo_user_notifications_remove(email: string, notification: Notification): any {}

function exo_user_permissions_update(email: string, permission: Permission): any {}

function exo_user_notify(email: string): any {}

export {exo_user_create, exo_user_delete, exo_user_get, exo_user_kv_set, exo_user_kv_get, exo_user_ts_read, exo_user_ts_write};

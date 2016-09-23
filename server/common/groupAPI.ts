import {User, UserFromAPI, Permission, Notification} from '../definitions/user';
import {CreateUser, DeleteUser} from '../definitions/user_actions';


function exo_groups_create(createUser: CreateUser) {}

function exo_groups_delete(deleteUser: DeleteUser) {}

function exo_groups_get(email?: string): any {}

function exo_groups_update(email: string, key: string): any {}

export {exo_groups_create, exo_groups_delete, exo_groups_get, exo_groups_update};

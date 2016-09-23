import {ListItem} from '../listItem/interface';

interface UserItem extends ListItem {
  uid: string; // make UID required from ListItem
}

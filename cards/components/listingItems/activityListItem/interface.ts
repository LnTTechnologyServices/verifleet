import {ListItem} from '../listItem/interface';

interface ActivityListItem extends ListItem {
  uid: string; // make UID required from ActivityListItem
  did: string; // make DID required for ActivityListItem
  icon: string; // make icon required for ActivityListItem
  timestamp: (string|number); // make timestamp required
}

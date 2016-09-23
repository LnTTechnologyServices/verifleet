import {ListItem} from '../listItem/interface';

interface AlarmListItem extends ListItem {
  timestamp: (string|number);
  did: string;
}

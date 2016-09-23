import {ListItem, ListItemStatus} from '../listItem/interface';

interface DeviceItem extends ListItem {
  did: string; // make device ID required
  status: ListItemStatus; // make this item required
}

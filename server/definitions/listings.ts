import {Device} from './device';
import {User} from './user';

interface List {
  elements: (AlertItem | ActivityItem | DeviceItem | UserItem)[];
}

interface ListItem { // anything that can be listed needs to have these properties
  rid: string;
  timestamp: number;
  did: string; // 'nice' identifier to display (device name)
  onClick?: () => void; // function to call when clicked
  options?: MoreOptions[]; // additional actions for kebab icon
  iconUrl?: string;
  iconClass?: string;
}

interface Status {
  state: string;
  class?: string; // class to apply to left bar - will be enumerated if not explicitly defined
}

interface MoreOptions { // item for dropdown (usually text and an 'onclick' event)
  text: string;
  onClick?: (device: Device) => void;
}

interface AlertItem extends ListItem {
  message: string; // eg: Temperature Too Low
  condition?: string; // Under Temperature for 40 Minutes
  status?: Status; // resolved, active, acknowledged, critical
}

interface ActivityItem extends ListItem {
  title: string;
  uid: string; // user identifier
}

interface DeviceItem extends ListItem {
  id: string; // identifier to display
  status?: Status; // status to display (healthy, fault, inactive, )
}

interface UserItem extends ListItem {
  email: string;
  role: string;
  options: MoreOptions[];
}

export {AlertItem, ActivityItem, DeviceItem, UserItem};

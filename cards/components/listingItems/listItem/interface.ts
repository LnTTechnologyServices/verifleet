import {ListItemStatus} from '../listItemStatus/interface';

// list items for dropdown
// generally used to go to another page or display additional state (silence this device, go to user, etc.)
interface MoreOptions { // item for dropdown (usually text and an 'onClick' event)
  text: string;
  onClick?: Function
}

interface ListItem {
  title: string;
  subtitle?: string;
  description?: string;

  icon?: string;

  did?: string; // unique device identifier
  uid?: string;

  // if options are present, display kebab for right hand icon
  // if options and onClick are present, display kebab for right hand icon
  // if only onClick is present, display right arrow for right hand icon
  // if onClick and options are absent, display no right hand icon
  onClick?: Function; // function to call when clicked item clicked
  options?: MoreOptions[]; // additional actions for dropdown

  status?: ListItemStatus;
  timestamp?: (number|string); // timestamp in milliseconds or string to display
}

export {MoreOptions, ListItem, ListItemStatus};

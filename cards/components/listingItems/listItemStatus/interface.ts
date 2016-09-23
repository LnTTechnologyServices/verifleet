
type ItemStatus =
  "healthy"
  "critical"
  "warning"
  "offline"

interface ListItemStatus {
  status?: ItemStatus; // enumeration of healthy, critical, warning, offline
  color?: string; // class to implement custom status colors
}

export {ListItemStatus}

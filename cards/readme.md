# Parker Cards and Card Components

## Overview
This folder / repository includes strictly the UI components needed to build a Parker styled web application. There will be no API services featured in this library - those will be something that you maintain and share between your web / mobile applications, and will be given to you in the seed applications as a starter for developing what you need from your API.

### Cards & Card Components
Cards are 'assemblies' of components. A card will use one or more card-components. Cards are 'standardized' ways of using components, or ways of logically ordering components (keeping a search bar and a list of `<device-list-items>` together and linked with glue code makes a lot of sense). There are currently a few cards planned, but not too many. For the moment, using components directly is likely an easier way to do development.

### List of Planned Card Components
##### Listing Items
* `<list-item item="vm.item"></list-item>` - renders a generic list item (useful if there isn't a broken out version of the list item you want to use).
* `<device-list-item device="vm.device"></device-list-item>` - renders a device list item that looks similar to [this]( https://github.com/exosite/ps-parker-seed-app/blob/master/cards/components/listingItems/deviceListItem/deviceListItem.common.png).
* `<alarm-list-item alarm="vm.alarm"></alarm-list-item>`
* `<activity-list-item activity="vm.activity"><activity-list-item>`
* `<user-list-item user="vm.user"><user-list-item>`

##### Data Visualization
* Big Icon - `<big-icon icon="vm.icon_name" state="vm.state"><big-icon>`
* Big Number - `<big-number value="vm.value" title="vm.title" unit="vm.unit"><big-number>`
* Line Chart - `<line-chart data="vm.data"></line-data>`
* Half Moon Gauge - `<gauge-chart value="vm.value" max="150" min="0"><gauge-chart>`

### List of Planned Cards
##### Listing Cards
* Wrappers for all `list-item-components` (eg: `<alarm-list alarms="vm.alarms"></alarm-list>`)
* Search functionality via object attributes `<device-list search-enabled devices="vm.devices"></device-list>`

##### Data Visualization Cards
* Data Table - `<data-table data="vm.dataTable"></data-table>` - Simply view your data in a table.
* Fleet Health - `<fleet-health devices="vm.devices"></fleet-health>` - Overview of all your devices at a glance.
* Trend Chart - `<trend-chart data="vm.trend_data"></trend-chart>`- Historical trends of your data.
* Bar Chart - `<bar-chart data="vm.bar_data"></bar-chart>`- Quickly compare between between a dataset.

### UI Specific Features
* Parker specific `colors.scss` that uses the corporate style guide
* Parker specific angular-material theme
* Icon font & angular icon library

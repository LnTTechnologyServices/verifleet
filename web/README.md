### Webapp

#### Getting started:

Run `npm install && npm link ../cards` once (or when you pull and `package.json` is modified).

Run `gulp` to serve the webapp. It will take a little bit on first load to generate all the code. Navigate to http://localhost:3000. You should be presented with a login screen.

Webpack will display compilation errors while running gulp, so look at the terminal window to see what has failed (if modules aren't found, try running `npm install` again).

As you modify `html`/`javascript` files, the webpage will refresh. If you modify `css` files, they will be loaded directly.

#### File Description:

* `webpack.config.js` - main webpack configuration. Sphinx has a limit of 1mb, so code needs to be distributed / minified here. This is where the 'transparent' includes for `client/app/app.js` are located (this is why we can include modules without directly including them in the page). If files are larger than 1mb, the upload to Sphinx will fail and you will need to separate some of the bundled files.
* `webpack.dist.js` - used when running `gulp webpack`. This will clear out the `web/dist` folder, and run for about a minute, and leave a minified version of the code in `web/dist/`. This `dist` folder can be copied to `sphinx/dist` to be deployed to the Sphinx solution.
* `client/app` - root of webapp.
* `client/app/favicon.ico` - favicon for webpage.
* `client/app/index.html` - webpage root (this is what is served to the client and where Angular is bootstrapped)
* `client/app/app.html` - UI that is displayed across all pages. Page components are rendered in the `md-content` block. The other components in that file are what gets displayed on all page views (navbar, header)
* `client/app/app.controller.js` - modifies the app's layout, when users aren't logged in the navbar isn't shown so things will be slightly off center.
* `client/app/config.js` - what URL should be used for the API root. This would be your Murano solution URL.
* `client/app/common/` - Common UI elements available across multiple views. If you want to change the header image, modify `header_logo.png` here. If you want to add additional pages, modify `navbar/navbar.html` here.
* `client/app/components/` - The data for the pages that are displayed. This is where you can request new data, modify how pages work, and add new functionality.

#### Common Uses:

###### To deploy local web changes to Sphinx
* Run `gulp webpack`. If there are errors, fix them (there will be lots of warnings)
* Copy the files in `PATH/web/dist/` to `REPO/sphinx/dist/`
* Run `exosite --deploy` from the sphinx directory

###### Use a different API configuration
* Modify `client/app/config.js` to use your solution URL.
* Modify `client/app/api/{deviceService.js,websocketFactory.js,userService.js}` to
use the new API endpoints.

###### Change how data is processed (change how alarms are displayed)
Redux reducers are used to synchronize changes between different pages. This greatly reduces the burden on individual pages to manage their own data, while allowing centralized logic during operations (when data is requested, show the loading bar).
* Modify `client/app/api/reducers/{alarmReducer,activityReducer,deviceReducer,userReducer,websocketReducer}.js` to take in device alarm data and output alarmListItems.

###### Add a new component
* Create a new folder with whatever component name you want to use (there are some restrictions - can't be the same as other component names, valid characters, etc).
* Copy the contents of another component and modify all the names into your component name.
* Modify `<component name>.js`, and modify the URL to be what you want.
* Modify `client/app/components/components.js` to include your new component.
* Modify `client/app/common/navbar/navbar.html` to include your new component sref.
* The page should reload. Click the new navbar element you added. A page should display. If it doesn't work, the `gulp` terminal should give you information if something is messed up, and you can also use the web console to view what's wrong.

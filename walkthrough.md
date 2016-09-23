## Walkthrough

This guide is intended for developers to get started doing development using the starter project.

### System Overview

The five main portions of the PooF Framework are the device simulator, Sphinx API, mobile seed application, web Seed Applications, and the Card Library.  With these four pieces, applications can be developed quickly and code can be modified, rather than created from scratch. By having a common base between applications, developer onboarding time is reduced, and code can be shared between applications more easily.

    cards/ - common core card library and ui styles
    device_simulator/ - device simulator
    sphinx/ - exosite murano sphinx api
    web/ - angular webapp

**Card Library**

Located in the `cards/` directory.

The Card Library is a set of common elements that implement the Parker Style Guide to allow developers to quickly add functionality to an application. It allows for both mobile and web use while sharing common logic between the mobile / web layouts.


**Device Simulator**

Located in the `device_simulator/` directory.

This is a device simulator for sending data to Exosite. It will use Gecko as the base layer (a Python library), allowing code reuse when applications are developed. It's currently a nodejs application that writes to dataports defined in the code.

**Sphinx API**

Located in the `sphinx/` directory.

This is a starting API that is intended to be used to quickly get device data into Murano (with the event_handler) and allow the Seed App to communicate with Sphinx endpoints out of the box.

**Web Seed Application**

Located in the `web/` directory.

The web seed application is an Angular1 application written to easily allow new pages to be added. It uses Redux to maintain global application state to allow for easier debugging, reducing the complexity in specific page controllers. It uses Angular1.5 component syntax to allow for a transition to Angular2 when the time is appropriate.



### How do I...?

This section will describe how to do common tasks with the PooF framework.

**How do I get set up on Murano?**

Follow the Murano getting started guide [here](http://docs.exosite.com/murano/get-started/).

**How do I get started with local development?**

Go to the `web/` directory in a terminal window.

Run `npm install && npm link ../cards` once to install the necessary dependencies.

Run `gulp` to serve the webapp. Navigate to http://localhost:3000 (it take a while on first load). You should be presented with a login screen. If the login screen never shows in your browser window, check the terminal window for errors. Try running `npm install` again or report an issue.

As you modify `html`/`javascript` files, the webpage will refresh. If you modify `css` files, they will be loaded without refreshing.

**How do I create a new component (new page)?**

Create a new directory that's named the same as the page you want to create (`mkdir web/client/app/components/mypage`).

Copy the component template into the new component directory you created.

Replace all instances of `<TEMPLATE>` with your new component name.

Modify `web/client/app/components/components.js` and add your new page name in 2 spots (follow the existing code as an example).

Modify `web/client/app/common/navbar` and add the new page to the navbar. The code should look something like

    <md-button ui-sref="mypage" ui-sref-active="active">
      <a class="sidebar-font" layout="column" layout-align="center center">
        <span>My Page</span>
      </a>
    </md-button>

The `ui-sref="mypage"` must match the route name in `web/client/app/components/mypage/mypage.js` (the first argument passed to `.state('mypage', ...)`).


COMING: `gulp create page $PAGE_NAME`

<!-- **How do I add additional cards / components?**

**How do I modify the device_simulator to simulate your hardware?** -->

**How do I add a new Sphinx endpoint?**

Navigate to `sphinx/api`.

Modify `api.lua`, add a new endpoint. Endpoints start with lines that look like

    --#ENDPOINT GET /api/v1/test/200
    response.code = 200

When you deploy your changes to Sphinx, you can navigate to `https://<MY_SOLUTION_URL>.apps.exosite.io/api/v1/test/200` and it should display `Ok` in the browser window.

For more endpoint information, refer to the [Murano endpoint documentation](http://docs.exosite.com/murano/scripting/#api-endpoint-scripts)

**How do I modify the Sphinx API to work with your device?**

The file that handles incoming device data is `sphinx/event_handler/product.lua`. Whenever new device data is sent to Murano, this script will be executed.

This script is where device data gets stored in Murano. If you change how the device data is stored, you will also have to modify how the device data is retrieved in Sphinx (modifying `sphinx/modules/device.lua`) to ensure your device data is returned properly. Look at the `Device:list()` and `Device:read()` functions as a starting point for seeing where to change your device retrieval data.

For more information, refer to the [Murano event_handler documentation](http://docs.exosite.com/murano/scripting/#script-execution)

**How do I pull upstream bug fixes?**

TBD: add correct repositories after we determine them.

**How do I pull upstream enhancements?**

TBD: add correct repositories after we determine them.

**How do I edit my application to work with a library change that broke my application?**

TBD: refer to changelog.

**How do I deploy my web changes to Murano?**

Run `gulp webpack` from the `web/` directory. This will create a `web/dist/` folder that has the compiled / minified HTML, javascript, and css.

After `gulp webpack` completes, copy the files from `web/dist/` to `sphinx/dist/` and then run `exosite --deploy_static` (or `exosite --deploy` for all changes) from the `sphinx/` directory.

**How do I deploy my API / event_handler / module changes to Murano?**

Run `exosite --deploy` from the Sphinx directory. This will deploy all changes made.

### Upstream Compatibility

Maintaining upstream compatibility will allow your application to pull upstream bug fixes / enhancements to your application. Ensuring that your application is written in a way that is compatible with upstream changes is critical to reduce the amount of effort required when pulling in new changes.

`/web/client/app/api/{deviceService, userService, websocketFactory}.js` - modifying how your device data is handled in the frontend API or adding additional Sphinx endpoints.
`/web/client/app/api/reducers/{activityReducer,alarmReducer,deviceReducer,userReducer,initialState,websocketReducer}.js` - modifying how your data is parsed when new data is loaded into the application.
`/web/client/app/api/constants/index.js` - for adding new dispatches that your application can
`/web/client/app/config.js`
`/web/client/app/common/navbar/navbar.html`
`/web/client/app/common/navbar/navbar.html`
`/web/client/app/common/navbar/header_logo.png`
`/web/client/app/components/` - this is where your pages are and where most of the code editing should be done.

Moving files around (`web/` -> `myweb/`) will generally break upstream compatibility and require more work from the developer's perspective to integrate upstream changes.


#### An IIoT Seed App for mobile / web applications, built on Exosite, using Parker's corporate style guide, designed to make creating Parker branded applications easier.

###### Getting Started

There are 3 important folders of interest at the moment. 

The raw card components are located in `cards/components/`. Currently, the `<list-item>` and `<device-list-item>` are nearing completion. Please see `web/client/app/components/home` for usage. Specifically - look at the `home.html` file and the `home.controller.js` to see how they should be used (more documentation about component / card usage coming).

The Web Seed application (PooF) is located in `web`. It is built in Angular using components and ES6 to make transition to Angular2 down the road easier. This is where an application can be built. It's currently in a rough state, but it receives data from the API and renders it into card components proving out the idea.

The Seed application depends on the card components, and since this package is not published on bower or npm, you must run `npm link ../cards` to link the card package into the seed application when you want to use it. 

The last folder of interest is the `sphinx/` folder. This is the Murano Sphinx API code. 

### To make things run:

* Install [nodejs](https://nodejs.org/en/). This comes with npm. Test that the install worked properly by running `node --version && npm --version`. 
* Install gulp globally with `npm install -g gulp`
* Install the dependencies for the webapp with `cd ./web && npm install && npm link ../cards`. This will install the package's dependencies and link the cards module to the local package file.
* Start the webserver with `cd ./web && gulp`
* Navigate to [http://localhost:3000](http://localhost:3000) and if everything worked properly, you should see a basic webpage load.

If you run into any trouble whatsoever, feel free to open an issue and we can help you get started.

# EcoRise Water Footprint Calculator - Deployment/Build Documentation

### Vendor: EMN

This document describes the dependancies & build steps for the Grace Water Footprint Calculator

### Dependancies

The EcoRise Water Footprint Calculator requires:

- [Node.js](http://node.js) installed on the build system. As a note, this is only required as a build dependancy
- Bower (Node Module)
- Gulp (Node Runner)

To install Node.js - visit node.js.org and follow the install instructions there. Once this is installed.

Use the node package manager to install gulp and bower globally on your system:

1. `npm install -g gulp`
2. `npm install -g bower`

### Prepping the Application

First prepare the application code for build or running locally:

1. `npm install`
2. `bower install`

These commands only need to be run once per distribution.

### Building or Running the Application

Environment configuration is contained in `environments.js` in the root directory. This is the first place to look if the calculator fails to load in any particular environment to make sure the paths and API endpoints are correct.

Development (local):

1. In your terminal, navigate to the root of the project folder.
2. Run `gulp local` - This will build the application to `.tmp/` and start a local node webserver.
3. Navigate your browser to `http://localhost:9000/` - You should see the Calculator.

Build (deployment):

Current valid environments include:

- `local`
- `wpengine:dev` (hosted at WPEngine)
- `wpengine:production` (hosted at WPEngine)

1. To build the application for a specific environment, run the gulp command with the environment as an argument. Eg: `gulp wpengine:dev`
2. In the case of `wpengine:production`, the application will build into the `/pub` directory. No server will be started. Everything you need to run the app in production is contained in `/pub` and can be copied/deplpyed as-is to the server.
3. In the case of `wpengine:dev`, the application will build into the `/dev` directory. This build has additional logging and debug information available.
4. From here you can use your favorite deployment technique to get it to the server, or integrate this build script with your automated deployment process.

=======

### Debug

Open the app in Chrome, and go to the developer tools javascript console. Enter:

`wfc_debug = true;`

and hit return. This will set a global flag allowing the application to output a lot of information to the console. Keep the console open as you browse the app. One very important think to look for is “Report:” followed by an Object. If you open that object, you will find a record of every question containing the “known values” for it and the calculations it made. Please note that these are a log, so the app kind of “writes it down” as it goes - but it’s VERY useful in debugging issues regarding calculation. Each item in the report contains several key properties:

```
{
  +: 123, // The output of the current question,
  =: 456, // The current total after adding the output,
  input : {} // Contains any values collected from the user interfacem
  message: // A somewhat “hand-written” version of the above data, composed by each question.
}
```

The logic for adding to this log can be found in each question’s model.

=======

### Wordpress Integration

In November 2017, the WFC was extended using a Wordpress instance, allowing us to move content over from gracelinks.org. The WP instance and the WFC app are hosted at WPEngine.

The WFC API code can be found in a separate repo. The API is hosted on a droplet at Digital Ocean.

The WFC app is located at `/wfc2` on the filesytem. The Spanish version of the WFC is located at `/wfc2/esp`.

Due to the way Wordpress functions, a child theme was created with a custom front-page.php that calls the WFC. Also, there are a number of rules in .htaccess to ensure the URL rewriting happens before WP has a chance to process HTTP requests to pages that are internal to the WFC. Without these rules, WP returns a 404 (e.g. in the case where users hit refresh in their browser mid way through the WFC journey).

This architecture also necessitated the index page of the calculator being replicated three times. Caution should be given to ensure any changes are relfected in each file, as required (e.g. changes to analytics or other tracking code). The three locations are:

1. the WP child theme's front-page.php (which calls the English calculator at /wfc2/)
2. /wfc2/index.html (English calculator)
3. /wfc2/esp/index.html (Spanish calculator)

=======

### Update 2024

Modified Packages Json file to avoid error "primoridals is not defined"
This was tested up to node 21.5.0 and Gulp 3.9.1
When updating to gulp 4 the gulpfile JS would have to be re done to function properly

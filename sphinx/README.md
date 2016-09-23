Set up a new Murano solution, follow the instructions, install the `exosite` tool.

Run `exosite --init` here which should create a `.Secret...` file which stores your solution ID. This information is used with the `exosite` command to ensure that you have access to the API. 

You can directly use the `exosite` command as you make changes, but if you'd like a more *live* developer experience, use `gulp` to automatically deploy and test your API as you save. To use gulp, run `npm install && ./test_setup.sh`. Then run `gulp`, which will deploy the API and run the test suite.

If your editor doesn't automatically transpile TypeScript files, run `./transpile.sh` to convert the `.ts` files to `.js` files.

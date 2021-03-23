# Development Process/Tutorial

One of the main developers (Steve) is UBC CPSC faculty and doing this in part just to brush up on skills and be a teacher. So, this will be a living rundown of the creation process.

## Early Stages

### Starting

To publish an npm package, we're starting from:

- [BetterStack's best practices article](https://betterstack.dev/blog/npm-package-best-practices/)
- [khalilstemmler.com's article on setting up TypeScript + Node.js](https://khalilstemmler.com/blogs/typescript/node-starter-project/)
- [Carl-Johan Kihl's publishing an NPM TypeScript package article](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)

To get set up, Steve created a public [Github](https://github.com/) repo with an MIT license and the Node .gitignore file. For the name, the BetterStack article and [npm's guidelines for package names](https://docs.npmjs.com/package-name-guidelines) suggested short, clear, lowercase (no underscores) naming, and we wanted the Github repo and npm package names to match. `ubc-term-finder` seemed short and clear; so, that's the name of the [repo](https://github.com/steven-wolfman/ubc-term-finder).

Steve then used the Manage access menu to invite Piam to collaborate.

Getting set up for editing on your own computer is another huge topic in itself, but the short version to start is to open the repo and click either the "Code" button to get a link to clone the repository or the "Fork" button to fork the repository into your own account (which is the way to go for people outside the main development team who want to contribute or for teams following the [forking workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962) or are simply a fan of [the Good Place](https://thegoodplace.fandom.com/wiki/Censored_Curse_Words)).

### Norms

To contribute to the package, we'll use a [branch-and-pull-request workflow](https://guides.github.com/introduction/flow/) within the development team. That will start after I put this document into the repo and update the `README.md` file to reflect the requested workflow.

### Basic Setup

This will be an npm package using [TypeScript](https://www.typescriptlang.org/). Typescript already supports decent backwards-compatibility via targeting older ECMAScript standards in compilation (defaulting to the 20-year-old ES3); so, we'll skip using [Babel](https://babeljs.io/), at least at first. (Both [Babel](https://babeljs.io/docs/en/babel-preset-typescript) and [Typescript](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html) have notes on these systems working together, should we need to use them both.) We'll want, at minimum, to test with [Jest](https://jestjs.io/).

So, let's get all that set up:

1. From the terminal, run `npm init`. Most of the questions can get the default or obvious response (e.g., an edited version of the descrption from `README.md` for the `description:` field). The `test command:` should be `jest` for this project. Guideline on [keywords](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#keywords) is pretty slim; so we just picked a few. They're easy to change in the `package.json` file. We used an MIT license. The [author field](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#people-fields-author-contributors) is meant to be one person; so, Steve put himself in and Piam as a collaborator by editing `package.json` after the fact.
2. [Install typescript](https://www.typescriptlang.org/download) for development: `npm install --save-dev typescript`.
3. Install jest for development: `npm install --save-dev jest @types/jest ts-jest`. The `--save-dev` part ensures that installing the `ubc-term-finder` package won't install jest, but cloning the repo and running `npm install` locally will. This also includes jest typescript support, to support typescript later on.
<!-- 3. Install babel for development: `npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/cli`. This includes `babel-jest` for integration with jest, see the [jest notes on TypeScript/Babel](https://jestjs.io/docs/getting-started#using-typescript). If we use this, we'll also want `@babel/preset-typescript`. -->
4. Next up, [`eslint`]() ([`tslint` has been deprecated](https://www.npmjs.com/package/tslint)) and [`prettier`](https://prettier.io/), which interact fairly heavily, since they serve similar purposes: `npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier`. This doesn't yet set up config files for either one. Then, for integration: `npm install --save-dev eslint-config-prettier eslint-plugin-prettier eslint-plugin-jest`

Now everything is installed, but mostly still needs to be configured:

<!-- 1. [Babel config](https://babeljs.io/docs/en/configuration#packagejson): Edit the `package.json` file to include the `babel` section:

   ```json
   "babel": {
       "presets": ["@babel/preset-typescript"]
   }
   ```
 -->

1. [Typescript config](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html): Create/edit `tsconfig.json`. We used a slightly edited version of the command from the [stemmler](https://khalilstemmler.com/blogs/typescript/node-starter-project/) tutorial with `--allowJs` set to `false`:

   ```bash
   npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule \
           --lib es6 --module commonjs --allowJs false --noImplicitAny true
   ```

    <!-- Then edited that to modify/add these options from the typescript config notes for Babel:
    ```json
    {
      "compilerOptions": {
        // Ensure that .d.ts files are created by tsc, but not .js files
        "declaration": true,
        "emitDeclarationOnly": true,
        // Ensure that Babel can safely transpile files in the TypeScript project
        "isolatedModules": true
      }
    }
    ``` -->

   We also added include/exclude options to this:

   ```json
   {
     "exclude": ["node_modules", "build"],
     "include": ["src"]
   }
   ```

   Separately, `package.json` needs some configuration both for our directory structure and for `typescript` specifically. Added these attributes to `package.json`:

   ```js
   {
     "main": "build/index.js", // tsconfig.json is set up to put build files into the build directory
     "typings": "build/index.d.ts", // index.js is plain JS, but tsc puts type info here
     "files": [
       "build" // only the build directory is needed for install of the package as a dependency
     ]
   }
   ```

   Note that some [automatically included files besides `build`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) still go into the package installs.

   Finally, since we chose `build` as the output directory, we added `build` as a line in `.gitignore` to avoid versioning automatically-generated build files!

2. [jest config](https://www.npmjs.com/package/ts-jest): The `ts-jest` module comes with configuration assistance via `npx ts-jest config:init`. That produces a new `jest.config.js` file. (Funny that it produces JavaScript and not TypeScript, even if [`ts-node`](https://github.com/TypeStrong/ts-node) is installed, as advised by the [jest config docs](https://jestjs.io/docs/configuration).) Along with those defaults, we updated the `testMatch` to recognize the `tests` directory as special, which didn't seem to be in other tutorials:

   ```javascript
   const { defaults } = require("jest-config");

   module.exports = {
     preset: "ts-jest",
     testEnvironment: "node",
     testMatch: [...defaults.testMatch, "./tests/**/?*(*.)+[jt]s?(x)"],
   };
   ```

   (`import` syntax is not usable in this file; so, we used `require`. Below, we exclude `*.js` files from `eslint` checks for use of `import`.)

3. [eslint config](https://eslint.org/docs/user-guide/configuring/): `eslint` can produce a config file with `npx eslint --init`. Among other things, we selected support for TypeScript, which installed `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser`. We initially used `json` format for the file, but to handle `jest` files, we switched to `javascript` format so we could import and rely on the matching pattern for tests used by `jest`. The resulting file looks like:

   ```javascript
   // Import the jest test matching pattern from local jest.config.js file.
   const { testMatch: jestTestMatch } = require("./jest.config");

   module.exports = {
     // Skipping all the pieces not changed from the default!

     root: true, // do not look in parent folders for further configuration
     extends: [..., "prettier"], // add prettier to the extends list
     plugins: [..., "prettier"], // add prettier to the plugins list
     overrides: [
       // Avoid enforcing import syntax on config files:
       {
         files: ["*.js"],
         rules: {
           "@typescript-eslint/no-var-requires": "off",
         },
       },
       // For only those files matched by jest, set up the jest testing environment/rules/plugins.
       {
         files: jestTestMatch,
         env: { jest: true },
         extends: ["plugin:jest/style"],
         plugins: ["jest"],
       },
     ],
   };
   ```

   We think the `overrides` rule above does a good job informing `eslint` about the `jest` environment (so you don't get `'describe' is not defined` style errors) and `jest`-specific rules. Alternatively, you can add another `.eslintrc.js` file in the `tests` folder or specify `/* eslint-env jest */` at the top of each test file (though in that case, you'll still want the `extends`/`plugins` options specific to `jest`).

4. Lots of scripts need to be configured in `package.json` (and we haven't even gotten to [publishing scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts#life-cycle-scripts)!). Some of this is really about configuration of tools described elsewhere, but it seemed valuable to wrap up in one place. To make it easier to run the scripts, we ran `npm install npm-run-all del-cli--save-dev` (for [`run-all`](https://www.npmjs.com/package/npm-run-all) and [`del-cli`](https://www.npmjs.com/package/del-cli)), but this could be replaced by tweaks like `npm run script1 && npm run script 2 && ...` for `run-all`. Much of this section is based on the [`react-svg`](https://github.com/tanem/react-svg) project as a working example.
   ```json
   {
     "scripts": {
       "prebuild": "npm run clean",
       "build": "npm run compile",
       "test": "run-s check:* lint build test:*",
       "compile": "tsc",
       "clean": "run-p clean:*",
       "check:format": "prettier --list-different \"**/*.{js,ts,tsx}\"",
       "check:types": "tsc --noEmit",
       "clean:compiled": "del compiled",
       "clean:coverage": "del coverage",
       "clean:build": "del build",
       "format": "prettier --write \"**/*.{js,ts,tsx}\"",
       "lint": "eslint .",
       "test:plain": "jest"
     }
   }
   ```
   In order, this sets up a build script (which takes advantage of the fact that we can create `pre<whatever>`/`post<whatever>` scripts for any script to first `clean` and then `compile`), a test script (running several scripts in sequence via `run-s` using globbing (`*`) to run all the various cleaning/testing scripts), a compile script (that just runs typescript, which is already configured via `tsconfig.json` to understand where to look for source and to place output), and to clean up (running all the cleanup scripts in parallel, which themselves just delete working folders). Format checking uses `prettier` to find if it would complain about any Typescript (or Java or Typescript/JSX) files. Typechecking runs `tsc` but doesn't produce output. Linting simply runs `eslint` (which needs to be separately configured). Testing runs `jest` (which needs to be separately configured). Note that `react-svg` takes advantage of specifying a config file to `jest` in order to have many flavors of testing. We may want to do that with `jest` or with another command.

## Development

### Basic Stubbing and Testing

We'll start development by stubbing out our primary function `getUbcTerm`[^acronymcamelcase] and setting up some tests for it. As usual, we'll overengineer this little package to learn as much as we can!

[^acronymcamelcase]: BTW, why name it `getUbcTerm` rather than `getUBCTerm`. Acronyms and abbreviations are a mess for camelCase naming conventions (or conventions that distinguish constants using UPPERCASE). This [https://stackoverflow.com/questions/15526107/acronyms-in-camelcase](closed StackOverflow post) gives some suggestions regarding camelCase naming with acronyms (fine, [https://wwwnc.cdc.gov/eid/page/abbreviations-acronyms-initialisms#:~:text=An%20abbreviation%20is%20a%20truncated,DNA%2C%20RT%2DPCR).](initialism or whatever)). We settled on wanting retain the advantages of camelCase vs. the dignity of an all-caps UBC.

# Unexplained Oddities and Unresolved Thoughts

## RESOLVED: Why does `babel` still show in `package-lock.json`?

We originally installed with `babel` but got rid of it. It's not in `package.json`.

Ah, the [`npm list`](https://docs.npmjs.com/cli/v7/commands/npm-ls) command can give more of your dependency tree with, e.g., `npm list --depth=3`, or the [`npm explain`](https://docs.npmjs.com/cli/v7/commands/npm-explain) command can give you bottom-up info. There may be other reasons we have it, but `jest` has a bunch of dependencies into babel.

## Why didn't running `npx tsc --init` with `build` and `src` directories indicated add include/exclude to tsconfig.json?

No idea. Should we have used one of the ["typescript base configs"](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) instead??

## Should we spin off some of the `jest` config into a tutorial?

Both our handling of `testMatch` in `jest.config.js` and using it in `.eslintrc.js` does not seem to be widely documented. If this is a good solution, it might be worth sharing around. Maybe just answer <https://stackoverflow.com/questions/31629389/how-to-use-eslint-with-jest>.

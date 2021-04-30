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

This will be an npm package using [TypeScript](https://www.typescriptlang.org/). Typescript already supports good backwards-compatibility via targeting older ECMAScript standards in compilation (defaulting to the 20-year-old ES3); so, we'll skip using [Babel](https://babeljs.io/), at least at first. (Both [Babel](https://babeljs.io/docs/en/babel-preset-typescript) and [Typescript](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html) have notes on these systems working together, should we need to use them both.) We'll want, at minimum, to test with [Jest](https://jestjs.io/).

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

   `import` syntax is not usable in this file; so, we used `require`. Below, we exclude `*.js` files from `eslint` checks for use of `import`. Also, the `ts-jest` preset will make TypeScript test files work (and allow, e.g., ES6 syntax), but if you want to use `*.js` test files, you may need to reconfigure `ts-jest` or use `babel`.

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
       "check:format": "prettier --ignore-path .gitignore --list-different \"**/*.{js,ts,tsx}\"",
       "check:types": "tsc --noEmit",
       "clean:compiled": "del compiled",
       "clean:coverage": "del coverage",
       "clean:build": "del build",
       "format": "prettier --ignore-path .gitignore --write \"**/*.{js,ts,tsx}\"",
       "lint": "eslint .",
       "test:plain": "jest"
     }
   }
   ```
   In order, this sets up a build script (which takes advantage of the fact that we can create `pre<whatever>`/`post<whatever>` scripts for any script to first `clean` and then `compile`), a test script (running several scripts in sequence via `run-s` using globbing (`*`) to run all the various cleaning/testing scripts), a compile script (that just runs typescript, which is already configured via `tsconfig.json` to understand where to look for source and to place output), and to clean up (running all the cleanup scripts in parallel, which themselves just delete working folders). Format checking uses `prettier` to find if it would complain about any Typescript (or Java or Typescript/JSX) files, and uses a command-line argument to ignore anything in the `.gitignore` file (but [in future it may be better to include the `.gitignore` in the `.prettierignore`](https://github.com/prettier/prettier/issues/8506)). Typechecking runs `tsc` but doesn't produce output. Linting simply runs `eslint` (which needs to be separately configured). Testing runs `jest` (which needs to be separately configured). Note that `react-svg` takes advantage of specifying a config file to `jest` in order to have many flavors of testing. We may want to do that with `jest` or with another command.

## Development

### Basic Stubbing and Testing

We'll start development by stubbing out our primary function `getUbcTerm` and setting up some tests for it. As usual, we'll overengineer this little package to learn as much as we can!

(BTW, why name it `getUbcTerm` rather than `getUBCTerm`? Acronyms and abbreviations are a mess for camelCase naming conventions (or conventions that distinguish constants using UPPERCASE). This [closed StackOverflow post](https://stackoverflow.com/questions/15526107/acronyms-in-camelcase) gives some suggestions regarding camelCase naming with acronyms (fine, [initialism or whatever](https://wwwnc.cdc.gov/eid/page/abbreviations-acronyms-initialisms#:~:text=An%20abbreviation%20is%20a%20truncated,DNA%2C%20RT%2DPCR)). We settled on wanting retain the advantages of camelCase vs. the dignity of an all-caps UBC.)

Stubbing out the function requires learning some basic TypeScript, but since we assume our readers know JavaScript, the [official TypeScript for JS programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) intro is probably sufficient. We use an interface to define our return type and then lay out the full type for `getUbcTerm`:

```typescript
export interface UbcTerm {
  year: number;
  session: "W" | "S";
  termNum: 1 | 2;
}

export function getUbcTerm(date: Date = new Date()): UbcTerm {
  return { year: 1999, session: "W", termNum: 1 };
}
```

The actual code has plenty of JSDoc comments to give users information about the type and function, which after all is one of the big advantages of TypeScript over plain JavaScript!

#### Jest Tests

We set up our configuration so that Jest test files can be in the `tests` folder under our project root or in [any of the default places](https://jestjs.io/docs/configuration#testmatch-arraystring): under any `__tests__` subfolder or named ending in `.spec.ts`, `.test.ts` or the like (e.g., `.test.jsx` for a [JSX file](https://reactjs.org/docs/introducing-jsx.html)). For now, we're testing in `tests/index.test.ts`, but we might be better off testing locally alongside our source so that imports in the tests don't get complicated.

Jest automatically makes available various utility functions and the [`jest` object](https://jestjs.io/docs/jest-object). So, the backbone of our test file is:

```typescript
import * as module from "../src/index";

describe("the getUbcTerm function", () => {
  ...
});
```

[`describe`](https://jestjs.io/docs/api#describename-fn) lets us group tests logically and also allows coordinated setup/teardown using [`beforeAll`](https://jestjs.io/docs/api#beforeallfn-timeout), [`beforeEach`](https://jestjs.io/docs/api#beforeeachfn-timeout), [`afterAll`](https://jestjs.io/docs/api#afterallfn-timeout), and [`afterEach`](https://jestjs.io/docs/api#aftereachfn-timeout). Here, we group all our tests together under the description `the getUbcTerm function`. Then, we supply a [thunk](https://en.wikipedia.org/wiki/Thunk) (zero-argument function) that will run the test suite.

Inside the `describe` block, we have more `describe` blocks and individual `test`s like:

```typescript
test("should be accessible in the module", () => {
  expect(module.getUbcTerm).toBeDefined();
});
```

Again, this has descriptive text and a thunk. When run, the thunk checks that `module.getUbcTerm` is defined. Each actual assertion in a test is an `expect` chained with one of many available [matchers](https://jestjs.io/docs/expect) like [`toBeDefined`](https://jestjs.io/docs/expect#tobedefined) that inspects the value. The matcher we use most is [`toEqual`](https://jestjs.io/docs/expect#toequalvalue), which performs deep equality checking.

Jest's [`test.todo`](https://jestjs.io/docs/api#testtodoname) is a great way to document planned tests. [`test.skip`](https://jestjs.io/docs/api#testskipname-fn)/[`describe.skip`](https://jestjs.io/docs/api#describeskipname-fn) are great ways to skip tests in progress. In our case, we use `test.skip` to skip a working but unnecessary test that is included only to demonstrate that [`jest.setSystemTime`](https://jestjs.io/docs/jest-object#jestsetsystemtimenow-number--date) works:

```typescript
test.skip("demonstrating that fake system timers do not advance", () => {
  ...
});
```

Just this Jest functionality is enough for most of our testing. However, automation is irresistible, especially when it optionally uses customized [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)! So, we're using [`test.each`](https://jestjs.io/docs/api#2-testeachtablename-fn-timeout) to streamline some of our testing across 12 separate dates/times: four terms (W1, W2, S1, S2) and three points in each term (at the start, at the end, and somewhere in the middle). Jest's `each` functions let you specify a table of values to test against, either through a template literal or an array.

The template literal version of `test.each` uses the standard template literal syntax but rather than simply constructing a string, this tagged variant expects a table and uses it to set up testing. The header row sets up field names. Each table row supplies field values for one test, using the standard template literal `${...}` syntax, but repurposed to splice in JavaScript values for the fields.

Let's take a look at the code (omitting the last 8 rows of the table for brevity) and then discuss what it means:

```typescript
test.each`
  point              | ubcterm                                     | date
  ${"at the start"}  | ${{ year: 1000, session: "W", termNum: 1 }} | ${W1_START_1000}
  ${"in the middle"} | ${{ year: 1999, session: "W", termNum: 1 }} | ${W1_MID_1999}
  ${"at the end"}    | ${{ year: 2020, session: "W", termNum: 1 }} | ${W1_END_2020}
  ${"at the start"}  | ${{ year: 1000, session: "W", termNum: 2 }} | ${W2_START_1000}
`(
  "should produce $ubcterm.session$ubcterm.termNum $point of the term ($date)",
  ({ ubcterm, date }) => {
    expect(module.getUbcTerm(date)).toEqual(ubcterm);
  }
);
```

Our tabular fields are:

- a textual description of the point in the term,
- the expected UBC Term to return, and
- the Date to use as the argument to the function.

Just after the table finishes, we use the fields to construct individualized test names like `should produce W1 at the start of the term (1000-09-01T08:12:28.000Z)`. `test.each` supplies `printf`-style formatting for the test name, with `$...` to reference the fields. Then, we write a very compact test that relies on receiving the fields as parameters.

With the full 12 row table, this represents 12 separate tests expressed compactly. Note: We defined `W1_START_1000` and the other `Date` constants at the top of our file. They are just the result of calling `new Date(...)` with specific dates/times to be tested.

(In our code, we don't need `point` after we're done constructing the individualized test name. The template literal version of `each` passes the arguments as a single object. So, we can just leave `point` out in our [destructuring parameter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#unpacking_fields_from_objects_passed_as_a_function_parameter). If you used the array-based version, you'd need your function to take three parameters but would just ignore the first parameter.)

#### Surprises and Complications

##### Initialization/Teardown/Skip May Not Work as You Think

[`describe.skip`](https://jestjs.io/docs/api#describeskipname-fn) and Jest's test running framework as a whole may not work as you think. A good way to experiment with this is to replace the start of our overall tests (`describe("the getUbcTerm function",`) with:

```typescript
describe.skip("the getUbcTerm function", () => {
  console.log("When does 'bare' code in a describe block run?");
  beforeAll(() => {
    console.log("When does 'beforeAll' code run?");
  });
  beforeEach(() => {
    console.log("When does 'beforeEach' code run?");
  });
```

Jest still processes skipped `describe` blocks. So, this will print `When does 'bare' code in a describe block run?`. `beforeAll` and `beforeEach` are meant to run setup code before a set of tests run (`All`) or before each test runs individually (`Each`). Thankfully, neither `before` block runs in a skipped block. Jest also tells us the number of tests that were skipped and, depending on what you skip, may give further information about the skipped tests like their text.

It's worth thinking about this if you put initialization or teardown code unprotected by a `before`/`after` block. That code may run at a surprising time and so impact its own and other tests in surprising ways!

You can remove the `.skip` above but leave the logging in to learn a bit more about how `beforeAll`/`beforeEach` work.

##### Timezones Are a Mess

One big complication we ran into is testing against timezones using Javascript's Date object (which will hopefully be replaced by [https://github.com/tc39/proposal-temporal](https://github.com/tc39/proposal-temporal) soon). Within Jest, it's not doable to set the timezone environment variable on the fly since Jest resists mutation to `process.env`. So, instead we used standard bash syntax for setting environment variables in `package.json` to set `TZ="America/Vancouver"` before the tests run. We put it in our `test` script in the `scripts` section:

```javascript
"test": "TZ=\"America/Vancouver\" run-s check:* lint build test:*",
```

##### Time Is a Mess

Time is so complicated that [Jest has specific support for working with time](https://jestjs.io/docs/timer-mocks). Since we're interested in `Date` and using Jest before version 27, we need to [use "modern" timers](https://jestjs.io/docs/jest-object#jestusefaketimersimplementation-modern--legacy). Using that, we can make "now" whatever we want. Alternatively, we could use jest's [`spyon` function](https://jestjs.io/docs/jest-object#jestspyonobject-methodname) with [`global` and `Date` as the parameters](https://stackoverflow.com/questions/28504545/how-to-mock-a-constructor-like-new-date/57599680#57599680) in order to mock `Date` and inspect how it's used. ([`global`](https://nodejs.org/api/globals.html#globals_global) is a Node.js-specific variable storing an object representing the global scope in the browser.) The former solution is probably **better**, but since we're trying to learn, we use both!

Mocking can be a bit tricky in combination with TypeScript. Fortunately, just telling TypeScript our spy variable was of type `jest.SpyInstance` was enough for it to resolve typing issues.

Here's the setup for our spy-based testing:

```typescript
describe("tested via mocking, which is probably inferior to using jest.setSystemTime", () => {
  let dateSpy: jest.SpyInstance;
  beforeAll(() => {
    dateSpy = jest.spyOn(global, "Date");
  });
  beforeEach(() => {
    // Reset counters.
    dateSpy.mockClear();
  });
  afterAll(() => {
    // Return Date to its original functionality.
    dateSpy.mockRestore();
  });
```

We need to access `dateSpy` everywhere inside the `describe` block; so, we make it a local variable in that block. We actually initialize it in `beforeAll` to be confident that the initialization only happens just before the tests are run, and we use [`mockRestore`](https://jestjs.io/docs/mock-function-api#mockfnmockrestore) to restore the original `Date` constructor in the `afterAll` block to avoid messing with other tests. Before each test, we use [`mockClear`](https://jestjs.io/docs/mock-function-api#mockfnmockclear) to reset the record of calls in the spy, in case the test relies on inspecting how or how many times the `Date` constructor was called.

# Unexplained Oddities and Unresolved Thoughts

## RESOLVED: Why does `babel` still show in `package-lock.json`?

We originally installed with `babel` but got rid of it. It's not in `package.json`.

Ah, the [`npm list`](https://docs.npmjs.com/cli/v7/commands/npm-ls) command can give more of your dependency tree with, e.g., `npm list --depth=3`, or the [`npm explain`](https://docs.npmjs.com/cli/v7/commands/npm-explain) command can give you bottom-up info. There may be other reasons we have it, but `jest` has a bunch of dependencies into babel.

## Why didn't running `npx tsc --init` with `build` and `src` directories indicated add include/exclude to tsconfig.json?

No idea. Should we have used one of the ["typescript base configs"](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) instead??

## Should we spin off some of the `jest` config into a tutorial?

Both our handling of `testMatch` in `jest.config.js` and using it in `.eslintrc.js` does not seem to be widely documented. If this is a good solution, it might be worth sharing around. Maybe just answer <https://stackoverflow.com/questions/31629389/how-to-use-eslint-with-jest>.

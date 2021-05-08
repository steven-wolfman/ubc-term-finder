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

   (`import` syntax is not usable in this file; so, we used `require`. Below, we exclude `*.js` files from `eslint` checks for use of `import`. Also, the `ts-jest` preset will make TypeScript test files work (and allow, e.g., ES6 syntax), but if you want to use `*.js` test files, you may need to reconfigure `ts-jest` or use `babel`.)

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
       "check:format": "prettier --ignore-path .gitignore --list-different \"**/*.{js,ts,tsx}\" || (echo \"check:format failed. You may want to execute npm run format.\" && false)",
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
   This sets up
   - `prebuild`/`build`: a build script. We can create `pre<whatever>`/`post<whatever>` scripts to run before/after any script we like. So, on `npm run build`, this first runs `clean` and then `compile`.
   - `test`: an overall test script. This runs several scripts in sequence via [`run-s`](https://github.com/mysticatea/npm-run-all/blob/HEAD/docs/run-s.md). `run-s` supports globbing (`*`) that lets us run all the various cleaning/testing scripts.
   - `compile`: a compilation script that just runs typescript. Typescript is already configured via `tsconfig.json` to understand where to look for source code and to place output.
   - `clean`: an overall cleaning script. This uses [`run-p`](https://github.com/mysticatea/npm-run-all/blob/HEAD/docs/run-p.md), which is just like `run-s` except that it runs commands in parallel. It runs all the `clean:*` scripts. Those are `clean:compiled`, `clean:coverage`, and `clean:build`, which just delete working folders using [`del`](https://www.npmjs.com/package/del-cli).
   - `check:format`: a format checking script. This runs `prettier` to find if it would complain about any Typescript (or Java or TSX/JSX) files. It uses a command-line argument to ignore anything in the `.gitignore` file (but [in future it may be better to include the `.gitignore` in the `.prettierignore`](https://github.com/prettier/prettier/issues/8506)). Our first version of the `check:format` script only called `prettier`, but we got confused about what to do when `prettier` failed! So, the version above uses `echo` to give advice on what to do when `prettier` fails.
   - `check:types`: typechecking script that runs `tsc` without producing output.
   - `format`: a format _fixing_ script that runs `prettier` and has it rewrite files in place.
   - `lint`: a linting script that simply runs `eslint`, which needs to be separately configured.
   - `test:plain`: the actual core test running script. This runs `jest`, which needs to be separately configured. (We could take advantage of specifying a config file to `jest` on the command-line in order to have many flavors of testing, but we did not need to here. See [`react-svg`](https://github.com/tanem/react-svg) for an example of how to do that.)

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

[`describe.skip`](https://jestjs.io/docs/api#describeskipname-fn) and Jest's test running framework as a whole may not work as you think. A good way to experiment with this is to replace the first line of our overall tests (the line: `describe("the getUbcTerm function", () => {`) with these lines:

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

One big complication we ran into is testing against timezones using Javascript's Date object (which will hopefully be replaced by [Temporal](https://github.com/tc39/proposal-temporal) soon). Within Jest, it's not doable to set the timezone environment variable on the fly since Jest resists mutation to `process.env`. So, instead we used standard bash syntax for setting environment variables in `package.json` to set `TZ="America/Vancouver"` before the tests run. We put it in our `test` script in the `scripts` section:

```javascript
"test": "TZ=\"America/Vancouver\" run-s check:* lint build test:*",
```

To enforce that this is working, we added a test that checks that `process.env` has an environment variable `TZ` set to `"America/Vancouver"`.

##### Time Is a Mess

Time is so complicated that [Jest has specific support for working with time](https://jestjs.io/docs/timer-mocks). Since we're interested in `Date` and using Jest before version 27, we need to [use "modern" timers](https://jestjs.io/docs/jest-object#jestusefaketimersimplementation-modern--legacy). Using that, we can make "now" whatever we want. Alternatively, we could use jest's [mock functions](...) in order to mock `Date` and inspect how it's used.

The Jest timer solution is probably **better** than the mocking one, but since we're trying to learn, we use both!

Testing using fake timers turns out to be straightforward. We use a tabular `test.each` similar to the one described above to make 12 individual test cases with one compact, parameterized test function. That test simply sets the system time so that "now" is the time we want, calls `getUbcTerm` with no parameters and checks its result, and finally turns real timers back on again to avoid ruining future tests:

```typescript
({ ubcterm, date }) => {
  jest.useFakeTimers("modern").setSystemTime(date);
  expect(module.getUbcTerm()).toEqual(ubcterm);
  jest.useRealTimers();
};
```

Mocking, on the other hand, is complicated! We ended up following [Yacine Hmito's advice on mocking `Date`](https://github.com/facebook/jest/issues/9185#issuecomment-560152566). We simplified that example substantially since we only wanted to handle calling the zero-argument constructor. (We would have preferred to use [jest's `spyOn` method](https://jestjs.io/docs/jest-object#jestspyonobject-methodname) over this solution, but both the fact that `Date` is in the global scope and that we want to mock a constructor make this challenging.)

Here's the setup for our mock-based testing, which we explain below:

```typescript
describe("tested via mocking, which is probably inferior to using jest.setSystemTime", () => {
  let dateSpy: jest.SpyInstance;
  let originalDate: DateConstructor;
  beforeAll(() => {
    originalDate = global.Date;
    dateSpy = jest.fn(() => new originalDate());
    global.Date = dateSpy as unknown as DateConstructor;
  });
  beforeEach(() => {
    // Reset counters.
    dateSpy.mockClear();
  });
  afterAll(() => {
    global.Date = originalDate;
  });
```

First of all, just getting TypeScript to understand the types when using mocking was tricky. Fortunately, TypeScript only demanded that we explicitly give two types: our mock variable's type (`let dateSpy: jest.SpyInstance`) and our record of the original `Date` constructor (`let originalDate: DateConstructor`).

Next, we want intercept calls to the `Date` constructor so we can spy on them and, in some cases, control their return values. We actually set this up in `beforeAll` to ensure that the setup happens exactly once just before the tests are run. The body of `beforeAll` proceeds in three steps:

1. Keep track of the old version of `Date` so we can restore it later.
2. Use [`jest.fn`](https://jestjs.io/docs/jest-object#jestfnimplementation) to make a new version of `Date` that spies on calls. For its return value, our new version simply calls through to the original version of `Date`.
3. Replace the original version in Node's global scope. ([`global`](https://nodejs.org/api/globals.html#globals_global) is a Node.js-specific variable storing an object representing the global scope in the browser.) Because we only bothered with the `Date` constructor in our mock function, TypeScript complains that it does not match the type of the `global.Date` object. To get around that, we cast `dateSpy` to `unknown` and then to `DateConstructor`, which insists that TypeScript accept the assignment. ([Hmito's version](https://github.com/facebook/jest/issues/9185#issuecomment-560152566) implements all properties of `Date` and so would not have caused the TypeScript error.)

Our `beforeEach` uses [`mockClear`](https://jestjs.io/docs/mock-function-api#mockfnmockclear) to reset the record of calls in the spy before each test, in case the test relies on inspecting how or how many times the `Date` constructor was called. We restore the original version of `Date` after the tests in the `afterAll` block. (Had we used `spyOn` on `Date` instead, we could use [`mockRestore`](https://jestjs.io/docs/mock-function-api#mockfnmockrestore) to put it back the way it was.)

With that setup, we can monitor and control the `Date` constructor. For example, our first test ensures that calling `getUbcTerm` with no arguments uses the current date/time to construct its return value:

```typescript
test("including using the result of 'new Date()' when called with no arguments", () => {
  const result = module.getUbcTerm();

  // new Date() should be called exactly once, with no arguments:
  expect(dateSpy).toHaveBeenCalledTimes(1);
  expect(dateSpy).toHaveBeenCalledWith();
  expect(dateSpy).toHaveReturned();

  // And the end result is the same as getUbcTerm with the explicit date
  const date = dateSpy.mock.results[0].value;
  expect(result).toEqual(module.getUbcTerm(date));
});
```

That test:

- calls `getUbcTerm` with no arguments,
- uses the spy to confirm that the `Date` constructor was called exactly one time ([`.toHaveBeenCalledTimes(1)`](https://jestjs.io/docs/expect#tohavebeencalledtimesnumber)) with no arguments ([`.toHaveBeenCalledWith()`](https://jestjs.io/docs/expect#tohavebeencalledwitharg1-arg2-)), and it successfully returned a value ([`.toHaveReturned()`](https://jestjs.io/docs/expect#tohavereturned)),
- grabs the Date value returned from that single Date constructor call (which lives in [`.mock.results`](https://jestjs.io/docs/mock-function-api#mockfnmockresults)), and
- checks that calling `getUbcTerm` with that Date value as an explicit parameter gives the same result as the parameterless call.

Then, we create our usual set of 12 tests with a tabular `test.each` call. In the parameterized test within the `test.each`, we receive the date for this test and the UBC term expected as a result for that date. We call [`mockImplementationOnce`](https://jestjs.io/docs/mock-function-api#mockfnmockimplementationoncefn) to make the `Date` constructor return what _we_ want. Finally, we test that calling `getUbcTerm` with no parameters gives us the expected result:

```typescript
({ ubcterm, date }) => {
  dateSpy.mockImplementationOnce(() => {
    return date;
  });
  expect(module.getUbcTerm()).toEqual(ubcterm);
};
```

(We could have used [`mockReturnValueOnce`](https://jestjs.io/docs/mock-function-api#mockfnmockreturnvalueoncevalue) instead of `mockImplementationOnce`.)

## Continuous Integration

[Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) (CI) involves frequent commits that are automatically tested for quality control and then integrated into the main codebase. This can be paired with continuous delivery and/or deployment (and DevOps processes in general) so that updates rapidly make it to users.

We'll focus on CI, which is already overkill (of course!) on a tiny, two-person project. The quality control can take any form, but typically includes a build and thorough testing. At minimum, we would want [unit tests](https://en.wikipedia.org/wiki/Unit_testing) (testing each source code piece indepentently) and [regression tests](https://en.wikipedia.org/wiki/Regression_testing) to avoid reintroducing bugs we fix along the way. We'll add TypeScript's static type checking and some basic style/format checking&mdash;in other words, everything we've already set up in our `npm test` script. Using that script for CI also means we can run our CI tests locally to develop confidence that our pull requests will work.

There are several popular CI platforms including: [Travis CI](https://travis-ci.org/), [CircleCI](https://circleci.com/), [Google Cloud Build](https://cloud.google.com/build), [AWS CodePipeline](https://aws.amazon.com/codepipeline/), and [GitHub Actions](https://docs.github.com/en/actions/guides/about-continuous-integration) (which is based on [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/)). Some quick searching around suggested not many meaningful differences between the available options at our scale. Since we're already using GitHub, we'll work with GitHub Actions.

All the tools, including GitHub Actions, allow you to hook an event relevant to the software development pipeline to a script and then take action based on the script's results. We will likely focus on pushes/pull requests to the main branch as our triggering event. Other possibilities in GitHub Actions include other common git actions, manual triggers, and scheduled events (via [cron](https://en.wikipedia.org/wiki/Cron) syntax). Actions might include accepting/rejecting a pull request, just flagging that success/failure for manual review, logging results, and notifying stakeholders of the process. We configure Actions via a [YAML](https://en.wikipedia.org/wiki/YAML) file that lists the event and its triggered script. That script is called a "[workflow](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)" in GitHub Actions.

(YAML is essentially a configuration file language. That may be surprising if you've seen "YA*" and "*ML" acronyms before and guess YAML means "Yet Another Markup Language". Per its Wikipedia page, that is what the acronym originally meant. However, a configuration file isn't a markup file. So, they backronymed it to "YAML Ain't Markup Language". Go figure!)

### Getting Started with GitHub Actions

For a quick start, check out the [GitHub Actions cheat sheet](https://github.github.io/actions-cheat-sheet/actions-cheat-sheet.html). For details, check out the [GitHub Actions reference](https://docs.github.com/en/actions/reference). You may find it easier to read the reference with some examples of the language it uses to describe its YAML syntax:

- [`on.<push|pull_request>.<branches|tags>`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#onpushpull_requestbranchestags) means:
  - in the `on:` section (i.e., the value associated with the `on` key) of your YAML document,
  - in the `push:` or `pull_request:` subsection,
  - the `branches:` or `tags:` subsubsection.
- [`jobs.<job_id>.steps[*].name`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsname) means
  - in the `jobs:` section,
  - in the subsection with the particular name to replace _job_id_ that you chose,
  - in the `steps:` subsubsection,
  - in some entry in the _list_ within that subsubsection (where a YAML list has entries starting with `- `),
  - the `name:` section.

#### GitHub Actions Starter Workflows

GitHub Actions has various starter workflows that you see when you click the Actions button on a repo for the first time or when you click the `New workflow` button later. You can also see this in the [repo backing that page](https://github.com/actions/starter-workflows). (The YAML files are in the direct subdirectories of the repo and their descriptions in the `properties` directory beneath that subdirectory.) Be aware that the commonly used command [`npm ci`](https://docs.npmjs.com/cli/v7/commands/npm-ci) is short for `npm clean-install` and _not_ continuous integration!

Here are a few starter workflows of interest to us:

- [Publishing an npm package on release](https://github.com/actions/starter-workflows/blob/main/ci/npm-publish.yml): This tests and publishes a project to two repositories (npm and GitHub Packages). Specifically, it:

  - triggers when a [release](https://docs.github.com/en/github/administering-a-repository/managing-releases-in-a-repository) is created,
  - tests the project (via `npm test`),
  - publishes to the main npm registry and GitHub Packages registry using `npm publish`
  - configures which registry to publish to by passing different registry URLs as parameters to the [`setup-node` action](https://github.com/actions/setup-node) using [`with`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith)),
  - uses a [context](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions) to access the npm authorization from the [GitHub secrets](https://docs.github.com/en/actions/reference/encrypted-secrets),
  - passes that authorization along to the `run` commands using an [environment variable](https://docs.github.com/en/actions/reference/environment-variables), and
  - uses [`needs`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idneeds) to configure dependencies among the jobs so that the two publishing jobs can run in parallel but only after the testing job finishes.

  **HOWEVER**, the `$registry-url` syntax used in this starter workflow is **not** available in a standard workflow. We, and probably you as well, are building standard workflows. This starter workflow is a special [workflow template](https://docs.github.com/en/actions/learn-github-actions/sharing-workflows-with-your-organization#using-a-workflow-template-from-your-organization). Workflow templates use syntax like `$registry-url` or `$default-branch` for variables that are instantiated to specific values when the template is used to create a standard workflow. The only `$` syntaxes legal in standard workflows are [`${{ ... }}` expression syntax](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#about-contexts-and-expressions) and perhaps shell-specific syntax used in `run` commands (like normal [bash parameter substitution](https://tldp.org/LDP/abs/html/parameter-substitution.html)).

- [Testing across node versions](https://github.com/actions/starter-workflows/blob/main/ci/node.js.yml): Tests across many different versions of node. Specifically, it uses a [matrix](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix) to generate a [factorial](https://en.wikipedia.org/wiki/Factorial_experiment) testing strategy. In this case, there's only one factor&mdash;the Node version, one of four to test with. If you use multiple factors, each combination of factor values is run as a separate job. Many other special-purpose variations are also possible. **CAUTION:** As above, the `$default-branch` syntax is unavailable in standard workflows. Instead, use the name of your default branch, likely `main`.
- [Sample of a manually triggered workflow](https://github.com/actions/starter-workflows/blob/main/automation/manual.yml): Demonstrates how to set up a workflow that triggers manually via a UI or an API call. Among other things, this starter workflow shows how these commands can accept parameters.
- [Welcome message to new contributors](https://github.com/actions/starter-workflows/blob/main/automation/greetings.yml): Invokes a built-in interaction to greet new participants on their first pull request or issue.

### Setting Up the Workflow File

GitHub Actions looks for your workflows in `.github/workflows` in files with `.yml` or `.yaml` extensions. We want to create a workflow that runs on pushes and pull requests to the `main` branch. So, we'll start in our [`.github/workflows/ci.yml` file](.github/workflows/ci.yml) with:

```yaml
name: Continuous Integration
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

Next, we supply the [jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs) in our workflow. Jobs can run in parallel by default, but you can specify [dependencies](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idneeds) between them. Each job _must_ indicate what platform it [runs on](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on). In our case, we only need one job, which we'll run on Ubuntu Linux:

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
```

(Only `on` and (for each job) `runs-on` are required in a workflow.)

A job is made of [steps](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idsteps) that run as individual processes (on the same platform) in sequence. Each step is an element in a YAML list. We have four steps that (1) checkout the repo, (2) set up node, (3) run an npm clean install, and (4) run our npm test script (which also checks types, style, and formatting):

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: actions/setup-node@v2
    with:
      node-version: "14.x"
  - run: npm ci
  - run: npm test
```

The syntax of the second list entry may look odd! Remember that a list entry can itself be a YAML mapping with keys and values, and in this list every entry _is_ a YAML mapping. The first entry has just one key (`uses`) with its one associated value (`actions/checkout@v2`). The second entry has the key `uses` and the key `with`. The value associated with `with` is itself a mapping with just one key: `node-version`. A [`uses` value](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses) in a step calls on a GitHub Action that wraps up some useful behaviour for a workflow. In this case, the Actions prepare your job's platform for use: checking out your repository and setting up node. We use version 2 of both of these actions; best practice is to give a reasonably specific version of the action to use to avoid unexpected behaviour as the action's implementation evolves. A [`run` value](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsrun) in a step is a shell command. We could have had a single step to run both commands instead of two separate steps by using a [YAML block literal](https://yaml.org/spec/1.2/spec.html#id2760844):

```yaml
run: |
  npm ci
  npm test
```

Our full [`ci.yml` workflow](.github/workflows/ci.yml) is a bit more complex just for fun and is built based on the [Node.js starter workflow template](https://github.com/actions/starter-workflows/blob/main/ci/node.js.yml).

## Basic Implementation

We're finally ready to write some code! For our basic implementation, we will simply check the month on the Date and choose the UBC term on its basis. Here's our implementation:

# Unexplained Oddities and Unresolved Thoughts

## Questions about CI

A tenet of CI appears to be [frequent commits to the main code branch](https://en.wikipedia.org/wiki/Continuous_integration#Everyone_commits_to_the_baseline_every_day). That makes sense particularly in an agile framework with its emphasis on working software, and yet... I may have at the end of my work period, for example, only a set of tests. When I submit these, they're going to fail. That's just one version of the larger question about partial progress and how it connects with CI.

What's the answer to this? Is it some combination of:

- I should adapt my philosophy and focus on small, incremental, working changes.
- I should use tools/practices that allow me to make my partial work product _work_, e.g., by using `test.skip` in jest?
- CI is really targeted at particular phases of product development and may not work in the same way at all stages. (E.g., when I'm prototyping, it may not even be meaningful to have a single "product".)
- This is simply a cost of CI, which can be a negative but also encourages some behaviours with significant advantages.

## RESOLVED: Why does `babel` still show in `package-lock.json`?

We originally installed with `babel` but got rid of it. It's not in `package.json`.

Ah, the [`npm list`](https://docs.npmjs.com/cli/v7/commands/npm-ls) command can give more of your dependency tree with, e.g., `npm list --depth=3`, or the [`npm explain`](https://docs.npmjs.com/cli/v7/commands/npm-explain) command can give you bottom-up info. There may be other reasons we have it, but `jest` has a bunch of dependencies into babel.

## Why didn't running `npx tsc --init` with `build` and `src` directories indicated add include/exclude to tsconfig.json?

No idea. Should we have used one of the ["typescript base configs"](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) instead??

## Should we spin off some of the `jest` config into a tutorial?

Both our handling of `testMatch` in `jest.config.js` and using it in `.eslintrc.js` does not seem to be widely documented. If this is a good solution, it might be worth sharing around. Maybe just answer <https://stackoverflow.com/questions/31629389/how-to-use-eslint-with-jest>.

It's a different piece, but our handling of the `check:format` script (giving a message about what to do) is better than the `package.json` that was given to us.

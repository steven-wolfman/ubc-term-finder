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

## Continuous Integration

[Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) (CI) involves frequent commits that are automatically tested for quality control and then integrated into the main codebase. This can be paired with continuous delivery and/or deployment (and DevOps processes in general) so that updates rapidly make it to users.

We'll focus on CI, which is already overkill (of course!) on a tiny, two-person project. The quality control can take any form, but typically includes a build and thorough testing. At minimum, we would want [unit tests](https://en.wikipedia.org/wiki/Unit_testing) (testing each source code piece indepentently) and [regression tests](https://en.wikipedia.org/wiki/Regression_testing) to avoid reintroducing bugs we fix along the way. We'll add to that some basic style/format checking, in other words, everything we've already set up in our `npm test` script. Using that script for CI also means we can run the same tests used for CI locally to develop confidence our pull requests will work!

There are several popular CI platforms including: [Travis CI](https://travis-ci.org/), [CircleCI](https://circleci.com/), [Google Cloud Build](https://cloud.google.com/build), [AWS CodePipeline](https://aws.amazon.com/codepipeline/), and [GitHub Actions](https://docs.github.com/en/actions/guides/about-continuous-integration) (which is based on [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/)).

Some quick searching around suggested not many meaningful differences between the available options at our scale, and especially because we're happy to suffer a bit of pain configuring in the name of Learning!! Since we're already using GitHub, we'll work with GitHub Actions.

GitHub Actions (and the other tools) essentially allows you to hook an event relevant to the software development pipeline to a script and then take action based on the script's results. We will likely focus on pushes/pull requests to main as our triggering event, but other possibilities include other common git actions, manual triggers, or scheduled events (via cron syntax). Actions might include accepting/rejecting a pull request, just flagging that success/failure for manual review, logging results, and notifying stakeholders of the process. Configuration is via a [YAML](https://en.wikipedia.org/wiki/YAML) file that specifies the event and its triggered workflow (script with embedded actions/commands).

(YAML is essentially a configuration file language, which is surprising since the obvious acronym expansion if you've seen "YA*" and "*ML" acronyms before is "Yet Another Markup Language". Per its Wikipedia page, that is what the acronym originally meant, but since a configuration file isn't a markup file, they backronymed it to "YAML Ain't Markup Language". Go figure!)

### Getting Started with GitHub Actions

For a quick start, check out the [GitHub Actions cheat sheet](https://github.github.io/actions-cheat-sheet/actions-cheat-sheet.html). For details, check out the [GitHub Actions reference](https://docs.github.com/en/actions/reference), but be aware that syntax like `on.<push|pull_request>.<branches|tags>` means "in the `on:` section (i.e., the value associated with the `on` key) of your YAML document, in the `push` or `pull` subsection, the `branches` or `tags` subsubsection" and `jobs.<job_id>.steps[*].name` means "in the `jobs:` section, in the subsection with the particular name to replace _job_id_ that you chose, in the `steps:` subsubsection, in some entry in the _list_ within that subsubsection, the `name:` section". (A list has entries starting with `- `.)

#### GitHub Actions Starter Workflows

GitHub Actions has various starter workflows that you see when you click the Actions button on a repo for the first time or when you click the `New workflow` button later. You can also see this in the [repo backing that page](https://github.com/actions/starter-workflows). (The YAML files are in the direct subdirectories and their descriptions in the properties directory beneath that subdirectory.) Many of the `npm` based starter workflows use [`npm ci`](https://docs.npmjs.com/cli/v7/commands/npm-ci) which is short for `npm clean-install` (not continuous integration!).

Here are a few starter workflows of interest to us:

- [Publishing an npm package on release](https://github.com/actions/starter-workflows/blob/main/ci/npm-publish.yml): This tests the project (via `npm test`), publishes to the npm repository, and publishes to the GitHub Packages repository when a [release](https://docs.github.com/en/github/administering-a-repository/managing-releases-in-a-repository) is created. It also demonstrates how to use [environment variables](https://docs.github.com/en/actions/reference/environment-variables) and [contexts](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions) including specifically accessing GitHub secrets like the npm authorization token and how to configure dependencies among jobs (where both the publishing jobs depend on the testing job, but can themselves run in parallel). **HOWEVER**, note that the `$registry-url` syntax and any other `$...` syntax besides [`${{ ... }}` expression syntax](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#about-contexts-and-expressions) (or within shell-specific run commands) is available only in special [workflow templates](https://docs.github.com/en/actions/learn-github-actions/sharing-workflows-with-your-organization#using-a-workflow-template-from-your-organization), not in standard workflows. Don't use it! TODO: hey, that a bogus action of some sort seems like a good idea (a pass-through that logs? maybe start with [TypeScript Action template](https://github.com/actions/typescript-action), or just a null action that logs its environment and parameters?).
- [Testing across node versions](https://github.com/actions/starter-workflows/blob/main/ci/node.js.yml): Uses a [matrix](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix) to generate a factorial testing strategy. (In this case, there's only one factor&mdash;the Node version, one of four to test with&mdash;but you can use multiple factors, in which case each combination of factor values is run as a separate job.) As above, the `$default-branch` syntax is unavailable in standard workflows. Instead, use the name of your default branch, likely `main`.
- [Sample of a manually triggered workflow](https://github.com/actions/starter-workflows/blob/main/automation/manual.yml): Demonstrates how to set up a workflow that triggers manually via a UI or an API call. Among other things, includes shows how these commands can accept parameters.
- [Welcome message to new contributors](https://github.com/actions/starter-workflows/blob/main/automation/greetings.yml): Invokes a built-in interaction to greet new participants on their first pull request or issue.

### Setting Up the Workflow File

GitHub Actions looks for your workflows in `.github/workflows` for `.yml` and `.yaml` files. We want to create a workflow that runs on pushes and pull requests to the `main` branch. So, we'll start in our `.github/workflows/ci.yml` file with:

```yaml
name: Continuous Integration
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

Next, we supply the [jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs) in our workflow. Jobs are run in parallel, but you can create [dependencies as needed](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idneeds). Each job _must_ indicate what platform it [runs on](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on). In our case, we only need one job, which we'll run on Ubuntu Linux:

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
```

(Only `on` and `runs-on` (for each job) are required in a workflow.)

A job is made of [steps](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idsteps) that run as individual processes (on the same platform) in sequence. Each step is an element in a YAML list. We want to checkout the repo, set up Node, run a clean install via npm, and run our test script, which not only runs the tests themselves but also checks for style and formatting:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: actions/setup-node@v2
    with:
      node-version: "14.x"
  - run: npm ci
  - run: npm test
```

The syntax looks a bit odd in the second entry of this list. Each list entry is itself a YAML mapping with keys and values. So, the second entry has the key `uses` and the key `with`. The value associated with `with` is itself a mapping with just one key: `node-version`. A [`uses` value](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses) in a step calls on a GitHub Action. Best practice is to give a reasonably specific version of the action to use. A [`run` value](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsrun) in a step is a shell command. We could have had a single step to run both commands instead:

```yaml
run: |
  npm ci
  npm test
```

Our full [`ci.yml` workflow](.github/workflows/ci.yml) is a bit more complex just for fun and is built based on the [Node.js starter workflow template](https://github.com/actions/starter-workflows/blob/main/ci/node.js.yml).

### Questions about CI

A tenet of CI appears to be [frequent commits to the main code branch](https://en.wikipedia.org/wiki/Continuous_integration#Everyone_commits_to_the_baseline_every_day). That makes sense particularly in an agile framework with its emphasis on working software, and yet... I may have at the end of my work period, for example, only a set of tests. When I submit these, they're going to fail. That's just one version of the larger question about partial progress and how it connects with CI.

What's the answer to this? Is it some combination of:

- I should adapt my philosophy and focus on small, incremental, working changes.
- I should use tools/practices that allow me to make my partial work product _work_, e.g., by using `test.skip` in jest?
- CI is really targeted at particular phases of product development and may not work in the same way at all stages. (E.g., when I'm prototyping, it may not even be meaningful to have a single "product".)
- This is simply a cost of CI, which can be a negative but also encourages some behaviours with significant advantages.

# Unexplained Oddities and Unresolved Thoughts

## RESOLVED: Why does `babel` still show in `package-lock.json`?

We originally installed with `babel` but got rid of it. It's not in `package.json`.

Ah, the [`npm list`](https://docs.npmjs.com/cli/v7/commands/npm-ls) command can give more of your dependency tree with, e.g., `npm list --depth=3`, or the [`npm explain`](https://docs.npmjs.com/cli/v7/commands/npm-explain) command can give you bottom-up info. There may be other reasons we have it, but `jest` has a bunch of dependencies into babel.

## Why didn't running `npx tsc --init` with `build` and `src` directories indicated add include/exclude to tsconfig.json?

No idea. Should we have used one of the ["typescript base configs"](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) instead??

## Should we spin off some of the `jest` config into a tutorial?

Both our handling of `testMatch` in `jest.config.js` and using it in `.eslintrc.js` does not seem to be widely documented. If this is a good solution, it might be worth sharing around. Maybe just answer <https://stackoverflow.com/questions/31629389/how-to-use-eslint-with-jest>.

# Development Process/Tutorial

One of the main developers (Steve) is UBC CPSC faculty and doing this in part just to brush up on skills and be a teacher. So, this will be a living rundown of the creation process.

## Early Stages

### Starting

To publish an npm package, we're starting from [BetterStack's best practices article](https://betterstack.dev/blog/npm-package-best-practices/) and also from [khalilstemmler.com's article on setting up TypeScript + Node.js](https://khalilstemmler.com/blogs/typescript/node-starter-project/).

To get set up, Steve created a public [Github](https://github.com/) repo with an MIT license and the Node .gitignore file. For the name, the BetterStack article and [npm's guidelines for package names](https://docs.npmjs.com/package-name-guidelines) suggested short, clear, lowercase naming, and we wanted the Github repo and npm package names to match. `ubc-term-finder` seemed short and clear; so, that's the name of the [repo](https://github.com/steven-wolfman/ubc-term-finder).

Steve then used the [`Manage access` menu](https://github.com/steven-wolfman/ubc-term-finder/settings/access) to invite Piam to collaborate.

Getting set up for editing on your own computer is another huge topic in itself, but the short version to start is to open the repo and click either the "Code" button to get a link to clone the repository or the "Fork" button to fork the repository into your own account (which is the way to go for people outside the main development team who want to contribute or for teams following the [forking workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962) or are simply a fan of [the Good Place](https://thegoodplace.fandom.com/wiki/Censored_Curse_Words).

### Norms

To contribute to the package, we'll use a [branch-and-pull-request workflow](https://guides.github.com/introduction/flow/) within the development team. That will start after I put this document into the repo and update the `README.md` file to reflect the requested workflow.

### Basic Setup

This will be an npm package using [TypeScript](https://www.typescriptlang.org/). We'll likely want to use [Babel](https://babeljs.io/) because we want to use the latest ES6 syntax but there's no reason this simple functionality shouldn't be accessible to older codebases. Both [Babel](https://babeljs.io/docs/en/babel-preset-typescript) and [Typescript](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html) have notes on these systems working together. We'll want, at minimum, to test with [Jest](https://jestjs.io/).

So, let's get all that set up:

1. From the terminal, run `npm init`. Most of the questions can get the default or obvious response (e.g., an edited version of the descrption from `README.md` for the `description:` field). The `test command:` should be `jest` for this project. Guideline on [keywords](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#keywords) is pretty slim; so we just picked a few. They're easy to change in the `package.json` file. We used an MIT license. The [author field](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#people-fields-author-contributors) is meant to be one person; so, Steve put himself in and Piam as a collaborator by editing `package.json` after the fact.
2. Install jest for development: `npm install --save-dev jest @types/jest`. The `--save-dev` part ensures that installing the `ubc-term-finder` package won't install jest, but cloning the repo and running `npm install` locally will. This also includes types for jest tests, to support typescript later on.
3. Install babel for development: `npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/cli`. This includes `babel-jest` for integration with jest, see the [jest notes on TypeScript/Babel](https://jestjs.io/docs/getting-started#using-typescript).
4. [Install typescript](https://www.typescriptlang.org/download) for development: `npm install --save-dev typescript @babel/preset-typescript`
5. Next up, [`eslint`]() ([`tslint` has been deprecated](https://www.npmjs.com/package/tslint)) and [`prettier`](https://prettier.io/), which interact fairly heavily, since they serve similar purposes: `npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier`. This doesn't yet set up config files for either one. Then, for integration: `npm install --save-dev eslint-config-prettier eslint-plugin-prettier`

Now everything is installed, but mostly still needs to be configured:

1. [Babel config](https://babeljs.io/docs/en/configuration#packagejson): Edit the `package.json` file to include the `babel` section:

   ```json
   "babel": {
       "presets": ["@babel/preset-typescript"]
   }
   ```

2. [Typescript config](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html): Create/edit `tsconfig.json`. We used a slightly edited version of the command from the [stemmler](https://khalilstemmler.com/blogs/typescript/node-starter-project/) tutorial with `--allowJs` set to `false`:
   ```bash
   npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule \
           --lib es6 --module commonjs --allowJs false --noImplicitAny true
   ```
   Then edited that to modify/add these options from the typescript config notes for Babel:
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
   ```

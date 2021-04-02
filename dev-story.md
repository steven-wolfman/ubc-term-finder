# Development Process/Tutorial

One of the main developers (Steve) is UBC CPSC faculty and doing this in part just to brush up on skills and be a teacher. So, this will be a living rundown of the creation process.

## Early Stages

### Setup

To publish an npm package, we're starting from [BetterStack's best practices article](https://betterstack.dev/blog/npm-package-best-practices/).

To get set up, Steve created a public [Github](https://github.com/) repo with an MIT license and the Node .gitignore file. For the name, the BetterStack article and [npm's guidelines for package names](https://docs.npmjs.com/package-name-guidelines) suggested short, clear, lowercase naming, and we wanted the Github repo and npm package names to match. `ubc-term-finder` seemed short and clear; so, that's the name of the [repo](https://github.com/steven-wolfman/ubc-term-finder).

Steve then used the [`Manage access` menu](https://github.com/steven-wolfman/ubc-term-finder/settings/access) to invite Piam to collaborate.

Getting set up for editing on your own computer is another huge topic in itself, but the short version to start is to open the repo and click either the "Code" button to get a link to clone the repository or the "Fork" button to fork the repository into your own account (which is the way to go for people outside the main development team who want to contribute or for teams following the [forking workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962) or are simply a fan of [the Good Place](https://thegoodplace.fandom.com/wiki/Censored_Curse_Words).

### Norms

To contribute to the package, we'll use a [branch-and-pull-request workflow](https://guides.github.com/introduction/flow/) within the development team. That will start after I put this document into the repo and update the `README.md` file to reflect the requested workflow.

## Continuous Integration

[Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) (CI) involves frequent commits that are automatically tested for quality control and then integrated into the main codebase. This can be paired with continuous delivery and/or deployment (and DevOps processes in general) so that updates rapidly make it to users.

We'll focus on CI, which is already overkill (of course!) on a small two-person project. The quality control can take any form, but typically includes a build and thorough testing. At minimum, we would want [unit tests](https://en.wikipedia.org/wiki/Unit_testing) (testing each source code piece indepentently) and [regression tests](https://en.wikipedia.org/wiki/Regression_testing) to avoid reintroducing bugs we fix along the way. We'll add to that some basic style/format checking.

I'm not really sure if this is standard for CI, but we certainly want to be able to run as much of the CI workflow as possible locally, which is how we've configured our `npm test` script. Hopefully, we'll be able to repurpose our test script into our CI workflow.

There are several popular CI platforms including: [Travis CI](https://travis-ci.org/), [CircleCI](https://circleci.com/), [Google Cloud Build](https://cloud.google.com/build), [AWS CodePipeline](https://aws.amazon.com/codepipeline/), and [GitHub Actions](https://docs.github.com/en/actions/guides/about-continuous-integration) (which is based on [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/)).

Some quick searching around suggested not many meaningful differences between the available options at our scale, and especially because we're happy to suffer a bit of pain configuring in the name of Learning!! Since we're already using GitHub, we'll work with GitHub Actions.

GitHub Actions (and the other tools) essentially allows you to hook an event relevant to the software development pipeline to a script and then take action based on the script's results such as accepting/rejecting a pull request, just flagging that success/failure for manual review, logging results, and notifying stakeholders of the process. Configuration is via a [YAML](https://en.wikipedia.org/wiki/YAML) file that specifies the event and its triggered workflow (script with embedded actions/commands).[^yaml]

[^yaml]: YAML is essentially a configuration file language, which is surprising since the obvious acronym expansion if you've seen "YA*" and "*ML" acronyms before is "Yet Another Markup Language". Per its Wikipedia page, that is what the acronym originally meant, but since a configuration file isn't a markup file, they backronymed it to "YAML Ain't Markup Language". Go figure!

### Questions about CI

- A tenet of CI appears to be [frequent commits to the main code branch](https://en.wikipedia.org/wiki/Continuous_integration#Everyone_commits_to_the_baseline_every_day). That makes sense particularly in an agile framework with its emphasis on working software, and yet... I may have at the end of my work period, for example, only a set of tests. When I submit these, they're going to fail. That's just one version of the larger question about partial progress and how it connects with CI.

What's the answer to this? Is it some combination of:

- I should adapt my philosophy and focus on small, incremental, working changes.
- I should use tools/practices that allow me to make my partial work product _work_, e.g., by using `test.skip` in jest?
- CI is really targeted at particular phases of product development and may not work in the same way at all stages. (E.g., when I'm prototyping, it may not even be meaningful to have a single "product".)
- This is simply a cost of CI, which can be a negative but also encourages some behaviours with significant advantages.

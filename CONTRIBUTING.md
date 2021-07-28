# Contributing to Litmus Documentation

Welcome to Litmus!! This guide goes over in details about the contribution process to the documentation.

Litmus is an Apache 2.0 Licensed project and uses the standard GitHub pull requests process to review and accept contributions. We welcome improvements from all contributors, new and experienced.

Litmus documentation contributors:

- Improve existing content
- Create new content
- Maintain documentation framework
- Keep documentation builds healthy
- Manage and publish documentation as part of the Litmus release cycle

Contributions are not limited to the above mentioned items. In case you have ideas for improving the documentation - create a PR.

## Steps to Contribute

Litmus documentation currently runs using [Docusaurus](https://docusaurus.io/) static file generator. [Embedmd](https://github.com/campoy/embedmd/) for embedding source codes into the documentation. [Travis CI](https://travis-ci.com/) is the build tool. Also, we have integrated [Netlify](https://www.netlify.com/) to deploy preview of the change.

- Find an issue to work on or create a new issue. The issues are maintained at [litmuschaos/litmus](https://github.com/litmuschaos/litmus/issues). For new contributors, you can pick up from a list of [good first issues](https://github.com/litmuschaos/litmus/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%2Flitmus-docs+label%3A%22good+first+issue%22+)
- Claim your issue by commenting your intent to work on it to avoid duplication of efforts.
- Fork the repository on GitHub.
- Create a branch from where you want to base your work (usually master).
- Make your changes, test locally, see preview by starting server and seeing in Preview Mode.
- Execute embedmd command before commiting your changes, so that it can embed source code into documentation, refer [README](/README.md) for steps.
- Commit your changes by making sure the commit messages convey the need and notes about the commit. Also make sure to [sign your commit](https://github.com/litmuschaos/litmus-docs/blob/master/CONTRIBUTING.md#sign-your-work) while making a new commit.
- Push your changes to the branch in your fork of the repository.
- Submit a pull request to the original repository.

A sample PR flow is outlined [here](https://guides.github.com/introduction/flow/). More detailed one is [here](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

## Use embedmd command before commiting changes

- Once you're done with the changes don't forget to run `embedmd` which will extract the embedded code from different files. For this you need do:

```bash
cd docs
embedmd -w $(find **/*.md)
```

## Pull Request Checklist

- Rebase to the current master branch before submitting your pull request.

- Commits should be kept small if possible. Each commit should follow the checklist below:

  - Pass the compile and tests - includes Link Verification, Formatting, etc.
  - Commit header (first line) should convey what changed
  - Commit body should include details such as why the changes are required and how the proposed changes
  - View automated netlify preview link on your PR for correctness of your changes. Escalate to project maintainers if the netify preview fails.

Protip : Refer to good PR etiquettes [here](https://gist.github.com/mikepea/863f63d6e37281e329f8).

- If your PR is not getting reviewed or you need a specific person to review it, please reach out to the Litmus contributors at the [Litmus slack channel](https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN)

### Sign your work

We use the Developer Certificate of Origin (DCO) as an additional safeguard for the LitmusChaos project. This is a well established and widely used mechanism to assure that contributors have confirmed their right to license their contribution under the project's license. Please add a line to every git commit message:

```
  Signed-off-by: Random J Developer <random@developer.example.org>
```

The email id should match the email id provided in your GitHub profile.

If you set your `user.name` and `user.email` in git config, you can sign your commit automatically with `git commit -s`.

You can also use git [aliases](https://git-scm.com/book/tr/v2/Git-Basics-Git-Aliases) like `git config --global alias.ci 'commit -s'`. Now you can commit with `git ci` and the commit will be signed.

### Adhere to Documentation Standards

Please ensure you follow the below standards around naming to avoid rework on the submitted pull requests.

- Resource names like ChaosEngine, ChaosExperiment, ChaosResult etc. should be in PascalCase.
- Spec attributes should be in camelCase.

## Community

We organize the Litmus into Special Interest Groups or SIGs in order to improve our workflow and to easily manage this community project. The developers within each SIG have autonomy and ownership over that SIG’s part of Litmus.

Like everything else in Litmus, a SIG is an open, community, effort. We thrive on a lively and friendly open-source community. Anybody is welcome to jump into a SIG and begin fixing issues/documentation, critiquing design proposals and reviewing code.

The Litmus community will have a weekly contributor sync-up on Mondays 20.30-21.30IST

- The sync up meeting is held online on [zoom](https://zoom.us/j/91358162694)
- The contribution items are tracked in this [planning sheet](https://docs.google.com/document/d/1Z9DrnA8W_IM2HnVOWU1dtVrVB9MyWj8VP43YS_A_wFs).

SIG Documentation is [here](https://github.com/litmuschaos/litmus/wiki/Special-Interest-Groups#sig-documentation). Please join the weekly zoom call, introduce yourself and get started!!

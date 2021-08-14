<img alt="LitmusChaos" src="https://avatars.githubusercontent.com/u/49853472?s=200&v=4" width="200" align="left">

# Documentation for the Litmus Project

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Flitmuschaos%2Flitmus-docs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Flitmuschaos%2Flitmus-docs?ref=badge_shield)
[![Slack Channel](https://img.shields.io/badge/Slack-Join-purple)](https://slack.litmuschaos.io)
[![Docker Pulls](https://img.shields.io/docker/pulls/litmuschaos/ansible-runner.svg)](https://hub.docker.com/r/litmuschaos/ansible-runner)
[![GitHub stars](https://img.shields.io/github/stars/litmuschaos/litmus-docs?style=social)](https://github.com/litmuschaos/litmus-docs/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/litmuschaos/litmus-docs)](https://github.com/litmuschaos/litmus-docs/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/litmuschaos/litmus-docs?logo=git)](https://github.com/litmuschaos/litmus-docs/pulls)
[![Twitter Follow](https://img.shields.io/twitter/follow/litmuschaos?style=social)](https://twitter.com/LitmusChaos)
[![YouTube Channel](https://img.shields.io/badge/YouTube-Subscribe-red)](https://www.youtube.com/channel/UCa57PMqmz_j0wnteRa9nCaw)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat&logo=github)](https://github.com/litmuschaos/litmus-docs/pulls)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/litmuschaos/litmus-docs)
![GitHub top language](https://img.shields.io/github/languages/top/litmuschaos/litmus-docs)

#### _Read this in [other languages](translations/TRANSLATIONS.md)._

[FR](translations/README-fr.md)

Additional details on the Docusaurus project can be found [here](https://docusaurus.io/docs/en/installation.html).

#

## For Developers

### Clone litmus-docs repository

```bash
git clone https://github.com/litmuschaos/litmus-docs.git
cd litmus-docs
```

The docs website server can be setup manually or through docker compose

## Use embedmd command before commiting changes

The embedded code will be extracted from the file at `URL`, which can either be a relative path to a file in the local file system (using forward slashes as directory separator) or a URL starting with `http://` or `https://.`

_Installation:_

- Make sure you have [golang](https://github.com/golang/go) installed. We just need to run the following command to install embedmd.

```bash
go get github.com/campoy/embedmd
```

_Run embedmd (needs to be done before commiting the changes):_

- Follow the steps (from root directory) to run embedmd:

```bash
cd website/docs
embedmd -w $(find **/*.md)
```

_Check the difference:_

- Executing `embedmd -d docs-name.md` will display the difference between the contents of docs-name.md and the output of embedmd docs-name.md.

## Manual Setup

### Install Node.js

```bash
sudo apt-get install software-properties-common
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
```

### Get the latest Node.js package

```bash
sudo apt-get install -y nodejs
```

### Install Yarn

```bash
npm install -g yarn
```

### Start the server

```bash
cd website
yarn install
yarn start
```

## Using Docker compose

### Install docker compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Run the server

```bash
docker-compose up
```

## Browse local documentation

http://localhost:3000/docs/next/getstarted.html

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Flitmuschaos%2Flitmus-docs.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Flitmuschaos%2Flitmus-docs?ref=badge_large)

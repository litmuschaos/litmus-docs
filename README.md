
Documentation pour le projet Litmus

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


Une description détaillée de projet Docusaurus est disponible
 [ici](https://docusaurus.io/docs/en/installation.html).

## Pour les développeurs

### Cloner le répertoire litmus-docs

```bash
git clone https://github.com/litmuschaos/litmus-docs.git
cd litmus-docs
```

Le serveur de site web documentaire peut être configuré manuellement ou en utilisant docker  compose

## Utiliser les commandes embedmd avant de commiter les changements

Le code incorporé sera extrait du fichier à `URL`, qui peut être un chemin relatif vers un autre dans le fichier de système local( en utilisant les barres obliques comme spérateur de répertoire) ou une URL commençant par  `http://` ou `https://.`

_Installation:_

- Il faut bien vérfier que [golang](https://github.com/golang/go) est installé. On a juste besoin d'exécuter la commande ci-dessous pour installer embedmd.

```bash
go get github.com/campoy/embedmd
```

_Exécution embedmd (doît être faite avant de commiter les modifications):_

- Suivez les étapes ci-dessous(à partir de répertoire root) pour exécuter embedmd:

```bash
cd docs
embedmd -w $(find *.md)
```
_Vérifier la différence:_

- L'exécution de cette commmande `embedmd -d docs-name.md` révelera la différence entre le contenu de docs-name.md et le résultat de embedmd docs-name.md.


## La configuration manuelle

### Installer Node.js

```bash
sudo apt-get install software-properties-common
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
```

### Télécharger la dérniére version Node.js 

```bash
sudo apt-get install -y nodejs
```

### Installer Yarn

```bash
npm install -g yarn
```

### Démarrer le serveur 

```bash
cd website
yarn install
yarn start
```

## La configuration via Docker compose

### Installer docker compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Démarrer le serveur

```bash
docker-compose up
```


## Parcourir la documentation locale
http://localhost:3000/docs/next/getstarted.html


## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Flitmuschaos%2Flitmus-docs.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Flitmuschaos%2Flitmus-docs?ref=badge_large)

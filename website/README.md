# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Installation

```console
npm install
```

## Local Development

```console
npm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Versioning

```console
npm run docusaurus docs:version <VERSION>
```

This command will tag a new version from master docs.
It will copy the docs/ folder contents into a new versioned_docs/version-`<version>`/ folder, create a versioned sidebars file based from your current sidebar configuration (if it exists) - saved as versioned_sidebars/version-`<version>`-sidebars.json and append the new version number to versions.json.

## Deployment

```console
GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

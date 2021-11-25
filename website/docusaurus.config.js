const versions = require('./versions.json')
const communities = [
  {
    label: 'Slack',
    href: 'https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN'
  },
  {
    label: 'GitHub',
    href: 'https://github.com/litmuschaos'
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/LitmusChaos'
  },
  {
    label: 'Blog',
    href: 'https://dev.to/t/litmuschaos/latest'
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCa57PMqmz_j0wnteRa9nCaw '
  }
]

const resources = [
  {
    label: 'Docs',
    href: 'https://docs.litmuschaos.io/'
  },
  {
    label: 'FAQ',
    href: 'https://docs.litmuschaos.io/docs/faq-general/'
  },
  {
    label: 'Issues',
    href: 'https://github.com/litmuschaos/litmus/issues'
  }
]

module.exports = {
  title: 'Litmus Docs',
  tagline: 'A website for testing',
  url: 'https://docs.litmuschaos.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'litmuschaos',
  projectName: 'litmus',
  themeConfig: {
    algolia: {
      apiKey: '7af78d639b7342f7da38c5c5c51993b0',
      indexName: 'litmuschaos',
      contextualSearch: true
    },
    navbar: {
      title: 'Litmus Docs',
      logo: {
        alt: 'Litmus Logo',
        srcDark: 'img/litmus-icon.svg',
        src: 'img/litmus-light-icon.svg'
      },
      items: [
        {
          type: 'docsVersion',
          position: 'right'
        },
        {
          activeBasePath: 'Version',
          label: 'Versions',
          position: 'left',
          items: [
            // adding items will create a dropdown
            {
              label: versions[0],
              to: 'docs/',
              activeBaseRegex: `docs/(?!${versions.join('|')}|next)`
            },
            ...versions.slice(1).map(version => ({
              label: version,
              to: `docs/${version}/introduction/what-is-litmus`
            })),
            {
              label: 'Master/Unreleased',
              to: 'docs/next/introduction/what-is-litmus'
            },
            {
              label: 'V1-Docs',
              to: 'https://v1-docs.litmuschaos.io/docs/getstarted/'
            }
          ]
        },
        {
          label: 'Tutorials',
          to: '/tutorials',
          position: 'right'
        },
        {
          label: 'APIs',
          to: 'http://litmuschaos.github.io/litmus/graphql/v2.0.0/api.html',
          position: 'right'
        },
        {
          label: 'Experiment Docs',
          to: 'http://litmuschaos.github.io/litmus',
          position: 'right'
        },
        {
          to: 'https://github.com/litmuschaos/litmus',
          label: 'GitHub',
          position: 'right'
        },
        {
          to: 'https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN',
          label: 'Slack',
          position: 'right'
        },
        {
          to: 'https://hub.litmuschaos.io/',
          label: 'ChaosHub',
          position: 'right'
        }
      ]
    },
    colorMode: {
      // "light" | "dark"
      defaultMode: 'light',

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: false,

      // Should we use the prefers-color-scheme media-query,
      // using user system preferences, instead of the hardcoded defaultMode
      respectPrefersColorScheme: false
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Litmus Logo',
        src: 'img/litmus-logo-dark-bg-icon.svg'
      },
      links: [
        {
          title: 'Community',
          items: communities
        },
        {
          title: 'Resources',
          items: resources
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LitmusChaos Authors. All rights reserved.`
    },
    hideableSidebar: true,

    googleAnalytics: {
      trackingID: 'UA-155028077-2'
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/litmuschaos/litmus-docs/edit/master/website',
          showLastUpdateTime: true
        },
        theme: {
          customCss: require.resolve('./src/css/global.css')
        }
      }
    ]
  ]
}

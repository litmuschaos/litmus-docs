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
  url: 'https://litmusdocs.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'litmuschaos',
  projectName: 'litmus',
  themeConfig: {
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
              to: `docs/${version}/getstarted`
            })),
            {
              label: 'Master/Unreleased',
              to: 'docs/next/introduction/what-is-litmus'
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
          href: 'https://github.com/litmuschaos/litmus',
          label: 'GitHub',
          position: 'right'
        },
        {
          href: 'https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN',
          label: 'Slack',
          position: 'right'
        },
        {
          href: 'https://hub.litmuschaos.io/',
          label: 'Chaos Hub',
          position: 'right'
        }
      ]
    },
    colorMode: {
      // "light" | "dark"
      defaultMode: 'light',

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: true,

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
    hideableSidebar: true
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/litmuschaos/litmus-docs-beta/edit/staging/',
          showLastUpdateTime: true
        },
        theme: {
          customCss: require.resolve('./src/css/global.css')
        }
      }
    ]
  ]
}

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
    href: 'https://docs.litmuschaos.io/docs/faq/'
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
      appId: "D8YZTJNSE2",
      apiKey: 'b388bb42bbdfcd9c02f0eb32c6ee9fa4',
      indexName: 'litmuschaos'
    },
    announcementBar: {
      id: 'support_us',
      content:
        'Star our repository on <a target="_blank" rel="noopener noreferrer" href="https://github.com/litmuschaos/litmus">GitHub</a> to stay updated with new features and contribute to our project!',
      backgroundColor: '#d8dbfa',
      textColor: '#5b44ba',
      isCloseable: true,
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
              label: 'master/unreleased',
              to: 'docs/next/introduction/what-is-litmus'
            },
          ]
        },
        {
          type: 'docsVersion',
          position: 'left'

        },
        {
          type: 'search',
          position: 'right',
        },
        {
          label: 'APIs',
          to: 'https://litmuschaos.github.io/litmus/graphql/v3.11.0/api.html',
          position: 'right'
        },
        {
          label: 'Experiment Docs',
          to: 'http://litmuschaos.github.io/litmus',
          position: 'right'
        },
        {
          to: 'https://hub.litmuschaos.io/',
          label: 'ChaosHub',
          position: 'right'
        } ,
        {
          to: 'https://github.com/litmuschaos/litmus',
          position: 'right',
          label: 'Try Litmus',
          className: 'try-button',
          'aria-label': 'Try Litmus',
        },
        {
          href: 'https://github.com/litmuschaos/litmus',
          className: 'github-button',
          position: 'right',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN',
          className: 'slack-button',
          position: 'right',
          'aria-label': 'Slack',
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
    hideableSidebar: true
  },
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/docs/user-guides/chaoscenter-advanced-installation',
            to: '/docs/getting-started/installation',
          },
        ],
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/litmuschaos/litmus-docs/edit/master/website',
          showLastUpdateTime: false
        },
        theme: {
          customCss: require.resolve('./src/css/global.css')
        },
        gtag: {
          trackingID: 'G-GG5GRPM03R'
        },
        googleAnalytics: {
          trackingID: 'UA-155028077-2'
        }
      }
    ]
  ]
}

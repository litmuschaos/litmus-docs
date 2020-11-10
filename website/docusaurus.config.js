const communities = [
  {
    label: "Slack",
    href: "https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN",
  },
  {
    label: "GitHub",
    href: "https://github.com/litmuschaos",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/LitmusChaos",
  },
  {
    label: "Blog",
    href: "https://dev.to/t/litmuschaos/latest",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCa57PMqmz_j0wnteRa9nCaw ",
  },
];

const resources = [
  {
    label: "Docs",
    href: "https://docs.litmuschaos.io/",
  },
  {
    label: "FAQ",
    href: "https://docs.litmuschaos.io/docs/faq-general/",
  },
  {
    label: "Issues",
    href: "https://github.com/litmuschaos/litmus/issues",
  },
];

module.exports = {
  title: "Litmus Docs",
  tagline: "A website for testing",
  url: "https://docs.litmuschaos.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "litmuschaos", // Usually your GitHub org/user name.
  projectName: "litmus", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Litmus Docs",
      logo: {
        alt: "Litmus Logo",
        srcDark: "img/litmus-icon.svg",
        src: "img/litmus-light-icon.svg",
      },
      items: [
        {
          href: "https://github.com/litmuschaos/litmus",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN",
          label: "Slack",
          position: "right",
        },
        {
          href: "https://hub.litmuschaos.io/",
          label: "Chaos Hub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      logo: {
        alt: "Litmus Logo",
        src: "img/litmus-logo-dark-bg-icon.svg",
      },
      links: [
        {
          title: "Community",
          items: communities,
        },
        {
          title: "Resources",
          items: resources,
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LitmusChaos Authors. All rights reserved.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/litmuschaos/litmus",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};

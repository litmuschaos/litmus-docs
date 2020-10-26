/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image: '/img/undraw_open_source.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Litmus Docs', // Title for your website.
  tagline: 'A website for testing',
  url: 'https://docs.litmuschaos.io', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'litmus',
  organizationName: 'litmuschaos',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // Algolia for searchbar
  algolia: {
    apiKey: '7af78d639b7342f7da38c5c5c51993b0',
    indexName: 'litmuschaos',
    debug: true,
  },

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { href: 'https://github.com/litmuschaos/litmus', label: 'GitHub' },
    { href: 'https://kubernetes.slack.com/messages/CNXNB0ZTN', label: 'Slack' },
    { href: 'https://hub.litmuschaos.io/', label: 'Chaos Hub' },
    { search: true },
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  footerIcon: 'img/litmus-logo-dark-bg-icon.svg',
  headerIcon: 'img/litmus-icon.svg',
  favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#0063ff',
    secondaryColor: '#23232a',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright1: `Copyright © ${new Date().getFullYear()} LitmusChaos Authors. All rights reserved.`,
  copyright2: `Copyright © ${new Date().getFullYear()} The Linux Foundation. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our Trademark Usage page.`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-blocks-buttons.js',
  ],

  stylesheets: ['/css/code-blocks-buttons.css'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  editUrl: 'https://github.com/litmuschaos/litmus-docs/edit/staging/docs/',

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  docsSideNavCollapsible: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/litmuschaos/litmus',
  twitterUsername: 'LitmusChaos',

  scrollToTop: true,
  scrollToTopOptions: {
    scrollDuration: 200,
    diameter: 35,
    backgroundColor: 'gray',
  },

  gaTrackingId: 'UA-155028077-2',
  gaGtag: true,
};

module.exports = siteConfig;

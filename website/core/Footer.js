/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const communities = [
  {
    name: 'Slack',
    url: 'https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/litmuschaos',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/LitmusChaos',
  },
  {
    name: 'Blog',
    url: 'https://dev.to/t/litmuschaos/latest',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/channel/UCa57PMqmz_j0wnteRa9nCaw ',
  },
];

const resources = [
  {
    name: 'Docs',
    url: 'https://docs.litmuschaos.io/',
  },
  {
    name: 'FAQ',
    url: 'https://docs.litmuschaos.io/docs/faq-general/',
  },
  {
    name: 'Issues',
    url: 'https://github.com/litmuschaos/litmus/issues',
  },
];

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div>
            <a href={this.props.config.baseUrl}>
              {this.props.config.headerIcon && (
                <img
                  src={this.props.config.baseUrl + this.props.config.footerIcon}
                  alt={this.props.config.title}
                  width="200"
                />
              )}
            </a>
            <p className="footerText">{this.props.config.copyright1}</p>
            <p className="footerText">{this.props.config.copyright2}</p>
          </div>
          <div>
            <h5>Community</h5>
            {communities.map((comm, index) => (
              <a
                key={index}
                href={comm.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {comm.name}
              </a>
            ))}
          </div>
          <div>
            <h5>Resources</h5>
            {resources.map((res, index) => (
              <a
                key={index}
                href={res.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {res.name}
              </a>
            ))}
          </div>
          <div>
            <h5>About Us</h5>
            <p className="footerText">
              Litmus is an OSS licensed project <br /> as Apache License 2.0{' '}
              <br />
              <br /> Founded by{' '}
              <a
                href="https://mayadata.io/"
                target="_"
                style={{ display: 'inline', color: '#fff', fontWeight: 'bold' }}
              >
                MayaData{' '}
              </a>
              ❤️
            </p>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/litmuschaos/litmus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
            {this.props.config.twitterUsername && (
              <div className="social">
                <a
                  href={`https://twitter.com/${this.props.config.twitterUsername}`}
                  className="twitter-follow-button"
                >
                  Follow @{this.props.config.twitterUsername}
                </a>
              </div>
            )}
            {this.props.config.facebookAppId && (
              <div className="social">
                <div
                  className="fb-like"
                  data-href={this.props.config.url}
                  data-colorscheme="dark"
                  data-layout="standard"
                  data-share="true"
                  data-width="225"
                  data-show-faces="false"
                />
              </div>
            )}
          </div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;

---
id: oauth-dex-concept
title: Authentication process in ChaosCenter
sidebar_label: Authentication in ChoasCenter
---

---

## Prerequisites

- [OAuth](https://oauth.net/specs/)

ChaosCenter allows OAuth as well as local authentication using Dex and the authentication server.


## Authentication Architecture

<img src={require('../assets/concepts/authentication/architecture.png').default} width="800" /><br/><br/>


Litmus portal uses two components for authentication of users:

- Authentication Server
- Dex OIDC Server (Optional)

By default litmus-portal comes with then authentication server as part of the `litmusportal-server` deployment and it allows local authentication that is based of mongo database. Client services such as `litmus-ctl` and `litmusportal-frontend` make use of this server.

In order to provide enhanced and seamless login features, we wanted to integrate OAuth and other authentication mechanisms such as OpenID connect. To have flexibility, litmus-portal makes use of an additional component, [Dex OIDC server](https://dexidp.io/).

It is an highly extensible cloud native OIDC provider that is able to take care of various authentication mechanisms. In order to keep things uniform, when this additional server is deployed, the authentication-server has some features that allows it to communicate to the dex-server, this enables integration of various OAuth providers, some being GitHub auth and Google auth in this case.


## Resources

- [Deploying OAuth in ChaosCenter](../user-guides/chaoscenter-oauth-dex-installation.md)










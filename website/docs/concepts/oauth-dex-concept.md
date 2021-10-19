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

Dex is a highly extensible cloud-native OIDC provider that is able to take care of various authentication mechanisms. With Dex being deployed, the authentication-server can communicate with the dex-server,  enabling integration of various OAuth providers. GitHub and Google auth has been tested at present. 


## Resources

- [Deploying OAuth in ChaosCenter](../user-guides/chaoscenter-oauth-dex-installation.md)










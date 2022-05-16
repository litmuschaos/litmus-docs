---
id: chaoscenter-oauth-dex-installation
title: ChaosCenter with OAuth2 Login Support
sidebar_label: OAuth2 Support using Dex
---

---

# Prerequisites

Before deploying LitmusChaos, make sure the following items are there

- Kubernetes 1.17 or later

- A Persistent volume of 20GB

  :::note
  Recommend to have a Persistent volume(PV) of 20GB, You can start with 1GB for test purposes as well. This PV is used as persistent storage to store the chaos config and chaos-metrics in the Portal. By default, litmus install would use the default storage class to allocate the PV. Provide this value
  :::

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

- [Deployed ChaosCenter](../getting-started/installation.md)

- Atleast one of the following
    - Google Oauth credentials
    - GitHub Oauth credentials

## Deploy Dex OIDC provider

In order to enable OAuth2 and to be able to login via Google and GitHub, litmus uses [Dex OIDC](https://dexidp.io/)

Make sure you have your Google and GitHub Client credentials ready, if you do not have them, you can generate one yourself

- [Guide to generating Google Oauth Client Credentials](https://support.google.com/cloud/answer/6158849?hl=en#zippy=)
- [Guide to generating GitHub OAuth Client Credentials](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)


### Configuring Dex OIDC provider


```bash
curl https://raw.githubusercontent.com/litmuschaos/litmus/master/litmus-portal/dex-server/dex-deployment.yaml --output dex-deployment.yaml
```

1. Open the file with your favorite text-editor
2. You will find the following `config-map` with some data, replace your data as the comments suggests
    ```yaml
    issuer: http://<NODE_IP>:32000  # Replace your NODE_IP here
    storage:
      type: kubernetes
      config:
        inCluster: true
    web:
      http: 0.0.0.0:5556
    staticClients:
      - id: LitmusPortalAuthBackend
        redirectURIs:
          - '/auth/dex/callback'
          - 'http://localhost:8080/auth/dex/callback' # Included for local testing purposes
          - 'https://<REPLACE_FRONTEND_URL>/auth/dex/calllback' #TODO: Replace with you frontend URL
        name: 'LitmusPortalAuthBackend'
        secret: ZXhhbXBsZS1hcHAtc2VjcmV0
    oauth2:
        skipApprovalScreen: true
    connectors:
      - type: google
        id: google
        name: Google
        config:
          clientID: # Add your Google Client ID here
          clientSecret: # Add your Google Client Secret here
          redirectURI: http://<NODE_IP>:32000 # Replace your NODE_IP here
      - type: github
        id: github
        name: GitHub
        config:
          clientID: # Add your GitHub Client ID here
          clientSecret: # Add your GitHub Client Secret here
          redirectURI: http://<NODE_IP>:32000/callback  # Replace your NODE_IP here
    ```

**Note: The Dex OIDC provider runs at `NODE_IP:32000` by default**

After the configuration, deploy the Dex deployment using the following command:

```bash
kubectl apply -f dex-deployment.yaml
```

You should now see the dex-server deployed in the litmus namespace!

```bash
kubectl get pods -n litmus
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
NAME                                      READY   STATUS              RESTARTS   AGE
litmusportal-dex-server-7f7658b57-lbbxc   1/1     Running             0          107s
litmusportal-frontend-74d456746f-56v9x    1/1     Running             0          5m57s
litmusportal-server-9c4d85f57-5r6km       2/2     Running             0          5m57s
mongo-0                                   1/1     Running             0          5m57s
```


### Configuring `litmusportal-server` to enable Dex features

To set up Dex, we would require to modify our litmusportal-server a bit in order to communicate with Dex. This will be achieved by adding some environment variables

- `OIDC_ISSUER`: The place where the Dex OIDC is hosted, i.e `NODE_IP:32000` or `https://dex.yourdomain.com`
- `DEX_ENABLED`: This variable enables dex features in the litmusportal-server
- `DEX_OAUTH_CALLBACK_URL`: This is the url that will be called back after user completes thier OAuth, this will be the litmusportal-frontend service

Set your variables using 

```bash
kubectl set env deployment/litmusportal-server -n litmus --containers="auth-server" DEX_ENABLED=true OIDC_ISSUER=<REPLACE_NODE_IP>:32000 DEX_OAUTH_CALLBACK_URL=https://<REPLACE_FRONTEND_URL>/auth/dex/callback
```
Your litmusportal-server pod will be restarted and Dex features will be enabled!

### Verifying if OAuth2 is enabled

Run the following command to check the env variables of the `auth-server`

```bash
kubectl describe deployment litmusportal-server -n litmus auth-server
```

Under `auth-server`, verify if the `DEX_ENABLED` variables are set

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
   auth-server:
    Image:       litmuschaos/litmusportal-auth-server:ci
    Ports:       3000/TCP, 3030/TCP
    Host Ports:  0/TCP, 0/TCP
    Environment Variables from:
      litmus-portal-admin-config  ConfigMap  Optional: false
      litmus-portal-admin-secret  Secret     Optional: false
    Environment:
      STRICT_PASSWORD_POLICY:  false
      ADMIN_USERNAME:          admin
      ADMIN_PASSWORD:          litmus
      LITMUS_SVC_ENDPOINT:     127.0.0.1
      OIDC_ISSUER:             [REDACTED]
      DEX_ENABLED:             true
      DEX_OAUTH_CALLBACK_URL:  [REDACTED]
    Mounts:                    <none>
```

Go to http://litmusportal-frontend-service/auth/dex/login, you should be prompted with Google or GitHub login

![litmus-oauth-image](https://user-images.githubusercontent.com/31009634/135559389-c8cdf53c-76cf-4f9d-acaa-99014540f9cf.png)


## Resources

- [Dex OIDC Provider configurations](https://dexidp.io/docs/)

## Learn more

- [Install ChaosCenter in Namespace Scope](../user-guides/chaoscenter-namespace-scope-installation.md)
- [Connect External ChaosAgents to ChaosCenter](../user-guides/chaosagents-installation.md)
- [Setup Endpoints and Access ChaosCenter without Ingress](../user-guides/setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](../user-guides/setup-with-ingress.md)


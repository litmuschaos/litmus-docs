---
id: setup-with-helm
title: Install ChaosCenter with Helm
sidebar_label: Setup with Helm
---

---

If you prefer to install and configure Dex via the LitmusChaos Helm chart, you can provide the required environment variables through a `values.yaml` file.

## Prerequisites
Add Litmus Helm Repository

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
helm repo update
```

## Create a values file
Create a file named dex-values.yaml and add the required configuration:

```yaml
chaoscenter:
  dex:
    enabled: true
    env:
      - name: DEX_ENABLED
        value: "true"
      - name: OIDC_ISSUER
        value: "<https://accounts.google.com>"   # Example: Google, GitHub issuer URL
      - name: DEX_OAUTH_CALLBACK_URL
        value: "http://<chaoscenter-host>/auth/callback"
      - name: DEX_OAUTH_CLIENT_ID
        value: "<your-client-id>"
      - name: DEX_OAUTH_CLIENT_SECRET
        value: "<your-client-secret>"
```

:::note
- Replace `<chaoscenter-host>`, `<your-client-id>`, and `<your-client-secret>` with your actual values from the OAuth provider configuration.
- For Google/GitHub, use their respective OIDC issuer URL.
:::

##  Install ChaosCenter with Dex enabled

```bash
helm install chaos litmuschaos/litmus \
  -n litmus \
  --create-namespace \
  -f dex-values.yaml
```

## Upgrade (if ChaosCenter already installed)

```bash
helm upgrade chaos litmuschaos/litmus \
  -n litmus \
  -f dex-values.yaml
```

## Verify the installation

- Check if the Dex pod is running:

```bash
kubectl get pods -n litmus | grep dex
```

Open the ChaosCenter UI and log in with your configured OAuth provider.


## Learn more

- [Setup Endpoints and Access ChaosCenter without Ingress](setup-without-ingress.md)
- [Install ChaosCenter with HTTP](../getting-started/installation.md)
- [Install ChaosCenter with HTTPS](chaoscenter-advanced-installation.md)

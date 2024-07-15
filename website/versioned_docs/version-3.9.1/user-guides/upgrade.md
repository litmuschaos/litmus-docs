---
id: upgrade
title: Upgrade Litmus ChaosCenter to Latest Version
sidebar_label: Upgrade
---

---

## Upgrade ChaosCenter

To upgrade Litmus ChaosCenter from 3.8.0 to 3.9.0, you can follow these steps:

> Note: This step is not required if using Helm, Helm upgrade should work.

1. Upgrade the control plane (ChaosCenter)
   To upgrade ChaosCenter, you can re-apply the manifest using the kubectl.

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/mkdocs/docs/3.9.1/litmus-getting-started.yaml
   ```

## Upgrade Chaos Delegate

To upgrade your Chaos Delegate, you can follow these steps:

1. If an upgrade is available, you will get an option to upgrade your chaos delegate in the ChaosCenter. Upon clicking on the upgrade option, a modal will pop up providing you the litmusctl command which you can execute and your Chaos Delegate will be upgraded.

<img src={require('../assets/user-guides/upgrade/upgrade-agent.png').default} width="800" />

Alternatively you can run the following command using litmusctl in the cluster containing the chaos delegate by providing `<CLUSTER_ID>` and `<PROJECT_ID>`.

```
litmusctl upgrade agent --cluster-id="<CLUSTER_ID>" --project-id="<PROJECT_ID>"
```

> Note: v0.7.0 of [litmusctl](https://github.com/litmuschaos/litmusctl/blob/master/README.md) is required.

---
id: upgrade
title: Upgrade Litmus ChaosCenter to Latest Version
sidebar_label: Upgrade
---

---

## Upgrade ChaosCenter
To upgrade Litmus ChaosCenter from 2.1.0 to 2.2.0, you can follow these steps:

> Note: This step is not required if using Helm, Helm upgrade should work.

1. Upgrade the control plane (ChaosCenter)
    To upgrade ChaosCenter, you can re-apply the manifest using the kubectl.

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/mkdocs/docs/2.2.0/litmus-2.2.0.yaml
    ```

## Upgrade Mongodb DB Schema
> Note: This step is not required for upgrading 2.1.0 to 2.2.0

To upgrade the DB schema, make sure to delete the PV before re-installing ChaosCenter.

## Upgrade ChaosAgent
To upgrade your ChaosAgent, you can follow these steps:

1. If an upgrade is available, you will get an option to upgrade your agent in the ChaosCenter. Upon clicking on the upgrade option, a modal will pop up providing you the litmusctl command which you can execute and your ChaosAgent will be upgraded.

<img src={require('../assets/user-guides/upgrade/upgrade-agent.png').default} width="800" />


Alternatively you can run the following command using litmusctl in the cluster containing the agent by providing `<CLUSTER_ID>` and `<PROJECT_ID>`.

```
litmusctl upgrade agent --cluster-id="<CLUSTER_ID>" --project-id="<PROJECT_ID>"
```

> Note: v0.5.0 of [litmusctl](https://github.com/litmuschaos/litmusctl/blob/master/README.md) is required.

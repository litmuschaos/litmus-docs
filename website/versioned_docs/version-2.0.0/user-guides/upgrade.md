---
id: upgrade
title: Upgrade Litmus ChaosCenter to Latest Version
sidebar_label: Upgrade
---

---

## Upgrade ChaosCenter
To upgrade Litmus ChaosCenter from 2.0.0-Beta9 to 2.0.0, you can follow these steps:

1. Disconnect the agent components
   To disconnect agents, you can do it from the chaoscenter by clicking the `disconnect` button. With this, the subscriber deployment and agent-config will be removed from the agent cluster.
   
   <img src={require('../assets/disconnect-image.png').default} width="800" />

    
2. Upgrade the control plane (ChaosCenter)
    To upgrade ChaosCenter, you can re-apply the manifest using the kubectl.

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/2.0.0/docs/2.0.0/litmus-2.0.0.yaml
    ```
    
2.  Reinstall the agent components using litmusctl
    >Note: While reinstallation, make sure to use the same agent name 
    
    To reinstall the ChaosAgents, use [Litmusctl](../litmusctl/usage-non-interactive-mode.md)

## Upgrade Mongodb DB Schema
> Note: This step is not required for upgrading 2.0.0-Beta9 to 2.0.0

To upgrade the DB schema, make sure to delete the PV before re-installing ChaosCenter.

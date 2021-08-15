---
id: upgrade
title: Upgrade Litmus ChaosCenter to Latest Version
sidebar_label: Upgrade
---

---

## Upgrade ChaosCenter

To upgrade Litmus ChaosCenter from 2.0.0-Beta9 to 2.0.0, you can follow these steps:

1.  **Control Plane Upgrade**
    To upgrade ChaosCenter with this approach, you can re-apply the 2.0.0 manifest: 

    ```
    kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/2.0.0/docs/2.0.0/litmus-2.0.0.yaml
    ```

2.  **Agent Plane Upgrade**
    With this approach, all the ChaosAgents connected with ChaosCenter should be upgraded manually with [Litmusctl](../litmusctl/installation).

    To do this, `disconnect` the ChaosAgent from ChaosCenter.

    <img src={require('../assets/disconnect-image.png').default} width="800" />
    
    After that delete the `agent-config` and `subscriber` deployment. Once this is done, the ChaosAgents can be re-installed using [Litmusctl](../litmusctl/installation)

## Upgrade DB Schema
To upgrade the DB schema, make sure to delete the PV before re-installing ChaosCenter.

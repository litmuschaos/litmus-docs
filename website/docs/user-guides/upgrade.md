---
id: upgrade
title: Upgrade Litmus ChaosCenter to Latest Version
sidebar_label: Upgrade
---

---

To upgrade Litmus ChaosCenter from 2.0.0-Beta9 to 2.0.0, you can follow these steps:

1. ## Control Plane Upgrade
    With this approach, the ChaosCenter components will get upgrade via helm. This step updates the frontend, server and mongo image. This can be done using the following commands: 

    ```
    kubectl set image
    ```

    ```
    kubectl set env VERSION=“2.0.0”
    ```

2. ## Agent Plane Upgrade
    With this approach, all the ChaosAgents connected with ChaosCenter should be upgraded manually with [Litmusctl](../litmusctl/installation).
    To do this, delete the `agent-config` and `subscriber` deployment. Once this is done, the ChaosAgents can be re-installed using [Litmusctl](../litmusctl/installation)

:::note
To upgrade the DB schema, make sure to delete the PV before re-installing ChaosCenter.
:::

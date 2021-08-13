---
id: agent-uninstall
title: Litmus ChaosAgent Uninstall
sidebar_label: ChaosAgent
---

As part of uninstalling agent components, we need to perform two steps

1. Disconnect the Agent from Portal

   - Login to Chaos Control Plane

   - Click on Agent

   - Click on the Disconnect icon on the required ChaosAgent which needs to be disconnected

   - On the above operation it would remove the subscriber component from ChaosAgent and removes the connectivity between the ChaosAgent and Chaos Control Plane.

     **Note** If the ChaosAgent is not reachable it would remove only the entry from the database of the Chaos control plane

2. Remove the ChaosAgent components from the system manually

```bash
kubectl delete chaosengine,chaosexperiments,chaosresults --all -A
kubectl delete ns litmus
```

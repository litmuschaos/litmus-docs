---
id: uninstall-litmus
title: Uninstalling Litmus
sidebar_label: Uninstall Litmus
---

## ChaosAgents

To disconnect the [ChaosAgent](../getting-started/resources#chaosagents) connected to the [ChaosCenter](../getting-started/resources#chaoscenter), follow these steps -

1. Login to the ChaosCenter and navigate to the ChaosAgents Tab.
2. Click on the `Disconnect icon` <img src={require("../assets/disconnect-icon.png").default} alt="Disconnect Icon" /> of the respective ChaosAgent you want to disconnect.
3. On the Modal that appears, confirm your selection by clicking `Yes` and the selected ChaosAgent would be disconnected from the ChaosCenter.
   :::note
   The above disconnect would remove the subscriber component from ChaosAgent and thus removing the connectivity between the ChaosAgent and the ChaosCenter.

   If the ChaosAgent is not reachable it would remove only the entry from the database of the ChaosCenter
   :::

To remove the respective components of the ChaosAgents you need to manually delete the created resources of that ChaosAgent.

```bash
kubectl delete chaosengine <CHAOSENGINE_IDs> --all -A
kubectl delete chaosexperiments <CHAOSEXPERIMENTS_IDs> --all -A
kubectl delete chaosresults <CHAOSRESULTS_IDs> --all -A
```

To remove all the ChaosAgents component ever created from the system, apply this command.

```bash
kubectl delete chaosengine,chaosexperiments,chaosresults --all -A
```

## ChaosCenter

To uninstall the ChaosCenter from the system, follow these steps -

#### Using Kubectl

```bash
kubectl delete ns litmus
```

#### Using Helm

```bash
helm uninstall litmuschaos  --namespace litmus
kubectl delete ns litmus
```

> The namespace doesn't have to be `litmus` necessarily, instead it should be the same namespace where Litmus ChaosCenter is installed.

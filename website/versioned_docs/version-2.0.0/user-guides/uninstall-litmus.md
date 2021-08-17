---
id: uninstall-litmus
title: Uninstalling Litmus
sidebar_label: Uninstall Litmus
---

---

## ChaosAgents

To disconnect the [ChaosAgent](../getting-started/resources.md#chaosagents) connected to the [ChaosCenter](../getting-started/resources.md#chaoscenter), follow these steps -

1. Remove the ChaosEngines of the respective ChaosAgent

   ```bash
   kubectl delete chaosengine <CHAOSENGINE_NAMEs> --all -<AGENT_NAMESPACE>
   ```

   > If ChaosEngines is unable to delete successfully then the Kubernetes finalizers need to be removed manually.

2. Login to the ChaosCenter and navigate to the ChaosAgents Tab.
3. Click on the `Disconnect icon` <img src={require("../assets/user-guides/uninstall-litmus/disconnect-icon.png").default} alt="Disconnect Icon" /> of the respective ChaosAgent you want to disconnect.
4. On the Modal that appears, confirm your selection by clicking `Yes` and the selected ChaosAgent would be disconnected from the ChaosCenter.
   :::note
   The above disconnect would remove the subscriber component from ChaosAgent and thus removing the connectivity between the ChaosAgent and the ChaosCenter.

   If the ChaosAgent is not reachable it would remove only the entry from the database of the ChaosCenter
   :::

### Removing the respective components individually

To remove the respective components of the ChaosAgents you need to manually delete the created resources of that ChaosAgent.

```bash
kubectl delete chaosexperiments <CHAOSEXPERIMENTS_NAMEs> --all -<AGENT_NAMESPACE>
kubectl delete chaosresults <CHAOSRESULTS_NAMEs> --all -<AGENT_NAMESPACE>
kubectl delete workflows <WORKFLOW_NAMEs> --all -<AGENT_NAMESPACE>
kubectl delete cronworkflows <CRONWORKFLOW_NAMEs> --all -<AGENT_NAMESPACE>
kubectl delete deployment chaos-operator-ce chaos-exporter --all -<AGENT_NAMESPACE>
```

### Removing all components

To remove all the ChaosAgents component ever created from the system, apply this command.

```bash
kubectl delete chaosengine,chaosexperiments,chaosresults --all -A
kubectl delete workflows cronworflows --all -<AGENT_NAMESPACE>
kubectl delete deployment chaos-operator-ce chaos-exporter --all -A
```

### Removing Service Account, Role Bindings and Roles

#### For Cluster Scope

```bash
kubectl delete sa litmus litmus-admin litmus-cluster-scope litmus-server-account -n -<AGENT_NAMESPACE>
kubectl delete clusterrolebindings litmus-admin litmus-admin-crb-for-litmusportal-server litmus-cluster-scope litmus-cluster-scope-crb-for-litmusportal-server litmus-server-crb subscriber-crb-for-litmusportal-server
kubectl delete clusterrole litmus-admin litmus-admin-crb-for-litmusportal-server litmus-cluster-scope litmus-cluster-scope-crb-for-litmusportal-server litmus-server-crb subscriber-crb-for-litmusportal-server
```

#### For Namespace Scope

```bash
kubectl delete sa rolebindings role --all -n <NAMESPACE>
```

---

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

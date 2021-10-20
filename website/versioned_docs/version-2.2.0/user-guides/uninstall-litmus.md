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

### Remove the CRs

To remove the CRs Litmus uses, use the following command:

- To remove individual CRs

```bash
kubectl delete chaosexperiments <CHAOSEXPERIMENTS_NAMEs> -n <AGENT_NAMESPACE>
kubectl delete chaosresults <CHAOSRESULTS_NAMEs> -n <AGENT_NAMESPACE>
kubectl delete workflows <WORKFLOW_NAMEs> -n <AGENT_NAMESPACE>
kubectl delete cronworkflows <CRONWORKFLOW_NAMEs> -n <AGENT_NAMESPACE>
kubectl delete eventtrackerpolicies -n <AGENT_NAMESPACE>
```

- To remove all CRs

```bash
kubectl delete chaosengine,chaosexperiments,chaosresults --all <AGENT_NAMESPACE>
kubectl delete workflows cronworflows --all <AGENT_NAMESPACE>
kubectl delete eventtrackerpolicies -n <AGENT_NAMESPACE>
```

### Delete the Deployments

To remove the respective deployments of the ChaosAgents you need to manually delete them.

```bash
kubectl delete deployment chaos-operator-ce event-tracker workflow-controller chaos-exporter -n <AGENT_NAMESPACE>
```

### Removing Service Account, Role Bindings and Roles

#### For Cluster Scope

```bash
kubectl delete sa argo argo-chaos litmus-admin litmus-cluster-scope event-tracker-sa -n -<AGENT_NAMESPACE>
kubectl delete clusterrolebindings argo-binding chaos-cluster-role-binding event-tracker-clusterole-binding litmus-admin litmus-cluster-scope subscriber-cluster-role-binding
kubectl delete clusterrole litmus-admin chaos-cluster-role subscriber-cluster-role event-tracker-cluster-role litmus-cluster-scope argo-aggregate-to-admin argo-aggregate-to-edit argo-aggregate-to-view argo-cluster-role
```

#### For Namespace Scope

```bash
kubectl delete sa rolebindings role --all -n <NAMESPACE>
```

---

## Remove the Litmus CRDs

:::note
If the Litmus CRDs are deleted in the Cluster Scope all the respective custom resources in the individual namespaces would stop working.
:::

To remove all the CRDs Litmus uses, use the following command:

```bash
kubectl delete -f https://raw.githubusercontent.com/litmuschaos/litmus/master/litmus-portal/litmus-portal-crds.yml
```

---

## ChaosCenter

> To remove the Self Agent Resources you need to follow the above ChaosAgent Uninstall process

To uninstall the ChaosCenter from the system, follow these steps -

### Using Kubectl

#### For Cluster Scope

- **Litmus 2.2.0**

  ```bash
  kubectl delete -f https://raw.githubusercontent.com/litmuschaos/litmus/master/mkdocs/docs/2.2.0/litmus-2.2.0.yaml
  ```

  > To delete any specific version of the ChaosCenter, replace the above command with the below command. `kubectl delete -f https://raw.githubusercontent.com/litmuschaos/litmus/<VERSION>/docs/<VERSION/litmus-<VERSION>.yaml`

- **Litmus Master Manifest**

  ```bash
  kubectl delete -f https://raw.githubusercontent.com/litmuschaos/litmus/master/litmus-portal/cluster-k8s-manifest.yml
  ```

#### For Namespace Scope

```bash
kubectl delete -f ${LITMUS_PORTAL_NAMESPACE}-ns-scoped-litmus-portal-manifest.yml -n ${LITMUS_PORTAL_NAMESPACE}
```

### Using Helm

```bash
helm uninstall litmuschaos  --namespace litmus
kubectl delete ns litmus
```

> The namespace doesn't have to be `litmus` necessarily, instead it should be the same namespace where Litmus ChaosCenter is installed.

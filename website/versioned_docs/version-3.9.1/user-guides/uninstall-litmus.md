---
id: uninstall-litmus
title: Uninstalling Litmus
sidebar_label: Uninstall Litmus
---

---

## Chaos Infrastructure

To disconnect the [Chaos Infrastructure](../getting-started/resources.md#chaosagents) connected to the [ChaosCenter](../getting-started/resources.md#chaoscenter), follow these steps -

1. Remove the ChaosEngines of the respective Chaos Infrastructure

   ```bash
   kubectl delete chaosengine <CHAOSENGINE_NAMEs> --all -<INFRA_NAMESPACE>
   ```

   > If ChaosEngines is unable to delete successfully then the Kubernetes finalizers need to be removed manually.

2. Login to the ChaosCenter and navigate to the Chaos Infrastructures Page.
3. Click on the three dot menu and select `Disable` of the respective Chaos Infrastructure you want to disconnect.
4. On the Modal that appears, confirm your selection by clicking `Yes` and the selected Chaos Infrastructure would be disconnected from the ChaosCenter.
   :::note
   The above disconnect would remove the subscriber component from Chaos Infrastructure and thus removing the connectivity between the Chaos Infrastructure and the ChaosCenter.

   If the Chaos Infrastructure is not reachable it would remove only the entry from the database of the ChaosCenter
   :::

### Remove the CRs

To remove the CRs Litmus uses, use the following command:

- To remove individual CRs

```bash
kubectl delete chaosexperiments <CHAOSEXPERIMENTS_NAMEs> -n <INFRA_NAMESPACE>
kubectl delete chaosresults <CHAOSRESULTS_NAMEs> -n <INFRA_NAMESPACE>
kubectl delete workflows <WORKFLOW_NAMEs> -n <INFRA_NAMESPACE>
kubectl delete cronworkflows <CRONWORKFLOW_NAMEs> -n <INFRA_NAMESPACE>
kubectl delete eventtrackerpolicies -n <INFRA_NAMESPACE>
```

- To remove all CRs

```bash
kubectl delete chaosengine,chaosexperiments,chaosresults --all <INFRA_NAMESPACE>
kubectl delete workflows cronworflows --all <INFRA_NAMESPACE>
kubectl delete eventtrackerpolicies -n <INFRA_NAMESPACE>
```

### Delete the Deployments

To remove the respective deployments of the Chaos Infrastructures you need to manually delete them.

```bash
kubectl delete deployment chaos-operator-ce event-tracker workflow-controller chaos-exporter -n <INFRA_NAMESPACE>
```

### Removing Service Account, Role Bindings and Roles

```bash
kubectl delete sa rolebindings role --all -n <NAMESPACE>
```

---

## Remove the Litmus CRDs

To remove all the CRDs Litmus uses, use the following command:

```bash
kubectl delete -f https://raw.githubusercontent.com/litmuschaos/litmus/master/mkdocs/docs/3.9.1/litmus-portal-crds.yml
```

---

## ChaosCenter

> To remove the Chaos Infrastructure Resources you need to follow the above Chaos Infrastructure Uninstall process

To uninstall the ChaosCenter from the system, follow these steps -

### Using Kubectl

```bash
kubectl delete -f ${LITMUS_PORTAL_NAMESPACE}-ns-scoped-litmus-portal-manifest.yml -n ${LITMUS_PORTAL_NAMESPACE}
```

### Using Helm

```bash
helm uninstall litmuschaos  --namespace <NAMESPACE>
kubectl delete ns <NAMESPACE>
```

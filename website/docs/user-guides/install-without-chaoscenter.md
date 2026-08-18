---
id: install-without-chaoscenter
title: Install Litmus without ChaosCenter
sidebar_label: Install without ChaosCenter
---

---

This guide covers running **LitmusChaos as infrastructure only**: CRDs, chaos
operator, and runners — without deploying the ChaosCenter UI/control plane.
Use this model when experiments are created and triggered from CI/CD, GitOps, or
plain `kubectl`, not from the portal.

If you need the full product experience (UI, multi-tenancy, GitOps from the
portal), follow the standard [ChaosCenter installation](../getting-started/installation.md) instead.

## What you get

| Component | Role |
| --------- | ---- |
| Litmus CRDs | `ChaosExperiment`, `ChaosEngine`, `ChaosResult`, and related APIs |
| chaos-operator | Watches `ChaosEngine` CRs and launches experiment pods |
| chaos-runner / experiment images | Execute individual faults |
| Optional chaos-exporter | Expose chaos metrics |

You do **not** install the ChaosCenter frontend, GraphQL server, auth server, or
MongoDB control-plane stack.

## Prerequisites

- Kubernetes 1.17+ (see chart docs for the version you install)
- [Helm 3](https://helm.sh/docs/intro/install/)
- `kubectl` configured for the target cluster
- Permission to install CRDs and create workloads in your target namespace

## Install execution plane with Helm (`litmus-core`)

The [`litmus-core`](https://github.com/litmuschaos/litmus-helm/tree/master/charts/litmus-core)
chart installs infrastructure components (operator + CRDs) without ChaosCenter.

### 1. Add the Helm repository

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
helm repo update
helm search repo litmuschaos/litmus-core
```

### 2. Create a namespace

```bash
kubectl create namespace litmus
```

### 3. Install `litmus-core`

```bash
helm install chaos-core litmuschaos/litmus-core \
  --namespace litmus
```

Useful options (see chart values for the full list):

```bash
# Namespace-scoped operator (when you do not want cluster-wide watch)
helm install chaos-core litmuschaos/litmus-core \
  --namespace litmus \
  --set operatorMode=namespace

# Enable chaos-exporter
helm install chaos-core litmuschaos/litmus-core \
  --namespace litmus \
  --set exporter.enabled=true
```

### 4. Verify

```bash
kubectl get pods -n litmus
kubectl get crds | grep litmuschaos
kubectl get deploy -n litmus
```

You should see the chaos-operator (and exporter if enabled) Running, and Litmus
CRDs registered on the cluster.

## Alternative: stand-alone `litmus-agent` chart

The [`litmus-agent`](https://github.com/litmuschaos/litmus-helm/tree/master/charts/litmus-agent)
chart can deploy execution-plane components. By default it is oriented toward
**registering with a ChaosCenter**. For a center-less install, disable the
registration hook:

```bash
helm install chaos-agent litmuschaos/litmus-agent \
  --namespace litmus --create-namespace \
  --set enablePreInstallJob=false
```

You may still need to adjust related flags (secrets/configmaps the chart
expects). Prefer `litmus-core` when you only need operator + CRDs and will apply
experiments yourself.

## Run experiments without the UI

With the operator installed, chaos is driven by Kubernetes APIs:

1. Install fault definitions (`ChaosExperiment` CRs) for the faults you need —
   from [litmuschaos/chaos-charts](https://github.com/litmuschaos/chaos-charts)
   or your own catalogs.
2. Create a `ChaosEngine` (and optional Argo `Workflow`) that references those
   experiments and selects your application.
3. Apply with CI/CD or GitOps:

   ```bash
   kubectl apply -f chaosexperiment-pod-delete.yaml
   kubectl apply -f chaosengine-pod-delete.yaml
   kubectl get chaosengine,chaosresult -n <app-namespace> -w
   ```

For composing multi-step Argo workflows outside the portal, see
[Construct chaos experiment YAML without ChaosCenter](./construct-experiment.md).

### Minimal CI pattern

```bash
# prune: install infra once per cluster (pipeline or bootstrap job)
helm upgrade --install chaos-core litmuschaos/litmus-core -n litmus --create-namespace

# each pipeline run: apply fault + engine manifests from git
kubectl apply -f experiments/
kubectl wait --for=condition=Complete chaosengine/my-engine -n demo --timeout=300s || true
kubectl get chaosresult -n demo
```

Exact `ChaosEngine` status fields depend on the chart/CRD version; assert on the
conditions your version exposes, or on the companion `ChaosResult`.

## How this differs from ChaosCenter installs

| | Without ChaosCenter (`litmus-core`) | With ChaosCenter (`litmus` chart) |
| - | ----------------------------------- | --------------------------------- |
| UI / API portal | No | Yes |
| MongoDB for portal | No | Yes |
| Who schedules chaos | You (`kubectl`, CI, GitOps) | Portal, litmusctl, APIs |
| Hub / project multi-tenancy | Not provided | Provided |
| Cluster impact | Operator + experiment pods | Control plane + execution plane |

`litmusctl` is primarily a ChaosCenter client. It is optional for the headless
model; use it when you still operate a center elsewhere.

## Related docs

- [ChaosCenter installation](../getting-started/installation.md)
- [Construct experiment YAML without ChaosCenter](./construct-experiment.md)
- [Chaos infrastructure concepts](../concepts/chaos-infrastructure.md)
- [litmus-helm charts](https://github.com/litmuschaos/litmus-helm)

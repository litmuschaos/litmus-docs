---
id: headless-installation
title: Running LitmusChaos Without ChaosCenter
sidebar_label: Headless Installation
---

## Overview

LitmusChaos can be deployed and operated without the ChaosCenter UI by installing only the Chaos Execution Plane components. This headless deployment is ideal for:

- **CI/CD pipelines** where chaos experiments are triggered programmatically on every build
- **Resource-constrained environments** where running the full control plane (frontend, auth server, MongoDB) is unnecessary
- **GitOps workflows** where chaos manifests live in a Git repository and are applied directly via `kubectl`
- **Air-gapped clusters** where minimizing the deployed surface area is a requirement

In this mode, you install only the Chaos Infrastructure — the CRDs, Chaos Operator, and Argo Workflow Controller — and trigger experiments using `kubectl` and `litmusctl` without a UI.

> The ChaosCenter UI is fully optional. The Chaos Execution Plane functions independently and can run any experiment from the ChaosHub.

## Architecture in Headless Mode

In a standard full installation, LitmusChaos has two planes:

| Plane | Components |
|---|---|
| **Chaos Control Plane** | ChaosCenter UI, GraphQL server, auth server, MongoDB |
| **Chaos Execution Plane** | CRDs, Chaos Operator, Argo Workflow Controller, Subscriber |

In headless mode, **only the Chaos Execution Plane is deployed**. Experiments are applied and monitored directly via `kubectl` or `litmusctl`, bypassing the control plane entirely.

For more details, see [Chaos Execution Plane](../architecture/chaos-execution-plane).

## Prerequisites

- Kubernetes 1.17 or later
- `kubectl` configured to your target cluster
- Helm v3 installed ([installation guide](https://helm.sh/docs/intro/install/))
- `litmusctl` installed (optional — see [litmusctl installation](../litmusctl/installation))

## Step 1 — Add the LitmusChaos Helm Repository

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
helm repo update
```

## Step 2 — Create a Namespace

```bash
kubectl create ns litmus
```

## Step 3 — Install litmus-core (Execution Plane Only)

The `litmus-core` Helm chart installs only the Chaos Execution Plane components — CRDs, Chaos Operator, and Argo Workflow Controller — without deploying the ChaosCenter frontend, auth server, or database.

```bash
helm install litmus-core litmuschaos/litmus-core \
  --namespace litmus
```

Verify the operator and workflow controller are running:

```bash
kubectl get pods -n litmus
```

Expected output:

```
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-operator-ce-<hash>                    1/1     Running   0          30s
workflow-controller-<hash>                  1/1     Running   0          30s
```

## Step 4 — Verify CRDs Are Installed

```bash
kubectl get crds | grep litmuschaos
```

Expected output:

```
chaosengines.litmuschaos.io
chaosexperiments.litmuschaos.io
chaosresults.litmuschaos.io
```

## Running Your First Experiment via kubectl

Without the UI, you apply experiment manifests directly using `kubectl`.

### 1. Install the ChaosExperiment CR

Pull the experiment definition directly from the ChaosHub:

```bash
kubectl apply -f "https://hub.litmuschaos.io/api/chaos/master?file=faults/kubernetes/pod-delete/fault.yaml" \
  -n litmus
```

### 2. Apply the RBAC

```bash
kubectl apply -f "https://hub.litmuschaos.io/api/chaos/master?file=faults/kubernetes/pod-delete/rbac.yaml" \
  -n litmus
```

### 3. Create a ChaosEngine

Save the following as `engine.yaml`, updating `applabel` to match your target application:

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: litmus
spec:
  appinfo:
    appns: default
    applabel: "app=nginx"
    appkind: deployment
  annotationCheck: "false"
  engineState: "active"
  chaosServiceAccount: pod-delete-sa
  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: "30"
            - name: CHAOS_INTERVAL
              value: "10"
            - name: FORCE
              value: "false"
```

Apply it:

```bash
kubectl apply -f engine.yaml
```

### 4. Monitor the Experiment

Watch the experiment and helper pods:

```bash
kubectl get pods -n litmus -w
```

Check the result once the experiment completes:

```bash
kubectl describe chaosresult nginx-chaos-pod-delete -n litmus
```

Look for the `status.experimentStatus.verdict` field — it will show `Pass` or `Fail`.

To get just the verdict:

```bash
kubectl get chaosresult nginx-chaos-pod-delete \
  -n litmus \
  -o jsonpath='{.status.experimentStatus.verdict}'
```

## Running Experiments via litmusctl (CLI-First Workflow)

If you have a ChaosCenter instance running elsewhere (for example, in a staging cluster), `litmusctl` lets you trigger and monitor experiments from the terminal without opening a browser.

```bash
# 1. Configure your account
litmusctl config set-account \
  --endpoint https://<chaoscenter-url> \
  --username admin \
  --password litmus

# 2. List available projects
litmusctl get projects

# 3. Connect chaos infrastructure to the project
litmusctl connect chaos-infra \
  --name my-headless-infra \
  --project-id <project-id> \
  --namespace litmus

# 4. Create and run an experiment from a manifest
litmusctl create chaos-experiment \
  -f experiment.yaml \
  --project-id <project-id>
```

For full reference, see [litmusctl Usage](../litmusctl/litmusctl-usage).

## CI/CD Integration Example

The following GitHub Actions snippet applies a chaos experiment as a pipeline stage and fails the pipeline if the verdict is not `Pass`:

```yaml
- name: Install chaos execution plane
  run: |
    helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
    helm repo update
    kubectl create ns litmus
    helm install litmus-core litmuschaos/litmus-core --namespace litmus
    kubectl wait --for=condition=ready pod \
      -l app.kubernetes.io/component=operator \
      -n litmus --timeout=120s

- name: Run pod-delete chaos experiment
  run: |
    kubectl apply -f "https://hub.litmuschaos.io/api/chaos/master?file=faults/kubernetes/pod-delete/fault.yaml" -n litmus
    kubectl apply -f "https://hub.litmuschaos.io/api/chaos/master?file=faults/kubernetes/pod-delete/rbac.yaml" -n litmus
    kubectl apply -f chaos/engine.yaml

    # Wait for the experiment to complete
    sleep 60

    # Fetch and validate the verdict
    VERDICT=$(kubectl get chaosresult nginx-chaos-pod-delete \
      -n litmus \
      -o jsonpath='{.status.experimentStatus.verdict}')
    echo "Chaos verdict: $VERDICT"
    if [ "$VERDICT" != "Pass" ]; then
      echo "Chaos experiment failed. Blocking pipeline."
      exit 1
    fi
```

## Uninstalling

Remove the ChaosEngine (stops any running experiment):

```bash
kubectl delete chaosengine nginx-chaos -n litmus
```

Uninstall the execution plane:

```bash
helm uninstall litmus-core -n litmus
kubectl delete ns litmus
```

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Experiment pod stuck in `Pending` | Node resource constraints or missing RBAC | Check `kubectl describe pod <pod> -n litmus` and verify RBAC was applied |
| `ChaosResult` not found after experiment | Experiment failed to start | Check the ChaosEngine status with `kubectl describe chaosengine <name> -n litmus` |
| `chaos-operator` not running | Helm install failed or node not ready | Check `kubectl describe pod -l name=chaos-operator -n litmus` |
| `workflow-controller` CrashLoopBackOff | Argo CRDs conflict with existing Argo installation | Uninstall existing Argo Workflows before installing `litmus-core` |

## Learn More

- [Architecture: Chaos Execution Plane](../architecture/chaos-execution-plane)
- [litmusctl Installation](../litmusctl/installation)
- [litmusctl Usage](../litmusctl/litmusctl-usage)
- [ChaosCenter Full Installation](../getting-started/installation) — add the UI when you need it
- [ChaosHub](https://hub.litmuschaos.io) — browse all available experiments

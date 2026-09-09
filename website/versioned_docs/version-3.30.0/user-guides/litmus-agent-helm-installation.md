---
id: litmus-agent-helm-installation
title: Install Litmus Agent with Helm
sidebar_label: Litmus Agent Helm Installation
---

---

## Overview

The Litmus Agent connects your Kubernetes cluster to ChaosCenter so you can run chaos experiments. This Helm chart automatically installs and registers the agent, making the setup quick and simple.

**What gets installed:**
- **Subscriber**: Communicates with ChaosCenter
- **Chaos Operator**: Runs chaos experiments
- **Chaos Exporter**: Collects experiment metrics
- **Event Tracker**: Records experiment events
- **Workflow Controller**: Manages experiment workflows

## Prerequisites

- Kubernetes cluster version 1.16 or later
- [Helm3](https://v3.helm.sh/) installed
- A running [ChaosCenter instance](../getting-started/installation.md)
- `kubectl` configured to access your target cluster
- ChaosCenter credentials (username and password)
- Project ID and Environment ID from your ChaosCenter

## Before You Start

You'll need to get some information from your ChaosCenter. Here's how to find it:

### Step 1: Find Your Project ID

1. Log in to ChaosCenter
2. Open your project
3. Look at the URL in your browser - it contains your project ID:
   ```
   https://chaoscenter.example.com/projects/69395cb3-0231-4262-8990-78056c8adb4c/...
                                             ↑ This is your Project ID ↑
   ```

### Step 2: Find Your Environment ID

1. In ChaosCenter, click on **Environments**
2. You'll see your environment name with its ID next to it
3. Copy the ID (or create a new environment if you don't have one)

### Step 3: Know Your ChaosCenter URL

Choose based on where ChaosCenter is running:

**Option A: ChaosCenter is on a different cluster** (most common)
- You have a public URL like `https://chaoscenter.example.com`
- Use this URL for `LITMUS_URL`
- Leave `LITMUS_BACKEND_URL` empty (the chart will handle it)

**Option B: ChaosCenter is on the same cluster**
- You're installing the agent in the same cluster where ChaosCenter runs
- Use the Kubernetes service names (see examples below)

## Installation

### Step 1: Add Litmus Helm Repository

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
helm repo update
```

### Step 2: Install Litmus Agent

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="external" label="Different Cluster (Recommended)" default>

**Use this when:** Your ChaosCenter is on a different cluster or has a public URL.

Replace the values with your own:
- `production-cluster` → Your cluster name
- `https://chaoscenter.example.com` → Your ChaosCenter URL
- `admin` / `litmus` → Your username and password
- `69395cb3-...` → Your Project ID (from Step 1)
- `production-env` → Your Environment ID (from Step 2)

```bash
helm install litmus-agent litmuschaos/litmus-agent \
  --namespace litmus \
  --create-namespace \
  --set "INFRA_NAME=production-cluster" \
  --set "INFRA_DESCRIPTION=Production cluster agent" \
  --set "LITMUS_URL=https://chaoscenter.example.com" \
  --set "LITMUS_USERNAME=admin" \
  --set "LITMUS_PASSWORD=litmus" \
  --set "LITMUS_PROJECT_ID=69395cb3-0231-4262-8990-78056c8adb4c" \
  --set "LITMUS_ENVIRONMENT_ID=production-env"
```

:::tip
The chart automatically handles the backend URL when you provide only `LITMUS_URL`. No need to set `LITMUS_BACKEND_URL` separately.
:::

  </TabItem>
  <TabItem value="self" label="Same Cluster">

**Use this when:** You're installing the agent in the same cluster where ChaosCenter is already running.

Replace the values with your own:
- `admin` / `litmus` → Your username and password
- `69395cb3-...` → Your Project ID (from Step 1)
- `default-env` → Your Environment ID (from Step 2)

```bash
helm install litmus-agent litmuschaos/litmus-agent \
  --namespace litmus \
  --create-namespace \
  --set "INFRA_NAME=self-agent" \
  --set "INFRA_DESCRIPTION=Same cluster agent" \
  --set "LITMUS_URL=http://litmusportal-frontend-service.litmus.svc.cluster.local:9091" \
  --set "LITMUS_BACKEND_URL=http://litmusportal-server-service.litmus.svc.cluster.local:9002" \
  --set "LITMUS_USERNAME=admin" \
  --set "LITMUS_PASSWORD=litmus" \
  --set "LITMUS_PROJECT_ID=69395cb3-0231-4262-8990-78056c8adb4c" \
  --set "LITMUS_ENVIRONMENT_ID=default-env"
```

:::note
For same-cluster installations, you **must** provide both `LITMUS_URL` and `LITMUS_BACKEND_URL` using the Kubernetes service names.
:::

  </TabItem>
  <TabItem value="values" label="Using Configuration File">

**Use this when:** You want to keep your configuration in a file for easier management.

Create a file named `values.yaml`:

```yaml
# Give your agent a name and description
INFRA_NAME: "production-cluster"
INFRA_DESCRIPTION: "Production cluster agent"

# Connect to ChaosCenter
LITMUS_URL: "https://chaoscenter.example.com"
LITMUS_USERNAME: "admin"
LITMUS_PASSWORD: "litmus"
LITMUS_PROJECT_ID: "69395cb3-0231-4262-8990-78056c8adb4c"
LITMUS_ENVIRONMENT_ID: "production-env"

# Optional: For self-signed certificates
SKIP_SSL: "false"  # Set to "true" if using self-signed certs

# Optional: Agent scope (where it can run experiments)
global:
  INFRA_MODE: "cluster"  # Use "cluster" or "namespace"

# Optional: Your cloud platform (helps with metrics)
PLATFORM_NAME: "Others"  # Options: Others, GKE, EKS, AKS

# Optional: Disable components if not needed
subscriber:
  enabled: true
chaos-operator:
  enabled: true
chaos-exporter:
  enabled: true
event-tracker:
  enabled: true
workflow-controller:
  enabled: true
```

Then install:

```bash
helm install litmus-agent litmuschaos/litmus-agent \
  -n litmus \
  --create-namespace \
  -f values.yaml
```

:::tip
The configuration file approach is recommended for production use - it's easier to track changes and reuse configurations.
:::

  </TabItem>
</Tabs>

## Check if Installation Worked

### Wait a Minute

The installation creates a background job that registers your agent with ChaosCenter. This takes about 30-60 seconds.

### Check Your Cluster

Run this command to see if all components started successfully:

```bash
kubectl get pods -n litmus
```

You should see 5 pods running (all should show "Running" under STATUS):

<span style={{color: 'green'}}><b>What you should see:</b></span>

```
NAME                                   READY   STATUS    RESTARTS   AGE
subscriber-xxxxx                       1/1     Running   0          2m
chaos-operator-ce-xxxxx                1/1     Running   0          2m
chaos-exporter-xxxxx                   1/1     Running   0          2m
event-tracker-xxxxx                    1/1     Running   0          2m
workflow-controller-xxxxx              1/1     Running   0          2m
```

:::note
If you see a pod named `litmus-agent-pre-install-hook-xxxxx` with status "Completed", that's good - it means the registration job finished successfully.
:::

### Check ChaosCenter

1. Open ChaosCenter in your browser
2. Go to **Environments**
3. Click on your environment
4. Look for your agent name under **Chaos Infrastructures**
5. The status should be **Active** (shown in green)

If you see "Active", your agent is ready to run chaos experiments!

## All Available Settings

### Basic Settings (Required)

These are the minimum settings you need to provide:

| Setting | What it does | Example | Required? |
|---------|--------------|---------|-----------|
| `INFRA_NAME` | A unique name for your agent | `"production-cluster"` | Yes |
| `LITMUS_URL` | Your ChaosCenter address | `"https://chaoscenter.example.com"` | Yes |
| `LITMUS_USERNAME` | Your ChaosCenter login | `"admin"` | Yes |
| `LITMUS_PASSWORD` | Your ChaosCenter password | `"litmus"` | Yes |
| `LITMUS_PROJECT_ID` | The project ID from ChaosCenter | `"69395cb3-..."` | Yes |
| `LITMUS_ENVIRONMENT_ID` | The environment ID from ChaosCenter | `"production-env"` | Yes |

### Connection Settings

| Setting | What it does | Default | When to use |
|---------|--------------|---------|-------------|
| `INFRA_DESCRIPTION` | A friendly description | `"chaos infrastructure deployed with helm"` | Optional |
| `LITMUS_BACKEND_URL` | Backend service URL | Empty (uses LITMUS_URL) | Only for same-cluster setup |
| `SKIP_SSL` | Ignore SSL certificate errors | `"false"` | Set to `"true"` for self-signed certificates |

### Where Can the Agent Run Experiments?

| Setting | What it does | Default | Options |
|---------|--------------|---------|---------|
| `global.INFRA_MODE` | Where experiments can run | `"cluster"` | `"cluster"` = anywhere<br/>`"namespace"` = only in litmus namespace |
| `PLATFORM_NAME` | Your cloud provider | `"Others"` | `Others`, `GKE`, `EKS`, `AKS` |
| `INFRA_NODE_SELECTOR` | Run agent on specific nodes | Empty | Example: `"node-type=chaos"` |

### What Gets Installed?

You can turn off components you don't need (advanced users only):

| Component | What it does | Can I turn it off? |
|-----------|--------------|-------------------|
| `subscriber.enabled` | Talks to ChaosCenter | No - required |
| `chaos-operator.enabled` | Runs experiments | No - required |
| `chaos-exporter.enabled` | Sends metrics to monitoring tools | Yes - if you don't use metrics |
| `event-tracker.enabled` | Records experiment events | Yes - if you don't need event history |
| `workflow-controller.enabled` | Manages experiment workflows | No - required |

### Advanced Settings

| Setting | What it does | Default | When to change |
|---------|--------------|---------|----------------|
| `enablePreInstallJob` | Auto-register with ChaosCenter | `true` | Set to `false` for manual registration |
| `crds.create` | Install Litmus custom resources | `true` | Set to `false` if CRDs already exist |
| `useExistingInfraSecret` | Use your own secret | `false` | Set to `true` if managing secrets separately |
| `useExistingInfraConfigMap` | Use your own config | `false` | Set to `true` if managing config separately |
| `SA_EXISTS` | Service account already exists | `true` | Usually keep as `true` |
| `NS_EXISTS` | Namespace already exists | `true` | Usually keep as `true` |

## Common Scenarios

### Limit Experiments to One Namespace

If you want to run experiments only in the `litmus` namespace (not cluster-wide):

```yaml
global:
  INFRA_MODE: "namespace"
```

Then install with your values file.

:::tip
This is useful when you don't want to give the agent cluster-wide permissions.
:::

### Run Agent on Specific Nodes

If you have dedicated nodes for chaos experiments:

```yaml
INFRA_NODE_SELECTOR: "node-type=chaos,region=us-west"
```

Or using labels:

```yaml
global:
  customLabels:
    node-type: chaos
    region: us-west
```

### Self-Signed SSL Certificates

If your ChaosCenter uses self-signed certificates and you see SSL errors:

```yaml
SKIP_SSL: "true"
```

:::warning
Only use this for testing! In production, use proper SSL certificates from a trusted authority.
:::

### Manage Secrets Separately

If your organization requires secrets to be managed outside Helm:

**Step 1:** Create your secret first:

```bash
kubectl create secret generic subscriber-secret \
  --from-literal=LITMUS_USERNAME=admin \
  --from-literal=LITMUS_PASSWORD=litmus \
  -n litmus
```

**Step 2:** Tell the chart to use it:

```yaml
useExistingInfraSecret: true
global:
  infraSecretName: "subscriber-secret"
```

### Adjust Resource Limits

If the default resources don't fit your cluster:

```yaml
resources:
  requests:
    cpu: "100m"      # Minimum CPU needed
    memory: "128Mi"  # Minimum memory needed
  limits:
    cpu: "500m"      # Maximum CPU allowed
    memory: "512Mi"  # Maximum memory allowed
```

## Updating Your Agent

### Update to the Latest Version

First, refresh the Helm repository:

```bash
helm repo update
```

Then upgrade your agent:

```bash
helm upgrade litmus-agent litmuschaos/litmus-agent \
  -n litmus \
  -f values.yaml
```

:::tip
This keeps all your settings from `values.yaml` and just updates the agent to the newest version.
:::

### Update to a Specific Version

If you want version 3.29.0 specifically:

```bash
helm upgrade litmus-agent litmuschaos/litmus-agent \
  -n litmus \
  --version 3.29.0 \
  -f values.yaml
```

### See All Available Versions

```bash
helm search repo litmuschaos/litmus-agent --versions
```

## Removing the Agent

### Quick Removal

To remove the agent from your cluster:

```bash
helm uninstall litmus-agent -n litmus
```

:::warning
This stops and removes all agent components. Any running experiments will be cancelled immediately.
:::

### Complete Cleanup

If you want to remove everything including the namespace:

```bash
# Remove the agent
helm uninstall litmus-agent -n litmus

# Remove the namespace (this removes everything in it)
kubectl delete namespace litmus
```

### Remove Custom Resource Definitions

If you want to completely uninstall Litmus (not just the agent):

```bash
kubectl delete crd chaosengines.litmuschaos.io
kubectl delete crd chaosexperiments.litmuschaos.io
kubectl delete crd chaosresults.litmuschaos.io
```

:::note
Only remove CRDs if you're sure no other Litmus components are using them.
:::

## Troubleshooting

### Problem: Agent Doesn't Show Up in ChaosCenter

**What to check:**

1. **Is the registration job complete?**
   ```bash
   kubectl get jobs -n litmus
   ```
   You should see a job named `litmus-agent-pre-install-hook-xxxxx` with "1/1" completions.

2. **Check the registration logs:**
   ```bash
   kubectl logs -n litmus job/litmus-agent-pre-install-hook
   ```
   
   Look for error messages about:
   - Wrong username or password
   - Can't reach ChaosCenter URL
   - Invalid Project ID or Environment ID

3. **Check the subscriber logs:**
   ```bash
   kubectl logs -n litmus deployment/subscriber
   ```

**Common fixes:**
- Wrong ChaosCenter URL - Double-check your LITMUS_URL
- Wrong credentials - Verify your username and password
- SSL errors - Try adding `SKIP_SSL: "true"` temporarily
- Can't reach ChaosCenter - Check your network/firewall rules

### Problem: Pods Are Not Starting

**Check what's wrong:**

```bash
kubectl get pods -n litmus
```

If you see "Pending" or "CrashLoopBackOff":

```bash
kubectl describe pod -n litmus <pod-name>
```

**Common fixes:**
- "Insufficient CPU/memory" - Your cluster doesn't have enough resources
- "ImagePullBackOff" - Check your internet connection or image registry
- "CrashLoopBackOff" - Check the pod logs: `kubectl logs -n litmus <pod-name>`

### Problem: Registration Keeps Failing

**Try this:**

```bash
# Delete the failed job
kubectl delete job litmus-agent-pre-install-hook -n litmus

# Try installing again with correct values
helm upgrade litmus-agent litmuschaos/litmus-agent -n litmus -f values.yaml
```

### Problem: Permission Errors

If you limited the agent to a namespace and see permission errors:

```bash
# Check if the agent can create chaos experiments
kubectl auth can-i create chaosengines \
  --as=system:serviceaccount:litmus:litmus-admin \
  -n litmus
```

If it says "no", you may need cluster-admin permissions or use `INFRA_MODE: "cluster"`.

## How Much Resources Does It Need?

The agent needs these resources to run properly:

| Component | Minimum CPU | Minimum Memory | What it does |
|-----------|-------------|----------------|--------------|
| Subscriber | 25m | 300 MB | Talks to ChaosCenter |
| Chaos Operator | 25m | 300 MB | Runs experiments |
| Chaos Exporter | 25m | 300 MB | Sends metrics |
| Event Tracker | 25m | 300 MB | Records events |
| Workflow Controller | 25m | 300 MB | Manages workflows |
| **Total** | **125m** | **1.5 GB** | All components together |

:::tip
Make sure your cluster has at least **125m CPU** and **1.5GB memory** available before installing.
:::

## Learn More

- [Chaos Infrastructure Concepts](../concepts/infrastructure.md)
- [ChaosCenter Installation](../getting-started/installation.md)
- [Setup ChaosCenter with Helm](setup-with-helm.md)
- [Connect Infrastructure with litmusctl](../litmusctl/connect-chaos-infrastructure.md)
- [Uninstall Litmus](uninstall-litmus.md)

## Resources

- **Helm Chart**: [ArtifactHub - litmus-agent](https://artifacthub.io/packages/helm/litmuschaos/litmus-agent)
- **Source Code**: [GitHub - litmus-helm](https://github.com/litmuschaos/litmus-helm)
- **Documentation**: [LitmusChaos Docs](https://docs.litmuschaos.io)

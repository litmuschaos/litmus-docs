---
id: podtato-head
title: Injecting a pod-delete fault into a Pod
sidebar_label: Injecting a pod-delete fault into a Pod
---

![podtato-head](../assets/tutorials/podtato-head/podtato-head.png)

A pod-delete fault is a fault injection experiment that intentionally deletes Kubernetes pods to test the resilience and self-healing capabilities of the system. In this tutorial, you will inject a pod-delete fault into the `podtato-head-hat` pod of the sample microservices application, [podtato-head](https://github.com/cncf/podtato-head), and check if the pod remains available during the chaos.

## What is Podtato-head?

[Podtato-head](https://github.com/cncf/podtato-head) is a sample application provided by the [CNCF](https://github.com/cncf) designed for practicing Kubernetes and cloud-native environments. This application is composed of several microservices, including frontend, hat, left/right-arm, and left/right-leg. It serves as an environment for experimenting with fault recovery capabilities and testing the system resilience.

## Prerequisites

- Kubernetes 1.18 or later (minimum 2 vCPUs, 8GB RAM, 10GB disk space)
- A Persistent volume of 20GB
- [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed on your system
- ChaosCenter installed on your system. You can follow the [Getting Started](../getting-started/installation.md) guide to install it.

## Step 1: Install Podtato-head

1. Run the command below to create a `podtato-kubectl` namespace and install `podtato-head` in it using the manifest file:

```bash
kubectl apply -f https://github.com/podtato-head/podtato-head-app/releases/download/v0.3.3/manifest.yaml
```

2. Run the command below to label the `podtato-head-hat` deployment in the `podtato-kubectl` namespace:

```bash
kubectl label deployment podtato-head-hat app=podtato-head-hat -n podtato-kubectl
```

Adding a label allows you to specifically target the pod during a Chaos experiment.

## Step 2: Set up Environment

1. On your ChaosCenter dashboard, navigate to "**Environments**" and create a new environment with the following details:

- Environment Name: `local`
- Environment Type: `Production`

![chaos center create new environment page](../assets/tutorials/podtato-head/litmus-chaos-create-new-environment-page.png)

## Step 3: Enable Chaos Infrastructure in your Environment

1. Configure a new chaos infrastructure with the following details:

- Name: `local`
- Chaos Components Installation: `Cluster-wide access`
- Installation Location (Namespace): `litmus`
- Service Account Name: `litmus`

2. Deploy the new chaos infrastructure by running:

```bash
kubectl apply -f local-litmus-chaos-enable.yml
```

3. Wait until the status changes to `CONNECTED`

![local environment showing connected status](../assets/tutorials/podtato-head/connected.png)

## Step 4: Set up Resilience Probe

You need to set up a resilience probe to automatically verify whether the pod remains operational after a fault is injected. For this tutorial, you will use a command-based probe because it allows you to run a specific shell command that checks the status of the target resource (in this case, ensuring the podtato-head-hat pod is running).

1. Select **CMD Probe** as the probe type

2. Configure the probe properties and details with the following:

- Name: `check-podtato-head-hat-pod`
- Timeout: `10s`
- Interval: `1s`
- Attempt: `1`
- Command: `kubectl get pods -n podtato-kubectl | grep podtato-head-hat | grep Running | wc -l`
- Type: `Int`
- Comparison Criteria: `>`
- Value: `0`

![setup-probe](../assets/tutorials/podtato-head/setup-probe.png)

## Step 5: Run Chaos Experiment

1. Start a new chaos experiment

- Name: `podtato-head`
- Chaos Infrastructure: `local`
- Builder Type: `Blank Canvas`

![start-chaos-experiment](../assets/tutorials/podtato-head/start-chaos-experiment.png)

2. Add the `pod-delete` chaos fault

![add-pod-delete](../assets/tutorials/podtato-head/add-pod-delete.png)

3. Select the target application for the `pod-delete` chaos fault

- App Kind: `deployment`
- App Namespace: `podtato-kubectl`
- App Label: `app=podtato-head-hat`

![select-target-application](../assets/tutorials/podtato-head/select-target-application.png)

4. Add the probe to the `pod-delete` chaos fault

- Probe Name: `check-podtato-head-hat-pod`
- Mode: `EOT`

![add-probe](../assets/tutorials/podtato-head/add-probe.png)

5. Save and run the chaos experiment

## Conclusion

- Experiment Status: `COMPLETED`
- Resilience Score: `100%`
- Probe Result: `PASSED`

![experiment-result](../assets/tutorials/podtato-head/experiment-result.png)

---

Congratulations! 🎉 You've successfully completed the tutorial.  
Continue exploring more tutorials to enjoy your journey with LitmusChaos! 🚀

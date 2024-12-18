---
id: podtato-head
title: Let's Start with Podtato-head
sidebar_label: Let's Start with Podtato-head
---

---

![podtato-head](../assets/tutorials/podtato-head/podtato-head.png)

In this tutorial, you will inject a pod-delete fault into the `podtato-head-hat` pod of the sample microservices application, [podtato-head](https://github.com/cncf/podtato-head), and check if the pod remains available during the chaos.

## What is Podtato-head?

[Podtato-head](https://github.com/cncf/podtato-head) is a sample application provided by the [CNCF](https://github.com/cncf) designed for practicing Kubernetes and cloud-native environments. This application is composed of several microservices, including frontend, hat, left/right-arm, and left/right-leg. It serves as an environment for experimenting with fault recovery capabilities and testing the system resilience.

## Prerequisites

- Kubernetes 1.18 or later (minimum 2 vCPUs, 8GB RAM, 10GB disk space)
- A Persistent volume of 20GB
- [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

## Install Podtato-head

1. Install `podtato-head` in the `podtato-kubectl` namespace using the manifest file, which also creates the namespace

```bash
kubectl apply -f https://github.com/podtato-head/podtato-head-app/releases/download/v0.3.3/manifest.yaml 
```

2. Add a label to the `podtato-head-hat` deployment

```bash
kubectl label deployment podtato-head-hat app=podtato-head-hat -n podtato-kubectl
```

## Install ChaosCenter

1. Follow the [Getting-started](../getting-started/installation.md) guide to install ChaosCenter

2. Access the ChaosCenter Dashboard

![chaoscenter-dashboard](../assets/tutorials/podtato-head/chaoscenter-dashboard.png)

## Set up Environment

1. Add a new environment
- Environment Name: `local`
- Environment Type: `Production`

![local-environment](../assets/tutorials/podtato-head/local-environment.png)

## Enable Chaos Infrastructure

1. Configure a new chaos infrastructure
- Name: `local`
- Chaos Components Installation: `Cluster-wide access`
- Installation Location (Namespace): `litmus`
- Service Account Name: `litmus`

2. Deploy the new chaos infrastructure

```bash
kubectl apply -f local-litmus-chaos-enable.yml
```

3. Wait until the status changes to `CONNECTED`.

![connected](../assets/tutorials/podtato-head/connected.png)

## Set up Resilience Probe

1. Select **CMD Probe** as the probe type

2. Configure the probe properties and details
- Name: `check-podtato-head-hat-pod`
- Timeout: `10s`
- Interval: `1s`
- Attempt: `1`
- Command: `kubectl get pods -n podtato-kubectl | grep podtato-head-hat | grep Running | wc -l`
- Type: `Int`
- Comparison Criteria: `>`
- Value: `0`

![setup-probe](../assets/tutorials/podtato-head/setup-probe.png)

## Run Chaos Experiment

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

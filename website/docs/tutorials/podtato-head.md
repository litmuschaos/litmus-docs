---
id: podtato-head
title: Let's start with Podtato-head
sidebar_label: Podtato-head
---

---

![podtato-head](../assets/tutorials/podtato-head/podtato-head.png)

In this tutorial, you will inject a pod-delete fault into a sample microservices application called [podtato-head](https://github.com/cncf/podtato-head) and verify if the service continues to be available during the chaos duration.

## Prerequisites

- Kubernetes 1.18 or later (minimum 2 vCPUs, 8GB RAM, 10GB disk space)

- A Persistent volume of 20GB

- [Helm3](https://v3.helm.sh/) or [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

## Install ChaosCenter

1. Follow the [Getting-started](../getting-started/installation.md) to install ChaosCenter

2. Access to ChaosCenter Dashboard

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

3. Wait until the status shows `CONNECTED`.

![connected](../assets/tutorials/podtato-head/connected.png)

## Set up Resilience Probe

1. Select HTTP Probe as the probe type

2. Configure properties & probe details
- Name: `check-podtato-main-access-probe`
- Timeout: `10s`
- Interval: `1s`
- Attempt: `1`
- URL: `http://podtato-main.{{workflow.parameters.adminModeNamespace}}.svc.cluster.local:9000`
- Method: `GET`
- Criteria: `==`
- Response Code: `200`

![setup-probe](../assets/tutorials/podtato-head/setup-probe.png)

## Run Chaos Experiment with Podtato-head
1. For Kubernetes v1.24 or later, bind a ClusterRole to the `argo-chaos` service account 

```bash
kubectl create rolebinding argo-chaos-binding --clusterrole=admin --serviceaccount=litmus:argo-chaos -n litmus
```

2. Configure a new chaos experiment
- Name: `podtato-head`
- Chaos Infrastructure: `local`

3. Select **Podtato-head Chaos** template 

![podtato-head-template](../assets/tutorials/podtato-head/podtato-head-template.png)

4. Add the new probe to `pod-delete` fault
- Probe Name: `check-podtato-main-access-probe`
- Mode: `Continuous`

![add-probe](../assets/tutorials/podtato-head/add-probe.png)

5. Remove the old probe section below from `podtato-head.yml`

```yaml
probe:
- name: "check-podtato-main-access-url"
    type: "httpProbe"
    httpProbe/inputs:
    url: "http://podtato-main.{{workflow.parameters.adminModeNamespace}}.svc.cluster.local:9000"
    insecureSkipVerify: false
    method:
        get:
        criteria: "=="
        responseCode: "200"
    mode: "Continuous"
    runProperties:
    probeTimeout: 1s
    interval: 100ms
    attempt: 1
```

6. Save and run the chaos experiment

## Check Chaos Experiment Results

- Experiment Status: `COMPLETED`
- Resilience Score: `100%`
- Probe Result: `PASSED`

![experiment-result](../assets/tutorials/podtato-head/experiment-result.png)

---

Congratulations! 🎉 You've successfully completed the tutorial.  
Continue exploring more tutorials to enjoy your journey with LitmusChaos! 🚀  

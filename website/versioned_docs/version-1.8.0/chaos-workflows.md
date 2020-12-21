---
id: chaos-workflows
title: Chaos Workflows with Argo and LitmusChaos
sidebar_label: Chaos Workflows
original_id: chaos-workflows
---
------

When simulating real-world failures via chaos injection on development/staging environments as part of a left-shifted, 
continuous validation strategy, it is preferable to construct potential failure sequence over executing standalone chaos 
injection actions. Often, this translates into failures during a certain workload condition (such as, say, percentage load), 
multiple (parallel) failures of dependent & independent services etc.  

Chaos Workflows are a set of actions strung together to achieve desired chaos impact on a Kubernetes cluster. 
They are an effective mechanism to simulate real world conditions & gauge application behaviour in an effective manner. 

This document specifies the procedure to setup and execute a simple chaos workflow to execute a pod-kill chaos on 
an nginx deployment while a benchmark run is in progress. 

## Install Argo Workflow Infrastructure

The Argo workflow infrastructure consists of the Argo workflow CRDs, Workflow Controller, associated RBAC & Argo CLI. 
The steps are shown below to install Argo in the standard cluster-wide mode, where the workflow controller operates on all 
namespaces. Ensure that you have the right permission to be able to create the said resources.

- Create argo namespace

  ```
  kubectl create ns argo
  ```

- Create the CRDs, workflow controller deployment with associated RBAC

  ```
  kubectl apply -f https://raw.githubusercontent.com/argoproj/argo/stable/manifests/install.yaml -n argo
  ```

- Install the argo CLI on the test harness machine (where the kubeconfig is available)

  ```
  curl -sLO https://github.com/argoproj/argo/releases/download/v2.8.0/argo-linux-amd64
  ```

  ```
  chmod +x argo-linux-amd64
  ```

  ```
  mv ./argo-linux-amd64 /usr/local/bin/argo
  ```


## Install a Sample Application: Nginx

- Install a simple multi-replica stateless Nginx deployment with service exposed over nodeport

  ```
  kubectl apply -f https://raw.githubusercontent.com/litmuschaos/chaos-workflows/master/App/nginx.yaml
  ```

  ```
  kubectl apply -f https://raw.githubusercontent.com/litmuschaos/chaos-workflows/master/App/service.yaml
  ```

## Install Litmus Infrastructure

- Apply the LitmusChaos Operator manifest:

  ```
  kubectl apply -f https://litmuschaos.github.io/litmus/litmus-operator-v1.8.2.yaml
  ```

- Install the litmus-admin service account to be used by the chaos-operator while executing the experiment (this example
  uses the [admin-mode](https://docs.litmuschaos.io/docs/next/admin-mode/) of chaos execution)

### Install the RBAC & experiment CR for litmus

  ```
  kubectl apply -f https://litmuschaos.github.io/litmus/litmus-admin-rbac.yaml
  ```

  - Install the pod-delete chaos experiment

  ```
  kubectl apply -f https://hub.litmuschaos.io/api/chaos/master?file=charts/generic/pod-delete/experiment.yaml -n litmus
  ```

  - **Note**: If you are interested in using chaostoolkit to perform the pod-delete, instead of the native litmus lib, you can apply 
  this [rbac](https://github.com/litmuschaos/chaos-charts/tree/master/charts/generic/k8-pod-delete/Cluster/rbac-admin.yaml) 
  & [experiment](https://hub.litmuschaos.io/api/chaos/1.8.2?file=charts/generic/k8-pod-delete/experiment.yaml) manifests instead 
  of the ones described above.

- Create the service account and associated RBAC, which will be used by the Argo workflow controller to execute the
  actions specified in the workflow. In our case, this corresponds to the launch of the Nginx benchmark job and creating
  the chaosengine to trigger the pod-delete chaos action. In our example, we place it in the namespace where the litmus
  chaos resources reside, i.e., litmus.

  ```
  kubectl apply -f https://raw.githubusercontent.com/litmuschaos/chaos-workflows/master/Argo/argo-access.yaml -n litmus
  ```

## Create the Chaos Workflow

- Applying the workflow manifest performs the following actions in parallel:

  - Starts an Nginx benchmark job for the specified duration (300s)
  - Triggers a random pod-kill of the Nginx replica by creating the chaosengine CR.
  - Cleans up after chaos.

  ```
  argo submit https://raw.githubusercontent.com/litmuschaos/chaos-workflows/master/Argo/argowf-native-pod-delete.yaml -n litmus
  ```

  - **Note**: If you are using the chaostoolkit experiment, submit [this](https://raw.githubusercontent.com/litmuschaos/chaos-workflows/master/Argo/argowf-chaos-admin.yaml) workflow manifest instead.


### Visualize the Chaos Workflow

You can visualize the progress of the chaos workflow via the Argo UI. Convert the argo-server service to type NodePort & view the dashboard at `https://<node-ip>:<nodeport>`

```
kubectl patch svc argo-server -n argo -p '{"spec": {"type": "NodePort"}}'
```

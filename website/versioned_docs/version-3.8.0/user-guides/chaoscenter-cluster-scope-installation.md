---
id: chaoscenter-cluster-scope-installation
title: ChaosCenter cluster scope installation
sidebar_label: Cluster scope
---

---

## Prerequisites

Before deploying LitmusChaos, make sure the following items are there

- Kubernetes 1.17 or later

- A Persistent volume of 20GB

  :::note
  Although it is recommended to have a Persistent Volume(PV) of 20GB, you can start with 1GB for test purposes as well. This PV is used as persistent storage to store the chaos config and chaos-metrics in ChaosCenter. By default, Litmus would use the default storage class to allocate the PV.
  :::

- [Helm3](https://v3.helm.sh/) or [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

## Installation

Installation of Litmus can be done using either of the below methods:

- [Helm3](#install-litmus-using-helm) chart
- [Kubectl](#install-litmus-using-kubectl) yaml spec file

### Helm installation

The Helm chart will be install all the required service account configuration and ChaosCenter.

The following steps will help you install Litmus ChaosCenter via Helm:

#### Step-1: Add Helm repository

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
helm repo list
```

#### Step-2: Create deployment namespace

ChaosCenter components can be deployed in any namespace, though it is deployed in `litmus` namespace by default.

```bash
kubectl create ns litmus
```

#### Step-3: Install ChaosCenter

```bash
helm install chaos litmuschaos/litmus --namespace=litmus
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```
NAME: chaos
LAST DEPLOYED: Tue Jun 15 19:20:09 2021
NAMESPACE: litmus
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing litmus 😀

Your release is named chaos and its installed to namespace: litmus.

Visit https://docs.litmuschaos.io to find more info.
```

:::info
Litmus uses Kubernetes CRDs to define chaos intent. Helm3 handles CRDs better than Helm2. Before you start running a chaos experiment, verify if Litmus is installed correctly.
:::

### Kubectl installation

#### Install Litmus from ChaosCenter

Applying the manifest file will install all the required service account configuration and ChaosCenter.

```bash
kubectl apply -f https://litmuschaos.github.io/litmus/3.8.0/litmus-cluster-scope-3.8.0.yaml
```

> If you are installing Litmus in any other namespace apart from `litmus` namespace, make sure to change the same in the manifest too `https://litmuschaos.github.io/litmus/3.8.0/litmus-namespaced-3.8.0.yaml`.

## Verify installation

### Verify frontend, auth server, backend server, and database pods

- Check the pods in the namespace where Litmus is installed:

  ```bash
  kubectl get pods -n litmus
  ```

  <span style={{color: 'green'}}><b>Expected Output</b></span>

  ```bash
  NAME                                       READY   STATUS              RESTARTS    AGE
  litmusportal-server-6fd57cc89-6w5pn        1/1     Running              0          57s
  litmusportal-auth-server-7b596fff9-5s6g5   1/1     Running              0          57s
  mongo-0                                    1/1     Running              0          57s
  litmusportal-frontend-55974fcf59-cxxrf     1/1     Running              0          58s
  ```

- Check the services running in the namespace where Litmus is installed:

  ```bash
  kubectl get svc -n litmus
  ```

  <span style={{color: 'green'}}><b>Expected Output</b></span>

  ```bash
  NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP PORT(S)                       AGE
  litmusportal-frontend-service      NodePort    10.43.79.17    <none>        9091:31846/TCP                  102s
  litmusportal-server-service        NodePort    10.43.30.54    <none>        9002:31245/TCP,8000:32714/TCP   101s
  litmusportal-auth-server-service   NodePort    10.43.81.108   <none>        9003:32618/TCP,3030:31899/TCP   101s
  mongo-service                      ClusterIP   10.43.227.10   <none>        27017/TCP                       101s
  mongo-headless-service             ClusterIP   None           <none>        27017/TCP                       101s
  ```

## Resource requirements of control-plane components

The resource requests provided here are estimated using the data gathered manually through different methods:

- Using command `kubectl top`
- Recommendations from Vertical-Pod-Autoscaler
- Recommendations by a great utility [Goldilocks](https://github.com/FairwindsOps/goldilocks).

These resources are getting monitored continuously and the information below will be updated as the metrics changes.

:::note
The metrics given below shows resources consumed when ChaosCenter is used at medium scale. The resources may need to be increased when used at higher scale.
:::

<table>
  <tr>
    <th>Pod</th>
    <th>Container</th>
    <th>CPU</th>
    <th>Memory</th>
  </tr>
  <tr>
    <td>litmusportal-frontend</td>
    <td>litmusportal-frontend</td>
    <td>25m</td>
    <td>300M</td>
  </tr>
  <tr>
    <td>litmusportal-server</td>
    <td>auth-server</td>
    <td>25m</td>
    <td>150M</td>
  </tr>
  <tr>
    <td>litmusportal-server</td>
    <td>graphql-server</td>
    <td>25m</td>
    <td>350M</td>
  </tr>
  <tr>
    <td>mongodb</td>
    <td>mongodb</td>
    <td>25m</td>
    <td>350M</td>
  </tr>
</table>

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/rOrKegj5ePI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn more

- [Install ChaosCenter in Namespace Scope](chaoscenter-namespace-scope-installation.md)
- [Setup Endpoints and Access ChaosCenter without Ingress](setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](setup-with-ingress.md)

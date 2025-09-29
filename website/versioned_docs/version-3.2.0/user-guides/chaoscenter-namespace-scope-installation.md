---
id: chaoscenter-namespace-scope-installation
title: ChaosCenter Namespace Scope Installation
sidebar_label: Namespace Scope
---

---

## Prerequisites

Before deploying LitmusChaos, make sure the following items are there

- Kubernetes 1.17 or later

- A Persistent volume of 20GB

  :::note
  Recommend to have a Persistent volume(PV) of 20GB, You can start with 1GB for test purposes as well. This PV is used as persistent storage to store the chaos config and chaos-metrics in the Portal. By default, litmus install would use the default storage class to allocate the PV. Provide this value
  :::

- [Helm3](https://v3.helm.sh/) or [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

## Installation

Installation of Litmus can be done using either of the below methods

- [Helm3](#install-litmus-using-helm) chart
- [Kubectl](#install-litmus-using-kubectl) yaml spec file

### **Install Litmus using Helm**

The helm chart will install all the required service account configuration and ChaosCenter.

The following steps will help you install Litmus ChaosCenter via helm.

#### Step-1: Add the litmus helm repository

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
helm repo list
```

#### Step-2: Create the namespace on which you want to install Litmus ChaosCenter <span style={{color: '#909191'}}><b>[Required only if namespace isn't there]</b></span>

- The chaoscenter components can be placed in any namespace, though it is typically placed in "litmus".

```bash
kubectl create ns litmus
```

> The ChaosCenter can be placed in any namespace, though it is typically placed in `litmus`. Ignore if you already have the namespace where you want to install Litmus created.

#### Step-3: Install the required Litmus CRDs

The cluster-admin or an equivalent user with the right permissions are required to install the CRDs upfront.

```bash
kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/chaoscenter/manifests/litmus-portal-crds.yml
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
customresourcedefinition.apiextensions.k8s.io/clusterworkflowtemplates.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/cronworkflows.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/workflows.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/workflowtemplates.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/chaosengines.litmuschaos.io created
customresourcedefinition.apiextensions.k8s.io/chaosexperiments.litmuschaos.io created
customresourcedefinition.apiextensions.k8s.io/chaosresults.litmuschaos.io created
customresourcedefinition.apiextensions.k8s.io/eventtrackerpolicies.eventtracker.litmuschaos.io created
```

#### Step-4: Install Litmus ChaosCenter

```bash
helm install chaos litmuschaos/litmus --namespace=litmus --set portalScope=namespace
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
NAME: chaos
LAST DEPLOYED: Tue Jun 15 19:20:09 2021
NAMESPACE: litmus
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing litmus 😀

Your release is named chaos and its installed to namespace: litmus.

Visit https://docs.litmuschaos.io/ to find more info.

```

> **Note:** Litmus uses Kubernetes CRDs to define chaos intent. Helm3 handles CRDs better than Helm2. Before you start running a chaos experiment, verify if Litmus is installed correctly.

### **Install Litmus using kubectl**

#### **Set the namespace on which you want to install Litmus ChaosCenter**

> Create a namespace `kubectl create ns <Your Namespace>`

```bash
kubectl create ns litmus
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
NAME                        STATUS   AGE
litmus                      Active   2s
```

#### **Install the required Litmus CRDs**

The cluster-admin or an equivalent user with the right permissions are required to install the CRDs upfront.

```bash
kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/chaoscenter/manifests/litmus-portal-crds.yml
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
customresourcedefinition.apiextensions.k8s.io/clusterworkflowtemplates.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/cronworkflows.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/workflows.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/workflowtasksets.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/workflowtemplates.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/chaosengines.litmuschaos.io created
customresourcedefinition.apiextensions.k8s.io/chaosexperiments.litmuschaos.io created
customresourcedefinition.apiextensions.k8s.io/chaosresults.litmuschaos.io created
customresourcedefinition.apiextensions.k8s.io/eventtrackerpolicies.eventtracker.litmuschaos.io created
```

#### **Install Litmus ChaosCenter**

Applying the manifest file will install all the required service account configuration and ChaosCenter.

```bash
kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/mkdocs/docs/3.2.0/litmus-namespaced-3.2.0.yaml -n <Your Namespace>
```

> You need to provide the Namespace in place of `Your Namespace`, that you have created eariler for the litmuschaos Installation

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
role.rbac.authorization.k8s.io/argo-role-for-litmusportal-server created
rolebinding.rbac.authorization.k8s.io/argo-rb-for-litmusportal-server created
role.rbac.authorization.k8s.io/litmus-namespace-scope-for-litmusportal-server created
rolebinding.rbac.authorization.k8s.io/litmus-namespace-scope-rb-for-litmusportal-server created
role.rbac.authorization.k8s.io/subscriber-role-for-litmusportal-server created
rolebinding.rbac.authorization.k8s.io/subscriber-rb-for-litmusportal-server created
role.rbac.authorization.k8s.io/litmus-admin-role-for-litmusportal-server created
rolebinding.rbac.authorization.k8s.io/litmus-admin-rb-for-litmusportal-server created
role.rbac.authorization.k8s.io/chaos-role-for-litmusportal-server created
rolebinding.rbac.authorization.k8s.io/chaos-rb-for-litmusportal-server created
role.rbac.authorization.k8s.io/event-tracker-role-for-litmusportal-server created
rolebinding.rbac.authorization.k8s.io/event-tracker-rb-for-litmusportal-server created
role.rbac.authorization.k8s.io/litmus-server-role created
rolebinding.rbac.authorization.k8s.io/litmus-server-rb created
serviceaccount/litmus-server-account created
secret/litmus-portal-admin-secret created
configmap/litmus-portal-admin-config created
configmap/litmusportal-frontend-nginx-configuration created
deployment.apps/litmusportal-frontend created
service/litmusportal-frontend-service created
deployment.apps/litmusportal-server created
service/litmusportal-server-service created
deployment.apps/litmusportal-auth-server created
service/litmusportal-auth-server-service created
statefulset.apps/mongo created
service/mongo-service created
service/mongo-headless-service created
```

## **Verify your installation**

---

#### **Verify if the frontend, server, and database pods are running**

- Check the pods in the namespace where you installed Litmus:

  ```bash
  kubectl get pods -n litmus
  ```

  <span style={{color: 'green'}}><b>Expected Output</b></span>

  ```bash
  NAME                                    READY   STATUS  RESTARTS  AGE
  litmusportal-server-6fd57cc89-6w5pn        1/1     Running              0          57s
  litmusportal-auth-server-7b596fff9-5s6g5   1/1     Running              0          57s
  mongo-0                                    1/1     Running              0          57s
  litmusportal-frontend-55974fcf59-cxxrf     1/1     Running              0          58s
  ```

- Check the services running in the namespace where you installed Litmus:

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

> Note: With the namespace mode of the control panel, we need to set the endpoint of the chaos center ui according to the use case for external Chaos Delegates. By default, it is `http://litmusportal-frontend-service:9091`

To alter, Apply:

```bash
kubectl set env deployment/litmusportal-server -n litmus --containers="graphql-server" CHAOS_CENTER_UI_ENDPOINT="http://172.132.44.44:3231"
```

---

#### **Verify Successful Registration of the Self Chaos Delegate post [Account Configuration](setup-without-ingress)**

Once the project is created, the cluster is automatically registered as a chaos target via installation of [Chaos Delegate](../getting-started/resources.md#chaosagents). This is represented as [Self Chaos Delegate](../getting-started/resources.md#types-of-chaosagents) in [ChaosCenter](../getting-started/resources.md#chaosagents).

```bash
kubectl get pods -n litmus
```

```bash
NAME                                     READY   STATUS    RESTARTS   AGE
chaos-exporter-547b59d887-4dm58          1/1     Running   0          5m27s
chaos-operator-ce-84ddc8f5d7-l8c6d       1/1     Running   0          5m27s
event-tracker-5bc478cbd7-xlflb           1/1     Running   0          5m28s
litmusportal-frontend-97c8bf86b-mx89w    1/1     Running   0          15m
litmusportal-server-6fd57cc89-6w5pn      1/1     Running   0          15m
litmusportal-auth-server-7b596fff9-5s6g5 1/1     Running   0          15m
mongo-0                                  1/1     Running   0          15m
subscriber-958948965-qbx29               1/1     Running   0          5m30s
workflow-controller-78fc7b6c6-w82m7      1/1     Running   0          5m32s
```

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/rOrKegj5ePI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn more

- [Install ChaosCenter in Cluster Scope](chaoscenter-cluster-scope-installation.md)
- [Setup Endpoints and Access ChaosCenter without Ingress](setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](setup-with-ingress.md)

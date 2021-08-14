---
id: litmus-install
title: Litmus Chaos Control Plane
sidebar_label: Control Plane
---

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/rOrKegj5ePI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Pre-requisites

- Kubernetes 1.15 or later.
  ​
- Persistent volume of 20GB
  ​
  Recommend to have a Persistent volume(PV) of 20GB, You can start with 1GB for test purposes as well. This PV is used as persistent storage to store the chaos config and chaos-metrics in the Portal. By default litmus install would use the default storage class to allocate the PV. Provide this value

- Helm3 or Kubectl

## Installation

Installation of Litmus can be done using either of below methods

- [Helm3](#helm_install) chart or
- [Kubectl](#kubectl_install) yaml spec file

### <a name="helm_install"> </a>**Install Litmus using Helm **

#### **Create a Litmus namespace in Kubernetes**

```bash
kubectl create ns litmus
```

#### **Add the Litmus Helm Chart**

To get started you need to clone the **litmuschaos** helm repo

```bash
git clone https://github.com/litmuschaos/litmus-helm
cd litmus-helm
```

#### **Install Litmus**

The helm chart will install all the CRDs, required service account configuration, and chaos-operator required both for the core services as well as the portal to run.

```bash
helm install litmuschaos  --namespace litmus ./charts/litmus/
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```
NAME: chaos
LAST DEPLOYED: Mon Mar 15 18:27:42 2021
NAMESPACE: litmus
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing litmus 😀

Your release is named chaos and its installed to namespace: litmus.

Visit https://docs.litmuschaos.io/docs/getstarted/ to find more info.
```

> **Note:** Litmus uses Kubernetes CRDs to define chaos intent. Helm3 handles CRDs better than Helm2. Before you start running a chaos experiment, verify if Litmus is installed correctly.

### <a name="kubectl_install"> </a>**Install Litmus using kubectl **

#### **Create a Litmus namespace in Kubernetes**

```bash
kubectl create ns litmus
```

#### **Install Litmus**

Applying the manifest file will install all the CRDs, required service account configuration, and chaos-operator required both for the core services as well as the portal to run.

```bash
kubectl apply -f https://litmuschaos.github.io/litmus/2.0.0/litmus-2.0.0.yaml
```

## **Verify your installation**

**Verify if the Frontend, Backend and Database Pods are running**

```bash
kubectl get pods -n litmus
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
chaos-litmus-portal-frontend-ff8b554dc-q5rl4   1/1     Running   0          2m6s
chaos-litmus-portal-mongo-6764cfdd59-c9r56     1/1     Running   0          2m6s
chaos-litmus-portal-server-5ffbccbfff-dknv8    2/2     Running   0          2m6s
```

<br />

## **Setup the Portal**

To setup and login to Litmus Portal expand the available services just created and copy the `PORT` of the `litmusportal-frontend-service` service

```bash
kubectl get svc -n litmus
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
NAME                            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                         AGE
chaos-litmus-portal-mongo       ClusterIP   10.104.107.117   <none>        27017/TCP                       2m
litmusportal-frontend-service   NodePort    10.101.81.70     <none>        9091:30385/TCP                  2m
litmusportal-server-service     NodePort    10.108.151.79    <none>        9002:32456/TCP,9003:31160/TCP   2m
```

> **Note**: In this case the PORT for `litmusportal-frontend-service` is `30385`. Yours will be different.

### **Accessing the Portal**

Once you have the PORT copied in your clipboard, simply use your NodeIP and PORT in this manner `<NodeIP>:<PORT>` to access the portal.

For example:

```yaml
http://172.17.0.3:30385/
```

> Where `172.17.0.3` is my NodeIP and `30385` is the frontend service PORT. You can also use a LoadBalancer if not NodePort, the only change would be to provide a `<LoadBalancerIP>:<PORT>`

You should be able to see the Login Page of Litmus. The **default credentials** are

```yaml
Username: admin
Password: litmus
```

<img src={require('./assets/login.png').default} width="800" />

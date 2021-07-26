---
id: cluster-scope-installation
title: Litmus Cluster Scope Installation
sidebar_label: Cluster Scope
---

---

## Prerequisites

Before deploying LitmusChaos, make sure the [prerequisites](basic-requirements) are met.

## Installation

Installation of Litmus can be done using either of the below methods

- [Helm3](#install-litmus-using-helm) chart
- [Kubectl](#install-litmus-using-kubectl) yaml spec file

### Install Litmus using Helm

The helm chart will install all the required service account configuration and chaos control plane.

The following steps will help you install litmus via helm.

#### Step-1: Add the litmus helm repository

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
helm repo list
```

#### Step-2: Create the namespace on which you want to install Litmus

- The litmus infra components will be placed in this namespace.

> The chaos control plane can be placed in any namespace, in this case we are using `litmus` as the namespace of our choice.

```bash
kubectl create ns <LITMUS_PORTAL_NAMESPACE>
```

#### Step-3: Install the litmus chaos control plane

```bash
helm install chaos litmuschaos/litmus-2-0-0-beta --namespace=<LITMUS_PORTAL_NAMESPACE> --devel
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```
NAME: chaos
LAST DEPLOYED: Tue Jun 15 19:20:09 2021
NAMESPACE: <LITMUS_PORTAL_NAMESPACE>
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing litmus-2-0-0-beta 😀

Your release is named chaos and its installed to namespace: litmus.

Visit https://docs.litmuschaos.io/docs/getstarted/ to find more info.
```

> **Note:** Litmus uses Kubernetes CRDs to define chaos intent. Helm3 handles CRDs better than Helm2. Before you start running a chaos experiment, verify if Litmus is installed correctly.

### **Install Litmus using kubectl **

#### **Create the namespace on which you want to install Litmus**

```bash
kubectl create ns <LITMUS_PORTAL_NAMESPACE>
```

#### **Install Litmus**

Applying the manifest file will install all the required service account configuration and chaos control plane.

```bash
kubectl apply -f https://litmuschaos.github.io/litmus/2.0.0-Beta/litmus-2.0.0-Beta.yaml -n <LITMUS_PORTAL_NAMESPACE>
```

---

## **Verify your installation**

**Verify if the frontend, server, and database pods are running**

- Check the pods in the namespace where you installed Litmus:

  ```bash
  kubectl get pods -n <LITMUS_PORTAL_NAMESPACE>
  ```

  <span style={{color: 'green'}}><b>Expected Output</b></span>

  ```bash
  NAME                                    READY   STATUS  RESTARTS  AGE
  litmusportal-frontend-97c8bf86b-mx89w   1/1     Running 2         6m24s
  litmusportal-server-5cfbfc88cc-m6c5j    2/2     Running 2         6m19s
  mongo-0                                 1/1     Running 0         6m16s
  ```

- Check the services running in the namespace where you installed Litmus:

  ```bash
  kubectl get svc -n <LITMUS_PORTAL_NAMESPACE>
  ```

  <span style={{color: 'green'}}><b>Expected Output</b></span>

  ```bash
  NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP PORT(S)                       AGE
  litmusportal-frontend-service   NodePort    10.100.105.154  <none>      9091:30229/TCP                7m14s
  litmusportal-server-service     NodePort    10.100.150.175  <none>      9002:30479/TCP,9003:31949/TCP 7m8s
  mongo-service                   ClusterIP   10.100.226.179  <none>      27017/TCP                     7m6s
  ```

## Resources

#### Videos

<iframe width="560" height="315" src="https://www.youtube.com/embed/rOrKegj5ePI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### Blogs

<table>
  <tr>
    <td>
      <a href="https://dev.to/litmus-chaos/getting-started-with-litmus-2-0-in-google-kubernetes-engine-4obf">
        <img width={300} src="https://res.cloudinary.com/practicaldev/image/fetch/s--zqwPPulX--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vklusi3v61g28ospmpck.png" />
        <br />
        <div style={{width: "300px"}}>
        Getting Started with Litmus 2.0 in Google Kubernetes Engine
        </div>
      </a>
    </td>
    <td>
      <a href="https://dev.to/avaakash/getting-started-with-litmus-2-0-in-azure-kubernetes-service-13f3">
        <img width={300} src="https://res.cloudinary.com/practicaldev/image/fetch/s--2AubMs-V--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8c9oa4s10q3zbj9ew7eu.png" />
        <br />
        <div style={{width: "300px"}}>
        Getting Started with LitmusChaos 2.0 in Azure Kubernetes Service
        </div>
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://blog.mayadata.io/get-started-with-litmuschaos-in-minutes">
        <img width={300} src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmma.prnewswire.com%2Fmedia%2F736824%2FMayaData_Logo.jpg%3Fp%3Dtwitter&f=1&nofb=1" />
        <br />
        <div style={{width: "300px"}}>
        Get Started with LitmusChaos in Minutes
        </div>
      </a>
    </td>
  </tr>
</table>

## Learn More

- [Install Litmus in Namespace Scope](namespace-scope-installation)
- [Setup Endpoints and Access Litmus without Ingress](setup-without-ingress)
- [Setup Endpoints and Access Litmus with Ingress](setup-with-ingress)

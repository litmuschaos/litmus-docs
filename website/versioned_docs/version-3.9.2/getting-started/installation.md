---
id: installation
title: ChaosCenter installation
sidebar_label: Installation
---

---

## Prerequisites

- Kubernetes 1.17 or later

- A Persistent volume of 20GB

:::note
Recommend to have a Persistent volume(PV) of 20GB, You can start with 1GB for test purposes as well. This PV is used as persistent storage to store the chaos config and chaos-metrics in the Portal. By default, litmus install would use the default storage class to allocate the PV. Provide this value
:::

- [Helm3](https://v3.helm.sh/) or [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

## Installation

Users looking to use Litmus for the first time have two options available to them today. One way is to use a hosted Litmus service like [Harness Chaos Engineering SaaS](https://app.harness.io/auth/#/signin). Alternatively, users looking for some more flexibility can install Litmus into their own Kubernetes cluster.

Users choosing the self-hosted option can refer to our Install and Configure docs for installing alternate versions and more detailed instructions.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="self-hosted" label="Self-Hosted" default>
    Installation of Self-Hosted Litmus can be done using either of the below methods:
    <li><a href="#install-litmus-using-helm">Helm3</a> chart</li>
    <li><a href="#install-litmus-using-kubectl">Kubectl</a> yaml spec file</li>
    <br/>
    Refer to the below details for Self-Hosted Litmus installation.
  </TabItem>
  <TabItem value="hosted" label="Hosted (Beta)">
    <a href="https://harness.io/">Harness</a> offers a free service for community members which makes getting started with Litmus easy. Create an account to get started. Once logged in, create a new hosted control plane and connect to it via the up CLI. Litmus can be used as a hosted cloud service using <a href="https://app.harness.io/auth/#/signin">Harness Chaos Engineering SaaS</a>. Harness Chaos Engineering SaaS executes your Chaos Experiments in the cloud by managing all your Chaos Control Plane components, while the Chaos Execution Plane components exist on your Kubernetes cluster as part of an external chaos infrastructure.
    <br/><br/>
    To get started with Harness Chaos Engineering SaaS, visit <a href="https://developer.harness.io/docs/chaos-engineering/get-started/learn-more-free-plan">Harness Chaos Engineering SaaS</a> and register for free. You can skip the below installation steps.
  </TabItem>
</Tabs>

:::note
With 3.9.0 release, Cluster scope installation is deprecated. Now Namespaced mode is the only supported and standard installation mode.
:::

### Install Litmus using Helm

The helm chart will install all the required service account configuration and ChaosCenter.

The following steps will help you install Litmus ChaosCenter via helm.

#### Step-1: Add the litmus helm repository

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
helm repo list
```

#### Step-2: Create the namespace on which you want to install Litmus ChaosCenter

- The ChaosCenter can be placed in any namespace, but for this scenario we are choose `litmus` as the namespace.

```bash
kubectl create ns litmus
```

#### Step-3: Install Litmus ChaosCenter

```bash
helm install chaos litmuschaos/litmus --namespace=litmus --set portal.frontend.service.type=NodePort
```

> **Note:** If your Kubernetes cluster isn't local, you may want not to expose Litmus via `NodePort`. If so, remove `--set portal.frontend.service.type=NodePort` option. To connect to Litmus UI from your laptop, you can use `port-forward svc/chaos-litmus-frontend-service 9091:9091`. Then you can use your browser and open `127.0.0.1:9091`.

- Litmus helm chart depends on `bitnami/mongodb` [helm chart](https://github.com/bitnami/charts/tree/main/bitnami/mongodb), which uses a mongodb image not supported on ARM. If you want to install Litmus on an ARM-based server, please replace the default one with your custom mongodb arm image as shown below.

  ```bash
  helm install chaos litmuschaos/litmus --namespace=litmus \
  --set portal.frontend.service.type=NodePort \
  --set mongodb.image.registry=<put_registry> \
  --set mongodb.image.repository=<put_image_repository> \
  --set mongodb.image.tag=<put_image_tag>
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

> **Note:** Litmus uses Kubernetes CRDs to define chaos intent. Helm3 handles CRDs better than Helm2. Before you start running a chaos experiment, verify if Litmus is installed correctly.

## **Install Litmus using kubectl**

In this method the users need to install mongo first via helm and then apply the installation manifest. Follow the instructions [here](https://github.com/litmuschaos/litmus/tree/master/chaoscenter#installation-steps-for-litmus-300-beta9).

### **Install mongo**

```bash
 helm repo add bitnami https://charts.bitnami.com/bitnami
```

Mongo Values

```bash
auth:
  enabled: true
  rootPassword: "1234"
  # -- existingSecret Existing secret with MongoDB(&reg;) credentials (keys: `mongodb-passwords`, `mongodb-root-password`, `mongodb-metrics-password`, ` mongodb-replica-set-key`)
  existingSecret: ""
architecture: replicaset
replicaCount: 3
persistence:
  enabled: true
volumePermissions:
  enabled: true
metrics:
  enabled: false
  prometheusRule:
    enabled: false

# bitnami/mongodb is not yet supported on ARM.
# Using unofficial tools to build bitnami/mongodb (arm64 support)
# more info: https://github.com/ZCube/bitnami-compat
#image:
#  registry: ghcr.io/zcube
#  repository: bitnami-compat/mongodb
#  tag: 6.0.5
```

```bash
helm install my-release bitnami/mongodb --values mongo-values.yml -n <NAMESPACE> --create-namespace
```

Litmus supports for HTTP and HTTPS mode of installation.

### Basic installation (HTTP based and allows all origins)

Applying the manifest file will install all the required service account configuration and ChaosCenter in namespaced scope.

```bash
 kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/mkdocs/docs/3.9.2/litmus-getting-started.yaml -n <NAMESPACE>
```

### Advanced installation (HTTPS based and CORS rules apply)

For advanced installation visit [here](../user-guides/chaoscenter-advanced-installation.md)

---

## **Verify your installation**

#### **Verify if the frontend, server, and database pods are running**

- Check the pods in the namespace where you installed Litmus:

  ```bash
  kubectl get pods -n litmus
  ```

  <span style={{color: 'green'}}><b>Expected Output</b></span>

  ```bash
  NAME                                       READY   STATUS    RESTARTS   AGE
  litmusportal-server-6fd57cc89-6w5pn        1/1     Running     0          57s
  litmusportal-auth-server-7b596fff9-5s6g5   1/1     Running     0          57s
  litmusportal-frontend-55974fcf59-cxxrf     1/1     Running     0          58s
  my-release-mongodb-0                       1/1     Running     0          63s
  my-release-mongodb-1                       1/1     Running     0          63s
  my-release-mongodb-2                       1/1     Running     0          62s
  my-release-mongodb-arbiter-0               1/1     Running     0          64s

  ```

- Check the services running in the namespace where you installed Litmus:

  ```bash
  kubectl get svc -n litmus
  ```

  <span style={{color: 'green'}}><b>Expected Output</b></span>

  ```bash
  NAME                                  TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                         AGE
  chaos-exporter                        ClusterIP      10.68.45.7     <none>           8080/TCP                        23h
  litmusportal-auth-server-service      NodePort       10.68.34.91    <none>           9003:32368/TCP,3030:31051/TCP   23h
  litmusportal-frontend-service         NodePort       10.68.43.68    <none>           9091:30070/TCP                  23h
  litmusportal-server-service           NodePort       10.68.33.242   <none>           9002:32455/TCP,8000:30722/TCP   23h
  my-release-mongodb-arbiter-headless   ClusterIP      None           <none>           27017/TCP                       23h
  my-release-mongodb-headless           ClusterIP      None           <none>           27017/TCP                       23h
  workflow-controller-metrics           ClusterIP      10.68.33.65    <none>           9090/TCP                        23h
  ```

---

## **Accessing the ChaosCenter**

To setup and login to ChaosCenter expand the available services just created and copy the `PORT` of the `litmusportal-frontend-service` service

```bash
kubectl get svc -n litmus
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
NAME                               TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                         AGE
litmusportal-frontend-service      NodePort    10.43.79.17    <none>        9091:31846/TCP                  102s
litmusportal-server-service        NodePort    10.43.30.54    <none>        9002:31245/TCP,8000:32714/TCP   101s
litmusportal-auth-server-service   NodePort    10.43.81.108   <none>        9003:32618/TCP,3030:31899/TCP   101s
mongo-service                      ClusterIP   10.43.227.10   <none>        27017/TCP                       101s
mongo-headless-service             ClusterIP   None           <none>        27017/TCP                       101s
```

> **Note**: In this case, the PORT for `litmusportal-frontend-service` is `31846`. Yours will be different.

Once you have the PORT copied in your clipboard, simply use your IP and PORT in this manner `<NODEIP>:<PORT>` to access the Litmus ChaosCenter.

For example:

```yaml
http://172.17.0.3:31846/
```

> Where `172.17.0.3` is my NodeIP and `31846` is the frontend service PORT. If using a LoadBalancer, the only change would be to provide a `<LoadBalancerIP>:<PORT>`. [Learn more about how to access ChaosCenter with LoadBalancer](../user-guides/setup-without-ingress.md#with-loadbalancer)

**NOTE:** With advanced installation CORS rules are applied, once manifest is applied frontend loadbalancer IP needs to be added in the `ALLOWED_ORIGINS` environment in both auth and graphql server deployment.

You should be able to see the Login Page of Litmus ChaosCenter. The **default credentials** are

```yaml
Username: admin
Password: litmus
```

<img src={require('../assets/login.png').default} width="800" />

By default you are assigned with a default project with Owner permissions.

<img src={require('../assets/landing-page.png').default} width="800" />

## Learn more

- [Install ChaosCenter with HTTPS](../user-guides/chaoscenter-advanced-installation.md)
- [Connect External Chaos Infrastructures to ChaosCenter](../user-guides/chaos-infrastructure-installation.md)
- [Setup Endpoints and Access ChaosCenter without Ingress](../user-guides/setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](../user-guides/setup-with-ingress.md)

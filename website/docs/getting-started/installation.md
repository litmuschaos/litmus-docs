---
id: installation
title: Installing ChaosCenter
sidebar_label: Installing ChaosCenter
---

---

## Prerequisites

- Litmus Chaos requires Kubernetes 1.17 or later.

- We recommend that you have a persistent volume (PV) of 20GB or more.

:::note
This PV is used to store the chaos config and chaos-metrics in the Portal. 20GB is the recommended minimum PV size, but you can start with 1GB for test purposes. By default, Litmus install uses the default storage class to allocate the PV. You must provide this value.
:::

- All the install variants require [Helm](https://v3.helm.sh/).

- Optionally, you can use [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) to perform the installation.

## Installating ChaosCenter

Typically, you install Litmus into your own Kubernetes cluster. Alternatively, you can run ChaosCenter from a hosted Litmus service like [Harness Chaos Engineering SaaS](https://app.harness.io/auth/#/signin). See how [here](hosted).

 This page describes how to install Litmus in a Kubernetes cluster. There are two installation methods:

- To install self-hosted Litmus using Helm version 3, follow the instructions in the [next section](#installing-with-helm).
- To use kubectl, skip to [Installing with kubectl](#installing-with-kubectl).

:::note
Cluster scope installation is deprecated and is no longer supported. Namespaced mode is the standard installation mode.
:::

### Installing with Helm

The Helm chart installs ChaosCenter and all the required service account configuration.

Use the following steps to install Litmus ChaosCenter via Helm.

1. Add the Litmus Helm repository.

   ```bash
   helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
   helm repo list
   ```

2. Create the namespace on which you want to install Litmus ChaosCenter.

   ChaosCenter can be placed in any namespace. These instructions use `litmus` as the namespace.

   ```bash
   kubectl create ns litmus
   ```

#### Local installation

3. (Optional – local install only) If your Kubernetes cluster is local (in *kind* or *minikube*, for example) and only accessing Litmus locally, replace the default endpoint with your custom CHAOS_CENTER_UI_ENDPOINT and run the Helm chart, as in the following:

  ```bash
  helm install chaos litmuschaos/litmus --namespace=litmus \
  --set portal.frontend.service.type=NodePort \
  --set portal.server.graphqlServer.genericEnv.CHAOS_CENTER_UI_ENDPOINT=http://chaos-litmus-frontend-service.litmus.svc.cluster.local:9091
  ```

Then skip to [Results](#results).

#### Remote installation

4. (Optional – ARM processors only) The Litmus Helm chart depends on the [`bitnami/mongodb` Helm chart](https://github.com/bitnami/charts/tree/main/bitnami/mongodb), which uses a MongoDB image not supported on ARM processors.

   To install Litmus on an ARM-based server, note your custom MongoDB ARM image registry and repository information. You will add the following options to the installation command in the next step:

   ```bash
   --set mongodb.image.registry=<put_registry> \
   --set mongodb.image.repository=<put_image_repository> \
   --set mongodb.image.tag=<put_image_tag>
   ```

5. Run the Helm chart.

   If your Kubernetes cluster isn't local, you may not want to expose Litmus via `NodePort`.

   Decide whether to set `NodePort`, then run one of the following commands:

:::note
If you are installing on an ARM-based server, append the options from the previous step to your chosen helm command, substituting your MongoDB information in the option parameters.
:::

   - To set the `NodePort` portal, run the Helm chart as follows to set the service:

      ```bash
      helm install chaos litmuschaos/litmus --namespace=litmus --set portal.frontend.service.type=NodePort
      ```

      or with a custom MongoDB image for ARM:
      
      ```bash
      helm install chaos litmuschaos/litmus --namespace=litmus --set portal.frontend.service.type=NodePort
         --set mongodb.image.registry=<put_registry> \
         --set mongodb.image.repository=<put_image_repository> \
         --set mongodb.image.tag=<put_image_tag>
      ```

   - To run Litmus remotely without `NodePort`, omit the `--set` option as follows:

      ```bash
      helm install chaos litmuschaos/litmus --namespace=litmus
      ```

      or with a custom MongoDB image for ARM:

      ```bash
      helm install chaos litmuschaos/litmus --namespace=litmus
         --set mongodb.image.registry=<put_registry> \
         --set mongodb.image.repository=<put_image_repository> \
         --set mongodb.image.tag=<put_image_tag>
      ```

#### Results

The installation output should look something like the following:

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

See https://docs.litmuschaos.io for more information.
```

:::note
Litmus uses Kubernetes custom resource definitions (CRDs) to define chaos intent. Helm3 handles CRDs better than Helm2. We strongly recommend that you verify the installation before running a chaos experiment.
:::

Skip the following kubectl installation instructions and continue with [Verifying your installation](#verifying-your-installation).

### Installing with kubectl

To install using kubctl, use Helm to install MongoDB first, then apply the installation manifest. The manifest can be found [here](https://github.com/litmuschaos/litmus/tree/master/chaoscenter#installation-steps-for-litmus-300-beta9).

1. Add the MongoDB manifest.

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

2. Run the Helm chart.

   ```bash
   helm install my-release bitnami/mongodb --values mongo-values.yml -n <NAMESPACE> --create-namespace
   ```

   Litmus supports HTTP and HTTPS modes of installation.

   Follow the instructions in the next step to choose a basic or advanced installation and complete the installation.

3. Use the [Basic](#basic_installation) (HTTP, all-origin) or [Advanced](#advanced_installation) (HTTP, resource sharing) installation instructions to finish the installation.

   <a name='basic_installation'></a>
   - Basic installation

     A basic installation is HTTP-based and allows all origins.

     Apply the manifest file as follows to install the required service account configuration and ChaosCenter in namespaced scope.

     ```bash
     kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/mkdocs/docs/3.12.0/litmus-getting-started.yaml -n <NAMESPACE>
     ```

     Skip to [Verifying your installation](#verifying-your-installation).

   <a name='advanced_installation'></a>
   - Advanced installation

     An advanced installation is HTTPS-based and adheres to cross-origin resource sharing (CORS) rules. Follow these steps:

     1. Provide TLS certificates.

        Provide your own certificates or generate them using [this](https://github.com/litmuschaos/litmus/blob/master/chaoscenter/mtls-helper.sh) bash script.

     2. Create a secret.

        ```bash
        kubectl create secret generic tls-secret --from-file=ca.crt=ca.crt --from-file=tls.crt=tls.crt --from-file=tls.key=tls.key -n <NAMESPACE>
        ```

     3. Apply the manifest file to install the required service account configuration and ChaosCenter in namespaced scope:

        ```bash
        kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/3.12.0/chaoscenter/manifests/litmus-installation.yaml -n <NAMESPACE>
        ```

        Proceed to [Verifying your installation](#verifying-your-installation).

### Verifying your installation

Verify that the frontend, server, and database pods are running.

1. Check the pods in the namespace where you installed Litmus.

   ```bash
   kubectl get pods -n litmus
   ```

   The pods output should look like the following.

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

2. Check the services running in the namespace where you installed Litmus.

   ```bash
   kubectl get svc -n litmus
   ```

   The services output should look like the following:

   ```bash
   NAME                                  TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                         AGE
   chaos-exporter                        ClusterIP      10.68.45.7     <none>           8080/TCP                        23h
   litmusportal-auth-server-service      NodePort       10.68.34.91    <none>           9003:32368/TCP,3030:31051/TCP    23h
   litmusportal-frontend-service         NodePort       10.68.43.68    <none>           9091:30070/TCP                  23h
   litmusportal-server-service           NodePort       10.68.33.242   <none>           9002:32455/TCP,8000:30722/TCP   23h
   my-release-mongodb-arbiter-headless   ClusterIP      None           <none>           27017/TCP                       23h
   my-release-mongodb-headless           ClusterIP      None           <none>           27017/TCP                       23h
   workflow-controller-metrics           ClusterIP      10.68.33.65    <none>           9090/TCP                        23h
   ```

## Accessing ChaosCenter

To set up and log in to ChaosCenter, expand the available services just created and copy the `PORT` of the `litmusportal-frontend-service` service as shown in the following steps.

1. View the services.

   ```bash
   kubectl get svc -n litmus
   ```

   The services output should look like the following:

   ```bash
   NAME                               TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                         AGE
   litmusportal-frontend-service      NodePort    10.43.79.17    <none>        9091:31846/TCP                  102s
   litmusportal-server-service        NodePort    10.43.30.54    <none>        9002:31245/TCP,8000:32714/TCP   101s
   litmusportal-auth-server-service   NodePort    10.43.81.108   <none>        9003:32618/TCP,3030:31899/TCP   101s
   mongo-service                      ClusterIP   10.43.227.10   <none>        27017/TCP                       101s
   mongo-headless-service             ClusterIP   None           <none>        27017/TCP                       101s
   ```

2. Copy the PORT from the `litmusportal-frontend-service`.

   :::note
   In this example, the PORT for `litmusportal-frontend-service` is `31846`. Yours will be different.
   :::

3. (Optional) If you installed ChaosCenter on a remote cluster without `NodePort` forwarding, set port forwarding on your local node:

   ``` bash
   port-forward svc/chaos-litmus-frontend-service 31846:31846
   ```

4. Access the UI.

   Enter your IP and PORT in this format to access the Litmus ChaosCenter: `<NODEIP>:<PORT>`.

   For example:

   ```yaml
   http://172.17.0.3:31846/
   ```

   where `172.17.0.3` is the NodeIP and `31846` is the frontend service PORT.

   If you use a load balancer, provide an IP for the load balancer instead: `<LoadBalancerIP>:<PORT>`. ([Learn how to access ChaosCenter with LoadBalancer](../user-guides/setup-without-ingress.md#with-loadbalancer)).

   If you set port forwarding as shown in the previous step, use the local host IP:

   ```yaml
   http://127.0.0.1:31846
   ```

   :::note
   When advanced installation CORS rules are applied, the frontend loadbalancer IP needs to be added in the `ALLOWED_ORIGINS` environment in both auth and graphql server deployment.
   :::

5. Log in.

   You should see the Login Page of Litmus ChaosCenter. The **default credentials** are

   ```yaml
   Username: admin
   Password: litmus
   ```

<img src={require('../assets/login.png').default} width="800" />

By default you are assigned a default project with Owner permissions.

<img src={require('../assets/landing-page.png').default} width="800" />

## Learn more

- [Install ChaosCenter with HTTPS](../user-guides/chaoscenter-advanced-installation.md)
- [Connect External Chaos Infrastructures to ChaosCenter](../user-guides/chaos-infrastructure-installation.md)
- [Setup Endpoints and Access ChaosCenter without Ingress](../user-guides/setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](../user-guides/setup-with-ingress.md)

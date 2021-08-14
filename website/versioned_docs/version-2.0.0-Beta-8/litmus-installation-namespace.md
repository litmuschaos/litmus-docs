---
id: litmus-install-namespace-mode
title: Litmus Chaos Control Plane (Namespace Mode)
sidebar_label: Control Plane (Namespace Mode)
---

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/rOrKegj5ePI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Pre-requisites

- Kubernetes 1.15 or later.
  ​
- Recommend to have a Persistent volume(PV) of 20GB, You can start with 1GB for test purposes as well. This PV is used as persistent storage to store the chaos config and chaos-metrics in the Portal. By default, litmus would use the default storage class to allocate the PV.

- Helm3 or Kubectl

## Installation

Installation of Litmus can be done using either of the below methods

- [Helm3](#helm_install) chart or
- [Kubectl](#kubectl_install) yaml spec file

### <a name="kubectl_install"> </a>**Install Litmus using Helm **

The helm chart will install all the required service account configuration and chaos control plane.

The following steps will help you install litmus via helm.

#### Step-1: Add the litmus helm repository

```bash
root@demo:~# helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
"litmuschaos" has been added to your repositories
```

```bash
root@demo:~# helm repo list
NAME            URL
litmuschaos     https://litmuschaos.github.io/litmus-helm/
```

#### Step-2: Create the litmus namespace

- The litmus infra components will be placed in this namespace.

**Note**: The chaos control plane can be placed in any namespace, though it is typically placed in "litmus".

```bash
root@demo:~# kubectl create ns litmus
namespace/litmus created
```

#### Step-3: Install the litmus chaos control plane

```bash
root@demo:~# helm install chaos litmuschaos/litmus --namespace=litmus --devel --set portalScope=namespace
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

Visit https://docs.litmuschaos.io/docs/getstarted/ to find more info.

```

> **Note:** Litmus uses Kubernetes CRDs to define chaos intent. Helm3 handles CRDs better than Helm2. Before you start running a chaos experiment, verify if Litmus is installed correctly.

- The cluster-admin or an equivalent user with the right permissions are required to install them CRDs upfront. To apply LitmusCRDs:

```bash
kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/litmus-portal/litmus-portal-crds.yml
```

Output:

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

### <a name="kubectl_install"> </a>**Install Litmus using kubectl **

#### **Install Litmus**

- Set the namespace on which you want to install litmus.

```bash
export LITMUS_PORTAL_NAMESPACE="<namespace>"
kubectl get ns ${LITMUS_PORTAL_NAMESPACE}
# If the namespace is not already present
# then create the target namespace
kubectl create ns ${LITMUS_PORTAL_NAMESPACE}
```

- The cluster-admin or an equivalent user with the right permissions are required to install them CRDs upfront. To apply LitmusCRDs:

```bash
kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/litmus-portal/litmus-portal-crds.yml
```

Output:

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

- Replace namespace with the target namespace.

```bash
export LITMUS_PORTAL_NAMESPACE="<namespace>"
curl https://raw.githubusercontent.com/litmuschaos/litmus/master/docs/2.0.0/litmus-namespaced-2.0.0.yaml --output litmus-portal-namespaced-K8s-template.yml
envsubst < litmus-portal-namespaced-K8s-template.yml >
${LITMUS_PORTAL_NAMESPACE}-ns-scoped-litmus-portal-manifest.yml
kubectl apply -f ${LITMUS_PORTAL_NAMESPACE}-ns-scoped-litmus-portal-manifest.yml -n ${LITMUS_PORTAL_NAMESPACE}
```

Output:

```bash
configmap/litmus-portal-admin-config created
deployment.apps/litmusportal-frontend created
service/litmusportal-frontend-service created
serviceaccount/litmus-server-account created
role.rbac.authorization.k8s.io/litmus-server created
rolebinding.rbac.authorization.k8s.io/litmus-server-rb created
deployment.apps/litmusportal-server created
service/litmusportal-server-service created
statefulset.apps/mongo created
service/mongo-service created
```

## **Verify your installation**

**Verify if the frontend, server, and database pods are running**

- Check the litmus CRDs:

  ```bash
  $ kubectl get crds | grep litmus
  chaosengines.litmuschaos.io                        2021-03-24T06:52:54Z
  chaosexperiments.litmuschaos.io                    2021-03-24T06:52:54Z
  chaosresults.litmuschaos.io                        2021-03-24T06:52:55Z
  eventtrackerpolicies.eventtracker.litmuschaos.io   2021-03-24T06:52:55Z

  ```

- Check the pods in litmus namespace:

  ```bash
  $ kubectl get pods -n litmus

  NAME                                    READY   STATUS  RESTARTS  AGE
  litmusportal-frontend-97c8bf86b-mx89w   1/1     Running 2         6m24s
  litmusportal-server-5cfbfc88cc-m6c5j    2/2     Running 2         6m19s
  mongo-0                                 1/1     Running 0         6m16s
  ```

- Check the services running in litmus namespace:

  ```bash
  $ kubectl get svc -n litmus

  NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP PORT(S)                       AGE
  litmusportal-frontend-service   NodePort    10.100.105.154  <none>      9091:30229/TCP                7m14s
  litmusportal-server-service     NodePort    10.100.150.175  <none>      9002:30479/TCP,9003:31949/TCP 7m8s
  mongo-service                   ClusterIP   10.100.226.179  <none>      27017/TCP                     7m6s
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

> **Note**: In this case, the PORT for `litmusportal-frontend-service` is `30385`. Yours will be different.

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

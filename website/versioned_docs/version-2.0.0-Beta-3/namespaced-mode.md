---
id: namespaced-mode
title: Namespaced Mode
sidebar_label: Namespaced Mode
original_id: namespaced-mode
---

---

### What is Namespaced Mode?

Namespaced mode is the other end of the orchestration spectrum & is an antithesis of the admin-mode of operation. Here, the ChaosOperator as well as the chaos resources (chaosexperiment, chaosengine, chaosresult CRs, the experiment pods and chaos workflows) are run in the same namespace where the application under test (AUT) resides. This mode serves the use-cases where the developers/users don't typically have much autonomy over cluster usage and operate strictly within a specific allotted namespace. However, in this case, too, the cluster-admin or an equivalent user with the right permissions are required to install them CRDs upfront.

Note that this mode of operation restricts the scope of chaos experiments to those at the pod-level, as the node/infra level experiments need cluster-wide access.

### How to use Namespaced Mode?

In order to use Namespaced Mode, you just have to install the namespace-scoped litmus operator manifest in the desired (app) namespace. This installs the ChaosOperator, configured to watch for ChaosEngine resources in the same namespace while also setting up the RBAC that can be used for the execution of the standard (generic suite) of chaos experiments.

### Supported Experiments in Namespaced Mode

- [Pod Delete](https://docs.litmuschaos.io/docs/pod-delete/)
- [Container Kill](https://docs.litmuschaos.io/docs/container-kill/)
- [Pod Network Loss](https://docs.litmuschaos.io/docs/pod-network-loss/)
- [Pod Network Latency](https://docs.litmuschaos.io/docs/pod-network-latency/)
- [Pod Network Duplication](https://docs.litmuschaos.io/docs/pod-network-duplication/)
- [Pod Network Corruption](https://docs.litmuschaos.io/docs/pod-network-corruption/)
- [Pod CPU Hog](https://docs.litmuschaos.io/docs/pod-cpu-hog/)
- [Pod Memory Hog](https://docs.litmuschaos.io/docs/pod-memory-hog/)
- [Disk Fill](https://docs.litmuschaos.io/docs/disk-fill/)
- [Pod Autoscaler](https://docs.litmuschaos.io/docs/pod-autoscaler/)

### Role Based Access Control (RBAC) Permission in Namespaced Mode

In Namespace mode the RBAC for different [litmus components](https://github.com/litmuschaos/litmus/tree/master/litmus-portal/graphql-server/manifests/namespace) are as follows,

- [Argo](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/namespace/1a_argo_rbac.yaml)
- [Litmus Cluster Scope](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/namespace/2a_litmus_rbac.yaml)
- [Litmus Admin](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/namespace/3a_agents_rbac.yaml)(for running experiments)
- [Subscriber](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/namespace/3a_agents_rbac.yaml)
- [Litmus Event Tracker](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/namespace/3a_agents_rbac.yaml)

### Install Litmus Portal in Namespaced Mode

To install Litmus portal on namespaced mode we need to run the following steps:

#### Checkout the namespace

Check the namespace on which you want to install litmus.

```bash
export LITMUS_PORTAL_NAMESPACE="<namespace>"
kubectl get ns ${LITMUS_PORTAL_NAMESPACE}
# If the namespace is not already present
# then create the target namespace
kubectl create ns ${LITMUS_PORTAL_NAMESPACE}
```

Output:

```bash
namespace/litmus created
```

#### Install Litmus CRDs

The cluster-admin or an equivalent user with the right permissions are required to install them CRDs upfront.

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
```

#### Install Litmus Portal namespaced mode

Replace namespace with the target namespace (here litmus).

```bash
export LITMUS_PORTAL_NAMESPACE="<namespace>"
curl
https://raw.githubusercontent.com/litmuschaos/litmus/master/docs/2
.0.0-Beta/litmus-namespaced-2.0.0.yaml --output
litmus-portal-namespaced-K8s-template.yml
envsubst < litmus-portal-namespaced-K8s-template.yml >
${LITMUS_PORTAL_NAMESPACE}-ns-scoped-litmus-portal-manifest.yml
kubectl apply -f
${LITMUS_PORTAL_NAMESPACE}-ns-scoped-litmus-portal-manifest.yml -n
${LITMUS_PORTAL_NAMESPACE}
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

#### Deploy sample Application Hello World under Chaos (Optional)

We can now deploy a sample hello world application under chaos (AUT) in the target namespace.

```bash
kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/litmus-portal/platforms/okteto/hello-world-AUT.yml -n ${LITMUS_PORTAL_NAMESPACE}
```

Output:

```bash
deployment.apps/hello-world created
service/hello-world created
```

#### Verify the installation

- Check the litmus CRDs:

  ```bash
  $ kubectl get crds | grep litmus

  chaosengines.litmuschaos.io       2021-03-24T06:52:54Z
  chaosexperiments.litmuschaos.io   2021-03-24T06:52:54Z
  chaosresults.litmuschaos.io       2021-03-24T06:52:55Z
  ```

- Check the pods in litmus namespace:

  ```bash
  $ kubectl get pods -n litmus

  NAME                                    READY   STATUS  RESTARTS  AGE
  hello-world-867646c44b-f985x            1/1     Running 0         6m11s
  hello-world-867646c44b-kqkbz            1/1     Running 0         6m11s
  litmusportal-frontend-97c8bf86b-mx89w   1/1     Running 2         6m24s
  litmusportal-server-5cfbfc88cc-m6c5j    2/2     Running 2         6m19s
  mongo-0                                 1/1     Running 0         6m16s
  ```

- Check the services running in litmus namespace:

  ```bash
  $ kubectl get svc -n litmus

  NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP PORT(S)                       AGE
  hello-world                     ClusterIP   10.100.46.148   <none>      8080/TCP                      7m1s
  litmusportal-frontend-service   NodePort    10.100.105.154  <none>      9091:30229/TCP                7m14s
  litmusportal-server-service     NodePort    10.100.150.175  <none>      9002:30479/TCP,9003:31949/TCP 7m8s
  mongo-service                   ClusterIP   10.100.226.179  <none>      27017/TCP                     7m6s
  ```

#### Access the Litmus portal frontend service.

To access the frontend we need to access the `litmusportal-frontend-service` mentioned above. We can either access the frontend using `NodePort` service (by Default) or change the service to `LoadBalancer` and use it. We access the frontend using `NodePort` service (Node IP and port from frontend service)

Now, for creating a project, we need to login using Default username and password which is:

- username: admin
- password: litmus

After logging in, the next page will ask you to create a project. You can give a name of your project and click on Continue. In the next step you will be asked to change the password. You can keep the same password for the sake of simplicity, i.e litmus.

With this, you’re done with the initial setup and you’ll arrive at the Welcome page.
Here, you can check the Targets option from the side bar if it changes to Active state from Pending state or not.

Now, you can again go back to the cluster and check the pods in the target namespace (here litmus).

```bash
$ kubectl get pods -n litmus

NAME                                    READY STATUS    RESTARTS  AGE
argo-server-8497bdfd84-kk2vw            1/1   Running   0         3m28s
chaos-exporter-5fbd968db-z4n4f          1/1   Running   0         3m36s
chaos-operator-ce-c749c49cd-w8t4k       1/1   Running   0         3m36s
event-tracker-647db5959d-gshql          1/1   Running   0         3m29s
hello-world-867646c44b-f985x            1/1   Running   0         75m
hello-world-867646c44b-kqkbz            1/1   Running   0         75m
litmusportal-frontend-97c8bf86b-mx89w   1/1   Running   2         75m
litmusportal-server-5cfbfc88cc-m6c5j    2/2   Running   2         75m
mongo-0                                 1/1   Running   0         75m
subscriber-676fd59f59-xcvc2             1/1   Running   0         3m30s
workflow-controller-7dbc97dc75-7c6b9    1/1   Running   0         3m27s
```

You’ll find that some new deployment is shown which includes litmus infra components like ChaosOperator and monitoring component ChaosExporter to generate chaos metrics. Also, some new service accounts have been created to run chaos.

```bash
$ kubectl get sa -n litmus

NAME                    SECRETS AGE
argo                    1       6m19s
argo-chaos              1       6m24s
argo-server             1       6m18s
default                 1       78m
litmus                  1       6m29s
litmus-admin            1       6m25s
litmus-event-tracker-sa 1       6m22s
litmus-namespace-scope  1       6m27s
litmus-server-account   1       78m
```

With this, we are done setting up litmus in namespaced mode!

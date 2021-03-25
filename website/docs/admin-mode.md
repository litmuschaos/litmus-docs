---
id: admin-mode
title: Administrator Mode
sidebar_label: Administrator Mode
original_id: admin-mode
---

---

### What is Adminstator Mode?

Admin mode is one of the ways the chaos orchestration is set up in Litmus, wherein all chaos resources (i.e., install time resources like the operator, chaosexperiment CRs, chaosServiceAccount/rbac and runtime resources like chaosengine, chaos-runner, experiment jobs & chaosresults) are set up in a single admin namespace (typically, litmus). In other words, centralized administration of chaos. This feature is aimed at making the SRE/Cluster Admins' life easier by doing away with setting up chaos pre-requisites on a per namespace basis (which may be more relevant in an autonomous/self-service cluster sharing model in dev environments). This mode typically needs a "wider" & "stronger" ClusterRole, albeit one that is still just a superset of the individual experiment permissions. In this mode, the applications in their respective namespaces are subjected to chaos while the chaos job runs elsewhere, i.e., admin namespace.

### How to use Adminstator Mode?

In order to use Admin Mode, you just have to create a ServiceAccount in the _admin_ or so-called _chaos_ namespace (`litmus` itself can be used), which is tied to a ClusterRole that has the permissions to perform operations on Kubernetes resources involved in the selected experiments across namespaces. Provide this ServiceAccount in ChaosEngine's .spec.chaosServiceAccount.

### Supported Experiments in Namespaced Mode

| Experiment                                                                           | Scope of the experiment |
| ------------------------------------------------------------------------------------ | ----------------------- |
| [Pod Delete](https://docs.litmuschaos.io/docs/pod-delete/)                           | Pod Level               |
| [Container Kill](https://docs.litmuschaos.io/docs/container-kill/)                   | Pod Level               |
| [Pod Network Loss](https://docs.litmuschaos.io/docs/pod-network-loss/)               | Pod Level               |
| [Pod Network Latency](https://docs.litmuschaos.io/docs/pod-network-latency/)         | Pod Level               |
| [Pod Network Duplication](https://docs.litmuschaos.io/docs/pod-network-duplication/) | Pod Level               |
| [Pod Network Corruption](https://docs.litmuschaos.io/docs/pod-network-corruption/)   | Pod Level               |
| [Pod CPU Hog](https://docs.litmuschaos.io/docs/pod-cpu-hog/)                         | Pod Level               |
| [Pod Memory Hog](https://docs.litmuschaos.io/docs/pod-memory-hog/)                   | Pod Level               |
| [Disk Fill](https://docs.litmuschaos.io/docs/disk-fill/)                             | Pod Level               |
| [Pod Autoscaler](https://docs.litmuschaos.io/docs/pod-autoscaler/)                   | Pod Level               |
| [Node CPU Hog](https://docs.litmuschaos.io/docs/node-cpu-hog/)                       | Infra Level             |
| [Node Memory Hog](https://docs.litmuschaos.io/docs/node-memory-hog/)                 | Infra Level             |
| [Node IO Stress](https://docs.litmuschaos.io/docs/node-io-stress/)                   | Infra Level             |
| [Node Drain](https://docs.litmuschaos.io/docs/node-drain/)                           | Infra Level             |
| [Node Taint](https://docs.litmuschaos.io/docs/node-taint/)                           | Infra Level             |
| [Node Restart](https://docs.litmuschaos.io/docs/node-restart/)                       | Infra Level             |
| [Kubelet Service Kill](https://docs.litmuschaos.io/docs/kubelet-service-kill/)       | Infra Level             |
| [Docker Service Kill](https://docs.litmuschaos.io/docs/docker-service-kill/)         | Infra Level             |
| [EC2 instance Terminate](https://docs.litmuschaos.io/docs/ec2-terminate/)            | Infra Level             |
| [EBS Loss](https://docs.litmuschaos.io/docs/ebs-loss/)                               | Infra Level             |

### Role Based Access Control (RBAC) Permission in Namespaced Mode

In Admin mode the RBAC for different [litmus components](https://github.com/litmuschaos/litmus/tree/master/litmus-portal/graphql-server/manifests/cluster) are as follows,

- [Argo](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/1b_argo_rbac.yaml)
- [Litmus Cluster Scope](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/2b_litmus_rbac.yaml)
- [Litmus Admin](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/3a_agents_rbac.yaml)(for running experiments)
- [Subscriber](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/3a_agents_rbac.yaml)
- [Litmus Event Tracker](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/3a_agents_rbac.yaml)

### Install Litmus Portal in Admin Mode

To install Litmus portal on admin mode we need to run the following steps:

#### Create a centralized namespace for chaos operations

We will create a centralized namespace that will manage the chaos operations for any other namespace. We use centralized namespaces as “litmus” here.

```bash
kubectl create ns litmus
```

Output:

```bash
namespace/litmus created
```

#### Install Litmus portal along with CRDs

```bash
kubectl apply -f https://litmuschaos.github.io/litmus/2.0.0-Beta/litmus-2.0.0-Beta.yaml
```

Output:

```bash
configmap/litmus-portal-admin-config created
deployment.apps/litmusportal-frontend created
service/litmusportal-frontend-service created
serviceaccount/litmus-server-account created
clusterrole.rbac.authorization.k8s.io/litmus-server created
clusterrolebinding.rbac.authorization.k8s.io/litmus-server-rb created
deployment.apps/litmusportal-server created
service/litmusportal-server-service created
statefulset.apps/mongo created
service/mongo-service created
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

#### Deploy sample Application Hello World under Chaos (Optional)

We can now deploy a sample hello world application under chaos (AUT) in any namespace.

```bash
kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/litmus-portal/platforms/okteto/hello-world-AUT.yml -n <namespace>
```

Output:

```bash
deployment.apps/hello-world created
service/hello-world created
```

#### Access the frontend service and create a project on the portal.

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

You’ll find that some new deployment is shown which includes litmus infra component like Chaos Operator and Chaos exporter to generate litmus metrics. Also, some new service accounts have been created to run a chaos.

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

With this, we are done setting up litmus in admin mode!

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

<table>
   <tr>
      <th>Experiment</th>
      <th>Scope of the experiment</th>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/pod-delete/">Pod Delete</a></td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/container-kill/">Container Kill</a></td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td>
         <a href="https://docs.litmuschaos.io/docs/pod-network-loss/">Pod Network Loss</a>
      </td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td>
         <a href="https://docs.litmuschaos.io/docs/pod-network-latency/">Pod Network Latency</a>
      </td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td>
         <a href="https://docs.litmuschaos.io/docs/pod-network-duplication/">Pod Network Duplication</a>
      </td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td>
         <a href="https://docs.litmuschaos.io/docs/pod-network-corruption/">Pod Network Corruption</a>
      </td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/pod-cpu-hog/">Pod CPU Hog</a></td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/pod-memory-hog/">Pod Memory Hog</a></td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/disk-fill/">Disk Fill</a></td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/pod-autoscaler/">Pod Autoscaler</a></td>
      <td>Pod Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/node-cpu-hog/">Node CPU Hog</a></td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td>
         <a href="https://docs.litmuschaos.io/docs/node-memory-hog/">Node Memory Hog</a>
      </td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/node-io-stress/">Node IO Stress</a></td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/node-drain/">Node Drain</a></td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/node-taint/">Node Taint</a></td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/node-restart/">Node Restart</a></td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td>
         <a href="https://docs.litmuschaos.io/docs/kubelet-service-kill/">Kubelet Service Kill</a>
      </td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td>
         <a href="https://docs.litmuschaos.io/docs/docker-service-kill/">Docker Service Kill</a>
      </td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td>
         <a href="https://docs.litmuschaos.io/docs/ec2-terminate/">EC2 instance Terminate</a>
      </td>
      <td>Infra Level</td>
   </tr>
   <tr>
      <td><a href="https://docs.litmuschaos.io/docs/ebs-loss/">EBS Loss</a></td>
      <td>Infra Level</td>
   </tr>
</table>

### Role Based Access Control (RBAC) Permission in Namespaced Mode

In Admin mode the RBAC for different [litmus components](https://github.com/litmuschaos/litmus/tree/master/litmus-portal/graphql-server/manifests/cluster) are as follows,

- [Argo](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/1b_argo_rbac.yaml)
- [Litmus Cluster Scope](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/2b_litmus_rbac.yaml)
- [Litmus Admin](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/3a_agents_rbac.yaml)(for running experiments)
- [Subscriber](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/3a_agents_rbac.yaml)
- [Litmus Event Tracker](https://github.com/litmuschaos/litmus/blob/master/litmus-portal/graphql-server/manifests/cluster/3a_agents_rbac.yaml)

### Install Litmus Portal in Admin Mode

To install Litmus portal on admin mode refer to our [installation steps](./litmus-installation.md)!

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

#### Create project from portal and check service accounts

After logging in to the portal by following the installation steps, the next page will ask you to create a project. You can give a name of your project and click on Continue. In the next step you will be asked to change the password. You can keep the same password for the sake of simplicity, i.e litmus.

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

With this, we are done setting up litmus in admin mode!

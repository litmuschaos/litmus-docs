---
id: rancher-litmus
title: Installation and Troubleshooting of LitmusChaos on Rancher
sidebar_label: Install and Troubleshoot Litmus
original_id: rancher-litmus
---

---

## Pre-requisites

- Rancher 2.4.3 or later
- Kubernetes 1.11 or later

## Getting Started

Running chaos on your application involves the following steps:

[Install Litmus](#install-litmus)

[Install Chaos Experiments](#install-chaos-experiments)

[Setup Service Account](#setup-service-account)

[Annotate your application](#annotate-your-application)

[Prepare ChaosEngine](#prepare-chaosengine)

[Run Chaos](#run-chaos)

[Observe chaos results](#observe-chaos-results)

[Troubleshooting](#troubleshooting)

<hr/>

**NOTE**:

- This guide describes the steps to inject container-kill chaos on an nginx application already deployed in the
  nginx namespace. It is a mandatory requirement to ensure that the chaos custom resources (chaosexperiment and chaosengine)
  and the experiment specific serviceaccount are created in the same namespace (typically, the same as the namespace of the
  Application Under Test (AUT), in this case nginx). This is done to ensure that the developers/users of the experiment isolate
  the chaos to their respective work-namespaces in shared environments.

- In all subsequent steps, please follow these instructions by replacing the nginx namespace and labels with that of your
  application.

### Creating the nginx Pod for testing

Deplying nginx process:

```console
$ kubectl create namespace nginx
namespace/nginx created

$ kubectl create deployment nginx --image=nginx -n nginx
deployment.apps/nginx created

$ kubectl create service nodeport nginx --tcp=80:80 -n nginx
service/nginx created

$ kubectl get svc -n nginx
NAME    TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx   NodePort   10.x.x.x   <none>        80:31281/TCP   0s
```

The nginx default web site should be available now.

### Install Litmus

Followed the steps in the [Getting Started Guide](https://docs.litmuschaos.io/docs/getstarted/)\* to install litmus in a `nginx` namespace with an nginx application.

Download `litmus-operator-v1.8.2.yaml` from https://litmuschaos.github.io/litmus/litmus-operator-v1.8.2.yaml.
Modify it to use the `nginx` namespace in three places (at lines 10, 41, and 47 approximately).
Install the litmus-operator in `nginx` application namespace using kubectl.

```console
$ kubectl apply -f litmus-operator.yaml -n nginx
```

Expected output:

```console
Warning: kubectl apply should be used on resource created by either kubectl create --save-config or kubectl apply
namespace/nginx configured
serviceaccount/litmus created
clusterrole.rbac.authorization.k8s.io/litmus created
clusterrolebinding.rbac.authorization.k8s.io/litmus created
deployment.apps/chaos-operator-ce created
customresourcedefinition.apiextensions.k8s.io/chaosengines.litmuschaos.io created
customresourcedefinition.apiextensions.k8s.io/chaosexperiments.litmuschaos.io created
customresourcedefinition.apiextensions.k8s.io/chaosresults.litmuschaos.io created
```

The above command install all the CRDs, required service account configuration, and chaos-operator.

**Verify your installation**
Before you start running a chaos experiment, verify if Litmus is installed correctly.

- Verify if the chaos operator is running

```console
$ kubectl get pods -n nginx
```

Expected output:

```console
NAME                                 READY   STATUS              RESTARTS   AGE
chaos-operator-ce-76d5d844f7-ptr2m   1/1     Running             0          21s
nginx-86c57db685-6lqbw               1/1     Running             0          58s
```

- Verify if chaos CRDs are installed

```console
$ kubectl get crds | grep chaos
```

Expected output:

```console
chaosengines.litmuschaos.io                   2020-06-24T17:37:01Z
chaosexperiments.litmuschaos.io               2020-06-24T17:37:01Z
chaosresults.litmuschaos.io                   2020-06-24T17:37:01Z
```

- Verify if the chaos API resources are successfully created in the desired (application) namespace.

  _Note_: Sometimes, it may take few seconds for the resources to be available post the CRD installation

```
$ kubectl api-resources | grep chaos
```

Expected output:

```console
chaosengines                                   litmuschaos.io                 true         ChaosEngine
chaosexperiments                               litmuschaos.io                 true         ChaosExperiment
chaosresults                                   litmuschaos.io                 true         ChaosResult
```

### Install Chaos Experiments

Chaos experiments contain the actual chaos details. These experiments are installed on your cluster as Kubernetes Custom Resources (CRs).
The Chaos Experiments are grouped as Chaos Charts and are published on <a href="https://hub.litmuschaos.io" target="_blank">ChaosHub</a>.

The generic chaos experiments such as `pod-delete`, `container-kill`,` pod-network-latency` are available under Generic Chaos Chart.
This is the first chart you are recommended to install.

```
$ kubectl apply -f https://hub.litmuschaos.io/api/chaos/1.8.2?file=charts/generic/experiments.yaml -n nginx
```

Expected output:

```console
chaosexperiment.litmuschaos.io/node-drain created
chaosexperiment.litmuschaos.io/disk-fill created
chaosexperiment.litmuschaos.io/pod-cpu-hog created
chaosexperiment.litmuschaos.io/pod-memory-hog created
chaosexperiment.litmuschaos.io/pod-network-corruption created
chaosexperiment.litmuschaos.io/pod-delete created
chaosexperiment.litmuschaos.io/pod-network-loss created
chaosexperiment.litmuschaos.io/disk-loss created
chaosexperiment.litmuschaos.io/pod-network-latency created
chaosexperiment.litmuschaos.io/node-cpu-hog created
chaosexperiment.litmuschaos.io/kubelet-service-kill created
chaosexperiment.litmuschaos.io/node-memory-hog created
chaosexperiment.litmuschaos.io/container-kill created
```

Verify if the chaos experiments are installed.

```
$ kubectl get chaosexperiments -n nginx
```

Expected output:

```console
NAME                     AGE
container-kill           0s
disk-fill                4s
disk-loss                2s
kubelet-service-kill     1s
node-cpu-hog             1s
node-drain               4s
node-memory-hog          0s
pod-cpu-hog              3s
pod-delete               2s
pod-memory-hog           3s
pod-network-corruption   3s
pod-network-latency      1s
pod-network-loss         2s
```

### Setup Service Account

A service account should be created to allow chaosengine to run experiments in your application namespace. Copy the following
into a `rbac.yaml` manifest and run `kubectl apply -f rbac.yaml` to create one such account on the `nginx` namespace. This service account
has just enough permissions needed to run the container-kill chaos experiment.

**NOTE**:

- For rbac samples corresponding to other experiments such as, say, pod-delete, please refer the respective experiment folder in
  the [chaos-charts](https://github.com/litmuschaos/chaos-charts/tree/master/charts/generic/pod-delete) repository.

[embedmd]: # 'https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/container-kill/rbac_nginx_getstarted.yaml'

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: container-kill-sa
  namespace: nginx
  labels:
    name: container-kill-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: container-kill-sa
  namespace: nginx
  labels:
    name: container-kill-sa
rules:
  - apiGroups: ['', 'litmuschaos.io', 'batch', 'apps']
    resources: ['pods', 'jobs', 'pods/exec', 'pods/log', 'events', 'chaosengines', 'chaosexperiments', 'chaosresults']
    verbs: ['create', 'list', 'get', 'patch', 'update', 'delete', 'deletecollection']
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: container-kill-sa
  namespace: nginx
  labels:
    name: container-kill-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: container-kill-sa
subjects:
  - kind: ServiceAccount
    name: container-kill-sa
    namespace: nginx
```

### Annotate your application

Your application has to be annotated with `litmuschaos.io/chaos="true"`. As a security measure, and also as a means
to reduce blast radius the chaos operator checks for this annotation before invoking chaos experiment(s) on the application.
Replace `nginx` with the name of your deployment.

<div class="danger">
<strong>NOTE:</strong> 
Litmus supports chaos on deployments, statefulsets & daemonsets. This example refers to a nginx deploymemt. In case
of other types, please use the appropriate resource/resource-name convention (say, `sts/kafka` or `ds/node-device-manager`, for example).  
</div>

```console
$ kubectl annotate deploy/nginx litmuschaos.io/chaos="true" -n nginx
```

Expected output:

```console
deployment.apps/nginx annotated
```

### Prepare ChaosEngine

ChaosEngine connects the application instance to a Chaos Experiment. Copy the following YAML snippet into a file called
`chaosengine.yaml`.

**NOTE:** You may update the values of `applabel` , `appns`, `appkind` and `experiments` as per your deployment and choices.
Change the `chaosServiceAccount` to the name of service account created in above previous steps if you modified the `rbac.yaml`.

[embedmd]: # 'https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/container-kill/engine_nginx_getstarted.yaml yaml'

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: nginx
spec:
  # It can be true/false
  annotationCheck: 'true'
  # It can be active/stop
  engineState: 'active'
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ''
  appinfo:
    appns: 'nginx'
    applabel: 'app=nginx'
    appkind: 'deployment'
  chaosServiceAccount: container-kill-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: 'delete'
  experiments:
    - name: container-kill
      spec:
        components:
          env:
            # specify the name of the container to be killed
            - name: TARGET_CONTAINER
              value: 'nginx'

            # provide the chaos interval
            - name: CHAOS_INTERVAL
              value: '10'

            # provide the total chaos duration
            - name: TOTAL_CHAOS_DURATION
              value: '20'

            - name: LIB_IMAGE
              value: 'litmuschaos/go-runner:latest'

            # provide the name of container runtime
            # it supports docker, containerd, crio
            # default to docker
            - name: CONTAINER_RUNTIME
              value: 'docker'

            # provide the container runtime path for containerd
            # applicable only for containerd runtime
            - name: CONTAINER_PATH
              value: '/run/containerd/containerd.sock'
```

### Override Default Chaos Experiments Variables

From LitmusChaos v1.1.0, the default environment variable values in chaosexperiments can be overridden by specifying
them in the chaosengine under `experiments.<experiment_name>.spec.components.env` with the desired value. In the
example below, the TARGET_CONTAINER is being set to a desired value based on the application instance.

```console
...
experiments:
    - name: container-kill
      spec:
        components:
          env:
            - name: TARGET_CONTAINER
              value: nginx
```

### Run Chaos

```console
$ kubectl apply -f chaosengine.yaml -n nginx
```

Expected output:

```console
chaosengine.litmuschaos.io/nginx-chaos created
```

### Observe Chaos results

Describe the ChaosResult CR to know the status of each experiment. The `spec.verdict` is set to `Awaited` when the experiment is in progress, eventually changing to either `Pass` or `Fail`.

**NOTE:** ChaosResult CR name will be `<chaos-engine-name>-<chaos-experiment-name>`

```console
$ kubectl describe chaosresult nginx-chaos-container-kill -n nginx
```

Expected output:

```console
Name:         nginx-chaos-container-kill
Namespace:    nginx
Labels:       chaosUID=e0f398da-27ad-43c3-b7be-88a7cde2b257
              type=ChaosResult
Annotations:  API Version:  litmuschaos.io/v1alpha1
Kind:         ChaosResult
Metadata:
  Creation Timestamp:  2020-07-06T15:54:34Z
  Generation:          4
  Resource Version:    67650
  Self Link:           /apis/litmuschaos.io/v1alpha1/namespaces/nginx/chaosresults/nginx-chaos-container-kill
  UID:                 0c848944-f594-4213-ada0-48efb41a6ba1
Spec:
  Engine:      nginx-chaos
  Experiment:  container-kill
Status:
  Experimentstatus:
    Fail Step:  N/A
    Phase:      Completed
    Verdict:    Pass
Events:         <none>
```

## Uninstallation

You can uninstall Litmus by deleting the namespace.

```console
kubectl delete -f chaosengine.yaml -n nginx
kubectl delete -f rbac.yaml -n nginx
kubectl delete -f https://hub.litmuschaos.io/api/chaos/1.8.2?file=charts/generic/experiments.yaml -n nginx
kubectl delete -f litmus-operator.yaml -n nginx

```

## Troubleshooting

Following the steps in the _Getting Started Guide_ to install litmus in a `nginx` namespace with an nginx deployment, you may do everything correctly and not get the `container-kill` experiment to work. The tips below are to assist you in troubleshooting the issue.

The environment used below is Rancher running on AWS.When I ran the chaos engine using the content provide in the _Getting Started Guide_:

```console
$ kubectl apply -f chaosengine.yaml -n nginx
chaosengine.litmuschaos.io/nginx-chaos created
```

Check to see the status of the `nginx` namespace:

```console
$ kubectl get all -n nginx
NAME                                     READY   STATUS              RESTARTS   AGE
pod/chaos-operator-ce-76d5d844f7-ptr2m   1/1     Running             0          7m56s
pod/container-kill-sfeyq0-r97db          1/1     Running             0          54s
pod/nginx-86c57db685-6lqbw               1/1     Running             0          8m37s
pod/nginx-chaos-runner                   1/1     Running             0          63s
pod/pumba-sig-kill-uc7rlt                0/1     ContainerCreating   0          2s

NAME                             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/chaos-operator-metrics   ClusterIP   10.43.184.74    <none>        8383/TCP       7m53s
service/nginx                    NodePort    10.43.201.219   <none>        80:31281/TCP   8m36s

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/chaos-operator-ce   1/1     1            1           7m56s
deployment.apps/nginx               1/1     1            1           8m37s

NAME                                           DESIRED   CURRENT   READY   AGE
replicaset.apps/chaos-operator-ce-76d5d844f7   1         1         1       7m56s
replicaset.apps/nginx-86c57db685               1         1         1       8m37s

NAME                              COMPLETIONS   DURATION   AGE
job.batch/container-kill-sfeyq0   0/1           54s        54s
```

Everything looks good at this point. You can also look at the Rancher UI to drill down into the Workloads of `nginx` namespace and see the pods.

The first time took a while to run but the Verdict was `Fail`.

```console
$ kubectl describe chaosresult nginx-chaos-container-kill -n nginx
Name:         nginx-chaos-container-kill
Namespace:    nginx
Labels:       chaosUID=4920e2e0-e241-482a-8f96-c96fff74638a
              type=ChaosResult
Annotations:  API Version:  litmuschaos.io/v1alpha1
Kind:         ChaosResult
Metadata:
  Creation Timestamp:  2020-06-24T17:44:43Z
  Generation:          1
  Resource Version:    82340
  Self Link:           /apis/litmuschaos.io/v1alpha1/namespaces/nginx/chaosresults/nginx-chaos-container-kill
  UID:                 8dc90e0d-fa0e-4b55-9a4d-1c7c3319175a
Spec:
  Engine:      nginx-chaos
  Experiment:  container-kill
Status:
  Experimentstatus:
    Phase:    Running
    Verdict:  Fail
Events:       <none>
```

Checking the status of the pods, either with kubectl or Rancher:

```console
$ kubectl get pods -n nginx
NAME                                 READY   STATUS    RESTARTS   AGE
chaos-operator-ce-76d5d844f7-ptr2m   1/1     Running   0          8m46s
container-kill-sfeyq0-r97db          1/1     Running   0          104s
nginx-86c57db685-6lqbw               1/1     Running   0          9m27s
nginx-chaos-runner                   1/1     Running   0          113s
pumba-sig-kill-uc7rlt                0/1     Error     0          52s
```

The Error status of the `pumba` pod gives us place to focus our attention as we start troubleshooting. Checking the logs on the `pumba` pod:

```console
$ kubectl logs pumba-sig-kill-uc7rlt -n nginx
time="2020-06-24T17:44:58Z" level=error msg="failed to list containers" app=pumba error="Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/containers/json?limit=0: dial unix /var/run/docker.sock: connect: permission denied" function=github.com/sirupsen/logrus.WithError source="container/client.go:90"
time="2020-06-24T17:44:58Z" level=error msg="failed to list containers" app=pumba error="Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/containers/json?limit=0: dial unix /var/run/docker.sock: connect: permission denied" function=github.com/sirupsen/logrus.WithError source="docker/kill.go:86"
time="2020-06-24T17:44:58Z" level=error msg="failed to run chaos command" app=pumba error="Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/containers/json?limit=0: dial unix /var/run/docker.sock: connect: permission denied" function=github.com/sirupsen/logrus.WithError source="chaos/command.go:79"
time="2020-06-24T17:44:58Z" level=fatal msg="Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/containers/json?limit=0: dial unix /var/run/docker.sock: connect: permission denied" app=pumba function=main.main source="cmd/main.go:162"
```

A search of the internet and the pumba image website doesn't reveal any useful information. Next step is to find the `/var/run/docker.sock` and the permissions on it that are causing the `pumba` pod to fail. Working under the assumption that `/var/run/docker.sock` is on the node where the `pumba` pod is running and pumba is attempting to volumeMount the file, we need to connect to the worker node via SSH.
First determine which worker node the pod is runnning on:

```console
kubectl describe pod pumba-sig-kill-uc7rlt -n nginx | grep Node:
```

Expected output

```console
Node:         <node_name>/x.y.z.212
```

After SSHing into the worker node, check the file permissions:

```bash
$ ls -l /var/run/docker.sock
srw-rw----. 1 root docker 0 Jun 30 04:44 /var/run/docker.sock
$ ls -Z /var/run/docker.sock
srw-rw----. root docker system_u:object_r:container_var_run_t:s0 /var/run/docker.sock
```

First fix is to try and change the regular file permissions to `srw-rw-rw` on `/var/run/docker.sock`.
To test, we delete the `chaosengine`

```console
kubectl delete -f chaosengine.yaml -n nginx
```

To attempt the `continer-kill` experiment again, apply `chaosengine.yaml` again :

```console
kubectl apply -f chaosengine.yaml -n nginx
```

The `pumba` pod errored out with the same log entries. To set-up for later testing, delete the `chaosengine` again.

```console
kubectl delete -f chaosengine.yaml -n nginx
```

Now we need to get into the Selinux access controls on `/var/run/docker.sock`

**NOTE:** The logs for Selinux auditing are in `/var/log/audit/audit.log` and require superuser privileges to review. To set Selinux policies also require superuser privileges. The rest of the steps in this section are run as root.

With elevated privileges, check monitored the audit log on both worker nodes for the file we having issues with `docker.sock`:

```console
$ grep docker.sock /var/log/audit/audit.log
```

The output was a number of lines that looked like this:

```console
type=AVC msg=audit(1594053128.110:14301): avc:  denied  { connectto } for  pid=15370 comm="pumba" path="/run/docker.sock" scontext=system_u:system_r:container_t:s0:c152,c861 tcontext=system_u:system_r:container_runtime_t:s0 tclass=unix_stream_socket permissive=0
```

This tells us that we really do have an Selinux access control issue to correct.

### Selinux Troubleshooting process:

Note: The sample Litmus experiment is set-up with the exception of applying `chaosengine.yaml.`

1. We need to log into all worker node the cluster where the `pumba` pod will try to run. This is required since we don't know on which worker node the pod will be created. Elevate privileges with sudo.
2. Checked the permissions on /var/run/docker.sock and /run/docker.sock:

```console
$ ls -lZ /run/docker.sock /var/run/docker.sock
srw-rw----. root docker system_u:object_r:container_var_run_t:s0 /run/docker.sock
srw-rw----. root docker system_u:object_r:container_var_run_t:s0 /var/run/docker.sock
```

3. Monitored the audit log on all worker nodes for the word `pumba`:

```console
$ tail -f /var/log/audit/audit.log | grep pumba
```

4. Applied `chaosengine.yaml` via kubectl in another terminal window.
5. Found an `avc: denied` message related to `docker.sock`.

```
type=AVC msg=audit(1594053128.110:14301): avc:  denied  { connectto } for  pid=15370 comm="pumba" path="/run/docker.sock" scontext=system_u:system_r:container_t:s0:c152,c861 tcontext=system_u:system_r:container_runtime_t:s0 tclass=unix_stream_socket permissive=0
```

**Solution:**

1. Created a SeLinux policy for the error. (Ref: [Red Hat SELinux User's and Administrator's Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/selinux_users_and_administrators_guide/sect-security-enhanced_linux-troubleshooting-fixing_problems#sect-Security-Enhanced_Linux-Fixing_Problems-Allowing_Access_audit2allow))

```console
$ grep pumba /var/log/audit/audit.log | audit2allow -M pumba_pol
To make this policy package active, execute:

semodule -i pumba_pol.pp
```

2. Applied the pumba selinux policy.

```console
$ semodule -i pumba_pol.pp

```

**Testing:**

1. Deleted `chaosengine.yaml` and then applied again.
2. This time no `avc: denied` message.
3. Ran the check on the litmus output and received `Pass` for the Verdict.

```console
kubectl describe chaosresult nginx-chaos-container-kill -n nginx
Name:         nginx-chaos-container-kill
Namespace:    nginx
Labels:       chaosUID=e0f398da-27ad-43c3-b7be-88a7cde2b257
              type=ChaosResult
Annotations:  API Version:  litmuschaos.io/v1alpha1
Kind:         ChaosResult
Metadata:
  Creation Timestamp:  2020-07-06T15:54:34Z
  Generation:          4
  Resource Version:    67650
  Self Link:           /apis/litmuschaos.io/v1alpha1/namespaces/nginx/chaosresults/nginx-chaos-container-kill
  UID:                 0c848944-f594-4213-ada0-48efb41a6ba1
Spec:
  Engine:      nginx-chaos
  Experiment:  container-kill
Status:
  Experimentstatus:
    Fail Step:  N/A
    Phase:      Completed
    Verdict:    Pass
Events:         <none>
```

**NOTE:** The `pumba_pol.pp` file is a binary policy file. The policy generation process also creates a type enforcement file (.te) that is a text representation of the policy. The contents of `pumba_pol.te`:

```bash
module pumba_pol 1.0;

require {
	type default_t;
	type container_runtime_t;
	type container_t;
	class sock_file write;
	class unix_stream_socket connectto;
}

#============= container_t ==============

#!!!! The file '/run/docker.sock' is mislabeled on your system.
#!!!! Fix with $ restorecon -R -v /run/docker.sock
allow container_t container_runtime_t:unix_stream_socket connectto;

#!!!! WARNING: 'default_t' is a base type.
allow container_t default_t:sock_file write;

```

## More Chaos Experiments

- For more details on supported chaos experiments and the steps to run them, refer the **Experiments** section.

## Join our community

If you have not joined our community, do join us [here](https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN).

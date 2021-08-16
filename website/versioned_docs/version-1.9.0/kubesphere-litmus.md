---
id: KubeSphere-litmus
title: Installtion of LitmusChaos on KubeSphere
sidebar_label: Install Litmus
original_id: kubesphere-litmus
---

---

## Pre-requisites

- KubeSphere 3.0.0 or later
  - You need to enable the [KubeSphere App Store (OpenPitrix)](https://v3-1.docs.kubesphere.io/docs/pluggable-components/app-store/).
  - You need to create a workspace, a project, and an account granted the `admin` role.. For more information, see [Create Workspaces, Projects, Accounts, and Roles](https://v3-1.docs.kubesphere.io/docs/quick-start/create-workspace-and-project/).
- Kubernetes 1.15 or later

## Getting Started

Running chaos on your application involves the following steps:

[Install Litmus](#install-litmus)

[Install Chaos Experiments](#install-chaos-experiments)

[Setup Service Account](#setup-service-account)

[Annotate your application](#annotate-your-application)

[Prepare ChaosEngine](#prepare-chaosengine)

[Run Chaos](#run-chaos)

[Observe ChaosResults](#observe-chaos-results)

---

### Install Litmus

**Step 1: Add the app repository**

1. Log in to KubeSphere web console and go to your workspace. In the left nevigation bar, select **App Management** > **App Repositories**, and then click **Add**.
2. In the displayed dialog box, set a name for the repository (for example, `litmus`) and enter the URL `https://litmuschaos.github.io/litmus-helm/`. Click **Validate** to verify the URL, and then click **OK** to continue.
3. The app repository will be displayed in the list after it is successfully imported.

**Step 2: Deploy Litmus**

1. In your project, go to **Application Workloads** > **Apps**, and then click **Deploy New App**.

2. In the displayed dialog box, choose **From App Templates**.
   - **From App Store**: Select apps from the official APP Store of Kubephere.
   - **From App Templates**: Select apps from workspace app templates and the third-party Helm app templates of App Repository.

3. In the drop-down list, select **litmus** > **litmus-2-0-0-beta**. Under **Versions**, select a specific version and click **Deploy**.

4. Under **Basic Information**, set a name for the app. Check the app version and the deployment location, and then click **Next**.

5. Under **App Configurations**, you can edit the yaml file or click **Deploy**.

6. The app will be displayed in the liste after it is successfully deployed.

**Step 3: Verify your installation**
Before you start running a chaos experiment, verify if Litmus is installed correctly.

- Verify if the ChaosOperator is running

```console
$ kubectl get pods -n litmus
```

Expected output:

```console
NAME                                                 READY   STATUS    RESTARTS   AGE
chaos-operator-ce-596647fd77-d85nn                   1/1     Running   0          21s
```

- Verify if chaos CRDs are installed

```console
$ kubectl get crds | grep chaos
```

Expected output:

```console
chaosengines.litmuschaos.io                           2021-08-12T06:29:58Z
chaosexperiments.litmuschaos.io                       2021-08-12T06:29:58Z
chaosresults.litmuschaos.io                           2021-08-12T06:29:59Z
```

- Verify if the chaos API resources are successfully created in the desired (application) namespace.

  _Note_: Sometimes, it may take few seconds for the resources to be available post the CRD installation

```
$ kubectl api-resources | grep chaos
```

Expected output:

```console
chaosengines                                           litmuschaos.io                true         ChaosEngine
chaosexperiments                                       litmuschaos.io                true         ChaosExperiment
chaosresults                                           litmuschaos.io                true         ChaosResult
```

**NOTE**:

- In this guide, we shall describe the steps to inject pod-delete chaos on an nginx application already deployed in the nginx namespace. It is a mandatory requirement to ensure that the chaos custom resources (chaosexperiment and chaosengine) and the experiment specific serviceaccount are created in the same namespace (typically, the same as the namespace of the application under test (AUT), in this case nginx). This is done to ensure that the developers/users of the experiment isolate the chaos to their respective work-namespaces in shared environments.
- In all subsequent steps, please follow these instructions by replacing the nginx namespace and labels with that of your
  application.

### Creating the nginx Pod for testing

To deploy Nginx, run the following commands:

```console
$ kubectl create namespace nginx
namespace/nginx created

$ kubectl create deployment nginx --image=nginx --replicas=2 -n nginx
deployment.apps/nginx created

$ kubectl create service nodeport nginx --tcp=80:80 -n nginx
service/nginx created

$ kubectl get svc -n nginx
NAME    TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx   NodePort   10.x.x.x        <none>        80:31281/TCP   0s
```

The nginx default website should be available now.

### Install Chaos Experiments

Chaos experiments contain the actual chaos details. These experiments are installed on your cluster as Kubernetes Custom Resources (CRs).
The Chaos Experiments are grouped as Chaos Charts and are published on <a href="https://hub.litmuschaos.io" target="_blank">Chaos Hub</a>.

The generic chaos experiments such as `pod-delete`, `container-kill`, ` pod-network-latency` are available under Generic Chaos Chart.
This is the first chart you are recommended to install.

```
$ kubectl apply -f https://hub.litmuschaos.io/api/chaos/2.0.0?file=charts/generic/experiments.yaml -n nginx
```

Expected output:

```console
chaosexperiment.litmuschaos.io/pod-network-latency created
chaosexperiment.litmuschaos.io/pod-network-duplication created
chaosexperiment.litmuschaos.io/pod-cpu-hog-exec created
chaosexperiment.litmuschaos.io/pod-memory-hog created
chaosexperiment.litmuschaos.io/pod-network-loss created
chaosexperiment.litmuschaos.io/pod-dns-spoof created
chaosexperiment.litmuschaos.io/pod-network-corruption created
chaosexperiment.litmuschaos.io/node-cpu-hog created
chaosexperiment.litmuschaos.io/node-memory-hog created
chaosexperiment.litmuschaos.io/node-restart created
chaosexperiment.litmuschaos.io/docker-service-kill created
chaosexperiment.litmuschaos.io/pod-memory-hog-exec created
chaosexperiment.litmuschaos.io/pod-autoscaler created
chaosexperiment.litmuschaos.io/pod-dns-error created
chaosexperiment.litmuschaos.io/kubelet-service-kill created
chaosexperiment.litmuschaos.io/container-kill created
chaosexperiment.litmuschaos.io/byoc-pod-delete created
chaosexperiment.litmuschaos.io/node-poweroff created
chaosexperiment.litmuschaos.io/disk-fill created
chaosexperiment.litmuschaos.io/pod-io-stress created
chaosexperiment.litmuschaos.io/node-io-stress created
chaosexperiment.litmuschaos.io/node-drain created
chaosexperiment.litmuschaos.io/node-taint created
chaosexperiment.litmuschaos.io/pod-cpu-hog created
chaosexperiment.litmuschaos.io/pod-delete created
```

Verify if the chaos experiments are installed.

```
$ kubectl get chaosexperiments -n nginx
```

Expected output:

```console
NAME                      AGE
byoc-pod-delete           34s
container-kill            34s
disk-fill                 34s
docker-service-kill       34s
kubelet-service-kill      34s
node-cpu-hog              34s
node-drain                34s
node-io-stress            34s
node-memory-hog           34s
node-poweroff             34s
node-restart              34s
node-taint                34s
pod-autoscaler            34s
pod-cpu-hog               34s
pod-cpu-hog-exec          34s
pod-delete                34s
pod-dns-error             34s
pod-dns-spoof             34s
pod-io-stress             34s
pod-memory-hog            34s
pod-memory-hog-exec       34s
pod-network-corruption    34s
pod-network-duplication   34s
pod-network-latency       34s
pod-network-loss          34s
```

A service account should be created to allow chaosengine to run experiments in your application namespace. Copy the following into a `rbac.yaml` manifest and run `kubectl apply -f rbac.yaml` to create one such account on the `nginx` namespace. This service account has just enough permissions needed to run the pod-delete chaos experiment.

**NOTE**:

For rbac samples corresponding to other experiments, refer to the respective experiment folder in the [chaos-charts](https://github.com/litmuschaos/chaos-charts/tree/master/charts/generic/pod-delete) repository.

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-delete-sa
  namespace: nginx
  labels:
    name: pod-delete-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-delete-sa
  namespace: nginx
  labels:
    name: pod-delete-sa
    app.kubernetes.io/part-of: litmus
rules:
- apiGroups: [""]
  resources: ["pods","events"]
  verbs: ["create","list","get","patch","update","delete","deletecollection"]
- apiGroups: [""]
  resources: ["pods/exec","pods/log","replicationcontrollers"]
  verbs: ["create","list","get"]
- apiGroups: ["batch"]
  resources: ["jobs"]
  verbs: ["create","list","get","delete","deletecollection"]
- apiGroups: ["apps"]
  resources: ["deployments","statefulsets","daemonsets","replicasets"]
  verbs: ["list","get"]
- apiGroups: ["apps.openshift.io"]
  resources: ["deploymentconfigs"]
  verbs: ["list","get"]
- apiGroups: ["argoproj.io"]
  resources: ["rollouts"]
  verbs: ["list","get"]
- apiGroups: ["litmuschaos.io"]
  resources: ["chaosengines","chaosexperiments","chaosresults"]
  verbs: ["create","list","get","patch","update"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-delete-sa
  namespace: nginx
  labels:
    name: pod-delete-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-delete-sa
subjects:
- kind: ServiceAccount
  name: pod-delete-sa
  namespace: nginx
```

### Annotate your application

Your application has to be annotated with `litmuschaos.io/chaos="true"`. As a security measure, and also as a means to reduce blast radius the chaos operator checks for this annotation before invoking chaos experiment(s) on the application.
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

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: nginx
spec:
  appinfo:
    appns: 'nginx'
    applabel: 'app=nginx'
    appkind: 'deployment'
  # It can be active/stop
  engineState: 'active'
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ''
  chaosServiceAccount: pod-delete-sa
  # It can be delete/retain
  jobCleanUpPolicy: 'delete'
  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: '30'

            # set chaos interval (in sec) as desired
            - name: CHAOS_INTERVAL
              value: '10'
              
            # pod failures without '--force' & default terminationGracePeriodSeconds
            - name: FORCE
              value: 'false'

             ## percentage of total pods to target
            - name: PODS_AFFECTED_PERC
              value: '50'
```

### Override Default Chaos Experiments Variables

From LitmusChaos v1.1.0, the default environment variable values in chaosexperiments can be overridden by specifying them in the chaosengine under `experiments.<experiment_name>.spec.components.env` with the desired value.

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
$ kubectl describe chaosresult nginx-chaos-pod-delete -n nginx
```

Expected output:

```console
Name:         nginx-chaos-pod-delete
Namespace:    nginx
Labels:       app.kubernetes.io/component=experiment-job
              app.kubernetes.io/part-of=litmus
              app.kubernetes.io/version=2.0.0
              chaosUID=cf6fc3d1-f815-4b87-86b5-687419dd7077
              controller-uid=a300f739-9feb-476c-b7de-698bfc9b3710
              ippool.network.kubesphere.io/name=default-ipv4-ippool
              job-name=pod-delete-085rig
              name=pod-delete
Annotations:  <none>
API Version:  litmuschaos.io/v1alpha1
Kind:         ChaosResult
Metadata:
  Creation Timestamp:  2021-08-16T05:05:48Z
  Generation:          2
  Managed Fields:
    API Version:  litmuschaos.io/v1alpha1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:labels:
          .:
          f:app.kubernetes.io/component:
          f:app.kubernetes.io/part-of:
          f:app.kubernetes.io/version:
          f:chaosUID:
          f:controller-uid:
          f:ippool.network.kubesphere.io/name:
          f:job-name:
          f:name:
      f:spec:
        .:
        f:engine:
        f:experiment:
      f:status:
        .:
        f:experimentStatus:
        f:history:
    Manager:         experiments
    Operation:       Update
    Time:            2021-08-16T05:05:48Z
  Resource Version:  1359518
  UID:               1b8f4207-7956-4639-83cf-78ad21602745
Spec:
  Engine:      nginx-chaos
  Experiment:  pod-delete
Status:
  Experiment Status:
    Fail Step:                 N/A
    Phase:                     Completed
    Probe Success Percentage:  100
    Verdict:                   Pass
  History:
    Failed Runs:   0
    Passed Runs:   1
    Stopped Runs:  0
    Targets:
      Chaos Status:  targeted
      Kind:          deployment
      Name:          nginx
Events:
  Type    Reason   Age   From                     Message
  ----    ------   ----  ----                     -------
  Normal  Awaited  94s   pod-delete-085rig-qzlxg  experiment: pod-delete, Result: Awaited
  Normal  Pass     39s   pod-delete-085rig-qzlxg  experiment: pod-delete, Result: Pass
```

## Uninstallation

You can uninstall Litmus by deleting the namespace.

```console
kubectl delete -f chaosengine.yaml -n nginx
kubectl delete -f rbac.yaml -n nginx
kubectl delete -f https://hub.litmuschaos.io/api/chaos/2.0.0?file=charts/generic/experiments.yaml -n nginx
kubectl delete -f litmus-operator.yaml -n nginx
```

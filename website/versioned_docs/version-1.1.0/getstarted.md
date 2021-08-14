---
id: getstarted
title: Getting Started with Litmus
sidebar_label: Introduction
original_id: getstarted
---

---

## Pre-requisites

Kubernetes 1.11 or later.

## Getting Started

Running chaos on your application involves the following steps:

[Install Litmus](#install-litmus)

[Install Chaos Experiments](#install-chaos-experiments)

[Setup Service Account](#setup-service-account)

[Annotate your application](#annotate-your-application)

[Prepare ChaosEngine](#prepare-chaosengine)

[Run Chaos](#run-chaos)

[Observe chaos results](#observe-chaos-results)

<hr/>

### Install Litmus

```
kubectl apply -f https://litmuschaos.github.io/pages/litmus-operator-v1.1.0.yaml
```

The above command install all the CRDs, required service account configuration, and chaos-operator. Before you start running a chaos experiment, verify if Litmus is installed correctly.

**Verify your installation**

- Verify if the chaos operator is running

```
kubectl get pods -n litmus
```

Expected output:

> chaos-operator-ce-554d6c8f9f-slc8k 1/1 Running 0 6m41s

- Verify if chaos CRDs are installed

```
kubectl get crds | grep chaos
```

Expected output:

> chaosengines.litmuschaos.io 2019-10-02T08:45:25Z
>
> chaosexperiments.litmuschaos.io 2019-10-02T08:45:26Z
>
> chaosresults.litmuschaos.io 2019-10-02T08:45:26Z

- Verify if the chaos api resources are successfully created in the desired (application) namespace.

  _Note_: Sometimes, it can take a few seconds for the resources to be available post the CRD installation

```
kubectl api-resources | grep chaos
```

Expected output:

> chaosengines litmuschaos.io true ChaosEngine
>
> chaosexperiments litmuschaos.io true ChaosExperiment
>
> chaosresults litmuschaos.io true ChaosResult

**NOTE**:

- In this guide, we shall describe the steps to inject container-kill chaos on an nginx application already deployed in the
  nginx namespace. It is a mandatory requirement to ensure that the chaos custom resources (chaosexperiment and chaosengine)
  and the experiment specific serviceaccount are created in the same namespace (typically, the same as the namespace of the
  application under test (AUT), in this case nginx). This is done to ensure that the developers/users of the experiment isolate
  the chaos to their respective work-namespaces in shared environments.

- In all subsequent steps, please follow these instructions by replacing the nginx namespace and labels with that of your
  application.

### Install Chaos Experiments

Chaos experiments contain the actual chaos details. These experiments are installed on your cluster as Kubernetes CRs.
The Chaos Experiments are grouped as Chaos Charts and are published on <a href="https://hub.litmuschaos.io" target="_blank">ChaosHub</a>.

The generic chaos experiments such as `pod-delete`, `container-kill`,` pod-network-latency` are available under Generic Chaos Chart.
This is the first chart you are recommended to install.

```
kubectl apply -f https://hub.litmuschaos.io/api/chaos?file=charts/generic/experiments.yaml -n nginx
```

Verify if the chaos experiments are installed.

```
kubectl get chaosexperiments -n nginx
```

### Setup Service Account

A service account should be created to allow chaosengine to run experiments in your application namespace. Copy the following
into a `rbac.yaml` manifest and run `kubectl apply -f rbac.yaml` to create one such account on the nginx namespace. This serviceaccount
has just enough permissions needed to run the container-kill chaos experiment.

**NOTE**:

- For rbac samples corresponding to other experiments such as, say, pod-delete, please refer the respective experiment folder in
  the [chaos-charts](https://github.com/litmuschaos/chaos-charts/tree/master/charts/generic/pod-delete) repository.

[embedmd]: # 'https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/container-kill/rbac_nginx_getstarted.yaml yaml'

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
    resources: ['pods', 'jobs', 'daemonsets', 'pods/exec', 'chaosengines', 'chaosexperiments', 'chaosresults']
    verbs: ['create', 'list', 'get', 'patch', 'update', 'delete']
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
<strong>NOTE</strong>: 
Litmus supports chaos on deployments, statefulsets & daemonsets. This example refers to a nginx deploymemt. In case
of other types, please use the appropriate resource/resource-name convention (say, `sts/kafka` or `ds/node-device-manager`, for example).  
</div>

```console
kubectl annotate deploy/nginx litmuschaos.io/chaos="true" -n nginx
```

### Prepare ChaosEngine

ChaosEngine connects the application instance to a Chaos Experiment. Copy the following YAML snippet into a file called
`chaosengine.yaml` and update the values of `applabel` , `appns`, `appkind` and `experiments` as per your choice.
Change the `chaosServiceAccount` to the name of service account created in above previous steps.

[embedmd]: # 'https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/container-kill/engine_nginx_getstarted.yaml yaml'

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: nginx
spec:
  annotationCheck: 'true'
  engineState: 'active'
  appinfo:
    appns: 'nginx'
    applabel: 'app=nginx'
    appkind: 'deployment'
  chaosServiceAccount: container-kill-sa
  # use retain to keep the job for debug
  jobCleanUpPolicy: 'delete'
  experiments:
    - name: container-kill
      spec:
        components:
          env:
            # specify the name of the container to be killed
            - name: TARGET_CONTAINER
              value: 'nginx'
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
kubectl apply -f chaosengine.yaml
```

### Observe Chaos results

Describe the ChaosResult CR to know the status of each experiment. The `spec.verdict` is set to `Awaited` when the experiment is in progress, eventually changing to either `Pass` or `Fail`.

<strong> NOTE:</strong> ChaosResult CR name will be `{"<chaos-engine-name>-<chaos-experiment-name>"}`

```console
kubectl describe chaosresult nginx-chaos-container-kill -n nginx
```

## Uninstallation

You can uninstall Litmus by deleting the namespace.

```console
kubectl delete -f https://litmuschaos.github.io/pages/litmus-operator-v1.1.0.yaml
```

## More Chaos Experiments

- For more details on supported chaos experiments and the steps to run them, refer the **Experiments** section.

## Join our community

If you have not joined our community, do join us [here](https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN).

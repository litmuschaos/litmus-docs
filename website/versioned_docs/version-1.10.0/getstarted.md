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

[Observe ChaosResults](#observe-chaos-results)

<hr/>

### Install Litmus

Apply the LitmusChaos Operator manifest:

```
kubectl apply -f https://litmuschaos.github.io/litmus/litmus-operator-v1.10.0.yaml
```

The above command installs all the CRDs, required service account configuration, and chaos-operator.

**Note**: Ensure that you have the right privileges to install the CRDs & setup cluster-wide RBAC policies (by default, the
ChaosOperator watches for Chaos CRs across namespaces)

Alternatively, you can choose to install it with Helm:

- Add the LitmusChaos Helm repo

```
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
```

- Create a Litmus namespace in Kubernetes

```
kubectl create ns litmus
```

- Install the Litmus Helm chart

```
helm install chaos litmuschaos/litmus --namespace=litmus
```

**Note**: Litmus uses Kubernetes CRDs to define chaos intent. Helm3 handles CRDs better than Helm2.
Before you start running a chaos experiment, verify if Litmus is installed correctly.

**Verify your installation**

- Verify if the ChaosOperator is running

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

- In this guide, we shall describe the steps to inject pod-delete chaos on an nginx application already deployed in the
  nginx namespace. It is a mandatory requirement to ensure that the chaos custom resources (chaosexperiment and chaosengine)
  and the experiment specific serviceaccount are created in the same namespace (typically, the same as the namespace of the
  application under test (AUT), in this case nginx). This is done to ensure that the developers/users of the experiment isolate
  the chaos to their respective work-namespaces in shared environments.

- In all subsequent steps, please follow these instructions by replacing the nginx namespace and labels with that of your
  application.

- The ChaosOperator collects some usage metrics (operator installation count & experiment run count) via a google analytics
  hook. This is done in order to gather chaos trends that will help us to improve the project. However, if you would like to
  prevent the collection of the same or are operating in an airgapped environment, you can disable it using the procedure
  suggested [here](https://docs.litmuschaos.io/docs/faq-general/#does-litmus-track-any-usage-metrics-on-the-test-clusters).

### Install Chaos Experiments

Chaos experiments contain the actual chaos details. These experiments are installed on your cluster as Kubernetes CRs.
The Chaos Experiments are grouped as Chaos Charts and are published on <a href="https://hub.litmuschaos.io" target="_blank">ChaosHub</a>.

The generic chaos experiments such as `pod-delete`, `container-kill`,` pod-network-latency` are available under Generic Chaos Chart.
This is the first chart you are recommended to install.

```
kubectl apply -f https://hub.litmuschaos.io/api/chaos/1.10.0?file=charts/generic/experiments.yaml -n nginx
```

Verify if the chaos experiments are installed.

```
kubectl get chaosexperiments -n nginx
```

### Setup Service Account

A service account should be created to allow chaosengine to run experiments in your application namespace. Copy the following
into a `rbac.yaml` manifest and run `kubectl apply -f rbac.yaml` to create one such account on the nginx namespace. This serviceaccount has just enough permissions needed to run the pod-delete chaos experiment.

**NOTE**:

- For rbac samples corresponding to other experiments such as, say, container-kill, please refer the respective experiment folder in
  the [chaos-charts](https://github.com/litmuschaos/chaos-charts/tree/master/charts/generic/container-kill) repository.

[embedmd]: # 'https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.10.x/charts/generic/pod-delete/rbac_nginx_getstarted.yaml yaml'

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-delete-sa
  namespace: nginx
  labels:
    name: pod-delete-sa
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-delete-sa
  namespace: nginx
  labels:
    name: pod-delete-sa
rules:
  - apiGroups: ['', 'litmuschaos.io', 'batch', 'apps']
    resources: ['pods', 'deployments', 'pods/log', 'events', 'jobs', 'chaosengines', 'chaosexperiments', 'chaosresults']
    verbs: ['create', 'list', 'get', 'patch', 'update', 'delete', 'deletecollection']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-delete-sa
  namespace: nginx
  labels:
    name: pod-delete-sa
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

Your application has to be annotated with `litmuschaos.io/chaos="true"`. As a security measure, and also as a means
to reduce blast radius the ChaosOperator checks for this annotation before invoking chaos experiment(s) on the application.
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

<strong> NOTE:</strong> To learn more about the various fields in the ChaosEngine spec and their supported values, refer to [Constructing ChaosEngine](https://docs.litmuschaos.io/docs/chaosengine/)

[embedmd]: # 'https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.10.x/charts/generic/pod-delete/engine_nginx_getstarted.yaml yaml'

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
  # It can be true/false
  annotationCheck: 'true'
  # It can be active/stop
  engineState: 'active'
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ''
  chaosServiceAccount: pod-delete-sa
  monitoring: false
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
```

### Override Default Chaos Experiments Variables

From LitmusChaos v1.1.0, the default environment variable values in chaosexperiments can be overridden by specifying
them in the chaosengine under `experiments.<experiment_name>.spec.components.env` with the desired value. In the
example below, the `TOTAL_CHAOS_DURATION` is being set to a desired value based on use-case.

```console
...
experiments:
    - name: pod-delete
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: '30'

```

### Run Chaos

Apply the ChaosEngine manifest to trigger the experiment.

```console
kubectl apply -f chaosengine.yaml
```

### Observe Chaos results

Describe the ChaosResult CR to know the status of each experiment. The `status.verdict` is set to `Awaited` when the experiment is in progress, eventually changing to either `Pass` or `Fail`.

<strong> NOTE:</strong> ChaosResult CR name will be `&lt;chaos-engine-name&gt;-&lt;chaos-experiment-name&gt;`

```console
kubectl describe chaosresult nginx-chaos-pod-delete -n nginx
```

## Uninstallation

Firstly, delete any active ChaosEngines on the cluster, followed by the deletion of the Operator manifest.

```console
kubectl delete chaosengine --all -n <namespace>
```

```console
kubectl delete -f https://litmuschaos.github.io/litmus/litmus-operator-v1.10.0.yaml
```

**NOTE**

- Ensure that the chaosengine resources are deleted before removal of the chaos-operator deployment via operator manifest.
  Failure to do so can cause the uninstall operation to be "stuck". Refer to the these [steps](https://docs.litmuschaos.io/docs/faq-troubleshooting/#litmus-uninstallation-is-not-successful-and-namespace-is-stuck-in-terminating-state) to resolve this condition and complete the uninstall.

## Troubleshooting

For any issues experienced in running through the the aforementioned steps, refer to the [Troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/) section.

## More Chaos Experiments

- For more details on supported chaos experiments and the steps to run them, refer the respective [Experiment](https://docs.litmuschaos.io/docs/chaoshub/#generic-chaos) docs.

## Join our community

If you have not joined our community, do join us [here](https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN).

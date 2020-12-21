---
id: faq-general
title: The What, Why & How of Litmus
sidebar_label: General
original_id: faq-general
---

---

[Why should I use Litmus? What is its distinctive feature?](#why-should-i-use-litmus-what-is-its-distinctive-feature)

[What type of chaos experiments are supported by Litmus?](#what-type-of-chaos-experiments-are-supported-by-litmus)

[What licensing model does Litmus use?](#what-licensing-model-does-litmus-use)

[What are the prerequisites to get started with Litmus?](#what-are-the-prerequisites-to-get-started-with-litmus)

[How to Install Litmus on the Kubernetes Cluster?](#how-to-install-litmus-on-the-kubernetes-cluster)

[What are the permissions required to run Litmus Chaos Experiments?](#what-are-the-permissions-required-to-run-litmus-chaos-experiments)

[What is the scope of a Litmus Chaos Experiment? ](#what-is-the-scope-of-a-litmus-chaos-experiment)

[How to view and interpret the results of a chaos experiment?](#how-to-view-and-interpret-the-results-of-a-chaos-experiment)

[Do chaos experiments run as a standard set of pods ?](#do-chaos-experiments-run-as-a-standard-set-of-pods)

[Is it mandatory to annotate application deployments for chaos?](#is-it-mandatory-to-annotate-application-deployments-for-chaos)

[How to add Custom Annotations as chaos filters?](#how-to-add-custom-annotations-as-chaos-filters)

[Is it mandatory for the chaosengine and chaos experiment resources to exist in the same namespace?](#is-it-mandatory-for-the-chaosengine-and-chaos-experiment-resources-to-exist-in-the-same-namespace)

[How to get the chaos logs in Litmus?](#how-to-get-the-chaos-logs-in-litmus)

[Does Litmus support generation of events during chaos?](#does-litmus-support-generation-of-events-during-chaos)

[How to stop or abort a chaos experiment?](#how-to-stop-or-abort-a-chaos-experiment)

[Can a chaos experiment be resumed once stopped or aborted?](#can-a-chaos-experiment-be-resumed-once-stopped-or-aborted)

[How to restart chaosengine after graceful completion](#how-to-restart-chaosengine-after-graceful-completion)

[Does Litmus track any usage metrics on the deployment clusters?](#does-litmus-track-any-usage-metrics-on-the-test-clusters)

<hr/>

### Why should I use Litmus? What is its distinctive feature?

Litmus is a toolset to do cloud-native chaos engineering. Litmus provides tools to orchestrate chaos
on Kubernetes to help developers and SREs find weaknesses in their application deployments. Litmus can
be used to run chaos experiments initially in the staging environment and eventually in production to
find bugs, vulnerabilities. Fixing the weaknesses leads to increased resilience of the system.
Litmus adopts a “Kubernetes-native” approach to define chaos intent in a declarative manner via custom
resources.

### What type of chaos experiments are supported by Litmus?

Litmus broadly defines Kubernetes chaos experiments into two categories: application or pod-level chaos
experiments and platform or infra-level chaos experiments. The former includes pod-delete, container-kill,
pod-cpu-hog, pod-network-loss etc., while the latter includes node-drain, disk-loss, node-cpu-hog etc.,
The infra chaos experiments typically have a higher blast radius and impacts more than one application
deployed on the Kubernetes cluster. Litmus also categorizes experiments on the basis of the applications,
with the experiments consisting of app-specific health checks. For example, OpenEBS, Kafka, CoreDNS.

For a full list of supported chaos experiments, visit: https://hub.litmuschaos.io

### What licensing model does Litmus use?

Litmus is developed under Apache License 2.0 license at the project level. Some components of the projects
are derived from the other Open Source projects and are distributed under their respective licenses.

### What are the prerequisites to get started with Litmus?

For getting started with Litmus the only prerequisites is to have Kubernetes 1.11+ cluster. While most
pod/container level experiments are supported on any Kubernetes platform, some of the infrastructure chaos
experiments are supported on specific platforms. To find the list of supported platforms for an experiment,
view the "Platforms" section on the sidebar in the experiment page.

### How to Install Litmus on the Kubernetes Cluster?

You can install/deploy stable litmus using this command:

```console
kubectl apply -f https://openebs.github.io/charts/openebs-operator.yaml
```

### What are the permissions required to run Litmus Chaos Experiments?

By default, the Litmus operator uses the “litmus” serviceaccount that is bound to a ClusterRole, in order
to watch for the ChaosEngine resource across namespaces. However, the experiments themselves are associated
with “chaosServiceAccounts” which are created by the developers with bare-minimum permissions necessary to
execute the experiment in question. Visit the [chaos-charts](https://github.com/litmuschaos/chaos-charts) repo
to view the experiment-specific rbac permissions. For example, here are the [permissions](https://github.com/litmuschaos/chaos-charts/blob/master/charts/generic/container-kill/rbac.yaml) for container-kill chaos.

### What is the scope of a Litmus Chaos Experiment?

The chaos CRs (chaosexperiment, chaosengine, chaosresults) themselves are namespace scoped and are installed
in the same namespace as that of the target application. While most of the experiments can be executed with
service accounts mapped to namespaced roles, some infra chaos experiments typically perform health checks of
applications across namespaces & therefore need their serviceaccounts mapped to ClusterRoles.

### How to get started with running chaos experiments using Litmus?

Litmus has a low entry barrier and is easy to install/use. Typically, it involves installing the chaos-operator,
chaos experiment CRs from the [charthub](https://hub.litmuschaos.io), annotating an application for chaos and creating
a chaosengine CR to map your application instance with a desired chaos experiment. Refer to
the [getting started](https://docs.litmuschaos.io/docs/getstarted/) documentation to learn more on how to run a
simple chaos experiment.

### How to view and interpret the results of a chaos experiment?

The results of a chaos experiment can be obtained from the verdict property of the chaosresult custom resource.
If the verdict is `Pass`, it means that the application under test is resilient to the chaos injected.
Alternatively, `Fail` reflects that the application is not resilient enough to the injected chaos, and indicates
the need for a relook into the deployment sanity or possible application bugs/issues.

```console
kubectl describe chaosresult <chaosengine-name>-<chaos-experiment> -n <namespace>
```

The status of the experiment can also be gauged by the “status” property of the ChaosEngine.

```console
Kubectl describe chaosengine <chaosengne-name> -n <namespace>
```

### Do chaos experiments run as a standard set of pods?

The chaos experiment (triggered after creation of the chaosEngine resource) workflow consists of launching the “chaos-runner”
pod, which is an umbrella executor of different chaos experiments listed in the engine. The chaos-runner creates one pod (job)
per each experiment to run the actual experiment business logic, and also manages the lifecycle of these experiment pods
(performs functions such as experiment dependencies validation, job cleanup, patching of status back into chaosEngine etc.,).
Optionally, a monitor pod is created to export the chaos metrics. Together, these 3 pods are a standard set created upon execution
of the experiment. The experiment job, in turn may spawn dependent (helper) resources if
necessary to run the experiments, but this depends on the experiment selected, chaos libraries chosen etc.,

### Is it mandatory to annotate application deployments for chaos?

Typically applications are expected to be annotated with `litmuschaos.io/chaos="true"` to lend themselves to chaos.
This is in order to support selection of the right applications with similar labels in a namespaces, thereby isolating
the application under test (AUT) & reduce the blast radius. It is also helpful for supporting automated execution
(say, via cron) as a background service. However, in cases where the app deployment specifications are sacrosanct and
not expected to be modified, or in cases where annotating a single application for chaos when the experiment itself is
known to have a higher blast radius doesn’t make sense (ex: infra chaos), the annotation check can be disabled via the
chaosEngine tunable `annotationCheck` (`.spec.annotationCheck: false`).

### How to add Custom Annotations as chaos filters?

Currently Litmus allows you to set your own/custom keys for Annotation filters, the value being `true`/`false`. To use your custom annotation, add this key under an ENV named as `CUSTOM_ANNOTATION` in chaos operator deployment. A sample chaos-operator deployment spec is provided here for reference:

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chaos-operator-ce
  namespace: litmus
spec:
  replicas: 1
  selector:
    matchLabels:
      name: chaos-operator
  template:
    metadata:
      labels:
        name: chaos-operator
    spec:
      serviceAccountName: litmus
      containers:
        - name: chaos-operator
          # 'latest' tag corresponds to the latest released image
          image: litmuschaos/chaos-operator:latest
          command:
            - chaos-operator
          imagePullPolicy: Always
          env:
            - name: CUSTOM_ANNOTATION
              value: "mayadata.io/chaos"
            - name: CHAOS_RUNNER_IMAGE
              value: "litmuschaos/chaos-runner:latest"
            - name: WATCH_NAMESPACE
              value:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: OPERATOR_NAME
              value: "chaos-operator"
```

### Is it mandatory for the chaosengine and chaos experiment resources to exist in the same namespace?

Yes. As of today, the chaos resources are expected to co-exist in the same namespace, which, typically is also the
application's (AUT) namespace.

### How to get the chaos logs in Litmus?

The chaos logs can be viewed in the following manner.

To view the successful launch/removal of chaos resources upon engine creation, for identification of
application under test (AUT) etc., view the chaos-operator logs:

```console
kubectl logs -f <chaos-operator-(hash)-(hash)>-runner -n litmus
```

To view lifecycle management logs of a given (or set of) chaos experiments, view the chaos-runner logs:

```console
kubectl logs -f <chaosengine_name>-runner -n <application_namespace>
```

To view the chaos logs itself (details of experiment chaos injection, application health checks et al),
view the experiment pod logs:

```console
kubectl logs -f <experiment_name_(hash)_(hash)> -n <application_namespace>
```

### Does Litmus support generation of events during chaos?

The chaos-operator generates Kubernetes events to signify the creation of removal of chaos resources over the
course of a chaos experiment, which can be obtained by running the following command:

```console
kubectl describe chaosengine <chaosengine-name> -n <namespace>
```

Note: Efforts are underway to add more events around chaos injection in subsequent releases.

### How to stop or abort a chaos experiment?

A chaos experiment can be stopped/aborted inflight by patching the `.spec.engineState` property of the chaosengine
to `stop` . This will delete all the chaos resources associated with the engine/experiment at once.

```console
kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"stop"}}'
```

The same effect will be caused by deleting the respective chaosengine resource.

### Can a chaos experiment be resumed once stopped or aborted?

Once stopped/aborted, patching the chaosengine `.spec.engineState` with `active` causes the experiment to be re-executed. Another way is to re-apply the chaos engine YAML, this will delete all stale chaos resources, and restart chaos engine lifecycle.
However, support is yet to be added for saving state and resuming an in-flight experiment (i.e., execute
pending iterations etc.,)

```console
kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"active"}}'
```

### How to restart chaosengine after graceful completion?

To restart chaosengine, check the `.spec.engineState`, which should be equal to `stop`, which means your chaosengine has gracefully completed, or forcefully aborted. In this case, restart is quite easy, as you can re-apply the chaosengine YAML to restart it. This will remove all stale chaos resources linked to this chaosengine, and restart its own lifecycle.

### Does Litmus support any chaos metrics for experiments?

Litmus provides a basic set of prometheus metrics indicating the total count of chaos experiments, passed/failed
experiments and individual status of experiments specified in the ChaosEngine, which can be queried against the monitor
pod. Work to enhance and improve this is underway. The default mode is to run experiments with `monitoring: false`.

### Does Litmus track any usage metrics on the test clusters?

By default, the installation count of chaos-operator & run count of a given chaos experiment is collected as part
of general analytics to gauge user adoption & chaos trends. However, if you wish to inhibit this, please use the following
ENV setting on the chaos-operator deployment:

```console
env:
  name: ANALYTICS
  value: 'FALSE'
```

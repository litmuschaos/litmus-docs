---
id: faq-troubleshooting
title: Troubleshooting Litmus
sidebar_label: Troubleshooting
original_id: faq-troubleshooting
---

---

[The Litmus chaos operator is seen to be in CrashLoopBackOff state immediately after installation?](#the-litmus-chaos-operator-is-seen-to-be-in-crashloopbackOff-state-immediately-after-installation)

[Nothing happens (no pods created) when the chaosengine resource is created?](#nothing-happens-no-pods-created-when-the-chaosengine-resource-is-created)

[The chaos-runner pod enters completed state seconds after getting created. No experiment jobs are created?](#the-chaos-runner-pod-enters-completed-state-seconds-after-getting-created-no-experiment-jobs-are-created)

[The experiment pod enters completed state w/o the desired chaos being injected?](#the-experiment-pod-enters-completed-state-wo-the-desired-chaos-being-injected)

[Scheduler not forming chaosengines for type=repeat?](#scheduler-not-forming-chaosengines-for-type=repeat)

[Litmus uninstallation is not successful and namespace is stuck in terminating state?](#litmus-uninstallation-is-not-successful-and-namespace-is-stuck-in-terminating-state)

<hr/>

### The Litmus chaos operator is seen to be in CrashLoopBackOff state immediately after installation?

Verify if the ChaosEngine custom resource definition (CRD) has been installed in the cluster. This can be
verified with the following commands:

```console
kubectl get crds | grep chaos
```

```console
kubectl api-resources | grep chaos
```

If not created, install it from [here](https://github.com/litmuschaos/chaos-operator/blob/master/deploy/crds/chaosengine_crd.yaml)

### Nothing happens (no pods created) when the chaosengine resource is created?

If the ChaosEngine creation results in no action at all, check the logs of the chaos-operator pod using
the following command to get more details (on failed creation of chaos resources). The below example uses litmus namespace,
which is the default mode of installation. Please provide the namespace into which the operator has been deployed:

```console
kubectl logs -f <chaos-operator-(hash)-(hash)>-runner -n litmus
```

Some of the possible reasons include:

- The annotationCheck is set to `true` in the ChaosEngine spec, but the application deployment (AUT) has not
  been annotated for chaos. If so, please add it using the following command:

  ```console
  kubectl annotate <deploy-type>/<application_name> litmuschaos.io/chaos="true"
  ```

- The annotationCheck is set to `true` in the ChaosEngine spec and there are multiple chaos candidates that
  share the same label (as provided in the `.spec.appinfo` of the ChaosEngine) and are also annotated for chaos.
  If so, please provide a unique label for the AUT, or remove annotations on other applications with the same label.
  Litmus, by default, doesn't allow selection of multiple applications. If this is a requirement, set the
  annotationCheck to `false`.

  ```console
  kubectl annotate <deploy-type>/<application_name> litmuschaos.io/chaos-
  ```

- The ChaosEngine has the `.spec.engineState` set to `stop`, which causes the operator to refrain from creating chaos
  resources. While it is an unlikely scenario, it is possible to reuse a previously modified ChaosEngine manifest.

- Verify if the service account used by the Litmus chaos operator has enough permissions to launch pods/services
  (this is available by default if the manifests suggested by the docs have been used).

### The chaos-runner pod enters completed state seconds after getting created. No experiment jobs are created?

If the chaos-runner enters completed state immediately post creation, i.e., the creation of experiment resources is
unsuccessful, check the logs of the chaos-runner pod logs.

```console
kubectl logs -f <chaosengine_name>-runner -n <application_namespace>
```

Some of the possible reasons may include:

- The ChaosExperiment CR for the experiment (name) specified in the ChaosEngine .spec.experiments list is not installed.
  If so, please install the desired experiment from the [chaoshub](https://hub.litmuschaos.io)

- The dependent resources for the ChaosExperiment, such as configmap & secret volumes (as specified in the ChaosExperiment CR
  or the ChaosEngine CR) may not be present in the cluster (or in the desired namespace). The runner pod doesn’t proceed
  with creation of experiment resources if the dependencies are unavailable.

- The chaosServiceAccount specified in the ChaosEngine CR doesn’t have sufficient permissions to create the experiment
  resources (For existing experiments, appropriate rbac manifests are already provided in chaos-charts/docs).

### The experiment pod enters completed state w/o the desired chaos being injected?

If the experiment pod enters completed state immediately (or in a few seconds) after creation w/o injecting the desired chaos,
check the logs of the chaos-experiment pod.

```console
kubectl logs -f <experiment_name_(hash)_(hash)> -n <application_namespace>
```

Some of the possible reasons may include:

- The ChaosExperiment CR or the ChaosEngine CR doesn’t include mandatory ENVs (or consists of incorrect values/info)
  needed by the experiment. Note that each experiment (see docs) specifies a mandatory set of ENVs along with some
  optional ones, which are necessary for successful execution of the experiment.

- The chaosServiceAccount specified in the ChaosEngine CR doesn’t have sufficient permissions to create the experiment
  helper-resources (i.e., some experiments in turn create other K8s resources like jobs/daemonsets/deployments etc..,
  For existing experiments, appropriate rbac manifests are already provided in chaos-charts/docs).

- The application's (AUT) unique label provided in the ChaosEngine is set only at the parent resource metadata but not
  propagated to the pod template spec. Note that the Operator uses this label to filter chaos candidates at the parent
  resource level (deployment/statefulset/daemonset) but the experiment pod uses this to pick application **pods** into
  which the chaos is injected.

### Scheduler not forming chaosengines for type=repeat?

If the chaosschedule has been created successfully created in the cluster and chaosengine is not being formed. The most common problem is that either start or end time has been wrongly specified. We should verify the times.
We can identify that if this is the problem or not by changing type=now. If the chaosengine is formed successfully then the problem is with the specified time ranges, if chaosengine is still not formed, then the problem is with engineSpec.
Try to create a chaosengine with the same engineSpec.

### Litmus uninstallation is not successful and namespace is stuck in terminating state?

Under typical operating conditions, the Chaos Operator makes use of finalizers to ensure that the ChaosEngine is deleted
only after chaos resources (chaos-runner, experiment pod, any other helper pods) are removed.

When uninstalling Litmus via the operator manifest (which contains the namespace, operator, crd specifictions in a single YAML)
without deleting the existing chaosengine resources first, the chaos operator deployment may get deleted before the CRD removal
is attempted. Since the stale chaosengines have the finalizer present on them, their deletion (triggered by the CRD delete) and
by consequence, the deletion of the chaosengine CRD itself is "stuck".

In such cases, manually remove the finalizer entries on the stale chaosengines to facilitate their successful delete. To do this,
run:

`kubectl edit chaosengine <chaosengine-name> -n <namespace>` and remove the finalizer entry `chaosengine.litmuschaos.io/finalizer`

Repeat this on all the stale chaosengine CRs to remove the CRDs successfully & complete uninstallation process.

If however, the "litmus"namespace deletion remains stuck despite the above actions, follow the procedure described
[here](https://success.docker.com/article/kubernetes-namespace-stuck-in-terminating) to complete the uninstallation.

---
id: chaos-workflow
title: Chaos Experiment
sidebar_label: Chaos Experiment
---

---

**Chaos Experiment** is a set of different operations coupled together to achieve desired chaos impact on a Kubernetes Cluster. <br/>
It is useful in automating a series of pre-conditioning steps or action which is necessary to be performed before triggering the chaos injection.<br/>
A Chaos Experiment can also be used to perform different operations parallelly to achieve a desired chaos impact.

:::note
With the latest release of LitmusChaos 3.0.0:

<li>The term <b>Chaos Experiment</b> has been changed to <b>Chaos Fault.</b> </li>
<li>The term <b>Chaos Scenario/Workflow</b> has been changed to <b>Chaos Experiment.</b></li>
:::

## Prerequisites

The following are required before creating a Chaos Experiment:

- [ChaosCenter](../getting-started/resources.md#chaoscenter)
- [Chaos Infrastructure](../getting-started/resources.md#chaosagents)
- [Probes](probes.md)

## How do we define and execute a Chaos Experiment ?

LitmusChaos leverages the popular GitOps tool **Argo** to achieve this goal. Argo enables the creation of different chaos experiments together in form of chaos experiments which are extremely simple and efficient to use.<br/>
With the help of **ChaosCenter**, chaos experiments with different types of faults can be created. In a Chaos Experiment, the faults can be set to execute in parallel to each other and the user can tune the chaos experiment by adding additional steps to simulate a desired fault that might occur in the production stage.

### Life Cycle of a Chaos Experiment

Here is a sample pod-delete chaos experiment from ChaosCenter.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  name: custom-chaos-workflow-1627980541
  namespace: litmus
  labels:
    subject: custom-chaos-workflow_litmus
spec:
  arguments:
    parameters:
      - name: adminModeNamespace
        value: litmus
  entrypoint: custom-chaos
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
  serviceAccountName: argo-chaos
  templates:
    - name: custom-chaos
      steps:
        - - name: install-chaos-experiments
            template: install-chaos-experiments
        - - name: pod-delete
            template: pod-delete
        - - name: revert-chaos
            template: revert-chaos
    - name: install-chaos-experiments
      inputs:
        artifacts:
          - name: pod-delete
            path: /tmp/pod-delete.yaml
            raw:
              data: >
                apiVersion: litmuschaos.io/v1alpha1

                description:
                  message: |
                    Deletes a pod belonging to a deployment/statefulset/daemonset
                kind: ChaosExperiment

                metadata:
                  name: pod-delete
                  labels:
                    name: pod-delete
                    app.kubernetes.io/part-of: litmus
                    app.kubernetes.io/component: chaosexperiment
                    app.kubernetes.io/version: 3.0.0
                spec:
                  definition:
                    scope: Namespaced
                    permissions:
                      - apiGroups:
                          - ""
                          - apps
                          - apps.openshift.io
                          - argoproj.io
                          - batch
                          - litmuschaos.io
                        resources:
                          - deployments
                          - jobs
                          - pods
                          - pods/log
                          - replicationcontrollers
                          - deployments
                          - statefulsets
                          - daemonsets
                          - replicasets
                          - deploymentconfigs
                          - rollouts
                          - pods/exec
                          - events
                          - chaosengines
                          - chaosexperiments
                          - chaosresults
                        verbs:
                          - create
                          - list
                          - get
                          - patch
                          - update
                          - delete
                          - deletecollection
                    image: litmuschaos/go-runner:3.0.0
                    imagePullPolicy: Always
                    args:
                      - -c
                      - ./experiments -name pod-delete
                    command:
                      - /bin/bash
                    env:
                      - name: TOTAL_CHAOS_DURATION
                        value: "15"
                      - name: RAMP_TIME
                        value: ""
                      - name: FORCE
                        value: "true"
                      - name: CHAOS_INTERVAL
                        value: "5"
                      - name: PODS_AFFECTED_PERC
                        value: ""
                      - name: LIB
                        value: litmus
                      - name: TARGET_PODS
                        value: ""
                      - name: SEQUENCE
                        value: parallel
                    labels:
                      name: pod-delete
                      app.kubernetes.io/part-of: litmus
                      app.kubernetes.io/component: experiment-job
                      app.kubernetes.io/version: 3.0.0
      container:
        args:
          - kubectl apply -f /tmp/pod-delete.yaml -n
            {{workflow.parameters.adminModeNamespace}} |  sleep 30
        command:
          - sh
          - -c
        image: litmuschaos/k8s:latest
    - name: pod-delete
      inputs:
        artifacts:
          - name: pod-delete
            path: /tmp/chaosengine-pod-delete.yaml
            raw:
              data: |
                apiVersion: litmuschaos.io/v1alpha1
                kind: ChaosEngine
                metadata:
                  namespace: "{{workflow.parameters.adminModeNamespace}}"
                  generateName: pod-delete
                  labels:
                    instance_id: 86a4f130-d99b-4e91-b34b-8f9eee22cb63
                spec:
                  appinfo:
                    appns: default
                    applabel: app=nginx
                    appkind: deployment
                  jobCleanUpPolicy: retain
                  engineState: active
                  chaosServiceAccount: litmus-admin
                  experiments:
                    - name: pod-delete
                      spec:
                        components:
                          env:
                            - name: TOTAL_CHAOS_DURATION
                              value: "30"
                            - name: CHAOS_INTERVAL
                              value: "10"
                            - name: FORCE
                              value: "false"
                            - name: PODS_AFFECTED_PERC
                              value: ""
      container:
        args:
          - -file=/tmp/chaosengine-pod-delete.yaml
          - -saveName=/tmp/engine-name
        image: litmuschaos/litmus-checker:latest
    - name: revert-chaos
      container:
        image: litmuschaos/k8s:latest
        command:
          - sh
          - -c
        args:
          - "kubectl delete chaosengine -l 'instance_id in
            (86a4f130-d99b-4e91-b34b-8f9eee22cb63, )' -n
            {{workflow.parameters.adminModeNamespace}} "
  podGC:
    strategy: OnWorkflowCompletion
```

The structure of a chaos experiment is similar to that of a Kubernetes Object. It consists of mandatory fields like `apiVersion`, `kind`, `metadata`, `spec`.

The **spec** in a Chaos Experiment is where the different steps are mentioned and the overall life cycle of the chaos experiment is described.
We can see different `templates` are present in the spec of a chaos experiment.

```
templates:
    - name: custom-chaos
      steps:
        - - name: install-chaos-experiments
            template: install-chaos-experiments
        - - name: pod-delete
            template: pod-delete
        - - name: revert-chaos
            template: revert-chaos
```

Here in this template, we can see different steps are present.
These include installing the chaos faults, executing the chaos engine of the faults, and at the end we have the revert chaos step which deletes/removes the resources that were created as part of the chaos experiment.

Some additional checks can be added with the faults in the form of probes. These probes are defined in the ChaosEngines of the faults and are updated when the fault execution takes place.
The overall chaos experiment result can be viewed with the ChaosResult CRD which contains the `verdict` and the `probeSuccessPercentage` (a ratio of successful checks v/s total probes).

## What is a run?

A chaos experiment run can be defined as a single/one-time execution of the chaos experiment. There can be multiple runs of a single chaos experiment. If the chaos experiment consists of a cron syntax, it will run periodically according to the cron provided in the chaos experiment.

## What is Resilience Score?

**Resiliency score** is an overall measure of the resiliency of a system for a given chaos experiment, which is obtained upon executing the constituent experiment faults on that system.

While creating a chaos experiment, certain weights are assigned to all the faults present in the chaos experiment. These weights signify the priority/importance of the fault. The higher the weight, the more significant the fault is.

In ChaosCenter, the weight priority is generally divided into three sections:

- 0-3: Low Priority
- 4-6: Medium Priority
- 7-10: High Priority

Once a weight has been assigned to the fault, we look for the Probe Success Percentage for that fault itself (Post Chaos) and calculate the total resilience result for that fault as a multiplication of the weight given and the probe success percentage returned after the Chaos Run.

```
Total Resilience for one single fault = (Weight Given to that fault * Probe Success Percentage)
Overall Resilience Score = Total Test Result / Sum of the assigned weights of the faults
```

## What is a Cron Chaos Experiment?

Cron Chaos Experiment is a type of chaos experiment that runs on a pre-defined schedule. It consists of a mandatory field `spec.schedule`. A cron syntax is provided in this field at which the chaos experiment execution takes
place.

Here's a sample Cron Chaos Experiment for Podtato-Head application:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: CronWorkflow
metadata:
  name: podtato-head-1628058291
  namespace: litmus
  labels:
    subject: podtato-head_litmus
spec:
  schedule: 10 0-23 * * *
  concurrencyPolicy: Forbid
  startingDeadlineSeconds: 0
  workflowSpec:
    entrypoint: argowf-chaos
    serviceAccountName: argo-chaos
    securityContext:
      runAsUser: 1000
      runAsNonRoot: true
    arguments:
      parameters:
        - name: adminModeNamespace
          value: litmus
    templates:
      - name: argowf-chaos
        steps:
          - - name: install-application
              template: install-application
          - - name: install-chaos-experiments
              template: install-chaos-experiments
          - - name: pod-delete
              template: pod-delete
          - - name: revert-chaos
              template: revert-chaos
            - name: delete-application
              template: delete-application
      - name: install-application
        container:
          image: litmuschaos/litmus-app-deployer:latest
          args:
            - -namespace={{workflow.parameters.adminModeNamespace}}
            - -typeName=resilient
            - -operation=apply
            - -timeout=400
            - -app=podtato-head
            - -scope=namespace
      - name: install-chaos-experiments
        container:
          image: litmuschaos/k8s:latest
          command:
            - sh
            - -c
          args:
            - kubectl apply -f
              https://hub.litmuschaos.io/api/chaos/1.13.7?file=charts/generic/experiments.yaml
              -n {{workflow.parameters.adminModeNamespace}} ; sleep 30
      - name: pod-delete
        inputs:
          artifacts:
            - name: pod-delete
              path: /tmp/chaosengine.yaml
              raw:
                data: >
                  apiVersion: litmuschaos.io/v1alpha1

                  kind: ChaosEngine

                  metadata:
                    namespace: "{{workflow.parameters.adminModeNamespace}}"
                    labels:
                      instance_id: 1b7ec920-75f9-4398-b4c3-9c3a5d7fd5c2
                    generateName: podtato-main-pod-delete-chaos
                  spec:
                    appinfo:
                      appns: "{{workflow.parameters.adminModeNamespace}}"
                      applabel: name=podtato-main
                      appkind: deployment
                    engineState: active
                    chaosServiceAccount: litmus-admin
                    jobCleanUpPolicy: retain
                    components:
                      runner:
                        imagePullPolicy: Always
                    experiments:
                      - name: pod-delete
                        spec:
                          probe:
                            - name: check-podtato-main-access-url
                              type: httpProbe
                              httpProbe/inputs:
                                url: http://podtato-main.{{workflow.parameters.adminModeNamespace}}.svc.cluster.local:9000
                                insecureSkipVerify: false
                                method:
                                  get:
                                    criteria: ==
                                    responseCode: "200"
                              mode: Continuous
                              runProperties:
                                probeTimeout: 1
                                interval: 1
                                retry: 1
                          components:
                            env:
                              - name: TOTAL_CHAOS_DURATION
                                value: "30"
                              - name: CHAOS_INTERVAL
                                value: "10"
                              - name: FORCE
                                value: "false"
        container:
          image: litmuschaos/litmus-checker:latest
          args:
            - -file=/tmp/chaosengine.yaml
            - -saveName=/tmp/engine-name
      - name: delete-application
        container:
          image: litmuschaos/litmus-app-deployer:latest
          args:
            - -namespace={{workflow.parameters.adminModeNamespace}}
            - -typeName=resilient
            - -operation=delete
            - -app=podtato-head
      - name: revert-chaos
        container:
          image: litmuschaos/k8s:latest
          command:
            - sh
            - -c
          args:
            - "kubectl delete chaosengine -l 'instance_id in
              (1b7ec920-75f9-4398-b4c3-9c3a5d7fd5c2, )' -n
              {{workflow.parameters.adminModeNamespace}} "
  timezone: Asia/Calcutta
```

In the above chaos experiment, we can see the cron syntax at `spec.schedule` is

```
spec:
  schedule: 10 0-23 * * *
```

This means the chaos experiment will be executed at the 10th minute of every hour.

A chaos experiment can be changed into Cron Chaos Experiment from the ChaosCenter.
While scheduling a chaos experiment, in the `Schedule` step, there are few options as part of Recurring Schedules. These include:

- Every hour
- Every Day
- Every Week
- Every Month

## Summary

A chaos experiment is a combination of different steps combined together to perform a specific chaos use-case on a Kubernetes system. These steps can include installing fault steps, ChaosEngine CR for target selection, revert-chaos steps, etc. Chaos Experiments can be scheduled for a later time with the help of Cron Chaos Experiments.
These chaos experiments consist of a cron syntax that is used for scheduling a chaos experiment. Once the chaos experiment execution is completed, the resiliency of the targeted application is calculated. Several weights are assigned to different faults in the chaos experiment. These weights are used along with the ProbeSuccessPercentage to find out the resiliency score.

## Learn More

- [Explore Probes](probes.md)
- [Visualize a Chaos Experiment](visualize-experiment.md)

---
id: construct-workflow
title: Construct Workflow YAML without ChaosCenter
sidebar_label: Construct Workflow YAML
---

---

**Chaos Workflow** is a set of different operations coupled together to achieve desired chaos imapact on a Kubernetes Cluster. <br/>
A basic chaos workflow consists of these steps:

1. Install ChaosExperiment
2. Install ChaosEngine
3. Revert Chaos

## Before we begin

To construct a Chaos Workflow without ChaosCenter, make sure you are aware of [Chaos Workflow](../concepts/chaos-workflow.md), [ChaosEngine CR](../concepts/chaos-engine.md) and the different steps present in it.

## Steps to Construct a Chaos Workflow

LitmusChaos leverages the popular workflow and GitOps tool **Argo** to achieve this goal. Argo enables the orchestration of different chaos scenarios together in the form of workflow which is extremly simple and efficient to use.<br/>

The structure of a chaos workflow is similar to that of a Kubernetes Object. It consists of the mandatory fields like `apiVersion`, `kind`, `metadata`, `spec`.

Few additional terms in an Argo workflows are:

1. **Template** : It consists of different steps with their specific operations.

```yaml
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

2. **Steps** : It is a single step inside a workflow which runs a container based on the input parameters.
   These can also be sequenced parallely.

```yaml
steps:
  - - name: install-chaos-experiments
      template: install-chaos-experiments
  - - name: pod-delete
      template: pod-delete
    - name: pod-cpu-hog
      template: pod-cpu-hog
  - - name: revert-chaos
      template: revert-chaos
```

3. **Entrypoint** : The first step that executes in a workflow is called its entrypoint.

```yaml
entrypoint: custom-chaos
```

Here, the template with the name `custom-chaos` will be executed first.

4. **Artifacts** : Artifacts are defined as the files saved by the containers in each step.

```yaml
- name: install-chaos-experiments
      inputs:
        artifacts:
          - name: pod-delete
            path: /tmp/pod-delete.yaml
            raw:
              data: >
                apiVersion: litmuschaos.io/v1alpha1

                description:
                  message: |...
```

Once the workflow is constructed, it should look like this:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  name: pod-delete-experiment
  namespace: litmus
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
                    app.kubernetes.io/version: 1.13.8
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
                    image: litmuschaos/go-runner:1.13.8
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
                      app.kubernetes.io/version: 1.13.8
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
```

## Install Experiment

1. ### ChaosExperiment CR:

   The `install-experiment` step consists of ChaosExperiment CR in its artifact.
   ChaosExperiment CR is the heart of LitmusChaos and contains the low-level execution information. They serve as off-the-shelf templates that one needs to "pull" (install on the cluster) before including them as part of chaos run against any target applications (the binding being defined in the ChaosEngine). The experiments are installed on the cluster as Kubernetes custom resources and are designed to hold granular details of the experiment such as image, library, necessary permissions, chaos parameters (set to their default values). Most of the ChaosExperiment parameters are essentially tunables that can be overridden from the ChaosEngine resource.

2. ### ChaosEngine CR:
   The ChaosEngine is the main user-facing chaos custom resource with a namespace scope and is designed to hold information around how the chaos experiments are executed. It connects an application instance with one or more chaos experiments while allowing the users to specify run level details (override experiment defaults, provide new environment variables and volumes, options to delete or retain experiment pods, etc.,). This CR is also updated/patched with the status of the chaos experiments, making it the single source of truth with respect to the chaos.

## Resources

- The ChaosExperiment CR and ChaosEngine CR of different experiments are available at **[ChaosHub](http://hub.litmuschaos.io/)**.

<iframe width="560" height="315" src="https://www.youtube.com/embed/dan0AXO_soY?start=310" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/xLjTx8lqTuQ?start=1163" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn More

- [What are the different Probes](../concepts/probes.md)
- [What is ChaosResult](../concepts/chaos-result.md)

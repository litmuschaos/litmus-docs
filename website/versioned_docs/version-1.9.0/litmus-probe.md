---
id: litmus-probe
title: Declarative Approach to Chaos Hypothesis using Litmus Probes
sidebar_label: Litmus Probe
original_id: litmus-probe
---
------

## Litmus Probes

Litmus probes are pluggable checks that can be defined within the ChaosEngine for any chaos experiment. The experiment pods execute these checks based on the mode they are defined in & factor their success as necessary conditions in determining the verdict of the experiment (along with the standard “in-built” checks). 

Litmus currently supports three types of probes: 

- **httpProbe:** To query health/downstream URIs
- **cmdProbe:** To execute any user-desired health-check function implemented as a shell command
- **k8sProbe:** To perform CRUD operations against native & custom Kubernetes resources

These probes can be used in isolation or in several combinations to achieve the desired checks. While the `httpProbe` & `k8sProbe` are fully declarative in the way they are conceived, the `cmdProbe` expects the user to provide a shell command to implement checks that are highly specific to the application use case.

The probes can be set up to run in different modes: 

- **SoT:** Executed at the Start of Test as a pre-chaos check
- **EoT:** Executed at the End of Test as a post-chaos check
- **Edge:** Executed both, before and after the chaos 
- **Continuous:** The probe is executed continuously, with a specified polling interval during the chaos injection. 

All probes share some common attributes:

- **probeTimeout:** Represents the time limit for the probe to execute the check specified and return the expected data. 
- **retry:** The number of times a check is re-run upon failure in the first attempt before declaring the probe status as failed. 
- **interval:** The period between subsequent retries 


## Types of Litmus Probes

### httpProbe

The `httpProbe` allows developers to specify a URL which the experiment uses to gauge health/service availability (or other custom conditions) as part of the entry/exit criteria. The received status code is mapped against an expected status. It can be defined at `.spec.experiments[].spec.probe` the path inside ChaosEngine.

```yaml
probe:
- name: "check-frontend-access-url"
  type: "httpProbe"
  httpProbe/inputs:
    url: "<url>"
    expectedResponseCode: "200"
  mode: "Continuous"
  runProperties:
    probeTimeout: 5
    interval: 5
    retry: 1
    probePollingInterval: 2
```
The `httpProbe` is better used in the Continuous mode of operation as a parallel liveness indicator of a target or downstream application. It uses the `probePollingInterval` property to specify the polling interval for the access checks. 

### cmdProbe

The `cmdProbe` allows developers to run shell commands and match the resulting output as part of the entry/exit criteria. The intent behind this probe was to allow users to implement a non-standard & imperative way for expressing their hypothesis. For example, the cmdProbe enables you to check for specific data within a database, parse the value out of a JSON blob being dumped into a certain path or check for the existence of a particular string in the service logs. 

In order to enable this behaviour, the probe supports an inline mode in which the command is run from within the experiment image as well as a source mode, where the command execution is carried out from within a new pod whose image can be specified. While inline is preferred for simple shell commands , source mode can be used when application-specific binaries are required. The `cmdProbe` can be defined at `.spec.experiments[].spec.probe` the path inside the ChaosEngine.

```yaml
probe:
- name: "check-database-integrity"
  type: "cmdProbe"
  cmdProbe/inputs:
    command: "<command>"
    expectedResult: "<expected-result>"
    source: "<repo>/<tag>" # it can be “inline” or any image
  mode: "Edge"
  runProperties:
    probeTimeout: 5
    interval: 5
    retry: 1
```

### k8sProbe

With the proliferation of custom resources & operators, especially in the case of stateful applications, the steady-state is manifested as status parameters/flags within Kubernetes resources. k8sProbe addresses verification of the desired resource state by allowing users to define the Kubernetes GVR (group-version-resource) with appropriate filters (field selectors/label selectors). The experiment makes use of the Kubernetes Dynamic Client to achieve this.The `k8sProbe` can be defined at `.spec.experiments[].spec.probe` the path inside ChaosEngine.

```yaml
probe:
- name: "check-app-cluster-cr-status"
  type: "k8sProbe"
  k8sProbe/inputs:
    command:
      group: "<appGroup>"
      version: "<appVersion>"
      resource: "<appResource>"
      namespace: "default"
      fieldSelector: "metadata.name=<appResourceName>,status.phase=Running"
      labelSelector: "metadata.name=<appResourceName>,status.phase=Running"
  mode: "EoT"
  runProperties:
    probeTimeout: 5
    interval: 5
    retry: 1
```
## Probe Status & Deriving Inferences 

The litmus chaos experiments run the probes defined in the ChaosEngine and update their stage-wise success in the ChaosResult custom resource, with details including the overall `probeSuccessPercentage` (a ratio of successful checks v/s total probes) and failure step, where applicable. The success of a probe is dependent on whether the expected status/results are met and also on whether it is successful in all the experiment phases defined by the probe’s execution mode. For example, probes that are executed in “Edge” mode, need the checks to be successful both during the pre-chaos & post-chaos phases to be declared as successful. 

The pass criteria for an experiment is the logical conjunction of all probes defined in the ChaosEngine and an inbuilt entry/exit criteria. Failure of either indicates a failed hypothesis and is deemed experiment failure.

Provided below is a ChaosResult snippet containing the probe status for a mixed-probe ChaosEngine. 

```yaml
Name:         app-pod-delete
Namespace:    test
Labels:       name=app-pod-delete
Annotations:  <none>
API Version:  litmuschaos.io/v1alpha1
Kind:         ChaosResult
Metadata:
  Creation Timestamp:  2020-08-29T08:28:26Z
  Generation:          36
  Resource Version:    50239
  Self Link:           /apis/litmuschaos.io/v1alpha1/namespaces/test/ChaosResults/app-pod-delete
  UID:                 b9e3638a-b7a4-4b93-bfea-bd143d91a5e8
Spec:
  Engine:      probe
  Experiment:  pod-delete
Status:
  Experimentstatus:
    Fail Step:                 N/A
    Phase:                     Completed
    Probe Success Percentage:  100
    Verdict:                   Pass

  Probe Status:
    Name:  check-frontend-access-url
    Status:
      Continuous:  Passed 👍 
    Type:          HTTPProbe

    Name:          check-app-cluster-cr-status
    Status:
      Post Chaos:  Passed 👍 #EoT
    Type:          K8sProbe

    Name:          check-database-integrity
    Status:
      Post Chaos:  Passed 👍 #Edge
      Pre Chaos:   Passed 👍 
    Type:          CmdProbe
Events:
  Type    Reason   Age   From                     Message
  ----    ------   ----  ----                     -------
  Normal  Summary  7s    pod-delete-0s2jt6-s4rdx  pod-delete experiment has been Passed
```

## Probe Chaining

Probe chaining enables reuse of probe a result (represented by the template function `{{ .<probeName>.probeArtifact.Register}}`) in subsequent "downstream" probes defined 
in the ChaosEngine. Note that the order of execution of probes in the experiment depends purely on the order in which they are defined in the ChaosEngine. 

Probe chaining is currently supported only for `cmdProbes`. 
  
```yaml
probe:
  - name: "probe1"
    type: "cmdProbe"
    cmdProbe/inputs:
      command: "<command>"
      expectedResult: "<expected-result>"
      source: "inline"
    mode: "SOT"
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
  - name: "probe2"
    type: "cmdProbe"
    cmdProbe/inputs:
      ## probe1's result being used as one of the args in probe2
      command: "<commmand> {{ .probe1.ProbeArtifacts.Register }} <arg2>"
      expectedResult: "<expected-result>"
      source: "inline"
    mode: "SOT"
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
```

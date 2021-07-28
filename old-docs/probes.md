---
id: probes
title: Declarative Approach to Chaos Hypothesis using Litmus Probes
sidebar_label: Probes
---

---
## Litmus Probes

Litmus probes are pluggable checks that can be defined within the ChaosEngine for any chaos experiment. The experiment pods execute these checks based on the mode they are defined in & factor their success as necessary conditions in determining the verdict of the experiment (along with the standard “in-built” checks).

Litmus currently supports four types of probes:

* **httpProbe:** To query health/downstream URIs
* **cmdProbe:** To execute any user-desired health-check function implemented as a shell command
* **k8sProbe:** To perform CRUD operations against native & custom Kubernetes resources
* **promProbe:** To execute promql queries and match prometheus metrics for specific criteria

These probes can be used in isolation or in several combinations to achieve the desired checks. While the `httpProbe` & `k8sProbe` are fully declarative in the way they are conceived, the `cmdProbe` expects the user to provide a shell command to implement checks that are highly specific to the application use case. `promProbe` expects the user to provide a promql query along with Prometheus service endpoints to check for specific criteria.

The probes can be set up to run in different modes:

* **SoT:** Executed at the Start of Test as a pre-chaos check
* **EoT:** Executed at the End of Test as a post-chaos check
* **Edge:** Executed both, before and after the chaos
* **Continuous:** The probe is executed continuously, with a specified polling interval during the chaos injection.
* **OnChaos:** The probe is executed continuously, with a specified polling interval strictly for chaos duration of chaos

All probes share some common attributes:

* **probeTimeout:** Represents the time limit for the probe to execute the check specified and return the expected data.
* **retry:** The number of times a check is re-run upon failure in the first attempt before declaring the probe status as failed.
* **interval:** The period between subsequent retries
* **probePollingInterval:** The time interval for which continuous probe should be sleep after each iteration
* **initialDelaySeconds:** Represents the initial waiting time interval for the probes.

## Types of Litmus Probes

### **httpProbe**

The `httpProbe` allows developers to specify a URL which the experiment uses to gauge health/service availability (or other custom conditions) as part of the entry/exit criteria. The received status code is mapped against an expected status. It supports http `Get` and `Post` methods.

In HTTP `Get` method it sends a http `GET` request to the provided url and matches the response code based on the given criteria(`==`, `!=`, `oneOf`).

In HTTP `Post` method it sends a http `POST` request to the provided url. The http body can be provided in the `body` field. In the case of a complex POST request in which the body spans multiple lines, the `bodyPath` attribute can be used to provide the path to a file consisting of the same. This file can be made available to the experiment pod via a ConfigMap resource, with the ConfigMap name being defined in the ChaosEngine OR the ChaosExperiment CR.
It can be defined at `.spec.experiments[].spec.probe` inside ChaosEngine.

> **NOTE:** `body` and `bodyPath` are mutually exclusive.

```yaml
probe:
- name: "check-frontend-access-url"
  type: "httpProbe"
  httpProbe/inputs:
    url: "<url>"
    insecureSkipVerify: false
    method:
      get: 
        criteria: == # supports == & != and oneof operations
        responseCode: "<response code>"
  mode: "Continuous"
  runProperties:
    probeTimeout: 5
    interval: 5
    retry: 1
    probePollingInterval: 2
```

The `httpProbe` is better used in the Continuous mode of operation as a parallel liveness indicator of a target or downstream application. It uses the `probePollingInterval` property to specify the polling interval for the access checks.

> **NOTE:** `insecureSkipVerify` can be set to true to skip the certificate checks.

<br />

### **cmdProbe**

The `cmdProbe` allows developers to run shell commands and match the resulting output as part of the entry/exit criteria. The intent behind this probe was to allow users to implement a non-standard & imperative way for expressing their hypothesis. For example, the cmdProbe enables you to check for specific data within a database, parse the value out of a JSON blob being dumped into a certain path or check for the existence of a particular string in the service logs.

In order to enable this behaviour, the probe supports an inline mode in which the command is run from within the experiment image as well as a source mode, where the command execution is carried out from within a new pod whose image can be specified. While inline is preferred for simple shell commands , source mode can be used when application-specific binaries are required. The `cmdProbe` can be defined at `.spec.experiments[].spec.probe` the path inside the ChaosEngine.

```yaml
probe:
- name: "check-database-integrity"
  type: "cmdProbe"
  cmdProbe/inputs:
    command: "<command>"
    comparator:
      type: "string" # supports: string, int, float
      criteria: "contains" #supports >=,<=,>,<,==,!= for int and contains,equal,notEqual,matches,notMatches for string values
      value: "<value-for-criteria-match>"
    source: "<repo>/<tag>" # it can be “inline” or any image
  mode: "Edge"
  runProperties:
    probeTimeout: 5
    interval: 5
    retry: 1
    initialDelaySeconds: 5
```

<br />

### **k8sProbe**

With the proliferation of custom resources & operators, especially in the case of stateful applications, the steady-state is manifested as status parameters/flags within Kubernetes resources. k8sProbe addresses verification of the desired resource state by allowing users to define the Kubernetes GVR (group-version-resource) with appropriate filters (field selectors/label selectors). The experiment makes use of the Kubernetes Dynamic Client to achieve this. The `k8sProbe` can be defined at `.spec.experiments[].spec.probe` the path inside ChaosEngine.

It supports following CRUD operations which can be defined at `probe.operation`.

* **create:** It creates kubernetes resource based on the data provided inside probe.data field.
* **delete:** It deletes matching kubernetes resource via GVR and filters (field selectors/label selectors).
* **present:** It checks for the presence of kubernetes resource based on GVR and filters (field selectors/labelselectors).
* **absent:** It checks for the absence of kubernetes resource based on GVR and filters (field selectors/labelselectors).

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
      labelSelector: "<app-labels>"
  operation: "present" # it can be present, absent, create, delete
  mode: "EOT"
  runProperties:
    probeTimeout: 5
    interval: 5
    retry: 1
```

<br />

### **promProbe**

The `promProbe` allows users to run Prometheus queries and match the resulting output against specific conditions. The intent behind this probe is to allow users to define metrics-based SLOs in a declarative way and determine the experiment verdict based on its success. The probe runs the query on a Prometheus server defined by the `endpoint`, and checks whether the output satisfies the specified `criteria`.

The promql query can be provided in the `query` field. In the case of complex queries that span multiple lines, the `queryPath` attribute can be used to provide the link to a file consisting of the query. This file can be made available in the experiment pod via a ConfigMap resource, with the ConfigMap being passed in the ChaosEngine OR the ChaosExperiment CR.

> **NOTE:** `query` and `queryPath` are mutually exclusive.

```yaml
probe:
- name: "check-probe-success"
  type: "promProbe"
  promProbe/inputs:
    endpoint: "<prometheus-endpoint>"
    query: "<promql-query>"
    comparator:
      criteria: "==" #supports >=,<=,>,<,==,!= comparision
      value: "<value-for-criteria-match>"
  mode: "Edge"
  runProperties:
    probeTimeout: 5
    interval: 5
    retry: 1
```

<br />

---

## **Probe Status & Deriving Inferences**

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
<br />

---

## **Probe Chaining**

Probe chaining enables reuse of probe a result (represented by the template function `{{ .<probeName>.probeArtifact.Register}})` in subsequent "downstream" probes defined in the ChaosEngine. Note that the order of execution of probes in the experiment depends purely on the order in which they are defined in the ChaosEngine.

Probe chaining is currently supported only for `cmdProbes`.

```yaml
probe:
  - name: "probe1"
    type: "cmdProbe"
    cmdProbe/inputs:
      command: "<command>"
      comparator:
        type: "string"
        criteria: "equals"
        value: "<value-for-criteria-match>"
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
      comparator:
        type: "string"
        criteria: "equals"
        value: "<value-for-criteria-match>"
      source: "inline"
    mode: "SOT"
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
```

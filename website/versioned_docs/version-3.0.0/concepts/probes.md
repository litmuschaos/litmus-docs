---
id: probes
title: Resilience Probes
sidebar_label: Resilience Probes
---

---

In Litmus, Resilience Probes are pluggable checks that can be defined within the ChaosEngine for any Chaos Experiment. The fault pods execute these checks based on the mode they are defined in & factor their success as necessary conditions in determining the verdict of the fault (along with the standard `in-built` checks).

## Prerequisites

To understand the concepts of Probes better make sure you are aware of the [ChaosEngine](glossary.md) Custom Resources and promql queries (for Prometheus Probes)

## Probes

Litmus currently supports four types of Probes:

- **httpProbe**: To query health/downstream URIs
- **cmdProbe**: To execute any user-desired health-check function implemented as a shell command
- **k8sProbe**: To perform CRUD operations against native & custom Kubernetes resources
- **promProbe**: To execute promql queries and match prometheus metrics for specific criteria

These probes can be used in isolation or in several combinations to achieve the desired checks. While the **httpProbe** and **k8sProbe** are **fully declarative** in the way they are conceived, the **cmdProbe** expects the user to provide a shell command to implement checks that are highly specific to the application use case. **promProbe** expects the user to provide a promql query along with Prometheus service endpoints to check for specific criteria.

The probes can be set up to run in different modes:

- **SoT**: Executed at the Start of Test as a pre-chaos check
- **EoT**: Executed at the End of Test as a post-chaos check
- **Edge**: Executed both, before and after the chaos
- **Continuous**: The probe is executed continuously, with a specified polling interval during the chaos injection.
- **OnChaos**: The probe is executed continuously, with a specified polling interval strictly for chaos duration of chaos

Some common attributes shared between the Probes:

- **probeTimeout**: Represents the time limit for the probe to execute the check specified and return the expected data.
- **retry**: The number of times a check is re-run upon failure in the first attempt before declaring the probe status as failed.
- **interval**: The period between subsequent retries
- **probePollingInterval**: The time interval for which continuous probe should be sleep after each iteration
- **initialDelaySeconds**: Represents the initial waiting time interval for the probes.
- **stopOnFailure**: It can be set to true/false to stop or continue the fault execution after probe fails

:::note
If probe needs any additional RBAC permissions other than the fault's serviceAccount `(<fault-name>-sa)` permissions, then the additional permissions should be provided inside the corresponding Role/ClusterRole bind with the serviceAccount `(<fault-name>-sa)`.
:::

---

## Detailed View of the Probes

### httpProbe

The `httpProbe` allows developers to specify a URL which the fault uses to gauge health/service availability (or other custom conditions) as part of the entry/exit criteria. The received status code is mapped against an expected status. It supports http `Get` and `Post` methods.

In HTTP `Get` method it sends a http `GET` request to the provided url and matches the response code based on the given criteria(`==`, `!=`, `oneOf`).

In HTTP `Post` method it sends a http `POST` request to the provided url. The http body can be provided in the `body` field. In the case of a complex POST request in which the body spans multiple lines, the `bodyPath` attribute can be used to provide the path to a file consisting of the same. This file can be made available to the fault pod via a ConfigMap resource, with the ConfigMap name being defined in the [ChaosEngine](glossary.md) OR the ChaosExperiment CR.
It can be defined at `.spec.experiments[].spec.probe` inside ChaosEngine.

> `body` and `bodyPath` are mutually exclusive

```yaml
probe:
  - name: 'check-frontend-access-url'
    type: 'httpProbe'
    httpProbe/inputs:
      url: '<url>'
      insecureSkipVerify: false
      responseTimeout: <value> # in milli seconds
      method:
        get:
          criteria: == # supports == & != and oneof operations
          responseCode: '<response code>'
    mode: 'Continuous'
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
      probePollingInterval: 2
```

The `httpProbe` is better used in the Continuous mode of operation as a parallel liveness indicator of a target or downstream application. It uses the `probePollingInterval` property to specify the polling interval for the access checks.

> `insecureSkipVerify` can be set to true to skip the certificate checks.

### cmdProbe

The `cmdProbe` allows developers to run shell commands and match the resulting output as part of the entry/exit criteria. The intent behind this probe was to allow users to implement a non-standard & imperative way for expressing their hypothesis. For example, the cmdProbe enables you to check for specific data within a database, parse the value out of a JSON blob being dumped into a certain path or check for the existence of a particular string in the service logs.

In order to enable this behaviour, the probe supports an inline mode in which the command is run from within the fault image as well as a source mode, where the command execution is carried out from within a new pod whose image can be specified. While inline is preferred for simple shell commands, source mode can be used when application-specific binaries are required. The cmdProbe can be defined at `.spec.experiments[].spec.probe` the path inside the ChaosEngine.

```yaml
probe:
  - name: 'check-database-integrity'
    type: 'cmdProbe'
    cmdProbe/inputs:
      command: '<command>'
      comparator:
        type: 'string' # supports: string, int, float
        criteria: 'contains' #supports >=,<=,>,<,==,!= for int and contains,equal,notEqual,matches,notMatches for string values
        value: '<value-for-criteria-match>'
      source: # omit this tag to "inline" the probe
        image: '<repo>/<tag>'
        hostNetwork: false
    mode: 'Edge'
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
      initialDelaySeconds: 5
```

> `source.hostNetwork` can be set to `true` to allow access to the node network namespace for the pod executing the probe

### k8sProbe

With the proliferation of custom resources & operators, especially in the case of stateful applications, the steady-state is manifested as status parameters/flags within Kubernetes resources. k8sProbe addresses verification of the desired resource state by allowing users to define the Kubernetes GVR (group-version-resource) with appropriate filters (field selectors/label selectors). The fault makes use of the Kubernetes Dynamic Client to achieve this.The `k8sProbe` can be defined at `.spec.experiments[].spec.probe` the path inside ChaosEngine.

It supports following CRUD operations which can be defined at probe.k8sProbe/inputs.operation.

- **create**: It creates kubernetes resource based on the data provided inside `probe.data` field.
- **delete**: It deletes matching kubernetes resource via GVR and filters (field selectors/label selectors).
- **present**: It checks for the presence of kubernetes resource based on GVR and filters (field selectors/labelselectors).
- **absent**: It checks for the absence of kubernetes resource based on GVR and filters (field selectors/labelselectors).

```yaml
probe:
  - name: 'check-app-cluster-cr-status'
    type: 'k8sProbe'
    k8sProbe/inputs:
      group: '<appGroup>'
      version: '<appVersion>'
      resource: '<appResource>'
      namespace: 'default'
      fieldSelector: 'metadata.name=<appResourceName>,status.phase=Running'
      labelSelector: '<app-labels>'
      operation: 'present' # it can be present, absent, create, delete
    mode: 'EOT'
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
```

### **promProbe**

The `promProbe` allows users to run Prometheus queries and match the resulting output against specific conditions. The intent behind this probe is to allow users to define metrics-based SLOs in a declarative way and determine the fault verdict based on its success. The probe runs the query on a Prometheus server defined by the `endpoint`, and checks whether the output satisfies the specified `criteria`.

The promql query can be provided in the `query` field. In the case of complex queries that span multiple lines, the `queryPath` attribute can be used to provide the link to a file consisting of the query. This file can be made available in the fault pod via a ConfigMap resource, with the ConfigMap being passed in the ChaosEngine OR the ChaosExperiment CR.

> **NOTE:** `query` and `queryPath` are mutually exclusive.

```yaml
probe:
  - name: 'check-probe-success'
    type: 'promProbe'
    promProbe/inputs:
      endpoint: '<prometheus-endpoint>'
      query: '<promql-query>'
      comparator:
        criteria: '==' #supports >=,<=,>,<,==,!= comparision
        value: '<value-for-criteria-match>'
    mode: 'Edge'
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
```

<br />

---

## Probe Status & Deriving Inferences

The litmus chaos faults run the probes defined in the ChaosEngine and update their stage-wise success in the ChaosResult custom resource, with details including the overall `probeSuccessPercentage` (a ratio of successful checks v/s total probes) and failure step, where applicable. The success of a probe is dependent on whether the expected status/results are met and also on whether it is successful in all the fault phases defined by the probe’s execution mode. For example, probes that are executed in “Edge” mode, need the checks to be successful both during the pre-chaos & post-chaos phases to be declared as successful.

The pass criteria for a fault is the logical conjunction of all probes defined in the ChaosEngine and an inbuilt entry/exit criteria. Failure of either indicates a failed hypothesis and is deemed fault failure.

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

## Probe Chaining

Probe chaining enables reuse of probe a result represented by the template function `{{ .<probeName>.probeArtifact.Register}})` in subsequent "downstream" probes defined in the ChaosEngine. Note that the order of execution of probes in the fault depends purely on the order in which they are defined in the ChaosEngine.

Probe chaining is currently supported only for `cmdProbes`.

```yaml
probe:
  - name: 'probe1'
    type: 'cmdProbe'
    cmdProbe/inputs:
      command: '<command>'
      comparator:
        type: 'string'
        criteria: 'equals'
        value: '<value-for-criteria-match>'
      source: 'inline'
    mode: 'SOT'
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
  - name: 'probe2'
    type: 'cmdProbe'
    cmdProbe/inputs:
      ## probe1's result being used as one of the args in probe2
      command: '<commmand> {{ .probe1.ProbeArtifacts.Register }} <arg2>'
      comparator:
        type: 'string'
        criteria: 'equals'
        value: '<value-for-criteria-match>'
      source: 'inline'
    mode: 'SOT'
    runProperties:
      probeTimeout: 5
      interval: 5
      retry: 1
```

---

## Probe Schema

This section describes the different fields of the litmus probes and the possible values that can be set against the same. The probes can be defined at `.spec.experiments[].spec.probe` path inside chaosengine.

### Basic Details

<table>
<tr>
  <th>Field</th>
  <td><code>.name</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the name of the probe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a  <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.name</code> holds the name of the probe. It can be set based on the usecase</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.type</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the type of the probe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> <code>httpProbe</code>, <code>k8sProbe</code>, <code>cmdProbe</code>, <code>promProbe</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.type</code> supports four type of probes. It can one of the <code>httpProbe</code>, <code>k8sProbe</code>, <code>cmdProbe</code>, <code>promProbe</code></td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.mode</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the mode of the probe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> <code>SOT</code>, <code>EOT</code>, <code>Edge</code>, <code>Continuous</code>, <code>OnChaos</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.mode</code> supports five modes of probes. It can one of the <code>SOT</code>, <code>EOT</code>, <code>Edge</code>, <code>Continuous</code>, <code>OnChaos</code></td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.data</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the data for the <code>create</code> operation of the k8sProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.data</code> contains the manifest/data for the resource, which need to be created. It supported for <code>create</code> operation of k8sProbe only</td>
</tr>
</table>

### K8sProbeInputs

<table>
<tr>
  <th>Field</th>
  <td><code>.k8sProbe/inputs.group</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the group of the kubernetes resource for the k8sProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.k8sProbe/inputs.group</code> contains group of the kubernetes resource on which k8sProbe performs the specified operation</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.k8sProbe/inputs.version</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the apiVersion of the kubernetes resource for the k8sProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.k8sProbe/inputs.version</code> contains apiVersion of the kubernetes resource on which k8sProbe performs the specified operation</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.k8sProbe/inputs.resource</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the kubernetes resource name for the k8sProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.k8sProbe/inputs.resource</code> contains the kubernetes resource name on which k8sProbe performs the specified operation</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.k8sProbe/inputs.namespace</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the namespace of the kubernetes resource for the k8sProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.k8sProbe/inputs.namespace</code> contains namespace of the kubernetes resource on which k8sProbe performs the specified operation</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.k8sProbe/inputs.fieldSelector</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the fieldSelectors of the kubernetes resource for the k8sProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.k8sProbe/inputs.fieldSelector</code> contains fieldSelector to derived the kubernetes resource on which k8sProbe performs the specified operation</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.k8sProbe/inputs.labelSelector</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the labelSelectors of the kubernetes resource for the k8sProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.k8sProbe/inputs.labelSelector</code> contains labelSelector to derived the kubernetes resource on which k8sProbe performs the specified operation</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.k8sProbe/inputs.operation</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the operation type for the k8sProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td><code>create</code>, <code>delete</code>, <code>present</code>, <code>absent</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.k8sProbe/inputs.operation</code> contains operation which should be applied on the kubernetes resource as part of k8sProbe. It supports four type of operation. It can be one of <code>create</code>, <code>delete</code>, <code>present</code>, <code>absent</code>.</td>
</tr>
</table>

### CmdProbeInputs

<table>
<tr>
  <th>Field</th>
  <td><code>.cmdProbe/inputs.command</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the command for the cmdProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.cmdProbe/inputs.command</code> contains the shell command, which should be run as part of cmdProbe</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.cmdProbe/inputs.source.image</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the image for the cmdProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td><code>any source docker image</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.cmdProbe/inputs.source.image</code> provides the source image which can be used to launch a external pod where the command execution is carried out.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.cmdProbe/inputs.source.hostNetwork</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to allow or deny the <code>.cmdProbe/inputs.source.image</code> access to the node network namespace</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td><code>true</code>, <code>false</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.cmdProbe/inputs.source.hostNetwork</code> provides a possibility to allow the pod executing the cmdProbe access to the network of the node he is running on. For more details <a href="https://kubernetes.io/docs/concepts/policy/pod-security-policy/#host-namespaces" target="_blank">refer to the offical Kubernetes documentation</a>.</td>
</tr>
</table>

### HTTPProbeInput

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.url</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the URL for the httpProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.url</code> contains the URL which the fault uses to gauge health/service availability (or other custom conditions) as part of the entry/exit criteria.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.insecureSkipVerify</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the flag to skip certificate checks for the httpProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td> <code>true</code>, <code>false</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.insecureSkipVerify</code> contains flag to skip certificate checks.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.responseTimeout</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the flag to response timeout for the httpProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: integer</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.responseTimeout</code> contains flag to provide the response timeout for the http Get/Post request.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.method.get.criteria</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the criteria for the http get request</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> <code>==</code>, <code>!=</code>, <code>oneOf</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.method.get.criteria</code> contains criteria to match the http get request's response code with the expected responseCode, which need to be fulfill as part of httpProbe run</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.method.get.responseCode</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the expected response code for the get request</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> HTTP_RESPONSE_CODE</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.method.get.responseCode</code> contains the expected response code for the http get request as part of httpProbe run</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.method.post.contentType</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the content type of the post request</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.method.post.contentType</code> contains the content type of the http body data, which need to be passed for the http post request</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.method.post.body</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the body of the http post request</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.method.post.body</code> contains the http body, which is required for the http post request. It is used for the simple http body. If the http body is complex then use <code>.httpProbe/inputs.method.post.bodyPath</code> field.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.method.post.bodyPath</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the path of the http body, required for the http post request</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.method.post.bodyPath</code> This field is used in case of complex POST request in which the body spans multiple lines, the bodyPath attribute can be used to provide the path to a file consisting of the same. This file can be made available to the fault pod via a ConfigMap resource, with the ConfigMap name being defined in the ChaosEngine OR the ChaosExperiment CR.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.method.post.criteria</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the criteria for the http post request</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> <code>==</code>, <code>!=</code>, <code>oneOf</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.method.post.criteria</code> contains criteria to match the http post request's response code with the expected responseCode, which need to be fulfill as part of httpProbe run</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.httpProbe/inputs.method.post.responseCode</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the expected response code for the post request</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> HTTP_RESPONSE_CODE</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.httpProbe/inputs.method.post.responseCode</code> contains the expected response code for the http post request as part of httpProbe run</td>
</tr>
</table>

### PromProbeInputs

<table>
<tr>
  <th>Field</th>
  <td><code>.promProbe/inputs.endpoint</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the prometheus endpoints for the promProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.promProbe/inputs.endpoint</code> contains the prometheus endpoints</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.promProbe/inputs.query</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the promql query for the promProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.promProbe/inputs.query</code> contains the promql query to extract out the desired prometheus metrics via running it on the given prometheus endpoint</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.promProbe/inputs.queryPath</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the path of the promql query for the promProbe</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.promProbe/inputs.queryPath</code> This field is used in case of complex queries that spans multiple lines, the queryPath attribute can be used to provide the path to a file consisting of the same. This file can be made available to the fault pod via a ConfigMap resource, with the ConfigMap name being defined in the ChaosEngine OR the ChaosExperiment CR.</td>
</tr>
</table>

### Runproperties

<table>
<tr>
  <th>Field</th>
  <td><code>.runProperties.probeTimeout</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the timeout for the probes</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a <code>type: integer</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.runProperties.probeTimeout</code> represents the time limit for the probe to execute the specified check and return the expected data</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.runProperties.retry</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the retry count for the probes</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a <code>type: integer</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.runProperties.retry</code> contains the number of times a check is re-run upon failure in the first attempt before declaring the probe status as failed.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.runProperties.interval</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the interval for the probes</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a <code>type: integer</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.runProperties.interval</code> contains the interval for which probes waits between subsequent retries</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.runProperties.probePollingInterval</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the polling interval for the probes(applicable for <code>Continuous</code> mode only)</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a <code>type: integer</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.runProperties.probePollingInterval</code> contains the time interval for which continuous probe should be sleep after each iteration</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.runProperties.initialDelaySeconds</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the initial delay interval for the probes</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a <code>type: integer</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.runProperties.initialDelaySeconds</code> represents the initial waiting time interval for the probes.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.runProperties.stopOnFailure</code></td>
</tr>
<tr>
  <th>Description</th>
  <td> Flags to hold the stop or continue the fault on probe failure</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td>false <code>type: boolean</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.runProperties.stopOnFailure</code> can be set to true/false to stop or continue the fault execution after probe fails</td>
</tr>
</table>

### Comparator

<table>
<tr>
  <th>Field</th>
  <td><code>type</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold type of the data used for comparision</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> <code>string</code>, <code>int</code>, <code>float</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>type</code> contains type of data, which should be compare as part of comparision operation</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>criteria</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold criteria for the comparision</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> it supports <code>{`>=, <=, ==, >, <, !=, oneOf, between`}</code> for int & float type. And <code>equal, notEqual, contains, matches, notMatches, oneOf</code> for string type.</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>criteria</code> contains criteria of the comparision, which should be fulfill as part of comparision operation.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>value</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold value for the comparision</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td> n/a <code>type: string</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>value</code> contains value of the comparision, which should follow the given criteria as part of comparision operation.</td>
</tr>
</table>

## Summary

Probes are pluggable checks that can be defined within the ChaosEngine for any Chaos Experiment. There are four kinds of probes `httpProbe` (allows developers to specify a URL which the fault uses to gauge health/service availability as part of the entry/exit criteria), `cmdProbe` (allows developers to run shell commands and match the resulting output as part of the entry/exit criteria), `k8sProbe` (addresses verification of the desired resource state by allowing users to define the Kubernetes GVR with appropriate filters) and `promProbe` (allows users to run Prometheus queries and match the resulting output against specific conditions).

The different modes these probes can be used in are `SoT`, `EoT`, `Edge`, `Continuous` and `OnChaos`. The litmus chaos faults run the probes defined in the ChaosEngine and update their stage-wise success in the ChaosResult custom resource with `probeSuccessPercentage`. A `probeSuccessPercentage` is the ratio of successful checks v/s total probes.

Probes can be Chained, Probe chaining enables reuse of probe, the order of execution of probes in the fault depends purely on the order in which they are defined in the ChaosEngine.

:::note
With the latest release of LitmusChaos 3.0.0:

<li>The term <b>Chaos Experiment</b> has been changed to <b>Chaos Fault.</b> </li>
<li>The term <b>Chaos Scenario/Workflow</b> has been changed to <b>Chaos Experiment.</b></li>
:::

## Learn more

- [Explore the Custom Resources](glossary.md)

---
id: chaosresult
title: Constructing the ChaosResult
sidebar_label: ChaosResult
original_id: chaosresult
---

---

ChaosResult resource holds the results of a ChaosExperiment with a namespace scope. It is created or updated at runtime by the experiment itself. It holds important information like the ChaosEngine reference, Experiment State, Verdict of the experiment (on completion), salient application/result attributes. It is also a source for metrics collection. It is updated/patched with the status of the experiment run. It is not removed as part of the default cleanup procedures to allow for extended reference.

This section describes the fields/details provided by the ChaosResult spec.

## Component Details

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.engine</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the ChaosEngine name for the experiment</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a  (type: string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.spec.engine</code> holds the engine name for the current course of the experiment.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.experiment</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to hold the ChaosExperiment name which induces chaos.</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td>n/a (type: string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.spec.experiment</code> holds the ChaosExperiment name for the current course of the experiment.</td>
</tr>
</table>

## Status Details

<table>
<tr>
  <th>Field</th>
  <td><code>.status.experimentstatus.failstep</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the failure step of the ChaosExperiment</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>n/a</i>(type: string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.experimentstatus.failstep</code> Show the step at which the experiment failed. It helps in faster debugging of failures in the experiment execution.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.status.phase</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the current phase of the experiment</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>Awaited,Running,Completed,Aborted</i> (type: string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.phase</code> shows the current phase in which the experiment is. It gets updated as the experiment proceeds.If the experiment is aborted then the status will be Aborted.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.status.probesuccesspercentage</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the probe success percentage</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>1 to 100</i> (type: int)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.probesuccesspercentage</code> shows the probe success percentage which is a ratio of successful checks v/s total probes.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.status.verdict</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the verdict of the experiment.</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>Awaited,Pass,Fail,Stopped</i> (type: string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.verdict</code> shows the verdict of the experiment. It is <code>Awaited</code> when the experiment is in progress and ends up with Pass or Fail according to the experiment result.</td>
</tr>
</table>

## Probe Details

<table>
<tr>
  <th>Field</th>
  <td><code>.status.probestatus.name</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the name of probe used in the experiment</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>n/a</i> n/a (type: string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.probestatus.name</code> shows the name of the probe used in the experiment.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.status.probestatus.status.continuous</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the result of probe in continuous mode</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>Awaited,Passed,Better Luck Next Time</i> (type: string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.probestatus.status.continuous</code> helps to get the result of the probe in the continuous mode. The httpProbe is better used in the Continuous mode.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.status.probestatus.status.postchaos</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the probe result post chaos</td>
</tr>
<tr>
  <th>Type</th>
  <td>Optional</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>Awaited,Passed,Better Luck Next Time</i> (type:map[string]string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.probestatus.status.postchaos</code> shows the result of probe setup in EOT mode executed at the End of Test as a post-chaos check. </td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.status.probestatus.status.prechaos</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the probe result pre chaos</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>Awaited,Passed,Better Luck Next Time</i> (type:string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.probestatus.status.prechaos</code> shows the result of probe setup in SOT mode executed at the Start of Test as a pre-chaos check.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.status.probestatus.type</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to show the type of probe used</td>
</tr>
<tr>
  <th>Range</th>
  <td>
<i>HTTPProbe,K8sProbe,CmdProbe</i>(type:string)</td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>.status.probestatus.type</code> shows the type of probe used.</td>
</tr>
</table>

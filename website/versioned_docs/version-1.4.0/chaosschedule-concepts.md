---
id: chaosschedule
title: "Constructing the ChaosSchedule"
sidebar_label: ChaosSchedule (alpha)
original_id: chaosschedule
---

---

The ChaosSchedule is the user-facing chaos custom resource with a namespace scope and is designed to hold information
around how the chaos engines are to be scheduled according to the specified template. It schedules a chaosengine instance .

This section describes the fields in the ChaosSchedule spec and the possible values that can be set against the same.

<font style={{fontFamily:"verdana",color:"yellow"}}>Note</font> - This is the alpha version of ChaosScheduler. An enhanced version may be released in the future based on the user reviews

## Schedule Specification

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.schedule.type</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to control the type of scheduling</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td><code>now</code>, <code>once</code>, <code>repeat</code></td>
</tr>
<tr>
  <th>Default</th>
  <td><code>now</code></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>scheduleType</code> in the spec is a user defined flag to trigger type of schedule they want. Setting it to <code>now</code> ensures immediate formation of chaosengine. Setting it to <code>once</code> ensures formation of chaosengine at a specific time. Setting it to <code>repeat</code> ensures repeated formation of chaosengine within a specific time interval.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.schedule.executionTime</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Time at which chaosengine is to be formed</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory (when <code>.spec.schedule.type="once"</code>)</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>user-defined</i> (type: UTC Timeformat)</td>
</tr>
<tr>
  <th>Default</th>
  <td><i>n/a</i></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>executionTime</code> in the spec specifies the exact time at which the chaosengine is to be formed</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.schedule.startTime</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to specify start of the range of time within which chaosengine is to be formed</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory (when <code>.spec.schedule.type="repeat"</code>)</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>user-defined</i> (type: UTC Timeformat)</td>
</tr>
<tr>
  <th>Default</th>
  <td><i>n/a</i></td>
</tr>
<tr>
  <th>Notes</th>
  <td>When <code>startTime</code> is specified along with <code>.spec.schedule.type="repeat"
  </code>. ChaosEngine will not be formed before this time, no matter when it was created.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.schedule.endTime</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to specify end of the range of time within which chaosengine is to be formed</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory (when <code>.spec.schedule.type="repeat"</code>)</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>user-defined</i> (type: UTC Timeformat)</td>
</tr>
<tr>
  <th>Default</th>
  <td><i>n/a</i></td>
</tr>
<tr>
  <th>Notes</th>
  <td>When <code>endTime</code> is specified along with <code>.spec.schedule.type="repeat"
  </code>. ChaosEngine will not be formed after this time.</td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.schedule.minChaosInterval</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to specify the minimum interval between two chaosengines to be formed. </td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory (when <code>.spec.schedule.type="repeat"</code>)</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>user-defined</i> (type: string)(pattern: "{'{'}number{'}'}m", "{'{'}number{'}'}h").</td>
</tr>
<tr>
  <th>Default</th>
  <td><i>n/a</i></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>minChaosInterval</code> in the spec specifies a time interval that must be taken care of while repeatedly forming the chaosengines i.e. This much duration of time should be there as interval between the formation of two chaosengines. </td>
</tr>
</table>

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.schedule.includedDays</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to specify the days at which chaos is allowed to take place</td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory (when <code>.spec.schedule.type="repeat"</code>)</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>user-defined</i> (type: string)(pattern: {'{'}day_name{'}'}).</td>
</tr>
<tr>
  <th>Default</th>
  <td><i>n/a</i></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>includedDays</code> in the spec specifies a (comma-separated) list of days of the week at which chaos is allowed to take place. {'{'}day_name{'}'} is to be specified with the first 3 letters of the name of day such as <code>Mon</code>, <code>Tue</code> etc.</td>
</tr>
</table>

## Engine Specification

<table>
<tr>
  <th>Field</th>
  <td><code>.spec.engineTemplateSpec</code></td>
</tr>
<tr>
  <th>Description</th>
  <td>Flag to control chaosengine to be formed </td>
</tr>
<tr>
  <th>Type</th>
  <td>Mandatory</td>
</tr>
<tr>
  <th>Range</th>
  <td><i>n/a</i></td>
</tr>
<tr>
  <th>Default</th>
  <td><i>n/a</i></td>
</tr>
<tr>
  <th>Notes</th>
  <td>The <code>engineTemplateSpec</code> is the ChaosEngineSpec of ChaosEngine that is to be formed.</td>
</tr>
</table>

---
id: scheduling
title: Scheduler Usage
sidebar_label: Scheduling
original_id: scheduling
---

---

The ChaosSchedule is a user-facing chaos custom resource with namespaced scope and is used to inject chaos at a specific time or repeat it
for a certain period. It schedules multiple instances of chaos by creating the chaosengine CR at the specified times.

## Prepare ChaosSchedule

ChaosSchedule supports execution of chaos _immediately_, at a specified _timestamp_ or _repeatedly_ over a time range with a minimum
interval in between two instances. They are represented by the following keywords in the CR specification respectively: `now`, `once`, `repeat`

A ChaosSchedule CR can consist of only one scheduling policy.

### Sample ChaosSchedule Manifest for "Immediate" Chaos

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    now: true
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    annotationCheck: "true"
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

### Sample ChaosSchedule Manifest for Chaos at a Specified TimeStamp

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    once:
      #should be modified according to current UTC Time
      executionTime: "2020-05-12T05:47:00Z"
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    annotationCheck: "true"
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

### Sample ChaosSchedule Manifest for Repeated Chaos

There are various ways we can set up this type of schedule by varying the the fields inside <code>spec.repeat</code>. <br/><br/>

**Note** - We have just one field i.e. <code>minChaosInterval</code> to be specified as mandatory one. All other fields are optional and
totally dependent on the desired behaviour.

#### Basic Schema to Execute Repeat Strategy

This will keep on executing the schedule and creating engines for an indefinite amount of time.

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    repeat:
      properties:
        #format should be like "10m" or "2h" accordingly for minutes or hours
        minChaosInterval: "2m"
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    annotationCheck: "true"
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

#### Specifying Time Range for the Chaos Schedule

This will manipulate the schedule to be started and ended according to our definition.

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    repeat:
      timeRange:
        #should be modified according to current UTC Time
        startTime: "2020-05-12T05:47:00Z"
        endTime: "2020-09-13T02:58:00Z"
      properties:
        #format should be like "10m" or "2h" accordingly for minutes and hours
        minChaosInterval: "2m"
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    annotationCheck: "true"
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

##### Specifying Just the End Time

Assumes the custom resource creation timestamp as the StartTime

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    repeat:
      timeRange:
        #should be modified according to current UTC Time
        endTime: "2020-09-13T02:58:00Z"
      properties:
        #format should be like "10m" or "2h" accordingly for minutes and hours
        minChaosInterval: "2m"
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    annotationCheck: "true"
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

##### Specifying Just the StartTime

Executes chaos indefinitely (until the ChaosSchedule CR is removed) starting from the specified timestamp

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    repeat:
      timeRange:
        #should be modified according to current UTC Time
        startTime: "2020-05-12T05:47:00Z"
      properties:
        #format should be like "10m" or "2h" accordingly for minutes and hours
        minChaosInterval: "2m"
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    annotationCheck: "true"
    auxiliaryAppInfo: ""
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

#### Specifying Work Hours

This ensures chaos execution within the specified hours of the day, everyday.

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    repeat:
      properties:
        #format should be like "10m" or "2h" accordingly for minutes and hours
        minChaosInterval: "2m"
      workHours:
        # format should be <starting-hour-number>-<ending-hour-number>(inclusive)
        includedHours: 0-12
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    # It can be true/false
    annotationCheck: "true"
    #ex. values: ns1:name=percona,ns2:run=nginx
    auxiliaryAppInfo: ""
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    # It can be delete/retain
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

#### Specifying work days

This executes chaos on specified days of the week, with the specified minimum interval.

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    repeat:
      properties:
        #format should be like "10m" or "2h" accordingly for minutes and hours
        minChaosInterval: "2m"
      workDays:
        includedDays: "Mon,Tue,Wed,Sat,Sun"
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    annotationCheck: "true"
    auxiliaryAppInfo: ""
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

#### Puttings Things Together

A sample ChaosSchedule that combines attributes discussed till this point

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    repeat:
      timeRange:
        # From 8:00AM 12th May 2020 - To 8:00 PM 12th June 2020
        startTime: "2020-05-12T08:00:00Z"
        endTime: "2020-06-12T20:00:00Z"
      properties:
        # Every 2 hours
        minChaosInterval: "2h"
      workHours:
        # Between 8:00 AM to 5:00 PM
        includedHours: 8-17
      workDays:
        includedDays: "Mon,Tue,Wed,Thu"
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    annotationCheck: "true"
    chaosServiceAccount: pod-delete-sa
    monitoring: false
    jobCleanUpPolicy: "delete"
    experiments:
      - name: pod-delete
        spec:
          components:
            env:
              # set chaos duration (in sec) as desired
              - name: TOTAL_CHAOS_DURATION
                value: "30"

              # set chaos interval (in sec) as desired
              - name: CHAOS_INTERVAL
                value: "10"

              # pod failures without '--force' & default terminationGracePeriodSeconds
              - name: FORCE
                value: "false"
```

## Halt/Resume ChaosSchedule

Chaos Schedules can be <code>halted</code> or <code>resumed</code> as per need. Note that this is only applicable to <code>once</code>
and <code>repeat</code> strategies.

For halting an active schedule we can simply follow these steps:

- Edit the ChaosSchedule CR in your favourite editor

```
kubectl edit chaosschedule schedule-nginx
```

- Change the <code>spec.scheduleState</code> to <code>halt</code>

```yaml
spec:
  scheduleState: halt
  ...
```

To resume a halted schedule:

- Edit the chaosschedule

```
kubectl edit chaosschedule schedule-nginx
```

- Change the <code>spec.scheduleState</code> to <code>active</code>

```yaml
spec:
  scheduleState: active
  ...
```

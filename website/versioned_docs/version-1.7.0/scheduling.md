---
id: scheduling
title: Scheduler Usage
sidebar_label: Scheduling
original_id: scheduling
---

---

The ChaosSchedule is the user-facing chaos custom resource with a namespace scope and is
built on top of ChaosEngine. It schedules a number of instances of chaosengine according to the given schedule specifications.

It basically helps for the scheduled execution of chaos immediately, at a specific time or helps to execute chaos repeatedly with a specific time interval in between two instances. It brings more resiliency to the cluster because of the repeated executions of chaos and not just a single time as is the case of chaos engine.

## Prepare ChaosSchedule

There are 3 scheduling strategies by which we can trigger the formation of chaosengine -

- now
- once
- repeat

They can only be followed one at a time.

### Sample ChaosSchedule Manifest for Now

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

### Sample ChaosSchedule Manifest for Once

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    once:
      executionTime: "2020-05-12T05:47:00Z" #should be modified according to current UTC Time
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

### Sample ChaosSchedule Manifest for Repeat

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    repeat:
      startTime: "2020-05-12T05:47:00Z" #should be modified according to current UTC Time
      endTime: "2020-05-12T05:52:00Z" #should be modified according to current UTC Time
      minChaosInterval: "2m" #format should be like "10m" or "2h" accordingly for minutes and   hours
      instanceCount: "2"
      includedDays: "mon,tue,wed"
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

## Halt/Resume ChaosSchedule

Schdeules can be <code>halted</code> or <code>resumed</code> as per the need. But it only works for <code>once</code> or <code>repeat</code> strategy as <code>now</code> immediately creates the engine.

For halting an active schedule we can simply follow these steps -

### Edit the applied chaosschedule

```
kubectl edit chaosschedule schedule-nginx
```

### Halt the schedule

Change the <code>spec.scheduleState</code> to <code>halt</code>

```yaml
spec:
  scheduleState: halt
  ...
```

For resuming a halted schedule we can simply follow these steps -

### Edit the applied chaosschedule

```
kubectl edit chaosschedule schedule-nginx
```

### Resume the schedule

Change the <code>spec.scheduleState</code> to <code>active</code>

```yaml
spec:
  scheduleState: active
  ...
```

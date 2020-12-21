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

### Sample ChaosSchedule Manifest

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosSchedule
metadata:
  name: schedule-nginx
spec:
  schedule:
    type: "repeat"
    executionTime: "2020-05-11T20:30:00Z" #should be set for type=once
    startTime: "2020-05-12T05:47:00Z" #should be modified according to current UTC Time
    endTime: "2020-05-12T05:52:00Z" #should be modified according to current UTC Time
    minChaosInterval: "2m" #format should be like "10m" or "2h" accordingly for minutes and hours
    instanceCount: "2"
    includedDays: "mon,tue,wed"
  engineTemplateSpec:
    appinfo:
      appns: "default"
      applabel: "app=nginx"
      appkind: "deployment"
    # It can be true/false
    annotationCheck: "true"
    # It can be active/stop
    engineState: "active"
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

## Scheduler Demo

- A sample recording of this experiment execution is provided [here](https://www.youtube.com/watch?v=2RIOFys9irc&list=UUa57PMqmz_j0wnteRa9nCaw&index=2).

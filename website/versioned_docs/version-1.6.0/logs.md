---
id: logs
title: Capturing & Viewing Logs
sidebar_label: Log Collection & Analysis
original_id: logs
---

---

Litmus test pod logs (playbook execution logs) as well as that of the application and
storage pods are automatically collected as part of any standard Kubernetes logging
frameworks such as fluentd.

However, in the absence of other mechanisms, Litmus provides a (stern-based) logger
container, that can be run as a sidecar to the ansible-runner in the Litmus pod.
The logger collects both the pod (stdout) logs as well as the cluster nodes’ kubelet logs
& places them in a user-specified location on the host. This simple support bundle
can be used for debug purposes.

It allows for selective pod capture (pod list specified by comma-separated list of
starting literals) for a given duration.

<br/>

<br/>

<hr/>

<br/>

<br/>

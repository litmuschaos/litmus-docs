---
id: basic-requirements
title: Prerequisites
sidebar_label: Basic Requirements
---

Before deploying LitmusChaos, make sure the following items are there

- Kubernetes 1.15 or later

- A Persistent volume of 20GB

  >Recommend to have a Persistent volume(PV) of 20GB, You can start with 1GB for test purposes as well. This PV is used as persistent storage to store the chaos config and chaos-metrics in the Portal. By default, litmus install would use the default storage class to allocate the PV. Provide this value

- [Helm3](https://v3.helm.sh/) or [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

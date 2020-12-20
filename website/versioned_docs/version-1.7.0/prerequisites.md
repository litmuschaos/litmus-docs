---
id: prerequisites
title: Litmus Pre-Requisites
sidebar_label: Pre-Requisites
original_id: prerequisites
---

---

- Healthy Kubernetes Cluster (size depends on test scenario)
- Test harness instance with access to the cluster & installed with kubectl.
- Set Kubernetes admin context
- Obtain Access Key details in case of certain managed clusters (ex: EKS). These need to
  be passed as ENV in the litmusbooks before execution
- Ensure that the package dependencies for the storage provider which will be used in the
  tests are installed. For ex. OpenEBS storage classes require iSCSI initiators to be installed
  on all nodes
- In the case of on-premise solutions such as Openshift, ensure that the project and user
  under which the Litmus e2e is executed has sufficient permissions.
- Verify that the security policies are updated with necessary changes to create & consume
  the given storage provider’s persistent volume.

<br/>

<br/>

<hr/>

<br/>

<br/>

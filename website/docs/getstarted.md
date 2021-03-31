---
id: getstarted
title: Getting Started with Litmus
sidebar_label: Pre-requisites
---

---

## Pre-requisites

- Kubernetes 1.15 or later.

- Persistent volume of 20GB

  Recommend to have a Persistent volume(PV) of 20GB, You can start with 1GB for test purposes as well. This PV is used as persistent storage to store the chaos config and chaos-metrics in the Portal. By default, litmus install would use the default storage class to allocate the PV. Provide this value 

- Helm3 or Kubectl


## Getting Started

Running chaos on your application involves the following steps:

[Install Litmus](litmus-install)

[How to Create and Run a Workflow](create-workflow)

[Observe ChaosResults](observe-workflow)

<hr/>

## Join our community

If you have not joined our community, do join us [here](https://app.slack.com/client/T09NY5SBT/CNXNB0ZTN).

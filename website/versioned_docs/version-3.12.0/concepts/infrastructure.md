---
id: chaos-infrastructure
title: Chaos infrastructure
sidebar_label: Chaos infrastructure
---

Chaos infrastructure is a service that runs in your target environment and aids the Litmus control plane in accessing and injecting chaos at a cloud-native scale. All the chaos infrastructure services adhere to the principle of least privilege, where the services execute with the minimum number of required permissions. A chaos infrastructure can be created under a Chaos Environment.

:::note
With the latest release of LitmusChaos 3.0.0 the term **Chaos Delegate/Agent** has been changed to **Chaos Infrastructure**.
:::

## Chaos environment

An environment represents where you are installing your chaos infrastructure and acts as an additional level of abstraction for the same. You categorize each environment as prod or non-prod.

## Types of Chaos Infrastructures

In Litmus, chaos infrastructures can be classified into two types:

- **Self Chaos Infrastructures:** A Chaos Infrastructure that is connected to the same cluster and namespace where the ChaosCenter is deployed. It can be used to target the workloads executing on that cluster only.

- **External Chaos Infrastructures:** A Chaos Infrastructure that is connected to a remote Kubernetes cluster. ChaosCenter can be operated in a cross-cloud manner, which allows connecting multiple External Chaos Infrastructure to the same ChaosCenter with the help of the [litmusctl](../litmusctl/installation.md) CLI. Once connected you can manage, monitor, observe and induce chaos from the ChaosCenter to the respective External Chaos Infrastructures.

### Access types

Chaos infrastructure can be created in two modes:

- **Cluster Wide:** This mode of infrastructure installation allows targeting resources across the entire cluster, in all the namespaces, as part of an experiment.
- **Namespace Mode:** This mode of infrastructure installation allows targeting resources only in the namespace where the chaos infrastructure is deployed.

:::note
- There can only be one cluster-wide chaos infrastructure per cluster.
- There may be multiple namespace-scoped chaos infrastructures per cluster.
:::

## Learn more

- [How to connect a Chaos Infrastructure](../user-guides/chaos-infrastructure-installation.md)

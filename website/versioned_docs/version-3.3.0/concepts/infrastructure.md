---
id: chaos-infrastructure
title: Chaos Infrastructure
sidebar_label: Chaos Infrastructure
---

Chaos infrastructure is a service that runs in your target environment and aids the Litmus control plane in accessing and injecting chaos at a cloud-native scale. All the chaos infrastructure services adhere to the principle of least privilege, where the services execute with the minimum number of required permissions. A Chaos Infrastructure can be created under a Chaos Environment.

:::note
With the latest release of LitmusChaos 3.0.0 the term **Chaos Delegate/Agent** has been changed to **Chaos Infrastructure**
:::

## Chaos Environment

An environment represents where you are installing your Chaos Infrastructure and acts as an additional level of abstraction for the same. You categorize each environment as prod or non-prod.

### Access Types

Chaos Infrastructure can be created in two modes:

<li><b>Cluster Wide:</b> This mode of infrastructure installation allows targeting resources across the entire cluster, in all the namespaces, as part of an experiment.</li> 
<li><b>Namespace Mode:</b> This mode of infrastructure installation allows targeting resources only in the namespace where the chaos infrastructure is deployed.</li>

<br/><br/>

:::note

 <li>There can only be one cluster-wide chaos infrastructure per cluster.</li>
 <li>There may be multiple namespace-scoped chaos infrastructures per cluster.</li>
:::

## Learn More

- [How to connect a Chaos Infrastructure](../user-guides/chaos-infrastructure-installation.md)

---
id: viewing-chaos-faults
title: Viewing Chaos Faults
sidebar_label: Viewing Chaos Faults
---

### Viewing Chaos Faults

After connecting a ChaosHub, you can view the different chaos charts and faults. These charts are categorized into different sections such as generic, AWS, Azure, Kube-Components, etc.

<img src={require('../assets/concepts/chaoshub/chaoshub-chaos-charts.png').default} width="800" />

### View the fault details

You can select one of the chaos faults and can examine the fault details. The fault page consists of all the important details like the description of the fault, a tutorial video, the maintainer of the fault, etc.

You can also find the Experiment manifest URL, RBAC URL, and the ChaosEngine URLs of the fault.
These URLs are required for the creation of custom chaos experiments.

<img src={require('../assets/concepts/chaoshub/chaoshub-exp-details.png').default} width="800" />
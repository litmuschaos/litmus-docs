---
id: chaoshub
title: ChaosHub
sidebar_label: ChaosHub
---

---

ChaosHub allows you to orchestrate workflows from the Public **[ChaosHub](http://hub.litmuschaos.io/)** or an alternate source for the Experiments (basically, a **[fork](https://github.com/litmuschaos/chaos-charts)** of the public hub with custom experiments).

## Prerequisites

The following are the prerequisites for creating a Chaos Workflow:

- Fork of [Chaos-Charts](https://github.com/litmuschaos/chaos-charts) repository

:::note
An active internet connection is required to clone the git repository for the first time installation.
:::

## Connecting a Git repository using ChaosHub

With ChaosHub, you can construct chaos workflows by selecting, tuning and sequencing different experiments together from their connected ChaosHubs.

You can make changes in your forked repositories and sync it with the Portal to get the latest changes from the fork.

By default, a Public ChaosHub is provided when the ChaosCenter is installed for the first time.

<img src={require('../assets/concepts/chaoshub/chaoshub-default.png').default} width="800" />

### 1. Connect a Public Git Repository

You can connect to a public Git repository by simply providing the following details:

- Hub Name
- Git URL of the forked repository
- Branch Name

<img src={require('../assets/concepts/chaoshub/chaoshub-add-public.png').default} width="800" />

### 2. Connect a Private Git Repository

To add a Private Hub, you need provide the Hub name, Git URL of the forked repository and the Branch name similar to that of Public Hub and the repository can be connected by 2 methods:

<img src={require('../assets/concepts/chaoshub/chaoshub-add-private.png').default} width="800" />

#### a. Access Token

Personal Access Tokens are used as an alternative to the password for authentication to Git services.

#### b. SSH Key

Just like the Access Token , SSH keys are used for the authentication. These keys come in pairs, a public key that is shared with the Git Services and a private key that is stored with you.
SSH link of the repository should be provided if you select this method.

<img src={require('../assets/concepts/chaoshub/chaoshub-after-add.png').default} width="800" />

## Syncing a ChaosHub

If some changes are made into the git repository, you can reflect these changes in the hub by selecting the **Refresh Hub** option from the ChaosHub card.

## Editing a ChaosHub

To make changes in a hub like changing the name, branch, access token etc, you can select the **Edit Hub** option from the ChaosHub card.

## Workflows and Experiments in a ChaosHub

### 1. View the PreDefined Workflows

After connecting a ChaosHub, you can view the different pre-defined workflows present in the ChaosHub.

<img src={require('../assets/concepts/chaoshub/chaoshub-predefined-wf.png').default} width="800" />

### 2. View the Chaos-Charts

Similarly, you can view the different charts and the experiment. These charts are sorted according to different categories like generic, aws, azure, kube-components etc.

<img src={require('../assets/concepts/chaoshub/chaoshub-chaos-charts.png').default} width="800" />

### 3. View the experiment details

You can select one of the chart and can examine the experiment details.
The experiment page consists of all the important details like the description of the experiment, a tutorial video, the maintainer of the experiment etc.
You can also find experiment yaml link, RBAC link and the ChaosEngine yaml link of the experiment.
These yaml links are required for the creation of Custom Chaos Workflows.

<img src={require('../assets/concepts/chaoshub/chaoshub-exp-details.png').default} width="800" />

## Disconnect a ChaosHub

To remove a ChaosHub from a project, you can select the **Disconnect Hub** option from the ChaosHub card.

## Summary

ChaosHubs are basically a collection of different clones of the Chaos-Charts repository, which consists of a variety of experiments and pre-defined workflows. You can use a ChaosHub to construct a custom chaos workflow and tune it according to the use-case. These ChaosHubs can also be synced with the latest changes. New experiments and pre-defined workflows can also be added in the repository which can be directly used in the ChaosCenter.

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/qO-lfmorcus" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn More

- [What is a Chaos Workflow](chaos-workflow.md)
- [Examine the ChaosResult](chaos-result.md)

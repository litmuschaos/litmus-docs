---
id: chaoshub
title: ChaosHub
sidebar_label: ChaosHub
---

---

A ChaosHub is a collection of experiment templates and faults that you can use to create and launch chaos experiments. Both experiments and faults are stored as manifests in an appropriate directory structure. This way, new experiment templates and faults can be added directly to the repository as files. In addition, the experiment templates can be derived from the existing experiments to be saved in ChaosHub from the web UI.

- ChaosHub is accessed using a Git service provider such as GitHub, where ChaosHub exists as a repository. This allows native version control and management of the faults and experiment artifacts.

- Chaos experiments can be created from the public [ChaosHub](http://hub.litmuschaos.io/) which is already connected to your ChaosCenter, or a custom ChaosHub which is a [fork](https://github.com/litmuschaos/chaos-charts) of the public ChaosHub where custom faults can be stored.

## Prerequisites

The following are the prerequisites for creating a Chaos Experiment:

- Fork of [Chaos-Charts](https://github.com/litmuschaos/chaos-charts) repository

:::note
An active internet connection is required to clone the git repository for the first time installation.
:::

## Connecting to a Git repository using ChaosHub

With ChaosHub, you can construct chaos experiments by selecting, tuning and sequencing different faults together from their connected ChaosHubs.

You can make changes in your forked repositories and sync it with the Portal to get the latest changes from the fork.

By default, a public ChaosHub is provided when the ChaosCenter is installed for the first time.

<img src={require('../assets/concepts/chaoshub/chaoshub-default.png').default} width="800" />

### 1. Connect a public Git repository

You can connect to a public Git repository by simply providing the following details:

- Hub name
- Git URL of the forked repository
- Branch name

<img src={require('../assets/concepts/chaoshub/chaoshub-add-public.png').default} width="800" />

### 2. Connect a private Git repository

To add a private ChaosHub, you need provide the hub name, Git URL of the forked repository and the branch name similar to that of public hub and the repository can be connected in two ways:

<img src={require('../assets/concepts/chaoshub/chaoshub-add-private.png').default} width="800" />

#### a. Access token

Personal Access Tokens are used as an alternative to the password for authentication to Git services.

#### b. SSH key

Just like the Access Token , SSH keys are used for the authentication. These keys come in pairs, a public key that is shared with the Git Services and a private key that is stored with you.
SSH link of the repository should be provided if you select this method.

<img src={require('../assets/concepts/chaoshub/chaoshub-after-add.png').default} width="800" />

## Syncing a ChaosHub

If some changes are made into the Git repository, you can reflect these changes in the hub by selecting the **Refresh Hub** option from the ChaosHub card.

## Editing a ChaosHub

To make changes in a hub like changing the name, branch, access token etc, you can select the **Edit Hub** option from the ChaosHub card.

## Chaos experiments and experiments in a ChaosHub

### 1. View the PreDefined Chaos Experiments

After connecting a ChaosHub, you can view the different pre-defined chaos experiments present in the ChaosHub.

<img src={require('../assets/concepts/chaoshub/chaoshub-predefined-experiments.png').default} width="800" />

### 2. View the Chaos Faults

Similarly, you can view the different charts and the fault. These charts are sorted according to different categories like generic, AWS, Azure, Kube-Components etc.

<img src={require('../assets/concepts/chaoshub/chaoshub-chaos-charts.png').default} width="800" />

### 3. View the fault details

You can select one of the chaos faults and can examine the fault details. The fault page consists of all the important details like the description of the fault, a tutorial video, the maintainer of the fault, etc.

You can also find the Experiment manifest URL, RBAC URL, and the ChaosEngine URLs of the fault.
These URLs are required for the creation of custom chaos experiments.

<img src={require('../assets/concepts/chaoshub/chaoshub-exp-details.png').default} width="800" />

## Disconnect a ChaosHub

To remove a ChaosHub from a project, you can select the **Disconnect Hub** option from the ChaosHub card.

## Summary

You can select one of the chaos faults and can examine the fault details.The fault page consists of all the important details like the description of the fault, a tutorial video, the maintainer of the fault, etc.
You can also find the Experiment URL URL, RBAC URL, and the ChaosEngine yaml URL of the fault.
These yaml URLs are required for the creation of Custom Chaos Experiments.

## Learn More

- [What is a Chaos Experiment](chaos-workflow.md)

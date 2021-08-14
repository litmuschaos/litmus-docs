---
id: myhub
title: MyHubs
sidebar_label: MyHubs
---

---

MyHubs allows a user to orchestrate workflows from the Public **[ChaosHub](http://hub.litmuschaos.io/)** or an alternate source for the Experiments (basically, a **[fork](https://github.com/litmuschaos/chaos-charts)** of the public source with custom experiments).

With this feature, a user can construct workflows by selecting, tuning and sequencing different experiments from their connected My Hubs.

The user can make changes in their forked repositories and sync it with the Portal to get the latest changes from the fork.

## Connecting a Git repository using MyHubs

### 1. Connect a Public Git Repository

The user can connect to a public Git repository by simply providing the following details:

- Hub Name
- Git URL of the forked repository
- Branch Name

### 2. Connect a Private Git Repository

To add a Private Hub, the user should provide the Hub name, Git URL of the forked repository and the Branch name similar to that of Public Hub and the repository can be connected by 2 methods:

#### a. Access Token

Personal Access Tokens are used as an alternative to the password for authentication to Git services.

#### b. SSH Key

Just like the Access Token , SSH keys are used for the authentication. These keys come in pairs, a public key that is shared with the Git Services and a private key that is stored with the user.
SSH link of the repository should be provided if the user selects this method.

## Syncing a MyHub

If some changes are made into the git repository, the user can reflect those changes in the hub by selecting the **Refresh Hub** option from the MyHub card.

## Editing a MyHub

To make changes in a hub like changing the name, branch, access token etc, the user can select the **Edit Hub** option from the MyHub card.

## Experiments in a MyHub

### 1. View the chart

After connecting a hub, the user can view the different charts and the experiment. The charts are sorted according to different categories like generic, cassandra, kube-components etc.

### 2. View the experiment details

The user can select one of the chart and can examine the experiment details.
The experiment page consists of all the important details like the description of the experiment, a tutorial video, the maintainer of the experiment etc.
The user can also find experiment yaml link, RBAC link and the ChaosEngine yaml link of the experiment.
These yaml links are required for the creation of Custom Chaos Workflows.

## Disconnect a MyHub

To remove a MyHub from a project, the user can select the **Disconnect Hub** option from the MyHub card.

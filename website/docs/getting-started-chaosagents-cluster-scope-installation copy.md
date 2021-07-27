---
id: chaosagents-cluster-scope-installation
title: ChaosAgents Cluster Scope Installation
sidebar_label: Cluster Scope
---

## Prerequisites

- Before connecting a ChaosAgent to the [ChaosCenter](chaoscenter), learn about what is a [ChaosAgent](chaosagents) in Litmus.
- Make sure `litmusctl` is installed.

## Installation

Multiple external Kubernetes agents can be connected to the [ChaosCenter](chaoscenter) with the help of the command line utility litmusctl.

The following steps will help you connect your ChaosAgents via litmusctl

```bash
litmusctl agent connect
```

Next, you need to enter ChaosCenter details to login into your ChaosCenter account. Fields to be filled in:

**ChaosCenter URL:** Enter the URL used to access the ChaosCenter.

> Example, http://172.17.0.2:31696/

**Username:** Enter your LitmusPortal username. <br />
**Password:** Enter your LitmusPortal password.

```bash
🔥 Connecting LitmusChaos agent

📶 Please enter LitmusChaos details --
👉 Host URL where litmus is installed: http://172.17.0.2:31696/
🤔 Username [admin]: admin
🙈 Password:
✅ Login Successful!
```

Upon successful login, there will be a list of exiting projects displayed on the terminal. Select the desired project by entering the sequence number indicated against it.

```bash
✨ Projects List:
1.  MyFirstProject
2.  MySecondProject

🔎 Select Project: 1
```

Next, select the installation mode as Cluster by entering the sequence number indicated against it. There will be a prerequisites check to verify ClusterRole and ClusterRoleBinding post selection.

```shell
🔌 Installation Modes:
1. Cluster
2. Namespace

👉 Select Mode [cluster]: 1

🏃 Running prerequisites check....
🔑  clusterrole - ✅
🔑  clusterrolebinding - ✅

🌟 Sufficient permissions. Connecting Agent
```

Next, enter the details of the new agent.

Fields to be filled in <br />

| Platforms                  | Download Link                                                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agent Name:**            | Enter the name for the new agent.                                                                                                               |
| **Agent Description:**     | Fill in details about the agent.                                                                                                                |
| **Platform Name:**         | Enter the platform name on which this agent is hosted. For example, AWS, GCP, Rancher etc.                                                      |
| **Enter the namespace:**   | You can either enter an existing namespace or enter a new namespace. In cases where the namespace does not exist, litmusctl creates it for you. |
| **Enter service account:** | Enter a name for your service account.                                                                                                          |

```shell
🔗 Enter the details of the agent ----
🤷 Agent Name: my-agent
📘 Agent Description: This is a new agent.
📦 Platform List
1. AWS
2. GKE
3. Openshift
4. Rancher
5. Others
🔎 Select Platform [Others]: 5
📁 Enter the namespace (new or existing) [litmus]: litmus
🔑 Enter service account [litmus]: litmus
```

Once, all these steps are implemented you will be able to see a summary of all the entered fields.
After verification of these details, you can proceed with the connection of the agent by entering Y. The process of connection might take up to a few seconds.

```shell
📌 Summary --------------------------

Agent Name:         my-agent
Agent Description:  This is a new agent.
Platform Name:      Others
Namespace:          litmus
Service Account:    litmus
Installation Mode:  cluster

-------------------------------------

🤷 Do you want to continue with the above details? [Y/N]: Y

💡 Connecting agent to Litmus Portal.
🏃 Agents running!!
🚀 Agent Connection Successful!! 🎉
👉 Litmus agents can be accessed here: http://172.17.0.2:31696/targets
```

---

## **Verify the new Agent Connection**

To verify, if the connection process was successful you can view the list of connected agents from the Targets section on your ChaosCenter and ensure that the connected agent is in Active State.

## Resources

#### Videos

<iframe width="560" height="315" src="https://www.youtube.com/embed/uIVrNH2_nVI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn More

- [Install ChaosAgents in Namespace Scope](chaosagents-namespace-scope-installation)
- [Install ChaosCenter in Cluster Scope](chaoscenter-cluster-scope-installation)
- [Install ChaosCenter in Namespace Scope](chaoscenter-namespace-scope-installation)
- [Setup Endpoints and Access ChaosCenter without Ingress](setup-without-ingress)
- [Setup Endpoints and Access ChaosCenter with Ingress](setup-with-ingress)

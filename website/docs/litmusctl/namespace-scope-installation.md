---
id: namespace-scope-installation
title: Installing Agent with Namespace Scope
sidebar_label: Namespace Scope
---

Multiple external [ChaosAgents](../getting-started/chaosagents.md) can be connected to application namespace/s with the help of the command line utility [litmusctl](installation).

There can be one or more than one ChaosAgent in a cluster connected to different namespaces of the same cluster.

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

Upon successful login, there will be a list of existing projects displayed on the terminal. Select the desired project by entering the sequence number indicated against it.

```bash
✨ Projects List:
1.  MyFirstProject
2.  MySecondProject

🔎 Select Project: 1
```

Next, select the installation mode as Namespace by entering the sequence number indicated against it. There will be a prerequisites check to verify Role and RoleBinding post selection.

```shell
🔌 Installation Modes:
1. Cluster
2. Namespace

👉 Select Mode [cluster]: 2

🏃 Running prerequisites check....
🔑  role - ✅
🔑  rolebinding - ✅

🌟 Sufficient permissions. Connecting Agent
```

Next, enter the details of the new agent.

Fields to be filled in <br />

| Platforms                  | Download Link                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Agent Name:**            | Enter the name for the new agent.                                                                        |
| **Agent Description:**     | Fill in details about the agent.                                                                         |
| **Platform Name:**         | Enter the platform name on which this agent is hosted. For example, AWS, GCP, Rancher etc.               |
| **Enter the namespace:**   | You can either enter an existing namespace (where your application is running) or create a new namespace |
| **Enter service account:** | Enter a name for your service account.                                                                   |

:::note
Since Namespaced Scope ChaosAgent don't have Cluster Wide Permission therefore if you are willing to install the ChaosAgent in new namespace, the namespace won't be automatically created

If you install the Namespaced Scope ChaosAgent in the same namespace as ChaosCenter, since the subscriber is already present in the namespace, you will see this message `🚫 Subscriber already present. Please enter a different namespace` in such cases you have to create a new namespace in the cluster to install the ChaosAgent else choose the existing namespace where your application resides _(besides the ns where ChaosCenter is present)_
:::

```shell
🔗 Enter the details of the agent ----
🤷 Agent Name: my-agent
📘 Agent Description: This is a new namespace agent.
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
Installation Mode:  namespace

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

## Learn more

- [Learn more about Litmusctl](installation)
- [Install ChaosAgents in Cluster Scope](cluster-scope-installation)
- [Setup Endpoints and Access ChaosCenter without Ingress](../user-guides/setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](../user-guides/setup-with-ingress.md)

---
id: connect-chaos-infrastructure
title: Connect Chaos Infrastructure
sidebar_label: Connect Chaos Infrastructure
---



This guide walks you through connecting a Chaos Infrastructure to your ChaosCenter using litmusctl. A Chaos Infrastructure is required to run chaos experiments in your Kubernetes cluster.

Follow these steps to connect a Chaos Infrastructure using `litmusctl`.

## Steps to connect a Chaos Infrastructure

1. Set up an account with litmusctl

Run the following command and follow the prompts to add your ChaosCenter account to `litmusctl`:

```shell
litmusctl config set-account
```

You will be asked to provide your ChaosCenter details:

- ChaosCenter URL: The URL used to access your ChaosCenter (for example, `https://preview.litmuschaos.io/`)
- Username: Your ChaosCenter username
- Password: Your ChaosCenter password

Example interaction:

```
Host endpoint where litmus is installed: https://preview.litmuschaos.io/
Username [Default: admin]: admin

Password:
account.username/admin configured
```

2. Connect a Chaos Infrastructure (cluster or namespace mode)

Run the connect command:

```shell
litmusctl connect chaos-infra
```

The CLI will list the existing projects. Select the project you want to connect the infrastructure to by entering the project number:

```
Project list:
1.  Project-Admin

Select a project [Range: 1-1]: 1
```

Next, choose the installation mode:

- Cluster mode: The Chaos Infrastructure can run chaos in any namespace. This mode installs cluster roles and cluster role bindings.

- Namespace mode: The Chaos Infrastructure runs only in its namespace and installs roles and role bindings for that namespace. 

Note: You must create the namespace beforehand when using namespace mode.

Example selection and prerequisites check:

```
Installation Modes:
1. Cluster
2. Namespace

Select Mode [Default: cluster] [Range: 1-2]: 1

🏃 Running prerequisites check....
🔑 clusterrole ✅
🔑 clusterrolebinding ✅
🌟 Sufficient permissions. Installing the Chaos Infrastructure...
```

3. Provide Chaos Infrastructure details

You will be prompted to enter details for the new Chaos Infrastructure. The fields and their descriptions are listed below.

| Field | Description |
|---|---|
| Chaos Infrastructure Name | A unique name for the Chaos Infrastructure within the project |
| Chaos Infrastructure Description | Description/details about the Chaos Infrastructure |
| Chaos EnvironmentID | The Environment ID this infra will belong to (must already exist) |
| Skip SSL verification | Whether to skip SSL/TLS verification (Y/N) |
| Node Selector | Optional nodeSelector labels to target specific nodes |
| Platform Name | Platform where the infra is hosted (for example: AWS, GKE, Openshift, Rancher, Others) |
| Namespace | Namespace to install the Chaos Infrastructure in (existing or new; litmusctl will create it if it doesn't exist) |
| Service Account | Existing or new service account to use |

Example prompts and selections:

```
Enter the details of the Chaos Infrastructure:

Chaos Infrastructure Name: New-Chaos-infrastructure

Chaos Infrastructure Description: This is a new Chaos Infrastructure

Chaos EnvironmentID: test-infra-environment

Do you want Chaos Infrastructure to skip SSL/TLS check (Y/N) (Default: N): n

Do you want NodeSelector to be added in the Chaos Infrastructure deployments (Y/N) (Default: N): N

Platform List:
1. AWS
2. GKE
3. Openshift
4. Rancher
5. Others

Select a platform [Default: Others] [Range: 1-5]: 5

Enter the namespace (new or existing namespace) [Default: litmus]:
👍 Continuing with litmus namespace
```

4. Confirm and connect

After entering all fields, `litmusctl` will show a summary of the entered values. Verify the details and confirm to proceed by entering Y. The connection process may take a few seconds.

```
Enter service account [Default: litmus]:

📌 Summary
Chaos Infra Name: test4
Chaos EnvironmentID: test
Chaos Infra Description:
Chaos Infra SSL/TLS Skip: false
Platform Name: Others
Namespace:  litmuwrq (new)
Service Account:  litmus (new)


Installation Mode: cluster

🤷 Do you want to continue with the above details? [Y/N]: Y
👍 Continuing Chaos Infrastructure connection!!

💡 Connecting Chaos Infrastructure to ChaosCenter.
🏃 Chaos Infrastructure is running!!

🚀 Chaos Infrastructure Connection Successful!! 🎉
```

5. Verify the new Chaos Infrastructure connection

To verify the connection, open your ChaosCenter and go to the Targets section. You should see the newly connected Chaos Infrastructure listed and in Active state.

---

For additional details or examples, you can also refer to this [guide](https://github.com/litmuschaos/litmusctl/blob/master/Usage_0.23.0.md#steps-to-connect-a-chaos-infrastucture).

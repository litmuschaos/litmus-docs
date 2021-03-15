---
id: gitops
title: GitOps
sidebar_label: GitOps
---

---
GitOps feature in Litmus enables the users to configure a single source of truth for their chaos workflows and experiments, any changes made either to the artifacts stored in the configured git repository or the portal will be synced. This allows creation and execution of workflows directly from git enabling a vast scope of automation in CI/CD pipelines. 

Besides the sync feature GitOps in Litmus provides a way of using Event-Driven Chaos Injection, where target resources(statefulsets, deployments etc.) can be configured to automatically trigger chaos workflows with any changes in the resource spec. Currently the event supported for chaos injection is resource **image change**, but in the future releases a wide variety of policies will be added to configure various events for chaos injection. 

The event driven chaos injection allows Litmus to be integrated with traditional GitOps flow that involves automated deployment of applications or workloads, for example users can now automatically trigger chaos workflows whenever a new release is created for their application and is deployed by a continuous delivery system.

GitOps is by default disabled for the projects created in Litmus, but it can be enabled and configured from the **GitOps** tab in Litmus portal **Settings**

## Configuring a Git repository for GitOps

To configure a git repo the user must provide the Git URL of the repository and the Branch name and the authentication credentials which are of two types:

#### a. Access Token
Personal Access Tokens are used as an alternative to the password for authentication to Git services. 

#### b. SSH Key
Just like the Access Token, SSH keys are used for the authentication. These keys come in pairs, a public key that is shared with the Git Services and a private key that is stored in the server. 
SSH link of the repository should be provided if the user selects this method.

Once GitOps is enabled, any new workflows created will be stored in the configured repo in the path `litmus/<project-id>/<workflow-name>.yaml`.

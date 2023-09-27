---
id: faq
title: FAQ
sidebar_label: FAQ
---

---

## Installation

### Can we host Mongodb outside the cluster? What connection string is supported? Is SSL connection supported?

Yes we can host Mongodb outside the cluster, the mongo string can be updated accordingly `DataBaseServer: "mongodb://mongo-service:27017"`.
We use the same connection string for both authentication server and graphql server containers in Chaoscenter-server deployment, also there are the db user and db password keys that can be tuned in the configmap like `DB_USER: "admin"` and `DB_PASSWORD: "1234"`.
We can connect with SSL if certificate is optional. If our requirement is ca.cert auth for the SSL connection, then this is not available on portal.

### What is the minimum system requirement to run Chaoscenter and chaos infrastructure together?

To run Chaoscenter you need to have a minimum of 1 GiB memory and 1 core of CPU free.

### Is there any way to use Litmus within github? Basically when someone submits a k8s deployment for a PR, We want to run Chaos Experiment on that to see whether it passes or not.

Yes, with the help of github-chaos-action we can automate the chaos execution on an application in the same place where the code is stored. We can write individual tasks along with chaos actions and combine them to create a custom GitHub workflow. GitHub Workflows are custom automated processes that we can set up in our repository to build, test, package, or deploy any code project on GitHub. Including the GitHub chaos actions in our workflow YAML, We can test the performance/resiliency of our application in a much simpler and better way. To know more visit our Github chaos action [repository](https://github.com/litmuschaos/github-chaos-actions).

### I encountered the concept of `namespace` and `cluster` scope during the installation. What is meant by the scopes, and how does it affect experiments to be performed outside or inside the litmus Namespace?

The scope of portal control plane (portal) installation tuned by the env `PORTAL_SCOPE` of litmusportal-server deployment can be kept as a namespace if you want to provide a very restricted access to litmus; It's useful in dev environments like Okteto cloud etc.
That basically restricts portal installation along with its chaos delegate to a single namespace and the chaos operator, exporter all get installed in a single namespace and can only perform and monitor chaos in that namespace.
Other than that there is another key in the control plane’s configmap `litmus-portal-admin-config` called `AgentScope`, this is given to allow users to restrict access to the litmus self chaos delegate components self chaos delegate is the chaos delegate for your control plane cluster (exporter, operator etc), you can use both of them in a way to give access as per the requirement.
The above holds for the control plane and self chaos delegate, for the external chaos delegates which can be connected using the litmusctl CLI you can provide the scope of the chaos delegate while using the utility to connect your other cluster to the control plane with access to just a single namespace or cluster-wide access.
Using a combination of AgentScope: cluster and `PORTAL_SCOPE` env set to cluster would give you cluster-admin privileges to inject chaos on all namespaces where the control plane/portal is installed. For external chaos delegates just selecting the scope of installation as cluster would be sufficient via litmusctl.

### Does Litmus 3.0 support backward compatibility with Litmus 2.0?

No, LitmusChaos 3.0.0 is not backward compatible with LitmusChaos 2.0.0.

### Can I run LitmusChaos Outside of my Kubernetes clusters?

Yes, you can run the ansible faults outside of the k8s cluster which is dockerized under this image litmuschaos/ansible-runner:ci. But other components such as chaos-operator, chaos-exporter, and runner are Kubernetes native. They requires k8s cluster to run on it.

## Chaos Experiment

### What does failed status of chaos experiment means in LitmusPortal?

Failed status indicates that either there is some misconfiguration in the chaos experiment or the default hypothesis of fault was disproved and some of the faults in the chaos experiment failed, In such case the resiliency score will be less than 100.

### How is resilience score calculated?

The Resilience score is calculated on the basis of the weightage and the Probe Success Percentage of the fault. Resilience for one single fault is the multiplication of the weight given to that fault and the Probe Success Percentage. Then we get the total test result by adding the resilience score of all the faults. The Final Resilience Score is calculated by dividing the total test result by the sum of the weights of all the faults combined in the single chaos experiment. For more detail refer to [this blog](https://dev.to/litmus-chaos/how-the-resilience-score-algorithm-works-in-litmus-1d22).

## Chaoshub

### How can I setup chaoshub of my own gitlab repo in Chaoscenter?

In the Chaoscenter when you go to the chaoshub section and you click on connect new hub button, you can see that there are two modes of authentication i.e public mode and private mode. In public mode, you only have to provide the git URL and branch name.

In private mode, we have two types of authentication; Access token and SSH key.
For the access token, go to the settings of GitLab and in the Access token section, add a token with read repository permission. After getting the token, go to the Chaoscenter and provide the GitLab URL and branch name along with the access token. After submitting, your own chaos hub is connected to the Chaoscenter.
For the SSH key, click on the SSH and it will generate a public key. You have to use this public key and put it in your GitLab account. Just go to the settings of GitLab, you can see the SSH key section, go to the SSH key section and add your public key. After adding the public key. Get the ssh type URL of the git repository and put it in the Chaoscenter along with the branch. After submitting, your own chaoshub is connected to the Chaoscenter.

## Gitops

### How can users integrate Litmuschaos in their environment with Gitops?

Gitops feature in Litmus enables users to sync chaos experiments from a configured git repo, any chaos experiment inserts/updates made to the repo will be monitored and picked up by Chaoscenter and will be executed on the target cluster. Chaoscenter gitops also includes an event-driven chaos injection feature where users can annotate an application to be watched for changes and if and when the change happens chaos experiments can be triggered automatically. This integrates with other gitops tools like flux/argo cd and enables users to automatically run chaos experiments whenever a new release happens or a particular change occurs in the application.
To configure a git repo the user must provide the Git URL of the repository and the Branch name and the authentication credentials which are of two types:

- Access Token
- SSH Key

Once GitOps is enabled, any new chaos experiments created will be stored in the configured repo in the path `litmus/<project-id>/<chaos-experiment-name>.yaml`.

## Litmusctl

### Does Litmusctl support actions that are currently performed from the portal dashboard?

Yes, Chaos Infrastructure connection, creation and chaos experiment executiom are now being supported in Litmusctl. [documentation of litmusctl](https://github.com/litmuschaos/litmusctl/blob/master/Usage_0.23.0.md).

### How to solve `invalid token` issue in litmusctl?

You can use the command `litmusctl config set-account` to generate a new token. You get `invalid token` error if the authorization token is expired. Authorization token has a life span of 24 hours.

### How to check if installed version of litmus control plane is compatible with installed litmusctl?

litmusctl will prompt if your installed litmusctl and litmus control plane are compatible when user runs `litmusctl config set-account`

### How to check compatibility of litmusctl with litmus control plane?

You can use command `litmusctl version` to check the compatibility of litmusctl or you can refer to: https://github.com/litmuschaos/litmusctl#compatibility-matrix to get the compatibility matrix of litmusctl and litmus control plane.

## Usage

### Can I use Litmus in Production?

Yes, you can use Litmuschaos in production. Litmus has a wide variety of faults and is designed as per the principles of chaos. But, if you are new to Chaos Engineering, we would recommend you to first try Litmus on your dev environment, and then after getting the confidence, you should use it in Production.

### How can we use Litmus in our DevOps pipeline/cycle?

You can add litmus to the CI/CD pipelines as part of an end-to-end testing approach due to its minimal pre-requisites and simple result mechanisms. It also provides utilities for quick setup of Kubernetes clusters on different platforms as well as installation of storage provider control plane components (operators). [Openebs.ci](https://openebs.ci/home) is a reference implementation of how litmus can be used in the DevOps pipeline.

---
id: create-infrastructure
title: Create an Infrastructure
sidebar_label: Create an Infrastructure
---

## Before you begin

- You can learn about the concept of chaos infrastructures & chaos environments [here](../concepts/infrastructure.md).

- You will need to create an environment for your chaos infrastructure to reside within. Environments are an abstraction layer over infrastructures, and a detailed guide on the environment creation process can be found [here](./create-environment.md)

## 1. Go to the Infrastructure section

Navigate to the `/environments` page (**Environments** sidebar option on the left nav), and click on the Environment you wish to install the chaos infrastructure in:

<img src={require('../assets/user-guides/infrastructure/create-infrastructure/step-1.png').default} />

## 2. Enable Chaos

Click on the **Enable Chaos** button:

<img src={require('../assets/user-guides/infrastructure/create-infrastructure/step-2.png').default} />

## 3. Add details of the Infrastructure

Add the details of the infrastructure such as the name, description and tags, then click on the **Next** button:

<img src={require('../assets/user-guides/infrastructure/create-infrastructure/step-3.png').default} />

## 4. Tune the cluster level specifications

Choose one of the following modes:

- **Cluster Wide:** This mode of infrastructure installation allows targeting workloads across the cluster, in all the namespaces.

- **Namespace Mode:** This mode of infrastructure installation allows targeting workloads only in the namespace where the chaos infrastructure is deployed.

By default the installation will take place in the `litmus` namespace and uses `litmus` service account, which can be configured under the cluster details.

Optionally, you can also specify the node selectors and Kubernetes tolerations for chaos infrastructure deployment in the advanced section.

<img src={require('../assets/user-guides/infrastructure/create-infrastructure/step-4.png').default} />

## 5. Deploy your Chaos Infrastructure

- For cluster-wide access:

<ol type="a">
  <li>Select Download, and then copy and run the <code>kubectl</code> command shown on your screen to install the chaos infrastructure.</li>
</ol>

<img src={require('../assets/user-guides/infrastructure/create-infrastructure/step-5.png').default} />

- For namespace access:

<ol type="a">
  <li>Run the first <code>kubectl</code> command to create the target namespace.</li>
  <li>Run the second <code>kubectl</code> command to apply the chaos CRDs.</li>
  <li>Select Download, and then copy and run the third command to install the chaos infrastructure.</li>
</ol>

<img src={require('../assets/user-guides/infrastructure/create-infrastructure/step-6.png').default} />

Click **Done**

**NOTE:** For HTTPS mode of installation of Chaoscenter, you will need to set `SKIP_SSL_VERIFY` as `true` in the infrastructure deployment yaml.
 
The newly created infrastructure will appear in the list of infrastructures:

<img src={require('../assets/user-guides/infrastructure/create-infrastructure/step-7.png').default} />

---
id: gettingstarted
title: Setting Up Litmus
sidebar_label: Getting Started
original_id: gettingstarted
---

---

- Clone the Litmus Github repository & run the interactive pre-requisites bash script

- Provide the absolute path of the cluster config (kubeconfig) file

- The script performs the following tasks:

  - Creates a dedicated namespace for execution of test containers
  - Creates a service account and sets up RBAC policy, in order to interact with the
    kube-apiserver from within the test container
  - Installs the custom resource definition for the litmus results CR
  - Creates config map of the cluster config which is mounted to the test/logger pods

```
git clone https://github.com/openebs/litmus.git
cd litmus/hack

bash litmus-prerequisites.sh
Provide the KUBECONFIG path: [default=/home/ubuntu/.kube/config]

Selected kubeconfig file: /home/ubuntu/.kube/config
Applying the litmus RBAC..
namespace "litmus" created
serviceaccount "litmus" created
clusterrole.rbac.authorization.k8s.io "litmus" created
clusterrolebinding.rbac.authorization.k8s.io "litmus" configured
Customresourcedefinition.apiextensions.k8s.io "litmusresults.litmus.io" created
Creating configmap..
configmap "kubeconfig" created
```

<br/>

<br/>

<hr/>

<br/>

<br/>

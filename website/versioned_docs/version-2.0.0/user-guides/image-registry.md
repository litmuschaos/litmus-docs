---
id: image-registry
title: Using different Image Registries in a Workflow
sidebar_label: Using different Image Registries
---

---

A container image registry can be defined as a collection of repositories that store container image.
These can be either public or private. Few of the container image registries are Docker, Red Hat Quay, Google Container Registry.
By default LitmusChaos uses DockerHub for managing the different images. These images are then used in Chaos Workflows. Few images that are used in the Litmus workflows are `litmuschaos:k8s`, `litmuschaos:litmus-checker` etc.
With ChaosCenter, you get the privilege to use your own/custom image registries for Chaos Workflows.

## Before you begin

To understand the concept of Image Registry, make sure you are aware of [Chaos Workflow](../concepts/chaos-workflow.md) and the different image registries that are used in it.

## Steps to Update Chaos Workflow Image Registry

To updated the Chaos Workflow Image Registry, you can go to Settings in ChaosCenter. In settings, there will be tab named Image Registry. On clicking the Image Registry tab, you can see that the default Registry server is `docker.io`, Registry name is `litmuschaos` and it is a Public registry.

<img src={require('../assets/user-guides/image-registry/img-registry-tab.png').default} width="800" />
<br/><br/>

To update this, click on the `Use Custom Values` option and provide the following details:

1. Registry Server
2. Registry Name
3. Registry Type `Public/Private`

<img src={require('../assets/user-guides/image-registry/img-registry-update.png').default} width="800" />
<br/><br/>

If the Registry Type is `Private`, make sure to provide the secret and the namespace where the secret is present.

Once the details are provided, click on the `Save Changes` button and you can see the updated Image Registry changes.

<img src={require('../assets/user-guides/image-registry/img-registry-updated.png').default} width="800" />

<br/><br/>

Now while scheduling a workflow, the image registry changes will be visible. Here's the code snippet from a Chaos Workflow after the image registry change.

```yaml
- name: install-application
      container:
        image: docker.io/testing-reg/litmus-app-deployer:latest
        args:
          - -namespace=bank
          - -typeName=resilient
          - -operation=apply
          - -timeout=400
          - -app=bank-of-anthos
          - -scope=cluster
    - name: install-chaos-experiments
      container:
        image: docker.io/testing-reg/k8s:latest
```

## Learn More

- [What is a Chaos Workflow](../concepts/chaos-workflow.md)
- [What is ChaosCenter](../getting-started/resources.md#chaoscenter)

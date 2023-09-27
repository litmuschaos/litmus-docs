---
id: image-registry
title: Using different Image Registries in a Chaos Experiments
sidebar_label: Using different Image Registries
---

---

A container image registry can be defined as a collection of repositories that store container image.
These can be either public or private. Few of the container image registries are Docker, Red Hat Quay, Google Container Registry.
By default LitmusChaos uses DockerHub for managing the different images. These images are then used in Chaos experiments. Few images that are used in the Litmus chaos experiments are `litmuschaos:k8s`, `litmuschaos:litmus-checker` etc.
With ChaosCenter, you get the privilege to use your own/custom image registries for Chaos experiments.

## Before you begin

To understand the concept of Image Registry, make sure you are aware of [Chaos experiment](../concepts/chaos-workflow.md) and the different image registries that are used in it.

## Steps to Update Chaos experiment Image Registry

To updated the Chaos experiment Image Registry, you can go to Image Registry in ChaosCenter (Project Setup > Image Registry on the left nav). On clicking the Image Registry tab, you can see that the default Registry server is `docker.io`, Registry name is `litmuschaos` and it is a Public registry.

<img src={require('../assets/user-guides/image-registry/img-registry-tab.png').default} />
<br/><br/>

To update this, click on the `Use Custom Values` option and provide the following details:

1. Custom Image Registry (Registry Server)
2. Custom Repo (Registry Name)
3. Registry Type `Public/Private`

<img src={require('../assets/user-guides/image-registry/img-registry-update.png').default} />
<br/><br/>

If the Registry Type is `Private`, make sure to provide the secret.

Once the details are provided, click on the `Save` button and you can see the updated Image Registry changes.

<img src={require('../assets/user-guides/image-registry/img-registry-updated.png').default} />

<br/><br/>

Now while scheduling a chaos experiment, the image registry changes will be visible. Here's the code snippet from a Chaos experiment after the image registry change.

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

- [What is a Chaos experiment](../concepts/chaos-workflow.md)
- [What is ChaosCenter](../getting-started/resources.md#chaoscenter)

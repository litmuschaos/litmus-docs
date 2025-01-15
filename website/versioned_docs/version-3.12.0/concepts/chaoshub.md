---
id: chaoshub
title: ChaosHub
sidebar_label: ChaosHub
---

---

A ChaosHub is a collection of experiment templates and faults that you can use to create and launch chaos experiments. Both experiments and faults are stored as manifests in an appropriate directory structure. This way, new experiment templates and faults can be added directly to the repository as files. In addition, the experiment templates can be derived from the existing experiments to be saved in ChaosHub from the web UI.

- ChaosHub is accessed using a Git service provider such as GitHub, where ChaosHub exists as a repository. This allows native version control and management of the faults and experiment artifacts.

- Chaos experiments can be created from the public [ChaosHub](http://hub.litmuschaos.io/) which is already connected to your ChaosCenter, or a custom ChaosHub which is a [fork](https://github.com/litmuschaos/chaos-charts) of the public ChaosHub where custom faults can be stored.

## Chaos experiments and experiments in a ChaosHub

For information on viewing predefined chaos experiments, refer to [Viewing Predefined Chaos Experiments](../user-guides/viewing-predefined-experiments.md).

For information on viewing chaos faults and their details, refer to [Viewing Chaos Faults](../user-guides/viewing-chaos-faults.md).

## Summary

You can select one of the chaos faults and can examine the fault details.The fault page consists of all the important details like the description of the fault, a tutorial video, the maintainer of the fault, etc.
You can also find the Experiment URL URL, RBAC URL, and the ChaosEngine yaml URL of the fault.
These yaml URLs are required for the creation of Custom Chaos Experiments.

## Learn More

- [What is a Chaos Experiment](chaos-workflow.md)

---
id: terms
title: Glossary Terms
sidebar_label: Terms
---

---

- **Chaos Engineering**: [<u>Chaos Engineering</u>](https://en.wikipedia.org/wiki/Chaos_engineering) is a field of engineering that is focused on the design and implementation of systems that are subject to failure.

- **Chaos Experiments**: [<u>Chaos Experiments</u>](https://en.wikipedia.org/wiki/Chaos_experiment) are off-the-shelf templates that one needs to "pull" before including them as part of a chaos run against any target applications

- **Chaos Workflow**: [<u>Chaos Workflow</u>](https://en.wikipedia.org/wiki/Chaos_workflow) is a type of workflow that is used to model the behavior of a system under failure. It supports the user in defining the expected result, observing the result, analysing the overall system behaviour, and in the decision-making process if the system needs to be tuned for improving the resilience of the system.

- **CRDs**: [<u>Custom Resource Definitions</u>](https://kubernetes.io/docs/concepts/api-extension/custom-resources/) are a type of Kubernetes API that allows users to define their own custom resources.

- **Chaos Operator**: [<u>Chaos Operator</u>](https://github.com/litmuschaos/chaos-operator) is are used to inject chaos into applications and Kubernetes architecture in a fashioned manner.

- **Chaos Scheduler**: [<u>Chaos Scheduler</u>](https://github.com/litmuschaos/chaos-scheduler) is a Kubernetes scheduler, which are custom-controllers with direct access to Kubernetes API that can manage the lifecycle of certain resources or applications, while always trying to ensure the resource is in the "desired state".

- **Chaos Control Plane**: [<u>Chaos Control Plane</u>](https://docs.litmuschaos.io/docs/architecture/chaos-control-plane/) consist of micro-services responsible for the functioning of the Chaos Center, the website-based portal that can be used for interacting with Litmus, apart from the CLI.

- **Litmus Service Account**: [<u>Kubernetes Service Account</u>](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) allow you to give an identity to your Pods, which can be used to: Authenticate Pods to the Kubernetes API server, allowing the Pods to read and manipulate Kubernetes API objects (for example, a CI/CD pipeline that deploys applications to your cluster).

- **ChaosCenter**: [<u>Chaos Center</u>](https://docs.litmuschaos.io/docs/getting-started/resources#chaoscenter) is a single source of truth to control all the different Chaos Activities happening around Litmus

- **Chaos Agent**: [<u>Chaos Agent</u>](https://docs.litmuschaos.io/docs/getting-started/resources#chaosagents) is the target cluster where Chaos would be injected via Litmus.

- **Gitops**: [<u>Gitops</u>](https://docs.litmuschaos.io/docs/concepts/overview#gitops/) enables you to configure a single source of truth for your chaos workflows and experiments

- **Probes**: [<u>Probes</u>](https://docs.litmuschaos.io/docs/concepts/probes) are pluggable checks that can be defined within the ChaosEngine for any Chaos Experiment
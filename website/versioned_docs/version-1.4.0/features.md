---
id: features
title: Litmus Features
sidebar_label: Features
original_id: features
---

---

## <font size="6">Containerized & Deployable Test Cases</font>

Test business logic is executed from inside “runner” pods managed by the Kubernetes
job controller. All the test aids, such as load generation tools, failure/chaos
injection utilities, logging mechanisms are also deployed as containers. A Litmus
e2e test is defined, maintained and deployed (run) as a single or set of simple
Kubernetes Job Specifications.

## <font size="6">Platform Agnostic</font>

As a consequence of being containerized & Kubernetes native, Litmus tests can be run
across different Kubernetes platforms, with minimal or no changes to the tests - from
managed services (GKE, AKS, EKS) to cloud hosted (KOPS based GCP, AWS), baremetal
cloud (kubespray/kubeadm based Packet) and on-premise solutions (Openshift).

## <font size="6">Written in Ansible, Powered by Kubectl</font>

One of the primary considerations while designing the litmus framework was to keep
the test workflows & code - as “DevOps-Centric” as possible, thereby allowing for
greater end user-participation in the definition & implementation of test scenarios.
Ansible was used as it has been the DSL of choice in the management of infrastructure
in the devops world, with increasing scripting/programmatic capabilities every release.
Litmus e2e, in some ways, is more about application & infrastructure manipulation
than anything else. In the same vein, kubectl, the powerful Kubernetes CLI tool with
rich support for object management & filters, has been used for all cluster interactions.

## <font size="6">Uses Microservice Philosophy (Do one thing, Do it well)</font>

Litmus provides separate litmusbooks for various functions such as application deployment
and deprovision, load generation, monitoring, specific day 1/2 ops, chaos/failure
injections etc., in order to enable their use, individually, in non-testcase contexts
(i.e., outside of CI pipelines) as well as provide better debuggability when ordered
together as different stages of an “e2e” test.

## <font size="6">Leverage Open source Chaos Tools</font>

Litmus uses capabilities of popular tools such as pumba & chaostoolkit in order to
induce chaos in the kubernetes cluster, while using home-grown techniques
(think privileged daemonsets inducing service loss & resource exhaustion!) where
necessary.

## <font size="6">Easily Extensible</font>

Litmus currently works with a wide range of stateful applications, uses different
workload generators and supports OpenEBS & Local PV storage providers. It has an
inherently extensible architecture, wherein different type of tools and test code
(say, for ex. A new BDD test written in GO) can be accomodated to run as a “litmus test”,
provided they are containerized & can run on the Kubernetes cluster.

## <font size="6">Integration with CI Pipelines</font>

Litmus lends itself to easy integration with CI/CD pipelines, due to minimal
pre-requisites and simple result mechanisms. It also provides utilities for quick setup
of Kubernetes clusters on different platforms as well as installation of storage provider
control plane components (operators). [Openebs.ci](https://openebs.ci) is a reference
implementation of the above.

<br/>

<br/>

<hr/>

<br/>

<br/>

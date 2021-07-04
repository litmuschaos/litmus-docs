---
id: architecture
title: Litmus Architecture
sidebar_label: Architecture
---

---

<img src={require('./assets/portal-arch.jpg').default} width="800" />

The above picture gives you a high-level architecture of the Litmus. At highlevel, Litmus components can be classified into two parts 

1. Portal
2. Agents 

**Portal**  is a set of Litmus components which act as Cross Cloud Chaos Control plane (WebUI) which is used to orchestrate and observe the chaos workflows on Agents.

**Agent** is the set of Litmus components which induces Chaos using the chaos workflows on the K8S cluster component.

A typical user scenario would be when a user would installs litmus, this would in-turn install Portal and Agent on the self cluster. Using the portal user can create/schedule new chaos workflows on the Agents and observe the results from here. Users can also connect more clusters to the portal, and use the Portal as single window pane for cross cloud chaos management.


#### Portal Components

Portal has the following components

- **Litmus WebUI** <br />
  Litmus UI provides web user interface, where a user can construct and observe the chaos workflow at ease. Also this act as a cross cloud chaos control plane.

- **Litmus Server**<br />
  Litmus Server act as middleware which is use to handle API request from the user interface, store the config and result details into the DB. This also act as an interface to communicate between the requests and scheduling the workflow to the Agent.

- **Litmus DB**<br />
  Litmus DB act as a config store for chaos workflows and its results.

#### Agent components
Agents has the following Litmus components

- **Chaos Operator**<br />
  Chaos-Operator watches for the ChaosEngine CR and executes the Chaos-Experiments mentioned in the CR. Chaos-Operator is namespace scoped. By default, it runs on the `litmus` namespace. Once the experiment is completed, chaos-operator invokes chaos-exporter to export chaos metrics to a Prometheus database.

-  **CRDs**<br />
   During installation, the following three CRDs are installed on the Kubernetes cluster.

  ```
  chaosexperiments.litmuschaos.io
  chaosengines.litmuschaos.io
  chaosresults.litmuschaos.io
  ```

- **Chaos Experiment**<br />
  Chaos Experiment is a CR and are available as YAML files on [Chaos Hub](https://hub.litmuschaos.io/). For more details visit [Chaos Hub documentation](https://litmusdocs-beta.netlify.app/docs/chaoshub).

- **Chaos Engine**<br />
  ChaosEngine CR links application to experiments. User has to create ChaosEngine YAML by specifying the application label, it's experiments and create the CR. The CR is watched by Chaos-Operator and chaos-experiments are executed on a given application.

- **Chaos Results**<br />
  ChaosResult resource holds the results of a ChaosExperiment within a namespace scope. It is created or updated at runtime by the experiment itself. It holds important information like the ChaosEngine reference, Experiment State, Verdict of the experiment (on completion), salient application/result attributes. It is also a source for metrics collection. It is updated/patched with the status of the experiment run. It is not removed as part of the default cleanup procedures to allow for extended reference.

- **Chaos Probes**<br />
  Litmus probes are pluggable checks that can be defined within the ChaosEngine for any chaos experiment. The experiment pods execute these checks based on the mode they are defined in & factor their success as necessary conditions in determining the verdict of the experiment (along with the standard “in-built” checks).

- **Chaos Exporter**<br />
  Optionally metrics can be exported to a Prometheus database. Chaos-Exporter implements the Prometheus metrics endpoint.

- **Subscriber**<br />
  Subscriber is the component used in Agent side which interact with Litmus Server component to get the details of Chaos workflow and send the results back.


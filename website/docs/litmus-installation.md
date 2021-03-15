---
id: litmus-install
title: How to install Litmus
sidebar_label: Litmus
---

---
<iframe width="560" height="315" src="https://www.youtube.com/embed/rOrKegj5ePI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### **Create a Litmus namespace in Kubernetes**

```bash
kubectl create ns litmus
```

### **Add the Litmus Helm Chart**

To get started you need to add the **litmuschaos** helm repo

```bash
helm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/
```

### **Install Litmus**

The helm chart will install all the CRDs, required service account configuration, and chaos-operator required both for the core services as well as the portal to run.

```bash
helm install chaos litmuschaos/litmus-2.0 --namespace litmus
```

> **Note:** Litmus uses Kubernetes CRDs to define chaos intent. Helm3 handles CRDs better than Helm2. Before you start running a chaos experiment, verify if Litmus is installed correctly.

### **Verify your installation**

**Verify if the Chaos Operator is running**

```bash
kubectl get pods -n litmus
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

<div style={{background: '#F5F5F5', padding: '1rem'}}>

chaos-operator-ce-554d6c8f9f-slc8k  1/1   Running   0   6m41s
</div>

<br />

**Verify if chaos CRDs are installed**

```bash
kubectl get crds | grep chaos
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

<div style={{background: '#F5F5F5', padding: '1rem'}}>
chaosengines.litmuschaos.io 2019-10-02T08:45:25Z
<br />
chaosexperiments.litmuschaos.io 2019-10-02T08:45:26Z
<br />
chaosresults.litmuschaos.io 2019-10-02T08:45:26Z
<br />
</div>

<br />

**Verify if the chaos api resources are successfully created in the desired (application) namespace.**

```bash
kubectl api-resources | grep chaos
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

<div style={{background: '#F5F5F5', padding: '1rem'}}>
chaosengines litmuschaos.io true ChaosEngine
<br />
chaosexperiments litmuschaos.io true ChaosExperiment
<br />
chaosresults litmuschaos.io true ChaosResult
<br />
</div>

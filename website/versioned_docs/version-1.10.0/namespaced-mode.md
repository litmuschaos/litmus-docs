---
id: namespaced-mode
title: Namespaced Mode
sidebar_label: Namespaced Mode
original_id: namespaced-mode
---

---

### What is Namespaced Mode?

Namespaced mode is the other end of the orchestration spectrum & is an antithesis of the admin-mode of operation. Here, the ChaosOperator
as well as the chaos resources (chaosexperiment, chaosengine, chaosresult CRs and the experiment pods) are run in the same namespace where
the application under test (AUT) resides. This mode serves the usecases where the developers/users don't typically have much autonomy
over cluster usage and operate strictly within a specific allotted namespace. However, in this case too, the cluster-admin or an equivalent
user with the right permissions are required to install them CRDs upfront.

Note that this mode of operation restricts the scope of chaos experiments to those at the pod-level, as the node/infra level experiments
need cluster-wide access.

### How to use Namespaced Mode?

In order to use Namespaced Mode, you just have to install the namespace-scoped litmus operator manifest in the desired (app) namespace.
This installs the ChaosOperator, configured to watch for ChaosEngine resources in the same namespace while also setting up the
RBAC that can be used for execution of the standard (generic suite) of chaos experiments.

#### Setup the Namespace-Scoped Chaos Operator

- Install the chaos CRDs separately via an admin account

  ```
  kubectl apply -f https://raw.githubusercontent.com/litmuschaos/litmus/master/docs/litmus-namespaced-scope/litmus-namespaced-crds.yaml
  ```

- Install the namespace-scoped operator (& continue to operator subsequent steps) via the dev/user account

  - Pull the manifest from [here](https://raw.githubusercontent.com/litmuschaos/litmus/master/docs/litmus-namespaced-scope/litmus-namespaced-operator.yaml)

  - Replace the 'default' string with that of your desired namespace across the manifest

  - Apply the modified operator manifest

  ```
  kubectl apply -f <namespace-scoped-operator.yaml>
  ```

#### Install the ChaosExperiment CR

- The supported experiments in the namespaced-mode, today, are:

  - pod-delete
  - container-kill
  - pod-cpu-hog
  - pod-memory-hog
  - pod-network-latency
  - pod-network-loss
  - pod-network-duplication
  - pod-network-corruption

- Pull the respective chaosexperiment custom resources from the [ChaosHub](https://hub.litmuschaos.io/generic)

#### Prepare the ChaosEngine CR

- Create a chaosengine, similar to the one shown below, by providing the appropriate application & experiment information.

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  appinfo:
    appns: 'default'
    applabel: 'app=nginx'
    appkind: 'deployment'
  annotationCheck: 'true'
  engineState: 'active'
  chaosServiceAccount: litmus
  monitoring: false
  jobCleanUpPolicy: 'delete'
  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: '30'

            # set chaos interval (in sec) as desired
            - name: CHAOS_INTERVAL
              value: '10'

            # pod failures without '--force' & default terminationGracePeriodSeconds
            - name: FORCE
              value: 'false'
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch ChaosEngine

- Describe ChaosEngine for chaos steps. Append your respective namespace to this command.

  `kubectl describe chaosengine nginx-chaos`

### Watch Chaos progress

- View pod terminations & recovery by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods`

### Check Chaos Experiment Result

- Check whether the application is resilient to the chaos injected, once the experiment (job) is completed. The ChaosResult resource
  name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`. Append your respective namespace to this command.

  `kubectl describe chaosresult nginx-chaos-pod-delete`

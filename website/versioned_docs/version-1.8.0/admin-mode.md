---
id: admin-mode
title: Administrator Mode
sidebar_label: Administrator Mode
original_id: admin-mode
---

---

### What is Adminstator Mode?

Admin mode is one of the ways the chaos orchestration is set up in Litmus, wherein all chaos resources (i.e., install time resources like the operator, chaosexperiment CRs, chaosServiceAccount/rbac and runtime resources like chaosengine, chaos-runner, experiment jobs & chaosresults) are setup in a single admin namespace (typically, litmus). In other words, centralized administration of chaos.
This feature is aimed at making the SRE/Cluster Admins life easier by doing away with setting up chaos pre-requisites on a per namespace basis (which may be more relevant in an autonomous/self-service cluster sharing model in dev environments).
This mode typically needs a "wider" & "stronger" ClusterRole, albeit one that is still just a superset of the individual experiment permissions. In this mode, the applications in their respective namespaces are subjected to chaos while the chaos job runs elsewhere, i.e., admin namespace.

### How to use Adminstator Mode?

In order to use Admin Mode, you just have to create a ServiceAccount in the _admin_ or so called _chaos_ namespace (`litmus` itself can be used), which is tied to a ClusterRole that has the permissions to perform operations on Kubernetes resources involved in the selected experiments across namespaces.
Provide this ServiceAccount in ChaosEngine's .spec.chaosServiceAccount.

### Example

#### Prepare Chaos Experiment

- Select Chaos Experiment from [hub.litmuschaos.io](https://hub.litmuschaos.io/) and click on `INSTALL EXPERIMENT` button.

```bash
kubectl apply -f https://hub.litmuschaos.io/api/chaos/1.8.2?file=charts/generic/pod-delete/experiment.yaml -n litmus
```

#### Prepare RBAC Manifest

Here is an RBAC definition, which in essence is a superset of individual experiments RBAC that has the permissions to run all chaos experiments across different namespaces.

[embedmd]: # 'https://litmuschaos.github.io/litmus/litmus-admin-rbac.yaml'

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: litmus-admin
  namespace: litmus
  labels:
    name: litmus-admin
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: litmus-admin
  labels:
    name: litmus-admin
rules:
  - apiGroups: ['', 'apps', 'batch', 'extensions', 'litmuschaos.io', 'openebs.io', 'storage.k8s.io']
    resources:
      [
        'chaosengines',
        'chaosexperiments',
        'chaosresults',
        'cstorpools',
        'cstorvolumereplicas',
        'configmaps',
        'secrets',
        'pods',
        'pods/exec',
        'pods/log',
        'pods/eviction',
        'jobs',
        'replicasets',
        'deployments',
        'daemonsets',
        'statefulsets',
        'persistentvolumeclaims',
        'persistentvolumes',
        'storageclasses',
        'services',
        'events'
      ]
    verbs: ['create', 'delete', 'get', 'list', 'patch', 'update', 'deletecollection']
  - apiGroups: ['']
    resources: ['nodes']
    verbs: ['get', 'list', 'patch', 'update']
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: litmus-admin
  labels:
    name: litmus-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: litmus-admin
subjects:
  - kind: ServiceAccount
    name: litmus-admin
    namespace: litmus
```

#### Prepare ChaosEngine

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: litmus #Chaos Resources Namespace
spec:
  appinfo:
    appns: 'default' #Application Namespace
    applabel: 'app=nginx'
    appkind: 'deployment'
  # It can be true/false
  annotationCheck: 'true'
  # It can be active/stop
  engineState: 'active'
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ''
  chaosServiceAccount: litmus-admin
  monitoring: false
  # It can be delete/retain
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

- Describe ChaosEngine for chaos steps.

  `kubectl describe chaosengine nginx-chaos -n litmus`

### Watch Chaos progress

- View pod terminations & recovery by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods -n default`

### Check Chaos Experiment Result

- Check whether the application is resilient to the pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-pod-delete -n litmus`

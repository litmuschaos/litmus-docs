---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

---

## Installation

### Not able to connect to the LitmusChaos Control Plane hosted on GKE cluster.

In GKE you have to setup a firewall rule to allow TCP traffic on the node port. You can use the following command:

`gcloud compute firewall-rules create test-node-port --allow tcp:port`

If this firewall rule is set up, It may be accessible on nodeIp:port where nodeIp is the external IP address of your node.

### While uninstalling Chaoscenter using helm, some components like subscriber, exporter, event, chaos scenatios, etc are not removed.

These are chaos infrastructure components, which are launched by the control plane server, so first disconnect the chaos infrastructure from the portal then uninstall the portal using helm.

### Unable to Install Chaoscenter using helm. Server pod and mongo pod are in CrashLoopBackOff state. Got this error while checking the logs of mongo container `chown: changing ownership of '/data/db/.snapshot': Read-only file system`.

It seems the directory somehow existed prior to litmus installation and might be used by some other application.
You have to change the mount path from /consul/config to /consul/myconfig in mongo statefulset then you can successfully deploy the litmus.

## Chaos Infrastructure

### Subscriber is crashing with the error `dial:websocket: bad handshake`

It is a network issue. It seems your subscriber is unable to access the server.
While installing chaos infrastructure, It creates a config called agent-config to store some metadata like server endpoint, accesskey, etc. That server endpoint can be generated in many ways:

- Ingress (If INGRESS=true in server deployment envs)
- Loadbalancer (it generates lb type of ip based on the server svc type)
- NodePort (it generates nodeport type of ip based on the server svc type)
- ClusterIP (it generates clusterip type of ip based on the server svc type)

So, you can edit the agent-config and update the node IP. Once edited, restart the subscriber.
We suggest using ingress, so that if the endpoint IP changes, then it won't affect your chaos infrastructure.

## Chaos Experiment

### In the logs of Helper pod, I am getting this error ` Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`

You need to Provide the correct socket path. By default in Portal `CONTAINER_RUNTIME` is set to `docker`,
If Your container runtime is `containerd` then you have to change the `CONTAINER_RUNTIME` to `containerd` and `SOCKET_PATH` to `/var/run/containerd/containerd.sock`.
You can find these in tune faults part of the tune chaos experiment page.

## Chaoshub

### We have installed ChaosCenter successfully but the Litmus ChaosHub is in error state and manual cloning of a Git repository does not work.

It is most probably a network issue. Currently the ChaosHub feature is not supported in airgapped environment since it requires cloning of a remote git repository. Make sure you have an active internet connection to clone the git repository. If the issue still persists, you can manually add the git repository in the server pod. Here are the steps for the same:

- Step 1: Exec inside the litmus-portal server pod and graphql-server container

```
kubectl exec -i -t <litmusportal-server> -n litmus --container graphql-server -- sh
```

Check if the Chaos faults directory is available. The directory structure is like

```
/tmp/version/<project_id>/<hub_name>
```

Create these directories if not present inside /tmp/version/ :

```
mkdir <project_id>
cd <project_id>
mkdir <hub_name>
```

- Step 2: Clone the Chaos-Charts/Hub repository locally

- Step 3: Use this command to copy the hub directory from your local system to the litmus-portal server pod

```
kubectl cp <location to chaos-fault/hub directory> <namespace>/<litmusportal-server-pod-name>:</tmp/version/<project_id>/<hub_name> -c graphql-server
```

Example:

```
kubectl cp /home/amitkrdas/Chaos-Charts/chaos-charts/  litmus/litmusportal-server-6df9c5895d-57xx7:/tmp/version/686c1da2-da9c-4029-9c6a-528a9455a3b3/"Litmus ChaosHub" -c graphql-server
```

- Step 4: Once the chaos faults directory is copied, refresh the ChaosHub page in ChaosCenter.

## Litmusctl

### Getting invalid token error while running litmusctl commands

Invalid token error occurs when the authorization token is not valid or expired. Authorization token expires in 24 hours. To solve the problem you need to generate a new token and update it in
.litmusconfig.

The following command can be used to do the same

```
litmusctl config set-account
```

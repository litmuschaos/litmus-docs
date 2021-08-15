---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

---

### Subscriber is crashing with the error `dial:websocket: bad handshake`

It is a network issue. It seems your subscriber is unable to access the server.
While installing agent, It creates a config called agent-config to store some metadata like server endpoint, accesskey, etc. That server endpoint can be generated in many ways:

- Ingress (If INGRESS=true in server deployment envs)
- Loadbalancer (it generates lb type of ip based on the server svc type)
- NodePort (it generates nodeport type of ip based on the server svc type)
- ClusterIP (it generates clusterip type of ip based on the server svc type)

So, you can edit the agent-config and update the node IP. Once edited, restart the subscriber.
We suggest using ingress, so that if the endpoint IP changes, then it won't affect your agent.

### Not able to connect to the Litmus chaos Control Plane hosted on GKE cluster.

In GKE you have to setup a firewall rule to allow TCP traffic on the node port. You can use the following command:

`gcloud compute firewall-rules create test-node-port --allow tcp:port`

If this firewall rule is set up, It may be accessible on nodeIp:port where nodeIp is the external IP address of your node.

### I forgot my Litmus portal password. How can I reset my credentials?

Just run the following command:

`kubectl exec -it mongo-0 -n litmus -- mongo -u admin -p 1234 <<< $'use auth\ndb.usercredentials.update({username:"admin"},{$set:{password:"$2a$15$sNuQl9y/Ok92N19UORcro.3wulEyFi0FfJrnN/akOQe3uxTZAzQ0C"}})\nexit\n'`

Make sure to update the namespace and mongo pod name according to your setup, the rest should remain the same. This command will update the password to `litmus`.

### While uninstalling Litmus portal using helm, some components like subscriber, exporter, event, workflows, etc are not removed.

These are agent components, which are launched by the control plane server, so first disconnect the agent from the portal then uninstall the portal using helm.

### Unable to Install Litmus portal using helm. Server pod and mongo pod are in CrashLoopBackOff state. Got this error while checking the logs of mongo container `chown: changing ownership of '/data/db/.snapshot': Read-only file system`.

It seems the directory somehow existed prior to litmus installation and might be used by some other application.
You have to change the mount path from /consul/config to /consul/myconfig in mongo statefulset then you can successfully deploy the litmus.

### We were setting up Litmus Portal, however, the Self-Agent status is showing pending. Any idea why is this happening?

The litmusportal-server-service might not be reachable due to inbound rules. You can enable the traffic to it if on GKE/EKS/AKS (by adding the port to inbound rules for traffic).
You have to check the logs of the subscriber pod and expose the port mentioned for the communication with the server.

### After logging in for the first time to the portal, `/getStarted` page keep loading after I provided the new password

First, try to clear the browser cache and cookies and refresh the page, this might solve your problem.
If your problem persists, then delete all the cluster role bindings, PV and PVC used by litmus and try to reinstall the litmus again.

### In the logs of Helper pod, I am getting this error ` Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`

You need to Provide the correct socket path. By default in Portal `CONTAINER_RUNTIME` is set to `docker`,
If Your container runtime is `containerd` then you have to change the `CONTAINER_RUNTIME` to `containerd` and `SOCKET_PATH` to `/var/run/containerd/containerd.sock`.
You can find these in tune experiments part of the tune workflow page.

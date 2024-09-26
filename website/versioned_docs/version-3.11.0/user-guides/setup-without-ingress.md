---
id: setup-without-ingress
title: Setting up endpoints without ingress
sidebar_label: Setup without ingress
---

---

## Prerequisites

Before setting up endpoint without Ingress, make sure [ChaosCenter](../getting-started/resources.md#chaoscenter) is installed in either one of these scopes:

- [Install ChaosCenter with HTTP](../getting-started/installation.md))
- [Install ChaosCenter with HTTPS](chaoscenter-advanced-installation.md)

## NodePort service setup

To setup and login to ChaosCenter, list the services in the Litmus namespace and copy the `PORT` of the `litmusportal-frontend-service` service.

```bash
kubectl get svc -n <LITMUS_PORTAL_NAMESPACE>
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
NAME                            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                         AGE
chaos-litmus-portal-mongo       ClusterIP   10.104.107.117   <none>        27017/TCP                       2m
litmusportal-frontend-service   NodePort    10.101.81.70     <none>        9091:30385/TCP                  2m
litmusportal-server-service     NodePort    10.108.151.79    <none>        9002:32456/TCP,9003:31160/TCP   2m
```

:::note
In this case, the port for `litmusportal-frontend-service` is `30385`, in your case it will be different.
:::

## LoadBalancer service setup

To setup and login to ChaosCenter with LoadBalancer, patch the Frontend service `litmusportal-frontend-service` and expose the external IP:

```bash
kubectl patch svc litmusportal-frontend-service -p '{"spec": {"type": "LoadBalancer"}}' -n <LITMUS_PORTAL_NAMESPACE>
```

<span style={{color: 'green'}}><b>Expected Output</b></span>

```bash
NAME                            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                         AGE
chaos-litmus-portal-mongo       ClusterIP   10.104.107.117   <none>        27017/TCP                       2m
litmusportal-frontend-service   NodePort    10.101.81.70     <none>        9091:30385/TCP                  2m
litmusportal-server-service     NodePort    10.108.151.79    <none>        9002:32456/TCP,9003:31160/TCP   2m
```

## Accessing ChaosCenter

Once you have the port copied in your clipboard, simply use your IP and port in this manner `<IP>:<PORT>` to access the Litmus ChaosCenter.

For example:

```yaml
http://172.17.0.3:30385/
```

:::note
Here `172.17.0.3` is the node's IP and `30385` is the frontend service port. If you're using a LoadBalancer service, use the load balancer IP and the port in the following manner: `<LoadBalancerIP>:<PORT>`
:::

You should be able to see the login page of ChaosCenter. The default credentials are following:

```yaml
Username: admin
Password: litmus
```

<img src={require('../assets/login.png').default} width="800" />

By default you are assigned with a default project with Owner permissions.

<img src={require('../assets/landing-page.png').default} width="800" />

## Learn more

- [Setup Endpoints and Access ChaosCenter with Ingress](setup-with-ingress.md)
- [Install ChaosCenter with HTTP](../getting-started/installation.md))
- [Install ChaosCenter with HTTPS](chaoscenter-advanced-installation.md)

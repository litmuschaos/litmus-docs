---
id: setup-without-ingress
title: Setting up Endpoints without Ingress
sidebar_label: Setup without Ingress
---

---

## Prerequisites

Before setting up endpoint without Ingress make sure the [Litmus ChaosCenter](../getting-started/resources.md#chaoscenter) is installed in either one of these scopes

- [Cluster Scope](chaoscenter-cluster-scope-installation.md)
- [Namespace Scope](chaoscenter-namespace-scope-installation.md)

## **With NodePort**

To setup and login to Litmus Portal expand the available services just created and copy the `PORT` of the `litmusportal-frontend-service` service

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

> **Note**: In this case, the PORT for `litmusportal-frontend-service` is `30385`. Yours will be different.

## **With LoadBalancer**

To setup and login to Litmus Portal with LoadBalancer, patch the Frontend Service `litmusportal-frontend-service` and expose the External IP.

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

## **Accessing the ChaosCenter**

Once you have the PORT copied in your clipboard, simply use your IP and PORT in this manner `<IP>:<PORT>` to access the Litmus ChaosCenter.

For example:

```yaml
http://172.17.0.3:30385/
```

> Where `172.17.0.3` is my NodeIP and `30385` is the frontend service PORT. If using a LoadBalancer, the only change would be to provide a `<LoadBalancerIP>:<PORT>`

You should be able to see the Login Page of Litmus ChaosCenter. The **default credentials** are

```yaml
Username: admin
Password: litmus
```

<img src={require('../assets/login.png').default} width="800" />

By default you are assigned with a default project with Owner permissions.

<img src={require('../assets/landing-page.png').default} width="800" />

## Learn more

- [Setup Endpoints and Access ChaosCenter with Ingress](setup-with-ingress.md)
- [Install ChaosCenter in Namespace Scope](chaoscenter-namespace-scope-installation.md)
- [Install ChaosCenter in Cluster Scope](chaoscenter-cluster-scope-installation.md)

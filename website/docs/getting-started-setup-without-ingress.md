---
id: setup-without-ingress
title: Setting up Endpoints without Ingress
sidebar_label: Setup without Ingress
---

## Prerequisites

Before setting up endpoint with Ingress make sure the [Litmus Chaos Control Plane](chaos-control-plane) is installed in either one of these scopes

- [Cluster Scope](cluster-scope-installation)
- [Namespace Scope](namespace-scope-installation)

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

## **Accessing the Portal**

Once you have the PORT copied in your clipboard, simply use your IP and PORT in this manner `<IP>:<PORT>` to access the portal.

For example:

```yaml
http://172.17.0.3:30385/
```

> Where `172.17.0.3` is my NodeIP and `30385` is the frontend service PORT. If using a LoadBalancer, the only change would be to provide a `<LoadBalancerIP>:<PORT>`

You should be able to see the Login Page of Litmus. The **default credentials** are

```yaml
Username: admin
Password: litmus
```

<img src={require('./assets/login.png').default} width="800" />

## Resources

<table>
  <tr>
    <td>
      <a href="https://kubernetes.io/docs/concepts/services-networking/service/#nodeport">
        <img width={300} src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.mirantis.com%2Fwp-content%2Fuploads%2F2018%2F03%2Ffirst-beta-version-of-kubernetes-1-10-is-here-your-chance-to-provide-feedback.jpg&f=1&nofb=1" />
        <br />
        <div style={{width: "300px"}}>
        NodePort
        </div>
      </a>
    </td>
    <td>
      <a href="https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer">
        <img width={300} src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.mirantis.com%2Fwp-content%2Fuploads%2F2018%2F03%2Ffirst-beta-version-of-kubernetes-1-10-is-here-your-chance-to-provide-feedback.jpg&f=1&nofb=1" />
        <br />
        <div style={{width: "300px"}}>
        LoadBalancer
        </div>
      </a>
    </td>
  </tr>
  <tr>
    <td>
        <a href="https://kubernetes.io/docs/concepts/services-networking/ingress/">
        <img width={300} src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.mirantis.com%2Fwp-content%2Fuploads%2F2018%2F03%2Ffirst-beta-version-of-kubernetes-1-10-is-here-your-chance-to-provide-feedback.jpg&f=1&nofb=1" />
        <br />
        <div style={{width: "300px"}}>
        Ingress
        </div>
      </a>
    </td>
  </tr>
</table>

## Learn More

- [Setup Endpoints and Access Litmus with Ingress](setup-with-ingress)
- [Install Litmus in Namespace Scope](namespace-scope-installation)
- [Install Litmus in Cluster Scope](cluster-scope-installation)

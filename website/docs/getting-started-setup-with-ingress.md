---
id: setup-with-ingress
title: Install LitmusPortal with Ingress
sidebar_label: Setup With Ingress
---

---

## Prerequisites

Before setting up endpoint with Ingress make sure the [Litmus Chaos Control Plane](chaos-control-plane) is installed in either one of these scopes

- [Cluster Scope](cluster-scope-installation)
- [Namespace Scope](namespace-scope-installation)

## Install LitmusPortal with Ingress

With Litmus-2.0.0-Beta3, LitmusPortal can be installed with ingress.
In the following doc, we will use the Nginx ingress controller for ingress setup.

1. By default, the service type is `NodePort`. For Ingress, we need to change the service type to `ClusterIP` in the following services.

- `litmusportal-frontend-service`
- `litmusportal-server-service`

2. Install Nginx Ingress Controller along with Kubernetes RBAC roles and bindings, please refer [here](https://kubernetes.github.io/ingress-nginx/deploy/#installation-guide)

> - If you're changing ingress name from **litmus-ingress** to a different name, make sure to update the **INGRESS_NAME** environment variable in the litmusportal-server deployment
> - Set the environment variable **INGRESS** as true in the litmusportal-server deployment.

### With HTTP

Sample litmus ingress manifest With HTTP

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /$1
  name: litmus-ingress
spec:
  rules:
    - host: '<HOST-NAME>'
      http:
        paths:
          - backend:
              serviceName: litmusportal-frontend-service
              servicePort: 9091
            path: /(.*)
            pathType: ImplementationSpecific
          - backend:
              serviceName: litmusportal-server-service
              servicePort: 9002
            path: /backend/(.*)
            pathType: ImplementationSpecific
```

```bash
kubectl apply -f <litmus_ingress_manifest> -n <PORTAL_NAMESPACE>
```

### With HTTPS

1. Install CertManager

```bash
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.3.0 --set installCRDs=true
```

2. Install LetsEncrypt Cluster Issuer

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
   name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: "your@mail.com"
    privateKeySecretRef:
      name: letsencrypt
    solvers:
    - http01:
     	ingress:
        class: nginx
```

3. Sample Litmus Portal Ingress Manifest with HTTPS

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /$1
  labels:
    component: litmusportal-frontend
  name: litmusportal-ingress
  namespace: litmus
spec:
  rules:
    - host: '<HOST-NAME>'
      http:
        paths:
          - backend:
              serviceName: litmusportal-frontend-service
              servicePort: 9091
            path: /(.*)
            pathType: ImplementationSpecific
          - backend:
              serviceName: litmusportal-server-service
              servicePort: 9002
            path: /backend/(.*)
            pathType: ImplementationSpecific
  tls:
    - hosts:
        - '<HOST-NAME>'
      secretName: litmuspreview-tls-secret
```

```bash
kubectl apply -f <litmus_ingress_manifest> -n <PORTAL_NAMESPACE>
```

## Resources

<table>
  <tr>
    <td>
      <a href="https://dev.to/hjgraca/aks-ingress-with-nginx-and-key-vault-certificates-2kma">
        <img width={300} src="https://res.cloudinary.com/practicaldev/image/fetch/s--RyQOqlJg--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/o13zbbtdr3nen2ikv734.jpg" />
        <br />
        <div style={{width: "300px"}}>
        AKS ingress with nginx and Key Vault certificates
        </div>
      </a>
    </td>
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

- [Setup Endpoints and Access Litmus without Ingress](setup-without-ingress)
- [Install Litmus in Namespace Scope](namespace-scope-installation)
- [Install Litmus in Cluster Scope](cluster-scope-installation)

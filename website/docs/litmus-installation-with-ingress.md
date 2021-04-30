---
id: litmus-with-ingress
title: Install LitmusPortal with Ingress
sidebar_label: Litmus with Ingress
---

---

### Install LitmusPortal with Ingress

With Litmus-2.0.0-Beta3, LitmusPortal can be installed with ingress.
In the following doc, we will use the Nginx ingress controller for ingress setup.

1. Install LitmusPortal in ClusterMode

```bash
kubectl apply -f https://litmuschaos.github.io/litmus/2.0.0-Beta/litmus-2.0.0-Beta.yaml
```

2. By default, the service type is NodePort. We have to edit the service types to ClusterIP as given below

```bash
kubectl edit svc litmusportal-frontend-service -n litmus
kubectl edit svc litmusportal-server-service -n litmus
```

3. Install Nginx Ingress Controller along with Kubernetes RBAC roles and bindings, please refer [here](https://kubernetes.github.io/ingress-nginx/deploy/#network-load-balancer-nlb)

#### With HTTP

4. Sample litmus ingress manifest With HTTP

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
    - http:
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
kubectl apply -f <litmus_ingress_manifest> -n litmus
```

#### With HTTPS

4. Install CertManager

```bash
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.3.0 --set installCRDs=true
```

5. Install LetsEncrypt Cluster Issuer

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

6. Sample Litmus Portal Ingress Manifest with HTTPS

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
    - host: "<HOST-NAME>"
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
        - "<HOST-NAME>"
      secretName: litmuspreview-tls-secret
```

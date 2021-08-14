---
id: litmus-with-ingress
title: Install LitmusPortal with Ingress
sidebar_label: Litmus with Ingress
---

---

### Install LitmusPortal with Ingress

With Litmus-2.0.0, LitmusPortal can be installed with ingress.
In the following doc, we will use the Nginx ingress controller for ingress setup.

1. Install LitmusPortal in ClusterMode

```bash
kubectl apply -f https://litmuschaos.github.io/litmus/2.0.0/litmus-2.0.0.yaml
```

2. By default, the service type is NodePort. We have to patch it to ClusterIP

```bash
kubectl patch svc litmusportal-frontend -n litmus -p '{"spec": {"type": "ClusterIP"}}'
kubectl patch svc litmusportal-server -n litmus -p '{"spec": {"type": "ClusterIP"}}'
```

3. Install Nginx Ingress Controller

```bash
kubectl create ns nginx
helm repo add nginx-stable https://helm.nginx.com/stable
helm install nginx-ingress nginx-stable/nginx-ingress -n nginx
```

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

#### With HTTPS

5. Install CertManager

```bash
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.3.0 --set installCRDs=true
```

6. Install LetsEncrypt Cluster Issuer

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

7. Sample Litmus Portal Ingress Manifest with HTTPS

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

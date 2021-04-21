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
kubectl edit svc litmusportal-frontend-service -n litmus
```

3. Install Nginx Ingress Controller along with Kubernetes RBAC roles and bindings

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml
```

4. create the ingress-nginx ingress controller service as a load balancer service

Sample service manifest

```yaml
kind: Service
apiVersion: v1
metadata:
  name: ingress-nginx
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
  ports:
    - name: http
      port: 80
      targetPort: http
    - name: https
      port: 443
      targetPort: https
```

```bash
kubectl apply -f ingress-controller-svc.yaml
```

#### With HTTP

5. Sample litmus ingress manifest With HTTP

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

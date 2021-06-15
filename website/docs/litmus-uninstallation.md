---
id: litmus-uninstall
title: Litmus Chaos Control Plane Uninstall
sidebar_label: Control Plane
---

---

### **Uninstallation of Litmus Control Plane uning Helm**

The helm chart uninstall installs the control plane components

```bash
helm uninstall litmuschaos  --namespace litmus
kubectl delete ns litmus
```

### **Uninstallation of Litmus Control Plane using kubectl**

The helm chart uninstall installs the control plane components

```bash
kubectl delete ns litmus
```
       
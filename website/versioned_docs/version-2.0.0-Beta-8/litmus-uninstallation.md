---
id: litmus-uninstall
title: Litmus Chaos Control Plane Uninstall
sidebar_label: Control Plane
---

---

### **Uninstallation of Litmus Control Plane using Helm**

The helm chart uninstall the control plane components

```bash
helm uninstall litmuschaos  --namespace litmus
kubectl delete ns litmus
```

---

### **Uninstallation of Litmus Control Plane using kubectl**

```bash
kubectl delete ns litmus
```

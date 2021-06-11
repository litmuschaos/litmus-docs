---
id: k8s-support
title: Kubernetes Support
sidebar_label: Kubernetes Support
original_id: k8s-support
---

---

### Control Plane Resource Requirements

The Resource requests provided here have been estimated using data gathered manually using different methods - 
- Using command `kubectl top` 
- Recommendations from Vertical-Pod-Autoscaler
- Recommendations by a great utility Goldilocks.

These resources are getting monitored continuously and the information below will be updated as the metrics changes.

<table>
   <tr>
      <th>Pod</th>
      <th>Container</th>
      <th>CPU(Requested)</th>
      <th>Memory(Requested)</th>
   </tr>
   <tr>
   <td>litmusportal-frontend</td>
   <td>litmusportal-frontend</td>
   <td>25m</td>
   <td>300M</td>
   </tr>
   <tr>
   <td>litmusportal-server</td>
   <td>auth-server</td>
   <td>15m</td>
   <td>150M</td>
   </tr>
   <tr>
   <td>litmusportal-server</td>
   <td>graphql-server</td>
   <td>15m</td>
   <td>150M</td>
   </tr>
   <tr>
   <td>mongodb</td>
   <td>mongodb</td>
   <td>25m</td>
   <td>300M</td>
   </tr>
</table>

---
id: k8s-support
title: Kubernetes Support
sidebar_label: Kubernetes Support
original_id: k8s-support
---

---

### Control Plane Resource Requirements

The Resource requests and limits provided here have been calculated using data gathered by manually using a command `kubectl top` and Vertical-Pod-Autoscaler & also through recommendation by a great utility Goldilocks.The resources are getting monitored continuously and the information below will be updated as the metrics changes.

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
   <td>263M</td>
   </tr>
   <tr>
   <td>litmusportal-server</td>
   <td>auth-server</td>
   <td>23m</td>
   <td>132M</td>
   </tr>
   <tr>
   <td>litmusportal-server</td>
   <td>graphql-server</td>
   <td>12m</td>
   <td>132M</td>
   </tr>
   <tr>
   <td>mongodb</td>
   <td>mongodb</td>
   <td>25m</td>
   <td>262M</td>
   </tr>
</table>

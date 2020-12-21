---
id: plugins
title: Using other chaos libraries as plugins
sidebar_label: Plugins
original_id: plugins
---

---

Litmus provides a way to use any chaos library or a tool to inject chaos. The chaos tool to be compatible with Litmus should satisfy the following requirements:

- Should be available as a Docker Image
- Should take configuration through a `config-map`

The `plugins` or `chaos-libraries` host the core logic to inject chaos.

These plugins are hosted at https://github.com/litmuschaos/litmus-ansible/tree/master/chaoslib

Litmus project has integration into the following chaos-libraries.

| Chaos Library                                                                        | Logo                                                                                                                                                                                     | Experiments covered                                                                                               |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| <a href="https://github.com/litmuschaos/litmus-ansible" target="_blank">Litmus</a>   | <img src="https://camo.githubusercontent.com/953211f24c1c246f7017703f67b9779e4589bf76/68747470733a2f2f6c616e6473636170652e636e63662e696f2f6c6f676f732f6c69746d75732e737667" width="50"/> | Litmus native chaos libraries that encompasses the chaos capabilities for `pod-kill`, `container-kill`, `cpu-hog` |
| <a href="https://github.com/alexei-led/pumba" target="_blank">Pumba</a>              | <img src="https://github.com/alexei-led/pumba/raw/master/docs/img/pumba_logo.png" width="50"/>                                                                                           | Pumba provides chaos capabilities for `network-delay`                                                             |
| <a href="https://github.com/bloomberg/powerfulseal" target="_blank">PowerfulSeal</a> | <img src="https://github.com/bloomberg/powerfulseal/raw/master/media/powerful-seal.png" width="50"/>                                                                                     | PowerfulSeal provides chaos capabilities for `pod-kill`                                                           |
|                                                                                      |                                                                                                                                                                                          |                                                                                                                   |

Usage of plugins is a configuration parameter inside the chaos experiment.

> Add an example snippet here.

<br/>

<br/>

<hr/>

<br/>

<br/>

---
id: installation
title: Install m-agent
sidebar_label: Installation
---

---

## Pre-Requisites
1. Linux OS 
2. systemd
3. Experiment specific third-party binaries (to be listed in the experiment docs)

## Installation
To install m-agent in your target machine, you can execute the following commands in the target machine:
```
$ curl -fsSL -o get_m-agent.sh https://raw.githubusercontent.com/litmuschaos/m-agent/master/scripts/install.sh
$ chmod 700 get_m-agent.sh
$ ./get_m-agent.sh
```
You can specify any particular m-agent version for installation:
```
$ ./get_m-agent.sh --version <VERSION>
```
By default, `41365` port is utilized by m-agent. You can specify a custom port at which m-agent should listen for client messages:
```
$ ./get_m-agent.sh --port <PORT>
```
Finally, you can specify if the installation can take place without using sudo, if it is not present:
```
$ ./get_m-agent.sh --no-sudo
```

To confirm whether the installation was successful or not, you can firstly check if the m-agent service is in an `active` state:
```
systemctl status m-agent
```

Then, you can confirm if the m-agent binary is correctly setup and working:
```
m-agent -help
```

---
id: litmus-demo
title: Chaos Engineering in a Microservices Environment
sidebar_label: Litmus Demo
original_id: litmus-demo
---
------

The Litmus Demo is a quick way to introduce yourself to the world of Cloud Native Chaos Engineering. It helps familiarize 
oneself with running litmus chaos experiments in a realistic app environment running multiple services on a Kubernetes cluster. 
In other words, you will be able to create a cluster, install a sample application that will be subject to chaos, build the 
chaos infrastructure & run the chaos experiments, all in a matter of minutes, using a simple python script. 

It is designed to help you experience chaos injection almost out of the box and is expected to serve as a precursor to a 
more involved exploration of LitmusChaos framework for your own business application/infrastructure chaos needs.


## The Demo Environment

Two cluster types are supported: 

- KinD:  A 3 node KinD cluster pre-installed with the sock-shop demo application, litmus chaos CRDs, operator, and a minimal 
  set of prebuilt chaos experiment CRs is setup. 

- GKE: A 3 node GKE cluster pre-installed with the sock-shop demo application, litmus chaos CRDs, operator, and the full generic 
  Kubernetes chaos experiment suite is setup. 


## PreRequisites

- Docker, Kubectl & Python3.7+ (with the PyYaml package) are all you will need for running the KinD platform based chaos demo. 
  If GKE is your platform choice, you may need to configure gcloud.


## Getting started:

To get started with any of the above platforms we will follow the following steps.

- Clone litmus demo repository in your system.

  ```
  git clone https://github.com/litmuschaos/litmus-demo.git
  cd litmus-demo
  ```

- Install the demo environment using one of the platforms with start argument

  **For KinD Cluster** 

  - Install & bring-up the KinD cluster using the following command

    ```
    ./manage.py start --platform kind
    ```

  - Wait for all the pods to get in a ready state. You can monitor this using


    ```
    watch kubectl get pods --all-namespaces
    ```

    Once all pods come into Running state we can access the sock-shop application through web-ui which will help us to 
    visualize the impact of chaos on the application and whether the application persists after chaos injections. 

  - Get the port of frontend deployment

    ```
    kubectl get deploy front-end -n sock-shop -o jsonpath='{.spec.template.spec.containers[?(@.name == "front-end")].ports[0].containerPort}'
    ```

  - Perform port forwarding on the port obtained above

    ```
    kubectl port-forward deploy/front-end -n sock-shop 3000:<port-number> (typically, 8079)
    ```


  - Access the web-ui (catalogue) of the sock-shop app via the address `127.0.0.1:3000` on your browser

  **For GKE Cluster** 

  - Create the GKE cluster (ensure you have setup access to your gcloud project)

    ```
    ./manage.py start --platform GKE
    ```

  - Wait for all the pods to get in a ready state. You can monitor this using


    ```
    watch kubectl get pods --all-namespaces
    ```

    Once all pods come into Running state we can access the sock-shop application through web-ui which will help us to 
    visualize the impact of chaos on the application and whether the application persists after chaos injections. 

  - After a few min, identify the ingress IP to access the web-ui

    ```
    kubectl get ingress basic-ingress --namespace=sock-shop
    ```

    You can access the web application in a few minutes at `http://<ingress-ip>`

## Running Chaos in Demo Environment 

- To find out the supported tests for a platform, execute the following command: 

  ```
  ./manage.py list --platform <kind|gke>
  ```

- For running all experiments, run: 


  ```
  ./manage.py test --platform <platform-name>
  ```

- For running selective experiments  


  ```
  ./manage.py test  --platform <platform-name> --test <test-name>
  ```


  Example: For running the pod-delete experiment.

  ```
  ./manage.py test  --platform kind --test pod-delete 
  ```

### Chaos Experiment Results

The experiment results (Pass/Fail) are derived based on the simple criteria of app availability post chaos & are summarized 
on the console once the execution completes. You are also encouraged to check the changes to the status of the web-ui & the 
respective microservices/pods as the experiment executes to get an idea of the failure injection process and subsequent recovery. 

Get more details about the flags used to configure and run the chaos tests please refer to the paramrter tables in the 
[test](https://github.com/litmuschaos/litmus-demo#test) section. 

## Generate PDF of the experiment result summary

We can also generate the pdf report of the experiment result summary using <code>--report</code> flag as follow:

```bash
./manage.py test --report=yes
``` 
It will generate a pdf report of name `chaos-report.pdf` in the current location containing ChaosResult summary.


## Deleting Cluster / Cluster Clean Up 

- To shut down and destroy the cluster when you're finished, run the following commands: 

  For KinD cluster

  ```
  ./manage.py --platform kind stop
  ```

  For GKE cluster

  ```
  ./manage.py --platform GKE stop --project {GC_PROJECT}
  ```

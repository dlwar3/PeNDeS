# PeNDeS
This repository is a fully docker based Design Studio development with WebGME.

## What is the domain about?
This design studio allows working with Petri nets. Use the predefined metamodel in the seed to instantly start creating Petri nets. A Petri net is defined as a triple (P, T, F) where:
- P is a finite set of places
- T is a finite set of transitions (P ∩ T = ∅)
- F ⊆ (P x T) ∪ (T x P) is a set of arcs (flow relation) {for short we will write f(p→t) to describe an arc that connect transition t to place p}.
The plugin PeNDeSInterpreter will assist you in classifying your created Petri nets.

## Typical use-cases
Here are some common use cases:
- Computational Biology
- Control Engineering
- Process Modeling
- Reliability Engineering
- Workflow Management Systems

## How to install the design studio
- install [Docker-Desktop](https://www.docker.com/products/docker-desktop)
- clone the repository
- edit the '.env' file so that the BASE_DIR variable points to the main repository directory
- `docker-compose up -d`
- connect to your server at http://localhost:8888
- create a new project from the sample seed or your own

### How to start modeling once the studio is installed
How to create your own model using the sample seed:
- Create a folder for your models
- Add Petri net instance 
- Add places and transitions. (Ensure each place and transition has a connected entry and exit port for arcs)
- Add connecting arcs
- Update place tokens to desired states
- You can now use the interpreter or visualizer on your created model.

### Features and how to use them
Visualizer:
- Add the PeNDeSViz visualizer to the valid visualizers on the meta tab of your model.
Interpreter:
- Add the PeNDeSInterpreter plugin to the valid plugins on the meta tab of your model.
- From the toolbar click the play button for the PeNDeSInterpreter. Check console for classification descriptions of your model.

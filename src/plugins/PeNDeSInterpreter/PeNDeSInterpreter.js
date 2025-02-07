/*globals define*/
/*eslint-env node, browser*/

/**
 * Generated by PluginGenerator 2.20.5 from webgme on Sun Dec 12 2021 01:47:53 GMT+0000 (Coordinated Universal Time).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of PeNDeSInterpreter.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin PeNDeSInterpreter.
     * @constructor
     */
    function PeNDeSInterpreter() {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    }

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructure etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    PeNDeSInterpreter.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    PeNDeSInterpreter.prototype = Object.create(PluginBase.prototype);
    PeNDeSInterpreter.prototype.constructor = PeNDeSInterpreter;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(Error|null, plugin.PluginResult)} callback - the result callback
     */
    PeNDeSInterpreter.prototype.main = function (callback) {
        // Use this to access core, project, result, logger etc from PluginBase.
        var self = this,
        activeNode = this.activeNode,
        core = this.core,
        logger = this.logger;

        // Using the coreAPI to make changes.
        const nodeObject = self.activeNode;
        
        

  this.loadNodeMap(activeNode)
    .then(function (nodes) {
      var path;
      var tree = {};
      var transitions = {};
      var places = {};
      var arcs = {};
      for (path in nodes) {       
        tree[path] = {"name": core.getAttribute(nodes[path], 'name'),       // node name
                      "GUID": core.getGuid(nodes[path]),                    // node guid
                      "meta": "",                                           // placeholder node meta name
                      "attributes": {}                                      // placeholder node attribute obj
                     };

        
        // find meta node and name
        let metaNode = core.getMetaType(nodes[path]);
        if (metaNode != null ) { 
          tree[path].meta = core.getAttribute(metaNode, 'name');
          if (tree[path].meta == "Transition")
          {
              transitions[path] = nodes[path];
          }
          if (tree[path].meta == "Place")
          {
              places[path] = nodes[path];
          }
          if (tree[path].meta == "Arc")
          {
              arcs[path] = nodes[path];
          }
        }
        else {
          tree[path].meta = null; //account for null value of root
        }
        
        
        var attr = core.getAttributeNames(nodes[path]);
        tree[path].attributes = {};
        for (let name in attr)
        {         
          // we want valid attributes that are strings to display, not functions or anything else
          // ignore script code, not relevant
          if (typeof attr[name] == "string") {
            tree[path].attributes[attr[name]] = core.getAttribute(nodes[path], attr[name]);
          }
        }
      }
    
        //console.log(JSON.stringify(tree,null,'\t'));

        var pointerPaths = {};
        for (let arc in arcs)
        {
            pointerPaths[arc] = {"src": core.getPointerPath(arcs[arc], "src"), "dst": core.getPointerPath(arcs[arc], "dst")};
        }

        // is free choice?
        var inplaces = [];
        var freeChoice = 1;
        for (let arc in arcs)
        {
            
            for (let place in places)
            {   
                // if a place is a src to a transition,
                if (pointerPaths[arc].src.includes(place))
                {
                    for (let trans in transitions)
                    {
                        if (pointerPaths[arc].dst.includes(trans))
                        {
                            if (inplaces[place] != undefined)
                            {
                                console.log(place);
                                console.log(inplaces[place]);
                                freeChoice = 0;
                            }
                            else 
                            {
                                inplaces[place] = trans;
                            }
                        }
                    }
                }
            }
        }

        if (freeChoice)
        {
            console.log("Petri net is free-choice.");
        }

        var outplaces = [];
        var stateMachine = 1;
        //is state machine?
        for (let arc in arcs)
        {
            
            for (let place in places)
            {   
                // if a place is a src to a transition,
                if (pointerPaths[arc].dst.includes(place))
                {
                    for (let trans in transitions)
                    {
                        if (pointerPaths[arc].src.includes(trans))
                        {
                            if (outplaces[trans] != undefined)
                            {
                                stateMachine = 0;
                            }
                            else 
                            {
                                outplaces[trans] = place;
                            }
                        }
                    }
                }
            }
        }
        if (stateMachine)
        {
            console.log("Petri net is state machine.");
        }

        //is marked graph?
        var markedGraph = 0;
        if (freeChoice && stateMachine)
        {
            markedGraph = 1;
            console.log("Petri net is marked graph.");
        }
        

        //is workflow net?
        //TODO: logic to determine workflow net



        // This will save the changes. If you don't want to save;
        // exclude self.save and call callback directly from this scope.
        self.save('PeNDeSInterpreter updated model.')
            .then(() => {
                self.result.setSuccess(true);
                callback(null, self.result);
            })
            .catch((err) => {
                // Result success is false at invocation.
                self.logger.error(err.stack);
                callback(err, self.result);
            });
        });
    };

    return PeNDeSInterpreter;
});

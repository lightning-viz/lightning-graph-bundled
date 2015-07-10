'use strict';

var Graph = require('lightning-graph');
var d3 = require('d3');
var utils = require('lightning-client-utils');
var ForceEdgeBundling = require('../deps/force-edge-bundling');

/*
 * Extend the base graph visualization
 */
var Visualization = Graph.extend({

    formatData: function(data) {
        var retColor = utils.getColorFromData(data);
        var retSize = data.size || [];
        var retName = data.name || [];

        data.nodes = data.nodes.map(function (d,i) {
            d.x = d[0];
            d.y = d[1];
            d.i = i;
            d.n = retName[i];
            d.c = retColor.length > 1 ? retColor[i] : retColor[0];
            d.s = retSize.length > 1 ? retSize[i] : retSize[0];
            return d;
        });

        data.links = data.links.map(function (d) {
            d.source = d[0];
            d.target = d[1];
            d.value = d[2];
            return d;
        });

        var xscale = d3.mean(data.nodes, function(d) {return Math.abs(d.x)});
        var yscale = d3.mean(data.nodes, function(d) {return Math.abs(d.y)});
        var scale = (xscale + yscale) / 2;

        var fbundling = ForceEdgeBundling()
            .nodes(data.nodes)
            .edges(data.links)
            .step_size(scale/1000)
            
        data.links = fbundling();    

        return data;
    },

    getLine: function() {
        return d3.svg.line()
            .x(function(d){ return d ? this.x(d.x) : null; })
            .y(function(d){ return d ? this.y(d.y) : null; })
            .interpolate('linear');
    },

    getLinkPathFunction: function() {
        var line = this.getLine();
        return function(d) {
            return line(d);
        }        
    }

});


module.exports = Visualization;

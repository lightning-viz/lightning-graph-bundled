'use strict';
var Graph = require('lightning-graph');
var d3 = require('d3');
var utils = require('lightning-client-utils');
var _ = require('lodash')
var ForceEdgeBundling = require('../deps/force-edge-bundling');

/*
 * Extend the base graph visualization
 */
var Visualization = Graph.extend({

    formatData: function(data) {
        var retColor = utils.getColorFromData(data)
        var retSize = data.size || []
        var retName = data.name || []
        var styles = this.styles

        var c, s, k

        data.nodes = data.nodes.map(function (d,i) {
            d.x = d[0]
            d.y = d[1]
            d.i = i
            d.n = retName[i]
            c = retColor.length > 1 ? retColor[i] : retColor[0]
            s = retSize.length > 1 ? retSize[i] : retSize[0]
            d.c = c ? c : styles.color
            d.k = c ? c.darker(0.75) : styles.stroke
            d.s = s ? s : styles.size
            return d
        })

        data.links = data.links.map(function (d) {
            d.source = d[0]
            d.target = d[1]
            d.value = d[2]
            return d
        })

        var xscale = d3.mean(data.nodes, function(d) {return Math.abs(d.x)})
        var yscale = d3.mean(data.nodes, function(d) {return Math.abs(d.y)})
        var scale = (xscale + yscale) / 2

        var fbundling = ForceEdgeBundling()
            .nodes(data.nodes)
            .edges(data.links)
            .step_size(scale/1000)
            
        data.links = fbundling()

        return data;
    },

    getSource: function(l) {
        return l[0].i
    },

    getTarget: function(l) {
        return l[l.length - 1].i
    },

    getLine: function(link) {
        var self = this

        link = _.map(link, function(l) {
            return [self.x(l.x), self.y(l.y)]
        })
        return link
    }

});


module.exports = Visualization;

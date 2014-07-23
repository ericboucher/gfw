/**
 * The Cartodb map layer module.
 * @return CartoDBLayerClass (extends LayerClass).
 */
define([
  'require',
  'underscore',
  'uri',
  'views/layers/class/OverlayLayerClass'
], function(require, _, UriTemplate, OverlayLayerClass) {

  'use strict';

  var CARTOCSS = require(['text!cartocss/style.cartocss']);
  var TPL = require(['text!templates/infowindow.handlebars']);

  var CartoDBLayerClass = OverlayLayerClass.extend({

    defaults: {
      user_name: 'wri-01',
      type: 'cartodb',
      sql: null,
      cartocss: CARTOCSS,
      interactivity: 'cartodb_id, name',
      infowindow: false
    },

    queryTemplate: 'SELECT cartodb_id||\':\' ||\'{tableName}\' as cartodb_id, the_geom_webmercator,' +
      '\'{tableName}\' AS layer, name FROM {tableName}',

    _getLayer: function() {
      var deferred = new $.Deferred();

      var cartodbOptions = {
        name: this.name,
        type: this.options.type,
        user_name: this.options.user_name,
        sublayers: [{
          sql: this.getQuery(),
          cartocss: this.options.cartocss,
          interactivity: this.options.interactivity
        }]
      };

      cartodb.createLayer(this.map, cartodbOptions)
      .done(
        _.bind(function(layer) {
          this.cdbLayer = layer;

          if (this.options.infowindow) {
            this.setInfowindow();
          }

          deferred.resolve(this.cdbLayer);
        }, this)
      ).error(function(err) {
        throw err;
      });

      return deferred.promise();
    },

    updateTiles: function() {
      this.cdbLayer.setQuery(this.getQuery());
    },

    /**
     * Create a CartodDB infowindow object
     * and add to CartoDB layer
     *
     * @return {object}
     */
    setInfowindow: function() {
      this.infowindow = cdb.vis.Vis.addInfowindow(this.map, this.cdbLayer.getSubLayer(0), this.options.interactivity, {
        infowindowTemplate: TPL,
        templateType: 'handlebars'
      });
    },

    /**
     * Get the CartoDB query. If it isn't set on this.options,
     * it gets the default query from this._queryTemplate.
     *
     * @return {string} CartoDB query
     */
    getQuery: function() {
      return new UriTemplate(this.options.sql || this.queryTemplate).fillFromObject({tableName: this.layer.table_name});
    }

  });

  return CartoDBLayerClass;
});

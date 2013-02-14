/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control/Button.js
 */

/**
 * Cl***REMOVED***: OpenLayers.Control.ZoomOut
 * The ZoomOut control is a button to decrease the zoom level of a map.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.ZoomOut = OpenLayers.Cl***REMOVED***(OpenLayers.Control.Button, {

    /**
     * Method: trigger
     */
    trigger: function(){
        if (this.map) {
            this.map.zoomOut();
        }
    },

    CLASS_NAME: "OpenLayers.Control.ZoomOut"
});

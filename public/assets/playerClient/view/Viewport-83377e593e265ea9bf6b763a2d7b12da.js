/*
 * File: app/view/Viewport.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.Viewport', {
//------------------------------------------------------------------------------

    extend: 'Biofuels.view.MainViewport',
    requires: [
        'Biofuels.view.MainViewport'
    ],
    renderTo: Ext.getBody(),
    autoScroll: true
    
});

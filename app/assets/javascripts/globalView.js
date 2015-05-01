/*
 * File: app.js
 */

Ext.define('WsConnection',{
  singleton: true,
  //webSocket: new WebSocketRails('localhost:3000/websocket'),
  id: '',
  gameChannel: ''

});

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    autoCreateViewport: true,
    name: 'BiofuelsGlobal',
    appFolder: '/assets/globalView',
    //--------------------------------------------------------------------------
    init: function(application) {
    },

    //--------------------------------------------------------------------------
    launch: function(profile) {
    }

});

/*
 * File: playerClient.js
 */


Ext.define('WsConnection',{
  singleton: true,
  //webSocket: new WebSocketRails('localhost:3000/websocket'),
  id: '',
  gameChannel: ''

});

// Ext.Loader.setConfig({
//     enabled: true
// });

Ext.application({
    autoCreateViewport: true,
    name: 'Biofuels',
    appFolder: '/assets/playerClient',
    //--------------------------------------------------------------------------
    init: function(application) {
      Ext.Loader.setConfig({
          enabled: true
      });
    },

    //--------------------------------------------------------------------------
    launch: function(profile) {
    	Biofuels.helpDelay = 1100
    }
});

/*
 * File: app.js
 */

Ext.define('WsConnection',{
  singleton: true,
  //webSocket: new WebSocketRails('localhost:3000/websocket'),
  id: '',
  gameChannel: ''

});

Ext.application({
    autoCreateViewport: true,
    name: 'BiofuelsModerator',
    appFolder: '/assets/moderator',


    //--------------------------------------------------------------------------
    init: function(application) {
      Ext.Loader.setConfig({
          enabled: true
      });
    },

    //--------------------------------------------------------------------------
    launch: function(profile) {
    }

});

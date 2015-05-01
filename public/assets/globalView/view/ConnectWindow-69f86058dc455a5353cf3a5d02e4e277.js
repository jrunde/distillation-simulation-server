Ext.define('BiofuelsGlobal.view.ConnectWindow', {
    extend: 'Ext.window.Window',
    id: 'connectWindow',

    height: 292,
    width: 456,
    layout: {
        type: 'absolute'
    },
    closable: false,
    title: 'Connecting to Server',
    titleAlign: 'center',
    id: 'connectWindow',
    constrainHeader: true,

    initComponent: function() {
        var me = this;
        
        var size = Ext.getCmp('viewport').size
        var x = (size.width - this.width) / 2
        var y = (size.height - this.height) / 2
        me.setPosition(x, y)

        var store1 = Ext.create('Ext.data.JsonStore', {
            storeId: 'loadStore',
            fields: ['data1'],
            data: [
              {'data1':1}
            ]
        });


        Ext.applyIf(me, {
            items: [
/*                {
                    xtype: 'textfield',
                    id: 'loadField',
                    x: 10,
                    y: 20,
                    width: 420,
                    fieldLabel: '',
                    emptyText: 'Loading...'
                },*/
                {
                    xtype: 'label',
                    x: 40,
                    y: 20,
                    id: 'loadingLabel',
                    width: 320,
                    text: 'Loading...'
                },
                {
                    xtype: 'chart',
                    x: 70,
                    y: 60,
                    height: 180,
                    width: 310,
                    animate: true,
                    insetPadding: 35,
                    store: store1,
                    theme: 'Category5',
                    axes: [
                        {
                            position: 'gauge',
                            type: 'Gauge',
                            margin: 5,
                            maximum: 4,
                            minimum: 0,
                            steps: 4
                        }
                    ],
                    series: [
                        {
                            type: 'gauge',
                            field: 'data1',
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },


    getRoom: function () {
      if(window.location.search){
        var params = location.search.substr(location.search.indexOf("?")+1);
        params = params.split("&")
        for (var i = 0; i < params.length; i++) {
          var p = params[i].split("=")[0]
          var v = params[i].split("=")[1]
          if(p == "room")
            return v
        };

      }

      return null
    },

    incCounter: function(){
      var store = Ext.data.StoreManager.lookup('loadStore').getAt(0)
      var currentVal = store.get("data1")
      store.set("data1", currentVal + 1 )
        // Ext.getCmp('loadingLabel').setText("Opening connection to server")
      if(currentVal==1){
        Ext.getCmp('loadingLabel').setText("Waiting to be assigned channel")
      }
      else if(currentVal==2){
        Ext.getCmp('loadingLabel').setText("Connecting to model")
      }
      else if(currentVal==3){
      }

      if(store.get("data1")>3){
        var joinPopup = Ext.create('BiofuelsGlobal.view.JoinGamePopup');
        joinPopup.show();
        Ext.getCmp('connectWindow').close();
        // BiofuelsGlobal.network.modRejoin(joinPopup)

        var roomName = this.getRoom();

        if(roomName){
          BiofuelsGlobal.roomInformation = {
            roomName: roomName,
            password: ""
          }

          WsConnection.webSocket.gameChannel = roomName


          var message = {
            event: 'globalJoinRoom',
            roomName: roomName,
            password: ""
          };

          BiofuelsGlobal.network.send(JSON.stringify(message))
        }
      }
    }

});

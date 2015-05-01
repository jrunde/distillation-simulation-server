Ext.define('Biofuels.view.ConnectWindow', {
    extend: 'Ext.window.Window',
    id: 'connectWindow',
    modal: true,
    height: 292,
    width: 456,
    layout: {
        type: 'absolute'
    },
    closable: false,
    title: 'Connecting to Server',
    titleAlign: 'center',
    constrainHeader: true,

    initComponent: function() {
        var me = this;

        var size = Ext.getBody().getViewSize()
        var x = (size.width - me.width) / 2
        var y = (size.height - me.height) / 2
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

    incCounter: function(){
      var store = Ext.data.StoreManager.lookup('loadStore').getAt(0)
      var currentVal = store.get("data1")
      store.set("data1", currentVal + 1 )
      if(currentVal==1){
        // Ext.getCmp('loadingLabel').setText("Opening connection to server")
        Ext.getCmp('loadingLabel').setText("Waiting to be assigned channel")
      }
      else if(currentVal==2){
        Ext.getCmp('loadingLabel').setText("Connecting to model")
      }
      else if(currentVal==3){
        Ext.getCmp('loadingLabel').setText("Connecting to model")
      }

      if(store.get("data1")>3){
        Biofuels.network.tryAutoJoin()
        this.close();
      }
    }

});
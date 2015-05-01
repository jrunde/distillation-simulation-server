Ext.define('BiofuelsModerator.view.StageToggle', {
    extend: 'Ext.container.Container',
    alias: 'widget.stageToggle',

    height: 62,
    width: 119,
    layout: {
        type: 'absolute'
    },
    stageName: 'stageName',
    stageDisplayName: 'Stage Name',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'cycle',
                    x: 20,
                    y: 30,
                    height: 20,
                    width: 70,
                    textAlign: 'left',
                    showText: true,
                    menu: {
                        xtype: 'menu',
                        floating: false,
                        width: 120,
                        items: [
                            {
                                xtype: 'menucheckitem',
                                text: 'Off'
                            },
                            {
                                xtype: 'menucheckitem',
                                text: 'On'
                            },
                        ]
                    },

                    changeHandler: function(cycleBtn, activeItem) {
                        me.sendItemChange(activeItem.text)
                    }
                },
                {
                    xtype: 'label',
                    x: 20,
                    y: 10,
                    height: 10,
                    width: 70,
                    text: me.stageDisplayName
                }
            ]
        });

        me.callParent(arguments);
    },

    sendItemChange: function(state){
      if (!WsConnection.webSocket.gameChannel)
        return

      var val = false;
      if(state == "On")
        val = true;

      var msg = {
        event: "setWaitForModerator",
        stage: this.stageName,
        value: val
      }
      BiofuelsModerator.network.send(JSON.stringify(msg))

    }



});

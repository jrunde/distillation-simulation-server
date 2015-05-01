/*
 * File: Biofuels/view/SinglePlayerOptionsWindow.js
 */

//------------------------------------------------------------------------------
Ext.define('BiofuelsModerator.view.SinglePlayerOptionsWindow', {
    //--------------------------------------------------------------------------

    extend: 'Ext.window.Window',
    requires: [ 'Biofuels.view.NetworkLayer' ],
    title: 'Game Options',
    layout: 'fit',
    autoDestroy: false,
    closable: false,
    resizable: false,
    titleAlign: 'center',
    modal: true,
    height: 250,
    width: 320,
    id: 'playerOptionsWindow',
    constrainHeader: true,

    //--------------------------------------------------------------------------
    initNetworkEvents: function () {
        var app = BiofuelsModerator;
        app.network.registerListener('createRoom', this.serverCreateRoomResult, this);
    },
    
    //--------------------------------------------------------------------------
    initComponent: function () {
        var me = this;
        
        var size = Ext.getCmp('viewport').size
        var x = (size.width - this.width) / 2
        var y = (size.height - this.height) / 2
        me.setPosition(x, y)

        Ext.applyIf(me, {
            x: 400,
            y: 400,
            items: [{
                xtype: 'panel',
                itemId: 'panel1',
                layout: {
                    type: 'absolute',
                    align: 'center',
                },
                items: [{
                        xtype: 'numberfield',
                        itemId: 'bots',
                        x: 25,
                        y: 25,
                        fieldLabel: 'Robot Opponents',
                        labelPad: 5,
                        labelWidth: 150,
                        labelAlign: 'right',
                        allowDecimals: false,
                        decimalPrecision: 0,
                        maxValue: 5,
                        minValue: 0,
                        value: 3,
                        width: 210
                    }, {
                        xtype: 'numberfield',
                        itemId: 'fieldCount',
                        x: 25,
                        y: 65,
                        value: 4,
                        fieldLabel: '# of Fields',
                        labelAlign: 'right',
                        labelPad: 5,
                        labelWidth: 150,
                        allowBlank: false,
                        allowDecimals: false,
                        maxValue: 6,
                        minValue: 2,
                        width: 210
                    }, {
                        xtype: 'checkboxfield',
                        itemId: 'soilVariation',
                        x: 30,
                        y: 105,
                        fieldLabel: 'Variable Initial Soil Health',
                        labelAlign: 'right',
                        labelPad: 5,
                        labelWidth: 200,
                        checked: false,
                        width: 260
                    }, {
                        xtype: 'button',
                        x: 65,
                        y: 155,
                        enableToggle: true,
                        scale: 'medium',
                        text: 'Begin',
                        pressed: true,
                        width: 110,
                        handler: function () {
                            me.beginGame()
                        }
                    }, {
                        xtype: 'button',
                        x: 195,
                        y: 155,
                        scale: 'medium',
                        width: 50,
                        text: 'Help',
                        scope: this,
                        handler: function () {
                            window.open('https://docs.fieldsoffuel.discovery.wisc.edu/game-options/');
                        }
                    },
                ]
            }]

        });
    
        me.callParent(arguments);
    },

    //--------------------------------------------------------------------------
    beginGame: function() {
        var bots = this.getComponent('panel1').getComponent('bots').value
        var fields = this.getComponent('panel1').getComponent('fieldCount').value
        var soil = this.getComponent('panel1').getComponent('soilVariation').value
        
        var room = "gen_" + Math.floor(new Date().getTime() / 10000).toString(16) + "_" + Math.floor(Math.random()*1001);
        var message = {
            event: "createRoom",
            roomName: room,
            password: "",
            playerCount: bots + 2,
            soilVariation: soil,
            fieldCount: fields
        }
        
        WsConnection.webSocket.gameChannel = room
        BiofuelsModerator.network.send(JSON.stringify(message))
        this.hide()

        message = {
            event: "joinRoom",
            roomID: room,
            roomName: room,
            deviseName: "guest@guest.com",
            password: "",
            userName: "Your Farm"
        }
            
        BiofuelsModerator.network.send(JSON.stringify(message))
        BiofuelsModerator.network.subscribe(WsConnection.webSocket.gameChannel);
        BiofuelsModerator.network.updateServerCredentials(WsConnection.webSocket.gameChannel,"Your Farm");
        BiofuelsModerator.network.startBots(bots)
    },
});

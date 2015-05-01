/*
 * File: BiofuelsModerator/view/CreateGamePopup.js
 */
//
// Sends Events:
//    event: 'validateRoom'
//        roomName: 'name'
//
//    event: 'createRoom'
//        roomName: 'name', password: 'pswd', playerCount: '1'
//
// Receives Events:
//
//    event: 'validateRoom'
//        result: 'true/false'
//
//    event: 'createRoom'
//        result: 'true/false'
//        errorMessage: 'errorMsg'
//------------------------------------------------------------------------------
Ext.define('BiofuelsModerator.view.CreateGamePopup', {
    //------------------------------------------------------------------------------

    extend: 'Ext.window.Window',
    requires: [
        'Ext.window.MessageBox'
    ],
    height: 270,
    width: 360,
    id: 'createGame',
    layout: {
        type: 'absolute'
    },
    closable: false,
    modal: true,
    title: 'Biofuels Game Creation',
    constrainHeader: true,

    //--------------------------------------------------------------------------
    initNetworkEvents: function () {
        var app = BiofuelsModerator;

        app.network.registerListener('validateRoom', this.manageLed, this);
        app.network.registerListener('createRoom', this.serverCreateRoomResult, this);
    },

    //--------------------------------------------------------------------------
    initComponent: function () {
        var me = this;
        this.initNetworkEvents();
        
        var size = Ext.getCmp('viewport').size
        var x = (size.width - this.width) / 2
        var y = (size.height - this.height) / 2
        me.setPosition(x, y)
        
        this.validated = false

        Ext.applyIf(me, {
            items: [{
                xtype: 'textfield',
                itemId: 'name',
                x: 20,
                y: 30,
                fieldLabel: 'Room Name',
                labelPad: 5,
                labelWidth: 100,
                labelAlign: 'right',
                allowBlank: false,
                blankText: 'Required',
                enforceMaxLength: true,
                maxLength: 16,
                validator: Ext.bind(this.dirtyChange, this)
            }, {
                xtype: 'image',
                itemId: 'roomLed',
                x: 305,
                y: 32,
                height: 20,
                width: 20,
                src: 'app/resources/redLed.png',
            }, /*{
                xtype: 'textfield',
                itemId: 'password',
                x: 20,
                y: 60,
                fieldLabel: 'Password',
                labelPad: 5,
                labelWidth: 100,
                labelAlign: 'right',
                enforceMaxLength: true,
                maxLength: 16
            },*/ 
            {
                xtype: 'numberfield',
                itemId: 'count',
                x: 20,
                y: 60,
                fieldLabel: 'Max Players',
                labelPad: 5,
                labelWidth: 200,
                labelAlign: 'right',
                allowDecimals: false,
                decimalPrecision: 0,
                maxValue: 48,
                minValue: 1,
                value: 8,
                width: 260
            }, {
                xtype: 'numberfield',
                itemId: 'bots',
                x: 20,
                y: 90,
                fieldLabel: '# of Robot Opponents',
                labelPad: 5,
                labelWidth: 200,
                labelAlign: 'right',
                allowDecimals: false,
                decimalPrecision: 0,
                maxValue: 5,
                minValue: 0,
                value: 0,
                width: 260
            }, {
                xtype: 'numberfield',
                itemId: 'fieldCount',
                x: 20,
                y: 120,
                value: 4,
                fieldLabel: '# of Fields',
                labelAlign: 'right',
                labelPad: 5,
                labelWidth: 200,
                allowBlank: false,
                allowDecimals: false,
                maxValue: 6,
                minValue: 2,
                width: 260
            }, {
                xtype: 'checkboxfield',
                itemId: 'soilVariation',
                x: 35,
                y: 150,
                fieldLabel: 'Variable Initial Soil Health',
                labelAlign: 'right',
                labelPad: 5,
                labelWidth: 200,
                checked: false,
                width: 260
            }, {
                xtype: 'button',
                x: 50,
                y: 190,
                width: 150,
                scale: 'medium',
                text: 'Create Game',
                scope: this,
                handler: function () {
                    if (this.validated) this.tryCreateRoom();
                    else {
                        var alert = Ext.Msg.alert('Invalid Name', 'The name you chose is not available at this time. Please select a different name.')
                        var x = (size.width - alert.width) / 2
                        var y = (size.height - alert.height) / 2
                        alert.setPosition(x, y)
                    }
                }
            },
            {
                xtype: 'button',
                x: 225,
                y: 190,
                width: 75,
                scale: 'medium',
                text: 'Help',
                scope: this,
                handler: function () {
                    window.open('https://docs.fieldsoffuel.discovery.wisc.edu/game-options-multiplayer/');
                }
            }]
        });

        me.callParent(arguments);
    },

    //--------------------------------------------------------------------------
    dirtyChange: function (value) {

        var app = BiofuelsModerator;
        var output = {
            event: 'validateRoom',
            roomName: value
        };
        app.network.send(JSON.stringify(output));

        return true;
    },

    //--------------------------------------------------------------------------
    manageLed: function (json) {

        var led = this.getComponent('roomLed');
        if ((led != null) && json.result) {
            led.setSrc('app/resources/greenLed.png');
        } else {
            led.setSrc('app/resources/redLed.png');
        }
        
        this.validated = json.result
    },

    // Asks the server to try to create the given room
    //--------------------------------------------------------------------------
    tryCreateRoom: function () {

        var roomName = this.getComponent('name').value;
        //var password = this.getComponent('password').value;
        var playerCount = this.getComponent('count').value;
        var fieldCount = this.getComponent('fieldCount').value;
        var soilVariation = this.getComponent('soilVariation').value;

        roomName = (typeof roomName == 'undefined' || roomName.length < 1) ? '' : roomName;
        //password = (typeof password == 'undefined' || password.length < 1) ? '' : password;

        if (typeof roomName == 'undefined' || roomName.length < 1) {

            Ext.MessageBox.alert('Data Required', 'A unique room name is required. ' +
                'The room name also cannot be left empty.');
            var roomName = this.getComponent('name').focus(true, true);
            return;
        }

        var message = {
            event: 'createRoom',
            roomName: roomName,
            //password: password,
            password: '',
            playerCount: playerCount,
            soilVariation: soilVariation,
            fieldCount: fieldCount
        };
        
        WsConnection.webSocket.gameChannel = roomName;
        BiofuelsModerator.network.send(JSON.stringify(message));
    },

    //--------------------------------------------------------------------------
    serverCreateRoomResult: function (json) {
        if (json.result) {
            var bots = this.getComponent('bots').value;
            BiofuelsModerator.network.subscribe(WsConnection.webSocket.gameChannel);
            BiofuelsModerator.network.updateServerCredentials(WsConnection.webSocket.gameChannel,"**MODERATOR**");
            BiofuelsModerator.network.startBots(bots);
            
            var msg = {
                event: 'getFarmerList',
            };

            BiofuelsModerator.network.send(JSON.stringify(msg))
            this.close();
        } else {
            Ext.MessageBox.alert('Create Room Error', json.errorMessage);
        }
    }
});

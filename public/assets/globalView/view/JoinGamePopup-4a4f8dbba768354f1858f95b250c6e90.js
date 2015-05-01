/*
 * File: BiofuelsGlobal/view/CreateGamePopup.js
 */

//
// Sends Events:
//		event: 'validateRoom'
//				roomName: 'name'
//
//		event: 'createRoom'
//				roomName: 'name', password: 'pswd', playerCount: '1'
//
// Receives Events:
//
//		event: 'validateRoom'
//				result: 'true/false'
//
//		event: 'createRoom'
//				result: 'true/false'
//				errorMessage: 'errorMsg'

//------------------------------------------------------------------------------
Ext.define('BiofuelsGlobal.view.JoinGamePopup', {
//------------------------------------------------------------------------------

    extend: 'Ext.window.Window',
    requires: [
    	'Ext.window.MessageBox'
    ],

    height: 150,
    width: 360,
    id: 'joinPopup',
    layout: {
        type: 'absolute'
    },
    closable: false,
    modal: true,
    title: 'Biofuels Global Viewer Join',
    constrainHeader: true,

    //--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = BiofuelsGlobal;

        app.network.registerListener('globalValidateRoom', this.manageLed, this);
        app.network.registerListener('globalJoinRoom', this.serverJoinRoomResult, this);
    },

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;
        var size = Ext.getCmp('viewport').size
        var x = (size.width - this.width) / 2
        var y = (size.height - this.height) / 2
        me.setPosition(x, y)
        this.initNetworkEvents();

        Ext.applyIf(me, {
            items: [{
				xtype: 'textfield',
				itemId: 'roomName',
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
			},
			{
				xtype: 'image',
				itemId: 'roomLed',
				x: 305,
				y: 32,
				height: 20,
				width: 20,
				src: 'app/resources/redLed.png'
			},
			/*{
				xtype: 'textfield',
				itemId: 'password',
				x: 20,
				y: 60,
				fieldLabel: 'Password',
				disabled: true,
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				enforceMaxLength: true,
				maxLength: 16
			},
			{
				xtype: 'image',
				itemId: 'passwordLed',
				x: 305,
				y: 62,
				hidden: true,
				height: 20,
				width: 20,
				src: 'app/resources/redLed.png'
			},*/
			{
				xtype: 'button',
				x: 100,
				y: 70,
				width: 160,
				scale: 'medium',
				text: 'Join Game',
				scope: this,
				handler: function() {
					this.tryJoinRoom();
				}
			}]
        });

        me.callParent(arguments);
    },

    //--------------------------------------------------------------------------
    dirtyChange: function(value) {

    	var app = BiofuelsGlobal;
    	var roomName = this.getComponent('roomName').value;
    	//var password = this.getComponent('password').value;

    	roomName = (typeof roomName == 'undefined' || roomName.length < 1) ? '' : roomName;
    	//password = (typeof password == 'undefined' || password.length < 1) ? '' : password;

 		var output = {
 			event: 'globalValidateRoom',
 			roomName: roomName,
 			password: "",//password
 		};
    	app.network.send(JSON.stringify(output));

    	return true;
    },

    //--------------------------------------------------------------------------
    manageLed: function(json) {
    	// -- Room
    	var led = this.getComponent('roomLed');
    	var roomMatched = json.roomResult;
    	if (roomMatched) {
    		led.setSrc('app/resources/greenLed.png');
    	}
    	else {
    		led.setSrc('app/resources/redLed.png');
    	}

    	/*// -- Password
    	led = this.getComponent('passwordLed');
    	password = this.getComponent('password');
    	var passwordResult = json.passwordResult;
    	if (!roomMatched || !json.needsPassword) {
    		password.setDisabled(true);
    		led.setVisible(false);
    	}
    	else {
    		password.setDisabled(false);
    		led.setVisible(true);
    	}

    	if (passwordResult && roomMatched) {
    		led.setSrc('app/resources/greenLed.png');
    	}
    	else {
    		led.setSrc('app/resources/redLed.png');
    	}*/
    },

    //--------------------------------------------------------------------------
    tryJoinRoom: function() {

    	var roomName = this.getComponent('roomName').value;
    	//var password = this.getComponent('password').value;

    	roomName = (typeof roomName == 'undefined' || roomName.length < 1) ? '' : roomName;
    	//password = (typeof password == 'undefined' || password.length < 1) ? '' : password;

    	if (typeof roomName == 'undefined' || roomName.length < 1) {

    		Ext.MessageBox.alert('Data Required', 'The room name cannot be left empty.');
    		var roomName = this.getComponent('name').focus(true,true);
    		return;
    	}

		// derp, save here for display...
		BiofuelsGlobal.roomInformation = {
			roomName: roomName,
			password: "",//password
		}

    	var message = {
    		event: 'globalJoinRoom',
    		roomName: roomName,
    		password: "",//password
    	};

      WsConnection.webSocket.gameChannel = roomName
    	BiofuelsGlobal.network.send(JSON.stringify(message));
    },

    //--------------------------------------------------------------------------
    serverJoinRoomResult: function(json) {

     	if (json.result) {
        BiofuelsGlobal.network.subscribe(WsConnection.webSocket.gameChannel);
        
        var msg = {
          event: 'getFarmerList',
        };
        BiofuelsGlobal.network.send(JSON.stringify(msg));
     	
        var msg = {
          event: 'getGameInfo',
        };
        BiofuelsGlobal.network.send(JSON.stringify(msg));
        
        this.close();
     	}
     	else {
     		Ext.MessageBox.alert('Join Room Error', json.errorMessage);
     	}
    }

});

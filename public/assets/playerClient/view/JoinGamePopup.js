/*
 * File: Biofuels/view/JoinGamePopup.js
 */

//
// Sends Events:
//		event: 'validateUserName'
//				roomName: 'name', password: 'pswd', userName: 'name'
//
// Receives Events:
//
//		event: 'validateUserName'
//				roomResult: 'true/false', needsPassword: 'true/false',
//				passwordResult: 'true/false', userNameResult: 'true/false'
//
//		event: 'joinRoom'
//				result: 'true/false'
//				errorMessage: 'errorMsg'

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.JoinGamePopup', {
//------------------------------------------------------------------------------

    extend: 'Ext.window.Window',
    requires: [
    	'Ext.window.MessageBox'
    ],
    id: 'joinGamePopup',
    //height: 230,
    height: 190,
    width: 360,
    layout: {
        type: 'absolute'
    },
    resizable: false,
    closable: false,
    modal: true,
    constrainHeader: true,
    title: 'Join a Biofuels Game',

    //--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = Biofuels;

        app.network.registerListener('validateUserName', this.manageLeds, this);
        app.network.registerListener('joinRoom', this.serverJoinRoomResult, this);
    },

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;
        this.initNetworkEvents();
        
        var size = Ext.getBody().getViewSize()
        var x = (size.width - me.width) / 2
        var y = (size.height - me.height) / 2
        me.setPosition(x, y)
        
        this.validated = false

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
                hasfocus:true,
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
				src: 'resources/redLed.png'
			},
			/*{
				xtype: 'textfield',
				itemId: 'password',
				x: 20,
				y: 60,
				disabled: true,
				fieldLabel: 'Password',
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				enforceMaxLength: true,
				maxLength: 16,
				validator: Ext.bind(this.dirtyChange, this)
			},
			{
				xtype: 'image',
				itemId: 'passwordLed',
				x: 305,
				y: 62,
				hidden: true,
				height: 20,
				width: 20,
				src: 'resources/redLed.png'
			},*/
			{
				xtype: 'textfield',
				itemId: 'userName',
				x: 20,
				//y: 100,
                y: 60,
				fieldLabel: 'Farmer Name',
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				enforceMaxLength: true,
				maxLength: 16,
				validator: Ext.bind(this.dirtyChange, this)
			},
			{
				xtype: 'image',
				itemId: 'userNameLed',
				x: 305,
				//y: 102,
                y: 62,
				height: 20,
				width: 20,
				src: 'resources/redLed.png'
			},
			{
				xtype: 'button',
				x: 50,
				//y: 150,
                y: 110,
				width: 150,
				scale: 'medium',
				text: 'Join Game',
				enabled: false,
				scope: this,
				handler: function() {
					if (this.validated) this.tryJoinRoom();
                    else {
                        var alert = Ext.Msg.alert('Invalid Info', 'The room and player name that you entered are not available right now. Please enter a different value next to the blanks that are red.')
                        var x = (size.width - alert.width) / 2
                        var y = (size.height - alert.height) / 2
                        alert.setPosition(x, y)
                    }
				}
			},
            {
                xtype: 'button',
                x: 225,
                y: 110,
                width: 75,
                scale: 'medium',
                text: 'Help',
                scope: this,
                handler: function() {
                    window.open('https://docs.fieldsoffuel.discovery.wisc.edu/join-multiplayer-game/')
                }
            }]
        });

        me.callParent(arguments);
    },

    //--------------------------------------------------------------------------
    dirtyChange: function(value) {

    	var roomName = this.getComponent('roomName').value;
    	//var password = this.getComponent('password').value;
    	var userName = this.getComponent('userName').value;

    	roomName = (typeof roomName == 'undefined' || roomName.length < 1) ? '' : roomName;
    	//password = (typeof password == 'undefined' || password.length < 1) ? '' : password;
    	userName = (typeof userName == 'undefined' || userName.length < 1) ? '' : userName;

    	var app = Biofuels;
 		var output = {
 			event: 'validateUserName',
 			roomName: roomName,
 			//password: password,
            password: '',
 			userName: userName
 		};
    	app.network.send(JSON.stringify(output));

    	return true;
    },

    //--------------------------------------------------------------------------
    manageLeds: function(json) {

    	// -- Room
    	var led = this.getComponent('roomLed');
      if (led == null)
        return
    	var roomMatched = json.roomResult;
    	if (roomMatched) {
    		led.setSrc('resources/greenLed.png');
    	}
    	else {
    		led.setSrc('resources/redLed.png');
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
    		led.setSrc('resources/greenLed.png');
    	}
    	else {
    		led.setSrc('resources/redLed.png');
    	}*/

    	// -- User Name
    	led = this.getComponent('userNameLed');
    	if (json.userNameResult) {
    		led.setSrc('resources/greenLed.png');
    	}
    	else {
    		led.setSrc('resources/redLed.png');
    	}
        
        this.validated = json.roomResult && json.userNameResult
    },

    // Asks the server to try to join the given room
    //--------------------------------------------------------------------------
    tryJoinRoom: function() {

    	var roomName = this.getComponent('roomName').value;
    	//var password = this.getComponent('password').value;
    	var userName = this.getComponent('userName').value;

    	if (typeof roomName == 'undefined' || typeof userName == 'undefined') {

    		Ext.MessageBox.alert('Data Required', 'A valid room name and farmer name are required.');
    		var roomName = this.getComponent('roomName').focus(true,true);
    		return;
    	}

    	roomName = (typeof roomName == 'undefined' || roomName.length < 1) ? '' : roomName;
    	//password = (typeof password == 'undefined' || password.length < 1) ? '' : password;
    	userName = (typeof userName == 'undefined' || userName.length < 1) ? '' : userName;

		// derp, save here for display...
		Biofuels.farmerName = userName;

    	var message = {
    		event: 'joinRoom',
    		roomName: roomName,
    		//password: password,
            password: '',
    		userName: userName
    	};
    
    	WsConnection.webSocket.gameChannel = roomName
    	Biofuels.network.send(JSON.stringify(message));
    },

    //--------------------------------------------------------------------------
    serverJoinRoomResult: function(json) {
        console.log(json)
     	if (json.result) {
            WsConnection.webSocket.gameChannel = json.roomName
            Biofuels.network.subscribe(json.roomName);
            Biofuels.network.updateServerCredentials(json.roomName, json.userName)

            var msg = {
                event: "getFarmData"
            }
            
            Biofuels.network.send(JSON.stringify(msg));
            this.close();
            
     	} else {
            Ext.MessageBox.alert('Join Room Error', json.errorMessage,
                function(){
                    Biofuels.network.clearSession()
                    window.location = "/"
                }
            )
     	}
    }
});

/*
 * File: NetworkLayer.js
 */
// TODO: would be nice if this could be shared between: player, moderator, global projects?
Ext.define('Biofuels.view.NetworkLayer', {


    //--------------------------------------------------------------------------
    constructor: function () {
        this.networkEvents = new Array();

        /*var channel = webSocket.subscribe('bla');

      channel.bind('event', function(message){
        console.log('blatest success')
      });*/
    },

    //--------------------------------------------------------------------------
    registerListener: function (eventName, eventProcessor, scope) {
        var event = {
            name: eventName,
            processor: eventProcessor,
            scope: scope
        };

        this.networkEvents.push(event);
    },

    //--------------------------------------------------------------------------
    openSocket: function (useNative) {
        window.WEB_SOCKET_FORCE_FLASH = true;

        if (useNative)
            WsConnection.webSocket = new WebSocketRails(window.location.host + '/websocket');
        else
            WsConnection.webSocket = new WebSocketRails(window.location.host + '/websocket', false);

        // WsConnection.webSocket = new WebSocketRails(window.location.hostname + ':80/websocket',false);
        // WsConnection.webSocket = new WebSocketRails('localhost:3000/websocket');
        // WsConnection.webSocket = new WebSocketRails('http://sleepy-temple-8942.herokuapp.com:80/websocket', false);


        var self = this;
        var size = Ext.getBody().getViewSize()
        WsConnection.webSocket.on_open = function () {
            console.log('the sockets are open')
            Ext.getCmp('connectWindow').incCounter()
        };
        WsConnection.webSocket.bind('connection_closed', function () {
            self.tryReconnect();
        });
        WsConnection.webSocket.on_message = function (message) {

            // var json = JSON.parse(message.data);
            // var index;
            // for (index = 0; index < self.networkEvents.length; index++) {
            //   var ne = self.networkEvents[index];
            //   if (!json.event.localeCompare(ne.name)) {
            //     ne.processor.call(ne.scope, json);
            //   }
            // }
        };
        WsConnection.webSocket.on_error = function () {
            console.log('websocket onError!!');
        };


        var success = function (channelID) {
            console.log('assigned id ' + channelID);
            Ext.getCmp('connectWindow').incCounter()

            WsConnection.webSocket.id = channelID.toString();
            var channel = WsConnection.webSocket.subscribe(channelID.toString());

            channel.bind('event', function (message) {

                var json = JSON.parse(message);
                if (json.event == "modelError") {
                    var err = Ext.Msg.alert(json.shortMessage, json.longMessage)
                    var x = (size.width - err.width) / 2
                    var y = (size.height - err.height) / 2
                    err.setPosition(x, y)
                }
                var index;
                for (index = 0; index < self.networkEvents.length; index++) {
                    var ne = self.networkEvents[index];
                    if (!json.event.localeCompare(ne.name)) {
                        ne.processor.call(ne.scope, json);
                    }
                }
            });
        }

        WsConnection.webSocket.trigger('get_new_id', 'blank', success);
    },

    subscribe: function (channel) {
        self = this;
        var size = Ext.getBody().getViewSize()
        WsConnection.webSocket.subscribe(channel).bind('event', function (message) {
            var json = JSON.parse(message);
            if (json.event == "modelError") {
                var err = Ext.Msg.alert(json.shortMessage, json.longMessage)
                var x = (size.width - err.width) / 2
                var y = (size.height - err.height) / 2
                err.setPosition(x, y)
            } else {
                var index;
                for (index = 0; index < self.networkEvents.length; index++) {
                    var ne = self.networkEvents[index];
                    if (!json.event.localeCompare(ne.name)) {
                        ne.processor.call(ne.scope, json);
                    }
                }
            }
        });
    },

    checkModel: function () {
        var success = function () {
            Ext.getCmp('connectWindow').incCounter();
        }
        WsConnection.webSocket.trigger('check_model', 'blank', success)
    },

    reportBug: function (title, body) {

        WsConnection.webSocket.trigger('found_bug', {
            title: title,
            body: body
        })
        // WsConnection.webSocket.trigger('bug_report','bugbugbug');
    },

    tryAutoJoin: function () {
        var me = this;
        var success = function (msg) {
            console.log('can rejoin!')

            var suc = function(){
                console.log('did rejoin!')
            }

            var fai = function(){
                console.log('2 fail join :(!')
            }
            
            if (msg.room.slice(0,4) == "gen_") {
                Ext.getCmp('joinGamePopup').close();
                //WsConnection.webSocket.trigger('try_rejoin', [WsConnection.webSocket.id], suc, fai)
                var message = {
                    event: 'joinRoom',
                    roomName: msg.room,
                    roomID: msg.room,
                    userName: 'Your Farm',
                    password: ''
                }
                me.send(JSON.stringify(message))
                
                // create a game settings button and add it to the farm panel
                var button = Ext.create('Ext.button.Button', {
                    text: 'Moderator Controls',
                    handler: function () {
                        window.open('./moderator')
                    }
                })
        
                Ext.getCmp('holderPanel').header.insert(1, button)

            } else {
                var prompt = "Try to rejoin room \"" + msg.room + "\" ?"
                Ext.MessageBox.confirm("Rejoin?", prompt, function (value) {
                    if(value == "yes"){
                        Ext.getCmp('joinGamePopup').close();
                        WsConnection.webSocket.trigger('try_rejoin', [WsConnection.webSocket.id], suc, fai)
                    } else {
                        Ext.getCmp('joinGamePopup').show();
                        console.log("ignore rejoin")
                    }
                })
            }
        }

        var fail = function () {
            Ext.getCmp('joinGamePopup').show();
            console.log('fail join :(!')
        }
        WsConnection.webSocket.trigger('can_rejoin', [WsConnection.webSocket.id], success, fail)
    },

    modRejoin: function () {
        var self = this
        var size = Ext.getBody().getViewSize()
        var success = function (data) {
            
            console.log('mod rejoin!', data)
            WsConnection.webSocket.gameChannel = data
            self.tryReconnect()
            
            // if it is a single player game
            if (data.slice(0,4) == "gen_") {
                // alert the moderator they've rejoined their previous game
                var alert = Ext.Msg.alert('Moderator Rejoin', "You've rejoined as moderator for your most recent game. To end the game permanently, click the \"End Game\" button.");
                var x = (size.width - alert.width) / 2
                var y = (size.height - alert.height) / 2
                alert.setPosition(x, y)
            
                // make the necessary updates to the moderator layout
                var panel = Ext.getCmp('viewport').getComponent('panel1').getComponent('panel2')
                panel.remove('help', true)
                panel.remove('scoreboard', true)
                panel.remove('helpOptions', true)
                panel.getComponent('start').setText('Play') // ideally should only happen if the year is not 0
                panel.getComponent('start').handler = function() {
                    Ext.getCmp('viewport').applySettingsChange(true)
           
                    if (this.text == "Start") {
                        Ext.getCmp('viewport').applySettingsChange(true)
                        this.setText('Play')
                    }
           
                    window.open('./play')
                }
                panel.getComponent('nextStage').handler = panel.getComponent('endGame').handler
                panel.getComponent('nextStage').setText('End Game')
                panel.getComponent('endGame').setText('Help')
                panel.getComponent('endGame').handler = function() {
                    window.open('https://docs.fieldsoffuel.discovery.wisc.edu/game-settings-multi-player/')
                }
            }
            
            // if it is a multiplayer game
            else {
                Ext.create('BiofuelsModerator.view.MultiplayerOptionsWindow').show()
            }
            
            // subscribe to the correct channel and update server credentials
            BiofuelsModerator.network.subscribe(WsConnection.webSocket.gameChannel);
            BiofuelsModerator.network.updateServerCredentials(WsConnection.webSocket.gameChannel,"**MODERATOR**");

            // send messages to display game info
            var msg = {
                event: 'getFarmerList',
            }
            self.send(JSON.stringify(msg))
            
            msg = {
                event: 'getGameInfo',
            }
            self.send(JSON.stringify(msg))
        }

        var fail = function () {
            console.log('fail mod join :(!')
            Ext.getCmp('gameTypeWindow').show()
        }
        WsConnection.webSocket.trigger('mod_rejoin', [WsConnection.webSocket.id], success, fail)
    },

    updateServerCredentials: function (room, user) {
        var success = function () {
            console.log('update server cred')
        }

        var fail = function () {
            console.log('fail update server cred')
        }
        WsConnection.webSocket.trigger('update_credentials', [WsConnection.webSocket.id, room, user], success, fail)
    },

    startBots: function(num) {
        if(num == null)
            num = 1

        for (var i = 0; i < num; i++) {
            var msg = {
              event: 'newBot',
              executable: "run_bot",
              args: ""
            }

            this.send(JSON.stringify(msg))
        };
    },

    clearSession: function () {
        var success = function () {
            console.log('exited game')
        }

        var fail = function () {
            console.log('error exiting game')
        }
        WsConnection.webSocket.trigger('clear_session', [WsConnection.webSocket.id], success, fail)
    },

    tryReconnect: function () {
        var self = this
        var size = Ext.getBody().getViewSize()
        var msg = Ext.Msg.show({
            height: 100,
            width: 200,
            title: 'Connecting',
            msg: 'Connecting To Server...'
        })
        var x = (size.width - msg.width) / 2
        var y = (size.height - msg.height) / 2
        msg.setPosition(x, y)
        
        var oldID = WsConnection.webSocket.id
        var oldGame = WsConnection.webSocket.gameChannel
        var interval = setInterval(function () {
            WsConnection.webSocket = new WebSocketRails(window.location.host + '/websocket');
            //TODO lots of repetition here because I'm confused about callback scoping...
            setTimeout(function () {
                if (WsConnection.webSocket.state == "connected") {
                    if (oldGame.slice(0,4) != "gen_") msg.close()
                    console.log("reconnected!")
                    clearInterval(interval);
                    var reconnected = function () {
                        var channel = WsConnection.webSocket.subscribe(oldID);
                        var gameChannel = WsConnection.webSocket.subscribe(oldGame);
                        WsConnection.webSocket.id = oldID;
                        WsConnection.webSocket.gameChannel = oldGame;
                        
                        // there used to be two messages sent here (getFarmData and getFarmerList)
                        // they didn't seem to be working at all, so I deleted them

                        channel.bind('event', function (message) {
                            var json = JSON.parse(message);
                            if (json.event == "modelError") {
                                var err = Ext.Msg.alert(json.shortMessage, json.longMessage)
                                var x = (size.width - err.width) / 2
                                var y = (size.height - err.height) / 2
                                err.setPosition(x, y)
                            } else {
                                var index;
                                for (index = 0; index < self.networkEvents.length; index++) {
                                    var ne = self.networkEvents[index];
                                    if (!json.event.localeCompare(ne.name)) {
                                        ne.processor.call(ne.scope, json);
                                    }
                                }
                            }
                        });

                        gameChannel.bind('event', function (message) {

                            var json = JSON.parse(message);
                            if (json.event == "modelError") {
                                var err = Ext.Msg.alert(json.shortMessage, json.longMessage)
                                var x = (size.width - err.width) / 2
                                var y = (size.height - err.height) / 2
                                err.setPosition(x, y)
                            } else {
                                var index;
                                for (index = 0; index < self.networkEvents.length; index++) {
                                    var ne = self.networkEvents[index];
                                    if (!json.event.localeCompare(ne.name)) {
                                        ne.processor.call(ne.scope, json);
                                    }
                                }
                            }
                        });

                        WsConnection.webSocket.bind('connection_closed', function () {
                            self.tryReconnect();
                        });
                    }

                    WsConnection.webSocket.trigger('reconnected_client', [oldID, oldGame], reconnected);
                }
            }, 500);
        }, 2000);
    },

    //--------------------------------------------------------------------------
    send: function (json) {
        var sendArray = new Array();
        sendArray.push(WsConnection.webSocket.id);
        sendArray.push(WsConnection.webSocket.gameChannel);
        sendArray.push(json);
        // console.log('sending', sendArray)
        WsConnection.webSocket.trigger('receive_event', sendArray);
    }

});

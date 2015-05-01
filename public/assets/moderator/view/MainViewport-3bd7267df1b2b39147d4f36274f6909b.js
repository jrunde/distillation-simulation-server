/*
 * File: BiofuelsModerator/view/MainViewport.js
 */

Ext.onReady(function () {

    Ext.create('BiofuelsModerator.view.ConnectWindow').show();
    Ext.create('BiofuelsModerator.view.JoinCreateWindow');
    Ext.create('BiofuelsModerator.view.CreateGamePopup');
    Ext.create('BiofuelsModerator.view.GameTypeWindow');
    Ext.create('BiofuelsModerator.view.SinglePlayerOptionsWindow');
});

//------------------------------------------------------------------------------
Ext.define('BiofuelsModerator.view.MainViewport', {
    //--------------------------------------------------------------------------

    extend: 'Ext.container.Viewport',
    id: 'viewport',
    requires: [
        'BiofuelsModerator.view.CreateGamePopup',
        'BiofuelsModerator.view.StageToggle',
        'BiofuelsModerator.view.AdvancedPanel',
        'BiofuelsModerator.view.BotAssignmentWindow',
        'Biofuels.view.NetworkLayer',
    ],
    layout: {
        type: 'hbox',
    },
    title: 'My Window',
    autoScroll: true,
    size: null,

    //--------------------------------------------------------------------------
    initComponent: function () {
        this.size = Ext.getBody().getViewSize()
        this.playerStore = Ext.create('Ext.data.JsonStore', {
            storeId: 'modPlayerStore',
            fields: [
                {name: 'name', type: 'string'},
            ],
        });

        BiofuelsModerator.network = Ext.create('Biofuels.view.NetworkLayer');
        BiofuelsModerator.network.openSocket(true);
        BiofuelsModerator.network.checkModel();
        BiofuelsModerator.network.registerListener('getFarmerList', this.updateFarmerList, this);
        BiofuelsModerator.network.registerListener('getGameInfo', this.updateGameInfo, this);
        BiofuelsModerator.network.registerListener('advanceStage', this.disableApply, this);

        var me = this
        Ext.applyIf(me, {
            items: [{
                xtype: 'panel',
                itemId: 'panel1',
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                },
                items: [{
                    xtype: 'panel',
                    itemId: 'panel2',
                    height: 880,
                    width: 780,
                    layout: {
                        type: 'absolute',
                        align: 'center'
                    },
                    title: 'Moderator Controls',
                    titleAlign: 'center',
                    items: [
                    {
                        xtype: 'label',
                        text: 'Game Controls:',
                        style: {
                            fontSize: '15px',
                        },
                        x: 50,
                        y: 25,
                    }, {
                        xtype: 'label',
                        itemId: 'helpOptions',
                        text: 'Help Options:',
                        style: {
                            fontSize: '15px',
                        },
                        x: 520,
                        y: 25,
                    }, {
                        xtype: 'button',
                        itemId: 'start',
                        x: 50,
                        y: 75,
                        enableToggle: true,
                        scale: 'medium',
                        text: 'Start',
                        pressed: true,
                        width: 110,
                        handler: function () {
                            
                            var msg = {
                                event: "togglePause"
                            }
                            if (this.text == "Start") {
                                me.applySettingsChange(true)
                                window.open("global?room="+WsConnection.webSocket.gameChannel);
                            }

                            //enable special behavior. A little hacky but it works
                            if (this.text == "Start" || this.text == "Play")
                                this.setText('Pause')
                            else
                                this.setText('Play')
                                
                            BiofuelsModerator.network.send(JSON.stringify(msg))
                        }
                    }, {
                        xtype: 'button',
                        itemId: 'nextStage',
                        x: 170,
                        y: 75,
                        scale: 'medium',
                        width: 110,
                        text: 'Next Stage',
                        scope: this,
                        handler: function () {
                            this.advanceStage();
                        }
                    }, {
                        xtype: 'button',
                        itemId: 'endGame',
                        x: 290,
                        y: 75,
                        scale: 'medium',
                        width: 110,
                        text: 'End Game',
                        handler: function(){
                            var confirm = Ext.Msg.confirm('Confirm', 'Do you really wish to end the game?',function(button) {
                                if (button === 'yes') {
                                    msg = { event: 'endGame' }
                                    BiofuelsModerator.network.send(JSON.stringify(msg))
                                    BiofuelsModerator.network.clearSession()
                                    window.location = '/'
                                } else {
                                    // do something when No was clicked.
                                }
                            });

                            var x = (me.size.width - confirm.width) / 2
                            var y = (me.size.height - confirm.height) / 2
                            confirm.setPosition(x, y)
                        }
                    }, {
                        xtype: 'button',
                        itemId: 'scoreboard',
                        x: 500,
                        y: 75,
                        scale: 'medium',
                        width: 110,
                        text: 'Scoreboard',
                        scope: this,
                        handler: function () {
                            window.open("global?room="+WsConnection.webSocket.gameChannel);
                        }
                    }, {
                        xtype: 'button',
                        itemId: 'help',
                        x: 620,
                        y: 75,
                        scale: 'medium',
                        width: 110,
                        text: 'Help',
                        scope: this,
                        handler: function () {
                            window.open('https://docs.fieldsoffuel.discovery.wisc.edu/game-settings-multi-player/');
                        }
                    }, {
                        xtype: 'button',
                        itemId: 'apply',
                        x: 50,
                        y: 125,
                        scale: 'medium',
                        width: 230,
                        text: 'Apply Changes',
                        scope: this,
                        handler: function () {
                            me.applySettingsChange(true)
                        }
                    }, {
                        xtype: 'label',
                        text: 'Game Settings:',
                        style: {
                            fontSize: '15px',
                        },
                        x: 50,
                        y: 205,
                    },   {
                        xtype: 'checkboxfield',
                        itemId: 'dynamicmarket',
                        x: 50,
                        y: 255,
                        fieldLabel: 'Market-Driven Prices Enabled',
                        labelAlign: 'right',
                        labelWidth: 260,
                    }, {
                        xtype: 'checkboxfield',
                        itemId: 'managementOptions',
                        x: 50,
                        y: 295,
                        fieldLabel: 'Management Options Enabled',
                        labelAlign: 'right',
                        labelWidth: 260,
                    }, {
                        xtype: 'checkboxfield',
                        itemId: 'helpPopups',
                        x: 50,
                        y: 335,
                        fieldLabel: 'Help Popups Disabled',
                        labelAlign: 'right',
                        labelWidth: 260,
                    }, {
                        xtype: 'label',
                        text: 'Adjust Crop Prices:',
                        style: {
                            fontSize: '15px',
                        },
                        x: 50,
                        y: 405,
                    }, {
                        xtype: 'label',
                        text: '$',
                        style: {
                            fontSize: '15px',
                        },
                        x: 140,
                        y: 457,
                    }, {
                        xtype: 'label',
                        text: '$',
                        opacity: 50,
                        style: {
                            fontSize: '15px',
                        },
                        x: 140,
                        y: 497,
                    }, {
                        xtype: 'label',
                        text: '$',
                        style: {
                            fontSize: '15px',
                        },
                        x: 140,
                        y: 537,
                    }, {
                        xtype: 'textfield',
                        itemId: 'corn',
                        x: 50,
                        y: 455,
                        fieldLabel: 'Corn',
                        value: '250',
                        inputAttrTpl: "data-qtip='When in a dynamic market, you can only change the base prices at the start of the game.'",
                        validator: function() {
                            var panel = me.getComponent('panel1').getComponent('panel2')
                            if (panel.getComponent('corn').getValue() == '') return 'A value must be entered.'
                            else if (Math.floor(panel.getComponent('corn').getValue()) != panel.getComponent('corn').getValue()) return 'Must be an integer.'
                            else if (isNaN(panel.getComponent('corn').getValue())) return 'Not a valid number.'
                            else if (parseInt(panel.getComponent('corn').getValue()) > 500 || parseInt(panel.getComponent('alfalfa').getValue()) < 0) return 'Must be between 0 and 500.'
                            else return true
                        }
                    }, {
                        xtype: 'textfield',
                        itemId: 'grass',
                        x: 50,
                        y: 495,
                        fieldLabel: 'Grass',
                        value: '80',
                        inputAttrTpl: "data-qtip='When in a dynamic market, you can only change the base prices at the start of the game.'",
                        validator: function() {
                            var panel = me.getComponent('panel1').getComponent('panel2')
                            if (panel.getComponent('grass').getValue() == '') return 'A value must be entered.'
                            else if (Math.floor(panel.getComponent('grass').getValue()) != panel.getComponent('grass').getValue()) return 'Must be an integer.'
                            else if (isNaN(panel.getComponent('grass').getValue())) return 'Not a valid number.'
                            else if (parseInt(panel.getComponent('grass').getValue()) > 500 || parseInt(panel.getComponent('alfalfa').getValue()) < 0) return 'Must be between 0 and 500.'
                            else return true
                        }
                    }, {
                        xtype: 'textfield',
                        itemId: 'alfalfa',
                        x: 50,
                        y: 535,
                        fieldLabel: 'Alfalfa',
                        value: '125',
                        inputAttrTpl: "data-qtip='When in a dynamic market, you can only change the base prices at the start of the game.'",
                        validator: function() {
                            var panel = me.getComponent('panel1').getComponent('panel2')
                            if (panel.getComponent('alfalfa').getValue() == '') return 'A value must be entered.'
                            else if (Math.floor(panel.getComponent('alfalfa').getValue()) != panel.getComponent('alfalfa').getValue()) return 'Must be an integer.'
                            else if (isNaN(panel.getComponent('alfalfa').getValue())) return 'Not a valid number.'
                            else if (parseInt(panel.getComponent('alfalfa').getValue()) > 500 || parseInt(panel.getComponent('alfalfa').getValue()) < 0) return 'Must be between 0 and 500.'
                            else return true
                        }
                    }, {
                        xtype: 'label',
                        text: 'Reweight Sustainability Score:',
                        style: {
                            fontSize: '15px',
                        },
                        x: 50,
                        y: 615,
                    }, {
                        xtype: 'textfield',
                        itemId: 'economy',
                        x: 50,
                        y: 665,
                        fieldLabel: 'Economy',
                        width: 200,
                        value: '1',
                        validator: function() {
                            var panel = me.getComponent('panel1').getComponent('panel2')
                            if (panel.getComponent('economy').getValue() == '') return 'A value must be entered.'
                            else if (Math.floor(panel.getComponent('economy').getValue()) != panel.getComponent('economy').getValue()) return 'Must be an integer.'
                            else if (isNaN(panel.getComponent('economy').getValue())) return 'Not a valid number.'
                            else if (parseInt(panel.getComponent('economy').getValue()) < 0 || parseInt(panel.getComponent('economy').getValue()) > 25) return 'Must be between 0 and 25.'
                            else return true
                        },
                        listeners: {
                            'change': function() {
                                me.percentageChange()
                            }
                        }
                    }, {
                        xtype: 'label',
                        itemId: 'economyText',
                        text: '= 33.3%',
                        style: {
                            fontSize: '15px',
                        },
                        x: 275,
                        y: 665,
                    }, {
                        xtype: 'textfield',
                        itemId: 'energy',
                        x: 50,
                        y: 705,
                        fieldLabel: 'Energy',
                        width: 200,
                        value: '1',
                        validator: function() {
                            var panel = me.getComponent('panel1').getComponent('panel2')
                            if (panel.getComponent('energy').getValue() == '') return 'A value must be entered.'
                            else if (Math.floor(panel.getComponent('energy').getValue()) != panel.getComponent('energy').getValue()) return 'Must be an integer.'
                            else if (isNaN(panel.getComponent('energy').getValue())) return 'Not a valid number.'
                            else if (parseInt(panel.getComponent('energy').getValue()) < 0 || parseInt(panel.getComponent('energy').getValue()) > 25) return 'Must be between 0 and 25.'
                            else return true
                        },
                        listeners: {
                            'change': function() {
                                me.percentageChange()
                            }
                        }
                    }, {
                        xtype: 'label',
                        itemId: 'energyText',
                        text: '= 33.3%',
                        style: {
                            fontSize: '15px',
                        },
                        x: 275,
                        y: 705,
                    }, {
                        xtype: 'textfield',
                        itemId: 'environment',
                        x: 50,
                        y: 745,
                        fieldLabel: 'Environment',
                        width: 200,
                        value: '1',
                        validator: function() {
                            var panel = me.getComponent('panel1').getComponent('panel2')
                            if (panel.getComponent('environment').getValue() == '') return 'A value must be entered.'
                            else if (Math.floor(panel.getComponent('environment').getValue()) != panel.getComponent('environment').getValue()) return 'Must be an integer.'
                            else if (isNaN(panel.getComponent('environment').getValue())) return 'Not a valid number.'
                            else if (parseInt(panel.getComponent('environment').getValue()) < 0 || parseInt(panel.getComponent('environment').getValue()) > 25) return 'Must be between 0 and 25.'
                            else return true
                        },
                        listeners: {
                            'change': function() {
                                me.percentageChange()
                            }
                        }
                    }, {
                        xtype: 'label',
                        itemId: 'environmentText',
                        text: '= 33.3%',
                        style: {
                            fontSize: '15px',
                        },
                        x: 275,
                        y: 745,
                    }, {
                        xtype: 'checkboxfield',
                        itemId: 'reweightBots',
                        x: 50,
                        y: 785,
                        fieldLabel: 'Recalculate Robot Strategies',
                        labelAlign: 'right',
                        labelWidth: 260,
                    }, {
                        xtype: 'gridpanel',
                        itemId: 'farmerList',
                        store: 'modPlayerStore',
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            mode : 'SIMPLE'
                        }),
                        x: 510,
                        y: 205,
                        height: 550,
                        width: 230,
                        header: false,
                        columns: [{
                            xtype: 'gridcolumn',
                            width: 204,
                            dataIndex: 'name',
                            resizable: false,
                            hideable: false,
                            text: 'Farmer List',
                        },],
                    }, {
                        xtype: 'button',
                        itemId: 'remove',
                        x: 510,
                        y: 775,
                        scale: 'medium',
                        width: 110,
                        text: 'Remove',
                        scope: this,
                        handler: function () {
                            var selected = me.getComponent('panel1').getComponent('panel2').getComponent('farmerList').selModel.getSelection()
                            if (selected.length == 0) return
                            
                            var containsMe = false
                            for (var i = 0; i < selected.length; i++) {
                                if (selected[i].data.name == 'Your Farm') containsMe = true
                            }
                            
                            if (containsMe) {
                                var alert = Ext.Msg.alert('Player Removal', 'You aren\'t allowed to remove yourself from the game. If you wish to remove another player, please select the box next to his or her name.');
                                var x = (this.size.width - alert.width) / 2
                                var y = (this.size.height - alert.height) / 2
                                alert.setPosition(x, y)
                            }
                            else {
                                confirm = Ext.Msg.confirm('Confirm', 'Remove player(s) from the game?',function(button) {
                                    if (button === 'yes') {
                                        for (var i = 0; i < selected.length; i++) {
                                            var msg = {
                                                event: 'kickPlayer',
                                                player: selected[i].data.name
                                            }
                                            BiofuelsModerator.network.send(JSON.stringify(msg))
                                        }
                                    } else {
                                        // do something when No was clicked.
                                    }
                                });
                                var x = (this.size.width - confirm.width) / 2
                                var y = (this.size.height - confirm.height) / 2
                                confirm.setPosition(x, y)
                            }
                        }
                    }, {
                        xtype: 'button',
                        itemId: 'assign',
                        x: 620,
                        y: 775,
                        scale: 'medium',
                        width: 110,
                        text: 'Assign Strategy',
                        scope: this,
                        handler: function () {
                            var selected = me.getComponent('panel1').getComponent('panel2').getComponent('farmerList').selModel.getSelection()
                            if (selected.length == 0) return
                            else if (selected.length != 1) {
                                var alert = Ext.Msg.alert('Strategy Assignment', 'It is only possible to assign a playing strategy to one player at a time. Please deselect all players except the one you wish to reassign.');
                                var x = (this.size.width - alert.width) / 2
                                var y = (this.size.height - alert.height) / 2
                                alert.setPosition(x, y)
                            }
                            else {
                                var bot = selected[0].data.name.substr(selected[0].data.name.length - 5, 5) == '(bot)'
                            
                                if (!bot) {
                                    var alert = Ext.Msg.alert('Strategy Assignment', 'It is only possible to assign a playing strategy to robot players unless you have the extension cords that can link into a human brain port.');
                                    var x = (this.size.width - alert.width) / 2
                                    var y = (this.size.height - alert.height) / 2
                                    alert.setPosition(x, y)
                                }
                                else {
                                
                                    var botWindow = Ext.create('BiofuelsModerator.view.BotAssignmentWindow')
                                    botWindow.bot = selected[0].data.name
                                    
                                    var msg = {
                                        event: 'getBotStrategy',
                                        name: selected[0].data.name
                                    }
                                    BiofuelsModerator.network.send(JSON.stringify(msg))
                                    
                                    botWindow.show()
                                }
                            }
                        }
                    },]
                }, ]
            }, ]
        });
        
        /*Ext.create('Ext.ToolTip', {
            target: me.getComponent('panel1').getComponent('panel2').getComponent('alfalfa'),
            anchor: 'bottom',
            anchorOffset :90,
            html: null,
            title:'My Tooltip',
            width: 500,
            trackMouse : false,
            autoHide: true,
            stateful:false,
            closable: true,
            hideDelay:1000,
            listeners: {
                
            }
        });*/
        
        me.callParent(arguments);
        this.resizeContent();
    },
    
    resizeContent: function() {
    
        var w = this.size.width
        var h = this.size.height
        if (h > 880 && w > 780) {
            this.getComponent('panel1').layout.align = 'center'
            this.layout = 'fit'
        }
    },
    
    percentageChange: function() {
        
        var panel = this.getComponent('panel1').getComponent('panel2')
        var economy = panel.getComponent('economy')
        var energy = panel.getComponent('energy')
        var environment = panel.getComponent('environment')
        
        if (!economy.isValid() || !energy.isValid() || !environment.isValid()) return
        
        var sum = parseInt(economy.getValue()) + parseInt(energy.getValue()) + parseInt(environment.getValue())
        var economyText = panel.getComponent('economyText')
        var energyText = panel.getComponent('energyText')
        var environmentText = panel.getComponent('environmentText')
        
        economyText.setText('= ' + Math.round((economy.getValue() / sum) * 1000) / 10 + '%')
        energyText.setText('= ' + Math.round((energy.getValue() / sum) * 1000) / 10 + '%')
        environmentText.setText('= ' + Math.round((environment.getValue() / sum) * 1000) / 10 + '%')
    },

    updateFarmerList: function(json){
        this.playerStore.loadRawData(json.Farmers, false);
    },
    
    updateGameInfo: function(json){
        var panel = this.getComponent('panel1').getComponent('panel2')
        
        if (json.stage != "Plant") panel.getComponent('apply').setDisabled(true)
        else panel.getComponent('apply').setDisabled(false)
        
        if (json.dynamicMarket) {
            panel.getComponent('corn').setDisabled(true)
            panel.getComponent('grass').setDisabled(true)
            panel.getComponent('alfalfa').setDisabled(true)
        } else {
            panel.getComponent('corn').setDisabled(false)
            panel.getComponent('grass').setDisabled(false)
            panel.getComponent('alfalfa').setDisabled(false)
        }
        
        panel.getComponent('economy').setValue(json.sustainabilityWeights.economy)
        panel.getComponent('energy').setValue(json.sustainabilityWeights.energy)
        panel.getComponent('environment').setValue(json.sustainabilityWeights.environment)
        panel.getComponent('corn').setValue(json.prices.corn)
        panel.getComponent('grass').setValue(json.prices.grass)
        panel.getComponent('alfalfa').setValue(json.prices.alfalfa)
        panel.getComponent('dynamicmarket').setValue(json.dynamicMarket)
        panel.getComponent('helpPopups').setValue(!json.helpPopupsOn)
        panel.getComponent('managementOptions').setValue(json.mgmtOptsOn)
        
        this.dynamicMarket = json.dynamicMarket
    },

    applySettingsChange: function (recalc) {
        
        // parse game settings
        var panel = this.getComponent('panel1').getComponent('panel2')
        var mgmtOptsOn = panel.getComponent('managementOptions').value;
        var helpPopupsOn = !panel.getComponent('helpPopups').value;
        var roomName = WsConnection.webSocket.gameChannel;
        var dynamicOn = panel.getComponent('dynamicmarket').getValue()
        
        // parse adjust crop prices
        var corn = panel.getComponent('corn')
        var grass = panel.getComponent('grass')
        var alfalfa = panel.getComponent('alfalfa')
                            
        if (!corn.isValid() || !grass.isValid() || !alfalfa.isValid()) {
            var alert = Ext.Msg.alert('Invalid Entry', 'The values you\'ve entered to adjust crop prices are not all valid numbers.')
            var x = (this.size.width - alert.width) / 2
            var y = (this.size.height - alert.height) / 2
            alert.setPosition(x, y)
            return
        }
        
        var newBasePrices = false;
        if (panel.getComponent('start').getText() == 'Start' && dynamicOn) newBasePrices = true
        
        // parse reweight sustainability info                  
        var economy = panel.getComponent('economy')
        var energy = panel.getComponent('energy')
        var environment = panel.getComponent('environment')
        var reweight = panel.getComponent('reweightBots').getValue()
                            
        if (!economy.isValid() || !energy.isValid() || !environment.isValid()) {
            var alert = Ext.Msg.alert('Invalid Entry', 'The values you\'ve entered to the reweight sustainability score are not all valid integers.')
            var x = (this.size.width - alert.width) / 2
            var y = (this.size.height - alert.height) / 2
            alert.setPosition(x, y)
            return
        }

        // compile and send the message
        var msg = {
            event: "applyModeratorSettings",
            roomName: roomName,
            prices: {
                corn: corn.getValue(),
                grass: grass.getValue(),
                alfalfa: alfalfa.getValue()
            },
            sustainability: {
                energy: energy.getValue(),
                economy: economy.getValue(),
                environment: environment.getValue()
            },
            mgmtOptsOn: mgmtOptsOn,
            helpPopupsOn: helpPopupsOn,
            dynamicMarket: dynamicOn,
            recalculateBots: recalc,
            newBasePrices: newBasePrices
        }
        
        BiofuelsModerator.network.send(JSON.stringify(msg))
        
        // if the reweight checkbox was selected, reassign bots
        if (reweight) {
            for (var i = 0; i < this.playerStore.data.items.length; i++) {
                var name = this.playerStore.data.items[i].data.name
                if (name.substr(name.length - 5, 5) == '(bot)') {
                    var msg = {
                        event: "assignBots",
                        roomName: roomName,
                        name: name,
                        energy: energy.getValue(),
                        economy: economy.getValue(),
                        environment: environment.getValue()
                    }
                    BiofuelsModerator.network.send(JSON.stringify(msg))
                }
            }
        }
    },

    advanceStage: function () {
        var message = {
            event: "advanceStage"
        };

        BiofuelsModerator.network.send(JSON.stringify(message));
    },
    
    disableApply: function(json) {
        var panel = this.getComponent('panel1').getComponent('panel2')
        if (json.stageName != "Plant") panel.getComponent('apply').setDisabled(true)
        if (json.stageName == "Plant"){
            panel.getComponent('apply').setDisabled(false)
        }
    }
});

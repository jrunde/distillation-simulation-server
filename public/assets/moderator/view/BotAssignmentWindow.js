/*
 * File: BiofuelsModerator/view/BotAssignmentWindow.js
 */


Ext.define('BiofuelsModerator.view.BotAssignmentWindow', {

    extend: 'Ext.window.Window',
    height: 270,
    width: 360,
    layout: {
        type: 'absolute'
    },
    closable: true,
    modal: true,
    title: 'Adjust Robot Strategy',
    bot: null,
    constrainHeader: true,

    //--------------------------------------------------------------------------
    initNetworkEvents: function () {
        BiofuelsModerator.network.registerListener('getBotStrategy', this.updateStrategy, this);
    },

    //--------------------------------------------------------------------------
    initComponent: function () {
        var me = this;
        this.initNetworkEvents();
        
        var size = Ext.getCmp('viewport').size
        var x = (size.width - this.width) / 2
        var y = (size.height - this.height) / 2
        me.setPosition(x, y)

        Ext.applyIf(me, {
            items: [{
                xtype: 'label',
                x: 30,
                y: 20,
                text: 'Enter values to make the robot adopt an appropriate strategy.'
            }, {
                xtype: 'textfield',
                itemId: 'economy',
                x: 30,
                y: 70,
                fieldLabel: 'Economy',
                width: 200,
                value: '1',
                validator: function() {
                    if (me.getComponent('economy').getValue() == '') return 'A value must be entered.'
                    else if (Math.floor(me.getComponent('economy').getValue()) != me.getComponent('economy').getValue()) return 'Must be an integer.'
                    else if (isNaN(me.getComponent('economy').getValue())) return 'Not a valid number.'
                    else if (parseInt(me.getComponent('economy').getValue()) < 0 || parseInt(me.getComponent('economy').getValue()) > 25) return 'Must be between 0 and 25.'
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
                x: 255,
                y: 70,
            }, {
                xtype: 'textfield',
                itemId: 'energy',
                x: 30,
                y: 110,
                fieldLabel: 'Energy',
                width: 200,
                value: '1',
                validator: function() {
                    if (me.getComponent('energy').getValue() == '') return 'A value must be entered.'
                    else if (Math.floor(me.getComponent('energy').getValue()) != me.getComponent('energy').getValue()) return 'Must be an integer.'
                    else if (isNaN(me.getComponent('energy').getValue())) return 'Not a valid number.'
                    else if (parseInt(me.getComponent('energy').getValue()) < 0 || parseInt(me.getComponent('energy').getValue()) > 25) return 'Must be between 0 and 25.'
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
                x: 255,
                y: 110,
            }, {
                xtype: 'textfield',
                itemId: 'environment',
                x: 30,
                y: 150,
                fieldLabel: 'Environment',
                width: 200,
                value: '1',
                validator: function() {
                    if (me.getComponent('environment').getValue() == '') return 'A value must be entered.'
                    else if (Math.floor(me.getComponent('environment').getValue()) != me.getComponent('environment').getValue()) return 'Must be an integer.'
                    else if (isNaN(me.getComponent('environment').getValue())) return 'Not a valid number.'
                    else if (parseInt(me.getComponent('environment').getValue()) < 0 || parseInt(me.getComponent('environment').getValue()) > 25) return 'Must be between 0 and 25.'
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
                x: 255,
                y: 150,
            }, {
                xtype: 'button',
                x: 50,
                y: 190,
                width: 150,
                scale: 'medium',
                text: 'Apply',
                scope: this,
                handler: function () {
                    var economy = me.getComponent('economy')
                    var energy = me.getComponent('energy')
                    var environment = me.getComponent('environment')
                            
                    if (!economy.isValid() || !energy.isValid() || !environment.isValid()) {
                        var alert = Ext.Msg.alert('Invalid Entry', 'The values you\'ve entered are not all valid integers.')
                        var x = (size.width - alert.width) / 2
                        var y = (size.height - alert.height) / 2
                        alert.setPosition(x, y)
                        return
                    }
                    this.applyStrategy();
                    this.close();
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
                    window.open('https://docs.fieldsoffuel.discovery.wisc.edu/farmer-list/#bot_strategy');
                }
            }]
        });

        me.callParent(arguments);
    },
    
    percentageChange: function() {
        var economy = this.getComponent('economy')
        var energy = this.getComponent('energy')
        var environment = this.getComponent('environment')
        if (!economy.isValid() || !energy.isValid() || !environment.isValid()) return
        var sum = parseInt(economy.getValue()) + parseInt(energy.getValue()) + parseInt(environment.getValue())
        var economyText = this.getComponent('economyText')
        var energyText = this.getComponent('energyText')
        var environmentText = this.getComponent('environmentText')
        economyText.setText('= ' + Math.round((economy.getValue() / sum) * 1000) / 10 + '%')
        energyText.setText('= ' + Math.round((energy.getValue() / sum) * 1000) / 10 + '%')
        environmentText.setText('= ' + Math.round((environment.getValue() / sum) * 1000) / 10 + '%')
    },

    //--------------------------------------------------------------------------
    applyStrategy: function () {
        var economy = this.getComponent('economy').getValue()
        var energy = this.getComponent('energy').getValue()
        var environment = this.getComponent('environment').getValue()
        var sum = parseInt(economy) + parseInt(energy) + parseInt(environment)
        msg = {
            event: "assignBots",
            name: this.bot,
            energy: energy,
            economy: economy,
            environment: environment,
        }
        BiofuelsModerator.network.send(JSON.stringify(msg))
    },
    
    updateStrategy: function (json) {
        console.log(json)
        
        var econ = json.economy
        var eng = json.energy
        var env = json.environment
        
        // run the decimal to fraction function
        var num
        var den
        
        if (econ != 0) num = econ
        else if (eng != 0) num = eng
        else if (env != 0) num = env
        else {
            this.getComponent('economy').setValue(econ)
            this.getComponent('energy').setValue(eng)
            this.getComponent('environment').setValue(env)
            return
        }
        
        for (var d = 2; d < 75; d++) {
            if (Math.floor(num * d) == num * d) {
                den = d
                break
            }
        }
        
        econ *= den
        eng *= den
        env *= den
        
        this.getComponent('economy').setValue(econ)
        this.getComponent('energy').setValue(eng)
        this.getComponent('environment').setValue(env)
    }
});

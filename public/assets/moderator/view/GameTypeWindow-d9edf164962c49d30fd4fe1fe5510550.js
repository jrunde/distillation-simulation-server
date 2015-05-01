Ext.define('BiofuelsModerator.view.GameTypeWindow', {
    extend: 'Ext.window.Window',
    id: 'gameTypeWindow',
    modal: true,
    height: 150,
    width: 460,
    layout: {
        type: 'absolute'
    },
    closable: false,
    title: 'Select Game Type',
    titleAlign: 'center',
    constrainHeader: true,

    initComponent: function() {
        var me = this;

        var size = Ext.getCmp('viewport').size
        var x = (size.width - this.width) / 2
        var y = (size.height - this.height) / 2
        me.setPosition(x, y)

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'label',
                    x: 25,
                    y: 15,
                    width: 400,
                    text: 'Would you like to start a single player game against the computer or begin a multiplayer game with a group of friends?',
                    style : 'font-size: 14px;'
                },
                {
                    xtype: 'button',
                    x: 25,
                    y: 75,
                    width: 150,
                    scale: 'medium',
                    text: 'Single Player',
                    scope: this,
                    handler: function() {
                        me.hide()
                        Ext.getCmp('playerOptionsWindow').show()
                        
                        var panel = Ext.getCmp('viewport').getComponent('panel1').getComponent('panel2')
                        panel.remove('help', true)
                        panel.remove('scoreboard', true)
                        panel.remove('helpOptions', true)
                        panel.getComponent('start').handler = function() {
                    
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
                            window.open('https://docs.fieldsoffuel.discovery.wisc.edu')
                        }
                    }
                },
                {
                    xtype: 'button',
                    x: 175,
                    y: 75,
                    width: 150,
                    scale: 'medium',
                    text: 'Multiplayer',
                    scope: this,
                    handler: function() {
                        Ext.getCmp('gameTypeWindow').hide()
                        Ext.getCmp('joinCreateWindow').show()
                    }
                },
                {
                    xtype: 'button',
                    x: 350,
                    y: 75,
                    width: 75,
                    scale: 'medium',
                    text: 'Help',
                    scope: this,
                    handler: function() {
                        window.open('https://docs.fieldsoffuel.discovery.wisc.edu/game-set-up-instructions/')
                    }
                },

            ]
        });

        me.callParent(arguments);
    },

});

Ext.define('BiofuelsModerator.view.MultiplayerOptionsWindow', {
    extend: 'Ext.window.Window',
    id: 'multiplayerOptions',
    modal: true,
    height: 150,
    width: 460,
    layout: {
        type: 'absolute'
    },
    closable: false,
    title: 'Moderate or Play?',
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
                    text: 'Would you like to rejoin as a moderator for your most recent game, or try to join as a player?',
                    style : 'font-size: 14px;'
                },
                {
                    xtype: 'button',
                    x: 25,
                    y: 75,
                    width: 150,
                    scale: 'medium',
                    text: 'Moderate',
                    scope: this,
                    handler: function() {
                        me.close()
                    }
                },
                {
                    xtype: 'button',
                    x: 175,
                    y: 75,
                    width: 150,
                    scale: 'medium',
                    text: 'Play',
                    scope: this,
                    handler: function() {
                        me.close()
                        window.location = './play'
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
                        window.open('https://docs.fieldsoffuel.discovery.wisc.edu')
                    }
                },

            ]
        });

        me.callParent(arguments);
    },

});

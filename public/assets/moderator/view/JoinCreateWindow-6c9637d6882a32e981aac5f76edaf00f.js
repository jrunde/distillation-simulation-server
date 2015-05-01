Ext.define('BiofuelsModerator.view.JoinCreateWindow', {
    extend: 'Ext.window.Window',
    id: 'joinCreateWindow',
    modal: true,
    height: 150,
    width: 460,
    layout: {
        type: 'absolute'
    },
    closable: false,
    title: 'What Next?',
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
                    text: 'Would you like to join an existing game room or create a new one?',
                    style : 'font-size: 14px;'
                },
                {
                    xtype: 'button',
                    x: 25,
                    y: 75,
                    width: 150,
                    scale: 'medium',
                    text: 'Join Game',
                    scope: this,
                    handler: function() {
                        window.location = './play'
                    }
                },
                {
                    xtype: 'button',
                    x: 175,
                    y: 75,
                    width: 150,
                    scale: 'medium',
                    text: 'Create Game',
                    scope: this,
                    handler: function() {
                        me.close()
                        Ext.getCmp('createGame').show()
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
                        window.open('https://docs.fieldsoffuel.discovery.wisc.edu/multiplayer/')
                    }
                },

            ]
        });

        me.callParent(arguments);
    },

});

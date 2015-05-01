Ext.define('Biofuels.view.GameTypeWindow', {
    extend: 'Ext.window.Window',
    id: 'gameTypeWindow',

    height: 292,
    width: 456,
    layout: {
        type: 'absolute'
    },
    closable: false,
    title: 'Select Game Type',
    titleAlign: 'center',
    constrainHeader: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    x: 40,
                    y: 20,
                    width: 150,
                    scale: 'medium',
                    text: 'Single Player',
                    scope: this,
                    handler: function() {
                        Biofuels.network.playNow();
                    }
                },
                {
                    xtype: 'button',
                    x: 70,
                    y: 70,
                    width: 150,
                    scale: 'medium',
                    text: 'Multi Player',
                    scope: this,
                    handler: function() {
                        Ext.getCmp('gameTypeWindow').close();
                    }
                },
            ]
        });

        me.callParent(arguments);
    },

});

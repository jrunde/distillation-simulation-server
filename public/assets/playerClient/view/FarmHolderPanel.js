/*
 * File: app/view/FarmHolderPanel.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.FarmHolderPanel', {
//------------------------------------------------------------------------------

	extend: 'Ext.panel.Panel',
    alias: 'widget.farmHolderPanel',
    requires: [
		'Biofuels.view.Field',
		'Biofuels.view.Farm',
		'Biofuels.view.FieldOverlay',
		'Biofuels.view.FieldData'
	],

    frame: false,
    id: 'holderPanel',

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            tools: [
            {
                xtype: 'tbspacer',
                width: 70,
            },
            {
                xtype: 'label',
                text: 'Your Farm',
                style: {
                    fontWeight: 'bold',
                }
            },
            {
                xtype: 'tbspacer',
                width: 120,
            },
            {
              xtype: 'button',
              id: 'scoreboardButton',
              text: 'Scoreboard',
              handler: function () {
                  window.open('global?room=' + WsConnection.webSocket.gameChannel);
              }
            }
            ],
            items: [{
                xtype: 'Farm'
            }]
        });

        me.callParent(arguments);
    },
});

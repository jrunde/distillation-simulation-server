/*
 * File: app/view/ContractOfferingWindow.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ContractOfferingPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.contractoffering',

    height: 100,
    layout: {
        type: 'absolute'
    },
    padding: 5,
	bodyPadding: '5 0 5 10',

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'image',
                    src: this.imageSource,
                    x: 5,
                    y: 5,
                    height: 50,
                    width: 50
                },
                {
                    xtype: 'displayfield',
                    x: 60,
                    y: 0,
                    width: 250,
                    value: this.contractText,
                    fieldLabel: ''
                },
                {
                    xtype: 'button',
                    x: 320,
                    y: 10,
                    width: 150,
                    scale: 'large',
                    text: 'Accept Contract?',
                    enableToggle: true,
          					handler: function(button, evt) {
          						if (button.pressed) {
          							button.setText('Contract Accepted!');
          						}
          						else {
          							button.setText('Accept Contract?');
          						}
          					}
                }
            ]
        });

        me.callParent(arguments);
    }

});

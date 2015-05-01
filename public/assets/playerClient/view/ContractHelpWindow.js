/*
 * File: app/view/ContractHelpWindow.js
 */
	
//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ContractHelpWindow', {
//------------------------------------------------------------------------------

	extend: 'Ext.window.Window',

    height: 300,
    width: 465,
    bodyPadding: '15 25 5 25',
    title: 'What Are Contracts?',
    modal: true,
    resizable: false,
    bodyStyle: 'background-color:rgb(36,44,57)',

    //--------------------------------------------------------------------------
    initComponent: function() {
   
        var me = this;

        var showDebugBorders = 0;
        
        var paragraph1 = "A contract is a legally binding agreement between the producer (farmer) and "
    			+ "the buyer such that the producer is then 'on the hook' to produce and sell to the buyer "
    			+ "the agreed to amount of product..."; 

    	var paragraph2 = "If the producer is unable to meet the contract production amounts, the producer must then "
    			+ "buy enough product at the current spot market price to cover the difference.";

    	var paragraph3 = "Any excess product grown by the producer is sold at the spot market price.";
    	
        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
				border: showDebugBorders,
				height: 100,
				width: 400,
				layout: {
					columns: 3,
					type: 'table'
				},
				items: [{
					xtype: 'panel',
					colspan: 1,
					border: showDebugBorders,
					height: 100,
					width: 100,
					padding: '0 10 0 10',
					layout: {
						type: 'fit'
					},
					items: [{
						xtype: 'draw',
						viewbox: false,
						colspan: 1,
						border: showDebugBorders,
						height: 100,
						width: 100,
						items: [{
							type: 'image',
							src: 'resources/contract_icon.png',
							width: 100,
							height: 100
						}]
					}]
				},
				{
					xtype: 'panel',
					colspan: 2,
					border: showDebugBorders,
					height: 100,
					width: 300,
					layout: {
						type: 'fit'
					},
					items: [{
						xtype: 'label',
						text: paragraph1
					}]
				}]
			},
			{
				xtype: 'panel',
				border: showDebugBorders,
				height: 100,
				width: 400,
				layout: {
					align: 'stretch',
					type: 'vbox'
				},
				items: [{
					xtype: 'label',
					text: paragraph2,
					layout: {
						type: 'fit'
					}
				},{
					xtype: 'label',
					padding: 10,
					layout: {
						type: 'fit'
					}
				},{
					xtype: 'label',
					text: paragraph3,
					layout: {
						type: 'fit'
					}
				}]
			},
			{
				xtype: 'panel',
				border: showDebugBorders,
				height: 50,
				width: 400,
				layout: {
					type: 'fit'
				},
				bodyPadding: '10 10 10 325',
				items: [{
					xtype: 'button',
					text: 'OK',
					scope: this,
					handler: function() {
						this.close();
					}
				}]
			}]
        });

        me.callParent(arguments);
    }

});

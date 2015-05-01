/*
 * File: app/view/MainViewport.js
 */

Ext.onReady(function() {
	
    Ext.create('Biofuels.view.JoinGamePopup');
    Ext.create('Biofuels.view.ConnectWindow').show();
});

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.MainViewport', {
//------------------------------------------------------------------------------

	extend: 'Ext.container.Viewport',
    requires: [
        'Biofuels.view.ConnectWindow',
        'Biofuels.view.NetworkLayer',
        'Biofuels.view.JoinGamePopup',
        'Biofuels.view.FarmHolderPanel',
        'Biofuels.view.FieldHealthPopup',
        'Biofuels.view.InformationPanel',
        'Biofuels.view.ContractPanel',
        'Biofuels.view.ContractOfferingPanel',
        'Biofuels.view.SustainabilityPanel',
        'Biofuels.view.EconomyPanel',
        'Biofuels.view.EnergyPanel',
        'Biofuels.view.EnvironmentPanel',
        'Biofuels.view.ContractHelpWindow',
        'Biofuels.view.ProgressPanel',
    ],
    title: 'My Window',
    autoScroll: true,
    layout: {
        type: 'hbox',
    },
    id: 'viewport',

	//--------------------------------------------------------------------------
    initComponent: function() {
        
        this.size = Ext.getBody().getViewSize()
        
        Biofuels.network = Ext.create('Biofuels.view.NetworkLayer');
        Biofuels.network.openSocket(true);
        Biofuels.network.checkModel();
        Biofuels.network.registerListener('endGame', this.endGame, this);
        
        var me = this;
        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
                itemId: 'main',
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				bodyStyle: 'background-image: url(resources/site_bg.jpg); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center top;',
				items: [{
					xtype: 'panel',
					layout: 'column',
					width: 1100,
                    height: 800,
					items: [{
						xtype: 'panel',
						columnWidth: 0.45,
						layout: '',
						items: [{
							xtype: 'progressPanel',
							height: 100
						},{
							xtype: 'farmHolderPanel',
							height: 700,
							layout: 'fit'
						}]
					},{
						xtype: 'informationPanel',
						columnWidth: 0.55,
						height: 800,
						layout: {
							type: 'accordion',
                            titleCollapse: false,
							multi: true,
						}
					}]
				}]
			}]
        });

        me.callParent(arguments);
        this.resizeContent();
    },
    
    resizeContent: function() {
    
        var w = Ext.getBody().getViewSize().width
        var h = Ext.getBody().getViewSize().height
        if (h > 800 && w > 1100) {
            this.getComponent('main').layout.align = 'center'
            this.layout = 'fit'
        }
    },
    
    endGame: function() {
        Biofuels.network.clearSession()
        window.location = '../'
    }
});

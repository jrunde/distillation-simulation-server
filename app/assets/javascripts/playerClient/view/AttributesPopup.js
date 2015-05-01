/*
 * File: app/view/AttributesPopup.js
 *
 * Visual representation of a field
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.AttributesPopup', {
//------------------------------------------------------------------------------

	extend: 'Ext.window.Window',
    constrainHeader: true,
	config: {
		source: 'default',
		x: '100',
		y: '100'
	},

	constructor: function(config) {
		this.initConfig(config);
		var location;

		if (this.source == 'corn') location = 'resources/corn_info.png';
		else if (this.source == 'grass') location = 'resources/switchgrass_info.png';
		else if (this.source == 'alfalfa') location = 'resources/alfalfa_info.png';
		else if (this.source == 'fertilizer') location = 'resources/fertilizer_info.png';
		else if (this.source == 'till') location = 'resources/till_info.png';
		else this.close();

		Ext.apply(this, {
			closable: false,
			height: 155,
			width: 215,
			// layout: 'fit',
			items: [{
				xtype: 'image',
				src: location
			}],
			maximizable: false,
			minimizable: false,
			resizable: false,
			header: false,
    	border: false,
    	closable: false,
    	draggable: false,
			// bodyStyle: 'background:transparent;',
			// title: "Attributes",
			x: this.x,
			y: this.y
		});
		this.callParent();
		this.show();
	}
});

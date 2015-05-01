/*
 * File: app/view/CornPlantSprite.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.CornPlantSprite', {
//------------------------------------------------------------------------------

	extend: 'Biofuels.view.BasePlantSprite',

	constructor: function (config) {
		this.randomSpriteConfigList = Array([{
			type: 'image',
			src: 'resources/corn_plant.png',
			width: 30,
			height: 50,
			zIndex: 750
		},
		{
			type: 'image',
			src: 'resources/corn_plant_2.png',
			width: 30,
			height: 50,
			zIndex: 750
		}]);
	
		this.harvestedSprite = 'resources/corn_plant_harvested.png';
	}
	
});


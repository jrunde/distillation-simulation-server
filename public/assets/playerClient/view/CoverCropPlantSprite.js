/*
 * File: app/view/CoverCropPlantSprite.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.CoverCropPlantSprite', {
//------------------------------------------------------------------------------

	extend: 'Biofuels.view.BasePlantSprite',

	constructor: function (config) {
		this.randomSpriteConfigList = Array([{
			type: 'image',
            src: 'resources/hairy_vetch_plant.png',
            // src: 'http://i373.photobucket.com/albums/oo179/Base_Oiboi/Tree1.png',
			width: 30,
			height: 50,
			zIndex: 750
		}]);

		this.harvestedSprite = 'resources/hairy_vetch_harvested.png';
	}

});


/*
 * File: app/view/CornPlantSprite.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.BasePlantSprite', {
//------------------------------------------------------------------------------

	requires: ['Ext.util.TaskRunner'
	],

	//--------------------------------------------------------------------------
	addToSurface: function(surface, atX, atY, alpha) {
		var randomSpriteConfig = this.randomSpriteConfigList[
			Math.floor(Math.random() * this.randomSpriteConfigList.length)];

		if (this.sprite) {
			this.removeFromSurface();
		}

		this.atX = atX;
		this.atY = atY;

		var result = surface.add(randomSpriteConfig);
		this.sprite = result[0];
		this.sprite.setAttributes({
			translate: {
				x: atX,
				y: atY
			},
			opacity: alpha
		}, true);
	},

	//--------------------------------------------------------------------------
	removeFromSurface: function() {
		if (!this.sprite) {
			return;
		}

		this.sprite.remove();
		this.sprite.destroy();
		this.sprite = null;
	},

  //----------------------------------------------------------------------------
	setOpacity: function(alpha){
		if (!this.sprite) {
			this.removeFromSurface();
			return;
		}
		this.sprite.setAttributes({
			opacity: alpha
		}, true)
	},

  //----------------------------------------------------------------------------
	grow: function(duration) {
		if(!this.sprite) return;

    // regrow switchgrass
    var randomSpriteConfig = this.randomSpriteConfigList[0][
      Math.floor(Math.random() * this.randomSpriteConfigList[0].length)];
    this.sprite.setAttributes({
      src: randomSpriteConfig.src,
      scale: {
          x: 0.2,
          y: 0.2
        },
    }, true);

		// randomize gowth duration...
		var time = duration * (1.0 + (Math.random() - 0.5) * 0.75);
		var scaleY = 1.0 + (Math.random() - 0.5) * 0.3;
		this.sprite.animate({
			duration: time,
			from: {
				scale: {
					x: 0.2,
					y: 0.2
				},
				translate: {
					x: this.atX,
					y: this.atY + 20 * 0.8
				}
			},
			to: {
				scale: {
					x: 1,
					y: scaleY
				},
				translate: {
					x: this.atX,
					y: this.atY
				}
			}
		});
	},

	//----------------------------------------------------------------------------
	harvest: function() {
		if(!this.sprite) return;
		this.sprite.setAttributes({
			src: this.harvestedSprite
		}, true);
	},

	//----------------------------------------------------------------------------
	scheduleHarvest: function(delay) {
		if(!this.sprite) return;
			Ext.defer(this.harvest, delay, this);
	}


});

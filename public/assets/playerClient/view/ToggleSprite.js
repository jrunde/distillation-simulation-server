/*
 * File: app/view/ToggleSprite.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ToggleSprite', {
//------------------------------------------------------------------------------

    technique: "",

    //--------------------------------------------------------------------------
    addToSurface: function(surface, config, off, on, attribute, startShown) {

    	this.stateImages = new Array();
    	this.stateImages.push(off);
    	this.stateImages.push(on);
    	this.stateValue = 0;
    	this.attributeName = attribute;

  		var result = surface.add(config);
  		this.sprite = result[0];

  		if (typeof startShown != 'undefined' && startShown) {
  			this.sprite.show(true);
  			this.setListeners();
  		}
  		else {
  			this.sprite.show(false);
  		}
    },

    //-----------------------------------------------------------------------
    addTip: function(tipString) {
    		var tip = Ext.create('Ext.tip.ToolTip', {
				target: this.sprite.el,
				html: tipString,
				anchorToTarget: true,
				anchor: 'left',
				showDelay: 250
			});
		},

    //-----------------------------------------------------------------------
    setListeners: function() {

		this.sprite.on({
				mouseover: this.onMouseOver,
				mouseout: this.onMouseOut,
				scope: this.sprite
		});
		this.sprite.on({
				click: this.onClick,
				scope: this
		});
    },

    //-----------------------------------------------------------------------
    show: function() {
    	this.sprite.stopAnimation().show(true).animate({
    		duration: 100,
    		to: {
    			opacity: 1
    		}
    	});
    	this.setListeners();
    },

    //-----------------------------------------------------------------------
    hide: function() {
    	if (this.sprite.attr.hidden) {
    		return;
    	}
    	this.sprite.stopAnimation().animate({
    		duration: 100,
    		callback: this.doHide,
    		scope: this.sprite,
    		to: {
    			opacity: 0
    		}
    	});
    	this.sprite.clearListeners();
    },

    //-----------------------------------------------------------------------
    doHide: function() {
      // this.sprite.hide(true);
    	this.hide(true);
    },

    //-----------------------------------------------------------------------
    onMouseOver: function(evt, target) {

    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1.5,
					y: 1.5
				},
				opacity: 1
			}
    	});
        
        var xpos = window.event.clientX
    	var ypos = window.event.clientY
        var me = this
        
        if(Ext.getCmp('farm').helpPopupsOn){
        
            this.doShow = true
            this.infoPopup = Ext.create('Biofuels.view.AttributesPopup',{
                source: me.technique,
                x: xpos + 20,
                y: ypos + 20
            }).hide()

            Ext.Function.defer(function(){
                if(me.doShow) me.infoPopup.show()

                Ext.Function.defer(function(){
                    if(me.infoPopup) me.infoPopup.hide()
                }, 15000)
            }, 1500)
        }
	},

    //-----------------------------------------------------------------------
    onMouseOut: function(evt, target) {

    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1,
					y: 1
				},
				opacity: 1
			}
    	});
        
        this.doShow = false
    	if(this.infoPopup) this.infoPopup.hide()

	},

    //-----------------------------------------------------------------------
    onClick: function(evt, target) {
      this.changeState()
      // this.stateValue++; if (this.stateValue > 1) this.stateValue = 0;
      // this.sprite.setAttributes({
      //    src: this.stateImages[this.stateValue]
      // }, true);
      
        this.doShow = false
        if(this.infoPopup) evt.infoPopup.hide()
   },

   changeState: function() {

     this.stateValue++; if (this.stateValue > 1) this.stateValue = 0;
     // changing state of hidden sprites is fine, but don't force show a hidden sprite
      this.sprite.setAttributes({
          src: this.stateImages[this.stateValue]
      }, true);
   },
   
   setState: function(state) {
   
     if (state) this.stateValue = 1;
     else this.stateValue = 0;
     
      this.sprite.setAttributes({
          src: this.stateImages[this.stateValue]
      }, true);
   }
});

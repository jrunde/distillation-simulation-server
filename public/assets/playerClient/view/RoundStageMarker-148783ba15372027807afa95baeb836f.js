/*
 * File: app/view/RoundStageMarker.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.RoundStageMarker', {
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    addToSurface: function(surface, atX, atY, label) {

        this.FRAME_OFFSET_X = -20;
        this.FRAME_OFFSET_Y = -19;
        this.FRAME_SIZE = 40;

        this.FRAME_Z = 200;
        this.MARKER_Z = this.FRAME_Z + 10;
        this.ALERT_Z = this.MARKER_Z + 10;

        this.LABEL_OFFSET_Y = 28;
        this.LABEL_SHADOW_OFFSET_Y = this.LABEL_OFFSET_Y + 2;

        this.ALERT_INTERVAL = 3000; // time in MS
        this.ALERT_SCALE = 1.8;

        var frameConfig = [{
            type: 'image',
            src: 'resources/check_frame.png',
            x: atX + this.FRAME_OFFSET_X,
            y: atY + this.FRAME_OFFSET_Y,
            width: this.FRAME_SIZE,
            height: this.FRAME_SIZE,
            zIndex: this.FRAME_Z
        }];

        this.surface = surface;
        this.atX = atX;
        this.atY = atY;

        var result = surface.add(frameConfig);
        this.markerFrameSprites = result;
        
        for (var index = 0; index < result.length; index++) {
            result[index].show(true);
        }

        var labelConfig = [{
            type: 'text',
            text: label,
            fill: '#000',
            font: '15px monospace',
            x: atX,
            y: atY + this.LABEL_SHADOW_OFFSET_Y
        },{
            type: 'text',
            text: label,
            fill: '#aaa',
            font: '15px monospace',
            x: atX,
            y: atY + this.LABEL_OFFSET_Y
        }];

        result = surface.add(labelConfig);
        
        this.labelSprites = result;

        // ensure labels are visible and properly centered
        for (var index = 0; index < result.length; index++) {
            var text = result[index];
            text.show(true);
            text.setAttributes({
                x: atX - text.getBBox().width * 0.5
            }, true);
        }
    },

    // This adds a marker that marks the currently active stage. Click function + scope optional
    //-------------------------------------------------
    addMarker: function(onClickFunction, scope) {

        var markerConfig = [{
            type: 'image',
            src: 'resources/check_frame_marker.png',
            x: this.atX + this.FRAME_OFFSET_X,
            y: this.atY + this.FRAME_OFFSET_Y,
            width: this.FRAME_SIZE,
            height: this.FRAME_SIZE,
            zIndex: this.MARKER_Z
        }];

        var result = this.surface.add(markerConfig);
        this.markerSprites = result;

        for (var index = 0; index < result.length; index++) {
            result[index].show(true);
        }

        // Make brightest
        this.labelSprites[1].animate({
            duration: 1000,
            to: {
              fill: '#fff'
            }
        });

        this.onClickFunction = onClickFunction;
        this.onClickScope = scope;
        
        var tar = this.markerSprites[0]
        var name = this.labelSprites[0].attr.text
        Ext.Ajax.request({
        	method: 'GET',
        	url: "help_text",
        	params: {target: name},
        	success: function(result){
						msg = JSON.parse(result.responseText).text
		        var tip = Ext.create('Ext.tip.ToolTip', {
		        	target: tar.el,
		        	html: msg,
		        	anchorToTarget: true,
		        	anchor: 'left',
		        	showDelay:  Biofuels.helpDelay
		        	// showDelay: 1000
		        });
		      }
	      })

        // Add a click handler if desired.
        if (typeof this.onClickFunction != 'undefined') {
          this.markerSprites[0].on({
              click: this.handleOnClick,
              scope: this
          });
        }
    },

    // this assumes that a checked box will not have an active marker or an alert...
    //  ie, it will just clear those to prevent badly overlapped sprites...
    //-------------------------------------------------
    addCheck: function(animate) {

        this.deactivateAlert();
        this.clearArraySprites(this.markerSprites);

        var checkConfig = [{
            type: 'image',
            src: 'resources/check_mark.png',
            x: this.atX + this.FRAME_OFFSET_X,
            y: this.atY + this.FRAME_OFFSET_Y,
            width: this.FRAME_SIZE,
            height: this.FRAME_SIZE,
            zIndex: this.MARKER_Z
        }];

        var result = this.surface.add(checkConfig);
        this.checkMarkSprites = result;

        if (typeof animate != 'undefined' && animate) {
          this.checkMarkSprites[0].animate({
            duration: 500,
            easing: 'bounceOut',
            from: {
              scale: {
                x: 0.0,
                y: 0.0
              }
            },
            to: {
              scale: {
                x: 1,
                y: 1
              }
            }
          });
        }

        for (var index = 0; index < result.length; index++) {
            result[index].show(true);
        }

        // Make darkest
        this.labelSprites[1].animate({
            duration: 1000,
            to: {
              fill: '#555'
            }
        });
    },

    // Should call detach on the marker to properly clean it up
    //-------------------------------------------------
    detach: function() {
        this.deactivateAlert();
        this.clearArraySprites(this.markerFrameSprites);
        this.clearArraySprites(this.labelSprites);
        this.clearArraySprites(this.markerSprites);
        this.clearArraySprites(this.checkMarkSprites);
    },

    // Internal helper...
    //-------------------------------------------------
    clearArraySprites: function(spriteArray) {

        if (typeof spriteArray == 'undefined') {
          return;
        }
        var index;
        for (index = 0; index < spriteArray.length; index++) {
          spriteArray[index].remove();
          spriteArray[index].destroy();
        }
    },

    // Optionally adds a flashing exclamation point on this stage
    //-------------------------------------------------
    activateAlert: function() {

        var alertConfig = [{
            type: 'image',
            src: 'resources/check_frame_exclamation.png',
            x: this.atX + this.FRAME_OFFSET_X,
            y: this.atY + this.FRAME_OFFSET_Y,
            width: this.FRAME_SIZE,
            height: this.FRAME_SIZE,
            zIndex: this.ALERT_Z
        }];

        var result = this.surface.add(alertConfig);
        this.alertSprites = result;

        for (var index = 0; index < result.length; index++) {
            result[index].show(true);
        }

        // Bah, use newTask vs. simpler method...as newTask actually returns
        //  a task that can be stopped later when I want to clean up this alert.
        var runner = new Ext.util.TaskRunner();
        this.alertTask = runner.newTask({
            run: this.updateAlert,
            interval: this.ALERT_INTERVAL,
            scope: this
        });

        this.alertTask.start();

        var tar = this.alertSprites[0]
        var name = this.labelSprites[0].attr.text
        Ext.Ajax.request({
        	method: 'GET',
        	url: "help_text",
        	params: {target: name},
        	success: function(result){
						msg = JSON.parse(result.responseText).text
		        var tip = Ext.create('Ext.tip.ToolTip', {
		        	target: tar.el,
		        	html: msg,
		        	anchorToTarget: true,
		        	anchor: 'left',
		        	showDelay: Biofuels.helpDelay
		        });
		      }
	      })

        // Alert sprites also get a click handler if there is one defined
        if (typeof this.onClickFunction != 'undefined') {
            this.alertSprites[0].on({
                click: this.handleOnClick,
                scope: this
            });
        }
    },

    //-------------------------------------------------
    handleOnClick: function() {

        // automatically applies an animated check mark and calls the handler
        this.addCheck(true);
        if (Ext.getCmp('farm').popupWindow) Ext.getCmp('farm').popupWindow.close()
        this.onClickFunction.call(this.onClickScope, this.labelSprites[0].attr.text);
    },

    //-------------------------------------------------
    updateAlert: function() {

        this.alertSprites[0].animate({
          duration: this.ALERT_INTERVAL * 0.5,
          easing: 'bounceOut',
          from: {
            scale: {
              x: 0.0,
              y: 0.0
            }
          },
          to: {
            scale: {
              x: this.ALERT_SCALE,
              y: this.ALERT_SCALE
            }
          }
        });
    },

    //-------------------------------------------------
    deactivateAlert: function() {

        if (typeof this.alertTask != 'undefined' ) {
          this.alertTask.stop();
          this.alertTask.destroy();
        }
        this.clearArraySprites(this.alertSprites);
    }

});


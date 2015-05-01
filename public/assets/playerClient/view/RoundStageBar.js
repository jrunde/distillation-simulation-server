/*
 * File: app/view/RoundStageBar.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.RoundStageBar', {
//------------------------------------------------------------------------------

    constructor: function (config) {
      this.markers = new Array();
    },

    // FIXME: Ok, the system of using the given incoming coordinates ended up
    //  being odd/awkward...not a huge deal maybe but this could be more straightfoward
    // Inputs e.g., atX = 60, atY = 35, width = 380
    //--------------------------------------------------------------------------
    addToSurface: function(surface, atX, atY, width) {

      this.surface = surface;
      this.placement = {
        x: atX,
        y: atY,
        width: width
      };

      var timeline = [{
        type: 'rect',
        fill: '#000',
        opacity: '0.5',
        x: atX,
        y: atY-1,
        width: width,
        height: 3,
        zIndex: 100
      },{
        type: 'rect',
        fill: '#fff',
        opacity: '0.25',
        x: atX,
        y: atY+1,
        width: width,
        height: 1,
        zIndex: 100
      }];

      var index;
      var result = surface.add(timeline);
      this.timeline = result;
      for (index = 0; index < result.length; index++) {
          result[index].show(true);
      }

      this.year = 1;
      this.yearLabel = surface.add([{
        type: 'text',
        text: ' ',
        fill: '#000',
        font: "16px monospace",
        x: atX,
        y: atY-19
      },{
        type: 'text',
        text: ' ',
        fill: '#fff',
        font: "16px monospace",
        x: atX,
        y: atY-21
      }]);

      this.setYear(this.year);
    },

    // currently just passes in the label name attached to the clicked on marker...
    // could return whatever custom identifying data easily enough...
    //--------------------------------------------------------------------------
    testClickerFunc: function(clickedMarker) {
        console.log('clicked on marker: ' + clickedMarker + '!!!');
    },

    sendReady: function() {
      var msg = {
        event: "farmerReady"
      }
      Biofuels.network.send(JSON.stringify(msg))
    },


    // array in the form of:   [{label: 'someLabel', active: true, checked: false},
    //                          {label: 'nextLabel', active: false, checked: false},
    //                            ...]
    //--------------------------------------------------------------------------
    setMarkers: function(markerArray) {

        var index;
        // remove old elements if there are any
        for (index = 0; index < this.markers.length; index++) {
            this.markers[index].detach();
            this.markers[index].destroy();
        }
        this.markers = [];//this.markers.splice(0, this.markers.length);

        // Add new elements
        var count = markerArray.length - 1;
        for (index = 0; index <= count; index++) {

            var marker = Ext.create('Biofuels.view.RoundStageMarker');
            var posX = this.placement.x + this.placement.width * (index / count);
            marker.addToSurface(this.surface, posX, this.placement.y,
                markerArray[index].label);
            marker.label = markerArray[index].label;
            this.markers.push(marker);

            if (markerArray[index].checked) {
              marker.addCheck();
            }
            else if (markerArray[index].active) {
              // Also adds a click handler to get the clicked notification...
              marker.addMarker(this.sendReady, this);
              marker.activateAlert();
            }

          // Ext.Ajax.request({
          // 	method: 'GET',
          // 	url: "help_text",
          // 	params: {target: marker.label},
          // 	success: function(result){
          // 		msg = JSON.parse(result.responseText).text
          // 		var tip = Ext.create('Ext.tip.ToolTip', {
          // 			target: marker.el,
          // 			html: msg,
          // 			anchorToTarget: true,
          // 			anchor: 'left',
          // 			showDelay: 750
          // 		});
          // 	}
          // })
        }
    },

    // yearNumber as an integer
    //--------------------------------------------------------------------------
    setYear: function(yearNumber) {

        // re-set, show, center
        for (var index = 0; index < this.yearLabel.length; index++) {

            var label = this.yearLabel[index];
            label.show(true);
            label.setText('Year ' + yearNumber);
            label.setAttributes({
                x: this.placement.x +
                    (this.placement.width - label.getBBox().width) * 0.5
            }, true);
        }
    },

    // setStage: function(stageNumber){
    //   for (var i = 0; i < Things.length; i++) {
    //     Things[i]
    //   };
    // },

});


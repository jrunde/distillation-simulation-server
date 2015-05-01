/*
 * File: app/view/ProgressPanel.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ProgressPanel', {
//------------------------------------------------------------------------------

    extend: 'Ext.panel.Panel',
    alias: 'widget.progressPanel',
    requires: [
        'Biofuels.view.RoundStageBar',
        'Biofuels.view.RoundStageMarker',
        'Ext.util.TaskManager'
    ],
    title: 'Round Stage',
    titleAlign: 'center',
    viewbox: true,
/*    header: {
      height: 30 
    },
*/
    //--------------------------------------------------------------------------
    initNetworkEvents: function() {
        var app = Biofuels;

        app.network.registerListener('getGameInfo', this.changeSettings, this);
        app.network.registerListener('advanceStage', this.advanceStage, this);
    },

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;
        this.initNetworkEvents();

        Ext.applyIf(me, {
            items: [{
                xtype: 'draw',
                width: 500,
                height: 80,
                layout: 'absolute',
                items: [{
                    type: 'rect',
                    width: 500,
                    height: 80,
                    fill: '#163020'
                }]
            }]
        });

        me.callParent(arguments);
    },

    //--------------------------------------------------------------------------
    changeSettings: function(json) {
        var plant = json.stage == "Plant"
        var manage = json.stage == "Manage"
        var harvest = json.stage == "Round Wrap Up"
        
        if (!this.stageBar) {
            var drawComp = this.child('draw');
            this.stageBar = Ext.create('Biofuels.view.RoundStageBar');
            this.stageBar.addToSurface(drawComp.surface, 60, 35, 380);
        }
           
        // handle dynamic market economy graphs
        var conPanel = Ext.getCmp('economy-tab-panel');
        var feedTab = Ext.getCmp('feed-demand-tab');
        var fuelTab = Ext.getCmp('fuel-demand-tab');
        if(json.dynamicMarket){
          feedTab.tab.show();
          fuelTab.tab.show();
        } else {
          if(conPanel.getActiveTab()==feedTab || conPanel.getActiveTab()==fuelTab){
            conPanel.setActiveTab(0);
          }
          feedTab.tab.hide();
          fuelTab.tab.hide();
        }
           
        var markerData = new Array();
        markerData.push({label: 'Done Planting', active: plant, checked: (manage || harvest)});

        if (json.mgmtOptsOn) {
            markerData.push({label: 'Done Managing', active: manage, checked: harvest});
        }
        markerData.push({label: 'Harvest', active: harvest, checked: false});

        this.stageBar.setMarkers(markerData);
        this.setYear(json.year)
    },

    //--------------------------------------------------------------------------
    setYear: function(year) {
        this.stageBar.setYear(year);
    },

    advanceStage: function(json){
        var prevMarkers = this.stageBar.markers
        var newMarkers = new Array();
        this.setYear(json.year)
        for (var i = 0; i < prevMarkers.length; i++) {
            var thisMarker = prevMarkers[i]
            if(i==json.stageNumber){
                thisMarker.active = true;
                thisMarker.checked = false;
            }
            else{
                thisMarker.active = false;
                if (i > json.stageNumber) thisMarker.checked = false;
                else thisMarker.checked = true;
            }
            newMarkers.push(thisMarker)
        };
        this.stageBar.setMarkers(newMarkers)
    }
});

/*
 * File: BiofuelsGlobal/view/MainViewport.js
 */

Ext.onReady(function () {
    var createGame = Ext.create('BiofuelsGlobal.view.ConnectWindow');
    createGame.show();
});

//------------------------------------------------------------------------------
Ext.define('BiofuelsGlobal.view.MainViewport', {
  //------------------------------------------------------------------------------

  extend: 'Ext.container.Viewport',
  requires: [
    'BiofuelsGlobal.view.JoinGamePopup',
    'Biofuels.view.NetworkLayer',
    'BiofuelsGlobal.view.InformationPanel',
    'BiofuelsGlobal.view.EconomyPanel',
    'BiofuelsGlobal.view.EnergyPanel',
    'BiofuelsGlobal.view.EnvironmentPanel',
    'BiofuelsGlobal.view.SustainabilityPanel',

    // 'BiofuelsGlobal.view.NetworkLayer',
  ],

  title: 'My Window',
  autoScroll: true,
  id: 'viewport',
  size: null,
  dynamic: false,

  //--------------------------------------------------------------------------
  initNetworkEvents: function () {
    var app = BiofuelsGlobal;

    app.network.registerListener('getGameInfo', this.updateGameSettings, this);
    app.network.registerListener('getFarmerList', this.updateFarmerList, this);
    app.network.registerListener('globalInfo', this.updateRoundProgress, this);
    app.network.registerListener('endGame', this.endGame, this);
  },

  //--------------------------------------------------------------------------
  updateFarmerList: function (json) {
    
    this.farmerListStore.loadRawData(json.Farmers, false);
    BiofuelsGlobal.roomInformation = {
      roomName: json.clientID,
    }

    // FIXME: not the best place for this...needs to happen after login
    var roomName = this.getComponent('panel1').getComponent('roomName');
    // var password = this.getComponent('panel1').getComponent('password');

    roomName.setValue(BiofuelsGlobal.roomInformation.roomName);
    // password.setValue(BiofuelsGlobal.roomInformation.password);
  },

  updateRoundProgress: function (json) {
    
    var msgString = "Year: " + json.year
    var stageName = json.stageName
    if (stageName == "Round Wrap Up") stageName = "Harvest"
    msgString += "\nStage: " + stageName +
      "\n\nPrice of Corn (per ton): " + json.cornPrice +
      "\nPrice of Switchgrass (per ton): " + json.grassPrice +
      "\nPrice of Alfalfa (per ton): " + json.alfalfaPrice;
      //"\n\nGlobal Sustainability: " + Math.round(json.globalSustainability * 100) +
      //"%\n\n\tGlobal Environment: " + Math.round(json.globalEnvironment * 100) +
      //"%\n\t\tGlobal Beneficial Bugs: " + Math.round(json.globalBCI * 100) +
      //"%\n\n\tGlobal Economy: " + Math.round(json.globalEconomy * 100) +
      //"%\n\n\tGlobal Energy: " + Math.round(json.globalEnergy * 100) + "%";

    Ext.getCmp('progressArea').setValue(msgString);

  },

  //--------------------------------------------------------------------------
  configFarmerStore: function () {

    this.farmerListStore = Ext.create('Ext.data.Store', {
      storeId: 'farmerListStore',
      fields: ['name', 'ready', 'rank', 'economy', 'energy', 'environment'],
      proxy: {
        type: 'memory',
        reader: {
          type: 'json',
          root: 'farmers'
        }
      }
    });
  },

  //--------------------------------------------------------------------------
  updateGameSettings: function (json) {

        // record whether dynamic market is turned on
        this.dynamic = false
        if (json.dynamicMarket) this.dynamic = true

  },
           
  //--------------------------------------------------------------------------
    initComponent: function () {
        var me = this;
        this.size = Ext.getBody().getViewSize()

        BiofuelsGlobal.network = Ext.create('Biofuels.view.NetworkLayer');
        BiofuelsGlobal.network.openSocket(true);
        BiofuelsGlobal.network.checkModel();

        this.initNetworkEvents();
        this.configFarmerStore();

        Ext.applyIf(me, {
            items: [{
                xtype: 'panel',
                itemId: 'panel1',
                width: 1000,
                height: 600,
                layout: {
                    type: 'absolute'
                },
                title: 'Global Scoreboard',
                titleAlign: 'center',
                items: [{
                    xtype: 'gridpanel',
                    itemId: 'farmerList',
                    store: 'farmerListStore',
                    x: 10,
                    y: 10,
                    height: 520,
                    width: 595,
                    title: 'Farmers',
                    titleAlign: 'center',
                    listeners: {
                        'itemdblclick': function (grid, record, item, index, e, eOpts) {
                            var win = Ext.create('Ext.window.Window', {
                                title: record.get('name') + "'s Farm's Yearly Totals",
                                titleAlign: 'center',
                                height: 800,
                                width: 750,
                                layout: 'fit',
                                closeAction: 'destroy',
                                items: [{
                                    xtype: 'panel',
                                    height: 770,
                                    width: 750,
                                    items: [{
                                        xtype: 'informationPanel',
                                        height: 770,
                                        name: record.get('name'),
                                        layout: {
                                            type: 'accordion',
                                            titleCollapse: false,
                                            multi: true
                                        }
                                    }]
                                }]
                            }).show()
                            win.setPosition(50, 25)
                        }
                    },
                    // resizable: true,
                    columns: [{
                        xtype: 'gridcolumn',
                        width: 145,
                        dataIndex: 'name',
                        resizable: true,
                        hideable: false,
                        text: 'Name'
                    }, {
                        xtype: 'booleancolumn',
                        width: 70,
                        dataIndex: 'ready',
                        resizable: true,
                        hideable: false,
                        text: 'Ready',
                        falseText: 'no',
                        trueText: 'yes'
                    }, {
                        xtype: 'gridcolumn',
                        width: 100,
                        dataIndex: 'rank',
                        resizable: true,
                        hideable: false,
                        text: 'Sustainability'
                    }, {
                        xtype: 'gridcolumn',
                        width: 70,
                        dataIndex: 'economy',
                        resizable: true,
                        hideable: false,
                        text: 'Economy'
                    }, {
                        xtype: 'gridcolumn',
                        width: 60,
                        dataIndex: 'energy',
                        resizable: true,
                        hideable: false,
                        text: 'Energy'
                    }, {
                        xtype: 'gridcolumn',
                        width: 90,
                        dataIndex: 'environment',
                        resizable: true,
                        hideable: false,
                        text: 'Environment'
                    }],
                    viewConfig: {}
                }, {
                    xtype: 'panel',
                    id: 'Round Progress',
                    x: 610,
                    y: 10,
                    height: 520,
                    width: 350,
                    title: 'Round Progress',
                    titleAlign: 'center',
                    layout: 'fit',
                    items: [{
                        xtype: 'textarea',
                        id: 'progressArea',
                        fieldLabel: '',
                        autoScroll: true,
                        readOnly: true,
                    }]
                }, {
                    xtype: 'button',
                    x: 918,
                    y: 535,
                    text: 'Help',
                    scope: this,
                    handler: function() {
                        window.open('https://docs.fieldsoffuel.discovery.wisc.edu/scoreboard/');
                    }
                }, {
                    xtype: 'textfield',
                    itemId: 'roomName',
                    x: 580,
                    y: 535,
                    width: 225,
                    fieldLabel: 'Room',
                    labelAlign: 'right',
                    labelPad: 20,
                    labelWidth: 75
                }, {
                    xtype: 'button',
                    x: 840,
                    y: 535,
                    text: 'Refresh',
                    handler: function () {
                        BiofuelsGlobal.network.send(JSON.stringify({
                            event: 'getFarmerList'
                        }))
                    }
                }, {
                    xtype: 'button',
                    x: 10,
                    y: 535,
                    text: 'View Farm Data',
                    handler: function () {
                        var selected = me.getComponent('panel1').getComponent('farmerList').getSelectionModel().selected.items[0];
                        if (selected) {
                            var record = selected.raw
                            var win = Ext.create('Ext.window.Window', {
                                title: record.name + "'s Farm's Yearly Totals",
                                titleAlign: 'center',
                                height: 800,
                                width: 750,
                                layout: 'fit',
                                closeAction: 'destroy',
                                items: [{
                                    xtype: 'panel',
                                    height: 770,
                                    width: 750,
                                    items: [{
                                        xtype: 'informationPanel',
                                        height: 770,
                                        name: record.name,
                                        layout: {
                                            type: 'accordion',
                                            titleCollapse: false,
                                            multi: true
                                        }
                                    }]
                                }]
                            }).show()
                            win.setPosition(50, 25)
                        } else {
                            var x = (me.size.width - 300) / 2
                            var y = (me.size.height - 62) / 2
                            var msg = Ext.Msg.alert('View Farm Data', "In order to view a player's farm data, you must first select their name in the list above.").setPosition(x, y);
                        }
                    }
                }]
            }]
        });

        me.callParent(arguments);
        this.resizeContent();
    },
  
    resizeContent: function() {
    
        var w = this.size.width
        var h = this.size.height
        if (h > 600 && w > 1000) {
            this.getComponent('panel1').layout.align = 'center'
            this.layout = 'fit'
        }
    },

    endGame: function() {
        window.location = '../'
    }
});

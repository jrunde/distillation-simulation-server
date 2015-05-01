Ext.define('BiofuelsGlobal.view.EnvironmentPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.environmentpanel',
  title: 'Environment',
  layout: 'fit',
  name: "",
  hideCollapseTool: true,
  bodyStyle: 'background-color: #89a',
    listeners: {
        afterrender: function(c) { 
            var me = this
            Ext.Ajax.request({
                method: 'GET',
                url: "help_text",
                params: {target: "Sustainability Panel"},
                success: function(result){
                    msg = JSON.parse(result.responseText).text
                    var tool = Ext.create('Ext.panel.Tool', {
                        //type: (this.collapsed ? 'plus' : 'minus'),
                        type: 'plus',
                        tooltip: {
                            text: msg,
                            showDelay: 250
                        },
                        toolOwner: c,
                        handler: function(evt, toolEl, owner, tool) {
                            if (tool.type == 'plus') {
                                owner.expand();
                                tool.setType('minus');
                            } else {
                                owner.collapse();
                                tool.setType('plus');
                            }
                        }
                    })
                    c.header.insert(0,tool);
                    
                    var space1 = Ext.create('Ext.toolbar.Spacer', {
                        type: 'tbspacer', 
                        width: 1,
                    })
                    c.header.insert(2,space1)
                    
                    var button = Ext.create('Ext.Button', {
                        text: ' ? ',
                        handler: function() {
                            window.open('https://docs.fieldsoffuel.discovery.wisc.edu/environment/');
                        }
                    })
                    c.header.insert(3, button)
                                                        
                    var space2 = Ext.create('Ext.toolbar.Spacer', {
                        type: 'tbspacer', 
                        width: 475,
                    })
                    c.header.insert(4,space2)
                    
                    Ext.Ajax.request({
                        method: 'GET',
                        url: "help_text",
                        params: {target: "Environment Score"},
                        success: function(result){
                            scorebox = Ext.create('BiofuelsGlobal.view.DisplayBox', {
                                blable: 'Avg Score',
                                altlable: 'This Year',
                                units: '%',
                                altUnits: '%',
                                btip: JSON.parse(result.responseText).text,
                                id: 'global-environment-score',
                                useAlt: true,
                                width: 75
                            })
                            c.header.insert(5,scorebox)

                            Ext.Ajax.request({
                                method: 'GET',
                                url: "help_text",
                                params: {target: "Environment Rank"},
                                success: function(result){
                                    rankbox = Ext.create('BiofuelsGlobal.view.DisplayBox', {
                                        blable: 'Rank',
                                        btip: JSON.parse(result.responseText).text,
                                        id: 'global-environment-rank'
                                    })
                                    c.header.insert(6,rankbox)
                                    
                                    // this is to ensure that all ajax requests are complete before 
                                    // data is rendered
                                    var msg = {
                                        event: 'getFarmData',
                                        userName: me.name
                                    }
                                    BiofuelsGlobal.network.send(JSON.stringify(msg))
                                    
                                    // update the layout so everything fits
                                    me.ownerCt.updateLayout()
                                }
                            })
                        }
                    })
                }
            })
        }
    },

  items: [
  {
    xtype: 'tabpanel',
  items: [
    {
      xtype: 'chart',
      title: 'Overall',
      background: {
          fill: '#89a'
      },
      animate: true,
      insetPadding: 20,
      store: 'environmentHistoryStore',
      theme: 'Category2',
      legend: {
        position: 'right'
      },
      axes: [
          {
              type: 'Category',
              fields: [
                  'year'
              ],
              position: 'bottom',
              title: 'Year',
          },
          {
              type: 'Numeric',
              fields: [
                  'soil quality',
                  'water quality',
                  'beneficial bugs',
                  'emissions',
              ],
              minimum: 0,
              maximum: 100,
              position: 'left',
              title: 'Score'
          }
      ],
      series: [
          {
            type: 'column',
            label: {
                display: 'outside',
                field: 'rank',
            },
            xField: 'year',
            yField: [
                'soil fertility',
                'water quality',
                'beneficial bugs',
                'emissions',
            ],
            stacked: true,
            tips: {
              trackMouse: true,
              width: 160,
              height: 60,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("water quality: " + storeItem.get("water quality") * 4 + 
                    "%<br>soil fertility: " + storeItem.get("soil fertility") * 4 + 
                    "%<br>beneifical bug: " + storeItem.get("beneficial bugs") * 4 + 
                    "%<br>emissions: " + storeItem.get("emissions") * 4 + "%");
              },
            },
        }
      ]
    },
    {
        xtype: 'chart',
        title: 'Water',
        background: {
          fill: '#89a'
        },
        animate: true,
        insetPadding: 20,
        store: 'environmentHistoryStore',
        theme: 'Category2',
        legend: {
          position: 'right'
        },
        axes: [
            {
                type: 'Category',
                fields: [
                    'year'
                ],
                position: 'bottom',
                title: 'Year',
            },
            {
                type: 'Numeric',
                fields: [
                    'farm water',
                    'average water',
                ],
                minimum: 0,
                maximum: 100,
                position: 'left',
                title: 'Score'
            }
        ],
        series: [
            {
                type: 'line',
                label: {
                    display: 'outside',
                    field: 'rank',
                },
                xField: 'year',
                yField: [
                    'farm water',
                ],
                stacked: true,
                tips: {
                    trackMouse: true,
                    width: 200,
                    height: 40,
                    layout: 'fit',
                    renderer: function(storeItem, item) {
                        this.setTitle("farm water quality: " + storeItem.get("farm water"));
                    },
                },
          }, {
                type: 'line',
                label: {
                    display: 'outside',
                    field: 'rank',
                },
                xField: 'year',
                yField: [
                    'average water',
                ],
                stacked: true,
                tips: {
                trackMouse: true,
                width: 200,
                height: 40,
                layout: 'fit',
                renderer: function(storeItem, item) {
                    this.setTitle("average water quality: " + storeItem.get("average water"));
                },
            },
          },
        ]
      },
      {

        xtype: 'chart',
        title: 'Emissions',
        id: 'emissionsChart',
        background: {
          fill: '#89a'
        },
        animate: true,
        insetPadding: 20,
        store: 'environmentHistoryStore',
        theme: 'Category2',
        legend: {
          position: 'right'
        },
        axes: [
            {
                type: 'Category',
                fields: [
                    'year'
                ],
                position: 'bottom',
                title: 'Year',
            },
            {
                type: 'Numeric',
                fields: [
                    'farm emissions',
                    'average emissions',
                ],
                minimum: -100,
                position: 'left',
                title: 'Tons CO2 Eqivalence'
            }
        ],
        series: [
            {
                type: 'line',
                label: {
                    display: 'outside',
                    field: 'rank',
                },
                xField: 'year',
                yField: [
                    'farm emissions',
                ],
                stacked: true,
                tips: {
                    trackMouse: true,
                    width: 200,
                    height: 40,
                    layout: 'fit',
                    renderer: function(storeItem, item) {
                        this.setTitle("farm emissions: " + storeItem.get("farm emissions") + " tons CO2 eq");
                    },
                },
            }, {
                type: 'line',
                label: {
                    display: 'outside',
                    field: 'rank',
                },
                xField: 'year',
                yField: [
                    'average emissions',
                ],
                stacked: true,
                tips: {
                    trackMouse: true,
                    width: 200,
                    height: 40,
                    layout: 'fit',
                    renderer: function(storeItem, item) {
                        this.setTitle("average emissions: " + storeItem.get("average emissions") + " tons CO2 eq");
                    },
                },
            },
        ]
      }
    ]
  }]
});

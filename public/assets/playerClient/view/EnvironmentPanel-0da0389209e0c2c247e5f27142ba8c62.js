Ext.define('Biofuels.view.EnvironmentPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.environmentpanel',
    title: 'Environment',
    layout: 'fit',
    hideCollapseTool: true,
    bodyStyle: 'background-color: #89a',
    listeners: {
        afterrender: function(c) { 
            Ext.Ajax.request({
                method: 'GET',
                url: "help_text",
                params: {target: "Sustainability Panel"},
                success: function(result){
                    msg = JSON.parse(result.responseText).text
                    var tool = Ext.create('Ext.panel.Tool', {
                        type: (c.collapsed ? 'plus' : 'minus'),
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
                        width: 280,
                    })
                    c.header.insert(4,space2)
                    
                    Ext.Ajax.request({
                        method: 'GET',
                        url: "help_text",
                        params: {target: "Environment Score"},
                        success: function(result){

                          
                          scorebox = Ext.create('Biofuels.view.DisplayBox', {
                                blable: 'Current',
                                btip: JSON.parse(result.responseText).text,
                                id: 'environment-score',
                                blable: 'Avg Score',
                                units: '%',
                                altUnits: '%',
                                altlable: 'This Year',
                                useAlt: true,
                            })

                            c.header.insert(5,scorebox)

                            Ext.Ajax.request({
                                method: 'GET',
                                url: "help_text",
                                params: {target: "Environment Rank"},
                                success: function(result){
                                    rankbox = Ext.create('Biofuels.view.DisplayBox', {
                                        blable: 'Rank',
                                        btip: JSON.parse(result.responseText).text,
                                        id: 'environment-rank'
                                    })
                                    c.header.insert(6,rankbox)
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
                    'soil fertility',
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
            title: [
                'soil health',
                'water quality',
                'beneficial bugs',
                'emissions',
            ],              
            stacked: true,
            tips: {
              trackMouse: true,
              width: 160,
              height: 80,
              layout: 'fit',
              renderer: function(storeItem, item) {
                this.setTitle("water quality: " + storeItem.get("water quality") * 4 + 
                    "%<br>soil fertility: " + storeItem.get("soil fertility") * 4 + 
                    "%<br>benefical bug: " + storeItem.get("beneficial bugs") * 4 + 
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

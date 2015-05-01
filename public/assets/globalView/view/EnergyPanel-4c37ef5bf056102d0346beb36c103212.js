Ext.define('BiofuelsGlobal.view.EnergyPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.energypanel',
  title: 'Energy',
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
                            window.open('https://docs.fieldsoffuel.discovery.wisc.edu/energy/');
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
                        params: {target: "Energy Score"},
                        success: function(result){
                            scorebox = Ext.create('BiofuelsGlobal.view.DisplayBox', {
                                blable: 'Avg Score',
                                altlable: 'This Year',
                                units: '%',
                                altUnits:'%',
                                btip: JSON.parse(result.responseText).text,
                                id: 'global-energy-score',
                                useAlt: true,
                                width: 75
                            })
                            c.header.insert(5,scorebox)

                            Ext.Ajax.request({
                                method: 'GET',
                                url: "help_text",
                                params: {target: "Energy Rank"},
                                success: function(result){
                                    rankbox = Ext.create('BiofuelsGlobal.view.DisplayBox', {
                                        blable: 'Rank',
                                        btip: JSON.parse(result.responseText).text,
                                        id: 'global-energy-rank'
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
    layout: 'fit',
    activeTab: 0,
    items: [
      {
        xtype: 'panel',
        title: 'Yield',
        layout: 'fit',
        bodyStyle: 'background-color: #89a',

        items: [
          {
            xtype: 'chart',
            animate: true,
            theme: 'Category5',
            insetPadding: 20,
            store: 'farmYieldStore',
            legend: {
              position: 'bottom'
            },
            axes: [
                {
                    type: 'Category',
                    fields: [
                        'year'
                    ],
                    position: 'bottom',
                    title: 'Year'
                },
                {
                    type: 'Numeric',
                    fields: [
                        'corn',
                        'grass',
                        'alfalfa'
                    ],
                    position: 'left',
                    title: 'Yield (Tons)'
                }
            ],
            series: [
                {
                  type: 'line',
                  highlight: {
                     size: 4,
                     radius: 6
                  },
                  xField: 'year',
                  yField: [
                      'grass'
                  ],
                  smooth: 3,
                  tips: {
                    trackMouse: true,
                    width: 90,
                    height: 55,
                    layout: 'fit',
                    renderer: function(storeItem, item) {
                      this.setTitle("year: " + storeItem.get("year") + "<br>grass: " + storeItem.get("grass") + " Tons") ;
                    },
                  },
                },
                {
                  type: 'line',
                  highlight: {
                     size: 4,
                     radius: 6
                  },
                  xField: 'year',
                  yField: [
                      'corn'
                  ],
                  smooth: 3,
                  tips: {
                    trackMouse: true,
                    width: 90,
                    height: 55,
                    layout: 'fit',
                    renderer: function(storeItem, item) {
                      this.setTitle("year: " + storeItem.get("year") + "\n yield: " + storeItem.get("corn"));
                    },
                  },
                },
                {
                  type: 'line',
                  highlight: {
                     size: 4,
                     radius: 6
                  },
                  xField: 'year',
                  yField: [
                      'alfalfa'
                  ],
                  smooth: 3,
                  tips: {
                    trackMouse: true,
                    width: 140,
                    height: 55,
                    layout: 'fit',
                    renderer: function(storeItem, item) {
                      this.setTitle("year: " + storeItem.get("year") + "<br>alfalfa: " + storeItem.get("alfalfa") + " Tons") ;
                    },
                  },
                },
            ]
          }
        ]
    },
    {
      xtype: 'panel',
      title: 'Energy',
      layout: 'fit',
      bodyStyle: 'background-color: #89a',

      items: [
          {
              xtype: 'chart',
              animate: true,
              insetPadding: 20,
              theme: 'Category5',
              store: 'farmEnergyStore',
              legend: {
                position: 'bottom'
              },
              axes: [
                  {
                      type: 'Category',
                      fields: [
                          'year'
                      ],
                      position: 'bottom',
                      title: 'Year'
                  },
                  {
                      type: 'Numeric',
                      fields: [
                          'corn',
                          'grass',
                          'alfalfa'
                      ],
                      position: 'left',
                      title: 'Energy (GJ)'
                  }
              ],
              series: [
                  {
                      type: 'line',
                      highlight: {
                         size: 4,
                         radius: 6
                      },
                      xField: 'year',
                      yField: [
                          'grass'
                      ],
                      smooth: 3,
                      tips: {
                        trackMouse: true,
                        width: 90,
                        height: 80,
                        layout: 'fit',
                        renderer: function(storeItem, item) {
                          this.setTitle("year: " + storeItem.get("year") + "\n energy(GJ): " + storeItem.get("grass"));
                        },
                      },
                  },
                  {
                      type: 'line',
                      highlight: {
                         size: 4,
                         radius: 6
                      },
                      xField: 'year',
                      yField: [
                          'corn'
                      ],
                      smooth: 3,
                      tips: {
                        trackMouse: true,
                        width: 90,
                        height: 80,
                        layout: 'fit',
                        renderer: function(storeItem, item) {
                          this.setTitle("year: " + storeItem.get("year") + "\n energy(GJ): " + storeItem.get("corn"));
                        },
                      },
                  },
                  {
                      type: 'line',
                      highlight: {
                         size: 4,
                         radius: 6
                      },
                      xField: 'year',
                      yField: [
                          'alfalfa'
                      ],
                      smooth: 3,
                      tips: {
                        trackMouse: true,
                        width: 90,
                        height: 80,
                        layout: 'fit',
                        renderer: function(storeItem, item) {
                          this.setTitle("year: " + storeItem.get("year") + "\n energy(GJ): " + storeItem.get("alfalfa"));
                        },
                      },
                  },
              ]
          }
        ]
    }]
  }]
});

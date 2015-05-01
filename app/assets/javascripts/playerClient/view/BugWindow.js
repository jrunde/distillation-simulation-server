Ext.define('Biofuels.view.BugWindow', {
    extend: 'Ext.window.Window',

    height: 459,
    width: 612,
    title: 'Report A Bug',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tbspacer',
                    height: 25,
                    width: 601
                },
                {
                    xtype: 'textfield',
                    width: 578,
                    fieldLabel: 'Summary'
                },
                {
                    xtype: 'tbspacer',
                    height: 59,
                    width: 602
                },
                {
                    xtype: 'textareafield',
                    height: 241,
                    width: 579,
                    fieldLabel: 'Details'
                },
                {
                    xtype: 'tbspacer',
                    height: 12,
                    width: 601
                },
                {
                    xtype: 'container',
                    height: 34,
                    width: 598,
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'tbspacer',
                            height: 70,
                            width: 448
                        },
                        {
                            xtype: 'button',
                            flex: 1,
                            text: 'Report',
                            handler: function(){
                              // var info = {
                              //   title: 'Found a bug',
                              //   body: 'yup this heres a bug all right. definitely a bug indeed',
                              // }
                              // WsConnection.webSocket.trigger('bug_report',info);
                              details = me.query('[fieldLabel=Details]')[0].getValue()
                              details += "\n\n browser: " + Ext.userAgent
															console.log(details)
                              Biofuels.network.reportBug(me.query('[fieldLabel=Summary]')[0].getValue(), details)
                              me.close()
                            }
                        },
                        {
                            xtype: 'tbspacer',
                            height: 70,
                            width: 19
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
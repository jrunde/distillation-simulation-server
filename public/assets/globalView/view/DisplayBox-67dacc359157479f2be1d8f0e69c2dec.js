Ext.define('BiofuelsGlobal.view.DisplayBox', {
  extend: 'Ext.container.Container',
  alias : 'widget.dispbox',
  border: 1,
  units: "",
  altUnits: "",
  preUnits: "",
  altPreUnits: "",
  height: 35,
  width: 60,
  blable: 'defal',
  altlable: 'alt',
  btip: '',
  val: '',
  altval: '',
  valstate: 0,
  useAlt: false,

  layout: {
      type: 'absolute'
  },


  initComponent: function() {
    var me = this;


    Ext.applyIf(me, {
    items: [
    {
      xtype: 'panel',
      x: 0,
      y: 0,
      height: 20,
      width: me.width,
      header: false,
      title: 'My Panel',

      items: [
          {
              xtype: 'label',
              height: 14,
              width: 40,
              text: me.val,
          }
      ]
    },
    {
      xtype: 'button',
      padding: '0 0 0 0',
      x: 0,
      y: 19,
      height: 15,
      width: me.width,
      text: me.blable,
      tooltip: me.btip,
      style: {
        background: 'transparent',
      },
      handler: function(){
        if(me.useAlt){
          if(me.valstate==0){
            me.items.items[0].items.items[0].setText(me.altval)
            me.valstate = 1
            me.refreshVal()
          }
          else{
            me.items.items[0].items.items[0].setText(me.val)
            me.valstate = 0
            me.refreshVal()
          }
        }
        else{
            me.refreshVal()
        }
        // console.log(this)
        // this.el.setStyle({
        //    background: 'transparent'
        // })
        // this.setTooltip('asdf');
        // Ext.getCmp('theLabel').setText('bla')
      }
    }
    ],
    })
    me.callParent(arguments)
  },

  // setText: function(text){

  //   this.items.items[0].items.items[0].setText(text + this.units)

  // },

  setVal: function(text){
    this.val = text
    this.refreshVal()
  },

  setAlt: function(text){
    this.altval = text
    this.refreshVal()
  },

  refreshVal: function(){
    if (this.valstate == 0 || !this.useAlt) {
      this.items.items[0].items.items[0].setText(this.preUnits + this.val + this.units)
      this.items.items[1].setText(this.blable)
    }
    else {
      this.items.items[0].items.items[0].setText(this.altPreUnits +  this.altval + this.altUnits)
      this.items.items[1].setText(this.altlable)
    }
  }
});

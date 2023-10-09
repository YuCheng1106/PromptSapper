Blockly.Blocks["Set_Text"] = {
  init: function() {
    this.jsonInit({
    "type": "Set_Text",
  "message0": "%1 %2",
  "args0": [
    {
      "type": "field_image",
      "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
      "width": 15,
      "class":"Imageplus",
      "height": 15,
      "alt": "saa",
      "flipRtl": false
    },
    {
      "type": "input_value",
      "name": "plus"
    }
  ],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
  }
};

Blockly.Constants.Math.IS_DIVISIBLEBY_MUTATOR_MIXIN={
  mutationToDom:function(){
    var a=Blockly.utils.xml.createElement("mutation"),
        b="DIVISIBLE_BY"==this.getFieldValue("PROPERTY");
    a.setAttribute("divisor_input",b);return a},
  domToMutation:function(a){
    a="true"==a.getAttribute("divisor_input");
    this.updateShape_(a)},
  updateShape_:function(a){
    var b=this.getInput("DIVISOR");
    a?b||this.appendValueInput("DIVISOR").setCheck("Number"):b&&this.removeInput("DIVISOR")}
};
Blockly.Constants.Math.IS_DIVISIBLE_MUTATOR_EXTENSION=function(){
  this.getField("PROPERTY").setValidator(function(a){
    a="DIVISIBLE_BY"==a;
    this.getSourceBlock().updateShape_(a)})};
Blockly.Extensions.registerMutator("math_is_divisibleby_mutator",
    Blockly.Constants.Math.IS_DIVISIBLEBY_MUTATOR_MIXIN,
    Blockly.Constants.Math.IS_DIVISIBLE_MUTATOR_EXTENSION);

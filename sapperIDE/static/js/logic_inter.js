/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating JavaScript for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
// 'use strict';
//
// goog.provide('Blockly.JavaScript.logic');
//
// goog.require('Blockly.JavaScript');

Blockly.JavaScript['prompt_controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
      until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};
Blockly.JavaScript['prompt_control'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', conditionCode, branchInfo;
  var branchCode = '';
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
        block);
  }
  do {
    conditionCode = Blockly.JavaScript.valueToCode(block, 'IF' + n,
        Blockly.JavaScript.ORDER_NONE) || 'false';
    branchInfo = Blockly.JavaScript.statementToCode(block, 'DO' + n);
    if (Blockly.JavaScript.STATEMENT_SUFFIX) {
      branchInfo = Blockly.JavaScript.prefixLines(
          Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
          block), Blockly.JavaScript.INDENT) + branchInfo;
    }
    if (branchInfo != ""){
        branchInfo = branchInfo.split("#*#*");
        for (var i = 1; i < branchInfo.length; i++) {
            if(branchInfo[i].includes("Code")){
                branchCode += JSON.parse(branchInfo[i])["Code"]
            }
        }
    }
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Blockly.JavaScript.STATEMENT_SUFFIX) {
    branchInfo = Blockly.JavaScript.statementToCode(block, 'ELSE');
    if (Blockly.JavaScript.STATEMENT_SUFFIX) {
      branchInfo = Blockly.JavaScript.prefixLines(
          Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
          block), Blockly.JavaScript.INDENT) + branchInfo;
    }
    if (branchInfo != ""){
        branchInfo = branchInfo.split("#*#*");
        for (var i = 1; i < branchInfo.length; i++) {
            if(branchInfo[i].includes("Code")){
                branchCode += JSON.parse(branchInfo[i])["Code"]
            }
        }
    }
    code += ' else {\n' + branchCode + '}';
  }
  return "#*#*" + JSON.stringify({"Code": code + "\n"});
};
Blockly.JavaScript['controls_ifelse'] = Blockly.JavaScript['controls_if'];
Blockly.JavaScript['prompt_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;
  var argument0 = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  if(argument0 != "0"){
      try{
          argument0 = JSON.parse(argument0.replace("#*#*","").replace("(","").replace(")",""))["Unit"]
      }
        catch(err){
          console.log("")
        }

  }
  var argument1 = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  if (argument1 != "0"){
      try{
          argument1 = JSON.parse(argument1.replace("#*#*","").replace("(","").replace(")",""))["Unit"]
      }
    catch(err){
        console.log("")
    }

  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};
Blockly.JavaScript['prompt_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.JavaScript.ORDER_LOGICAL_AND :
      Blockly.JavaScript.ORDER_LOGICAL_OR;
  var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order);
  var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else if(!argument0 || !argument1){
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
      argument1 = JSON.parse(argument1)["Unit"];
    }
    if (!argument1) {
      argument1 = defaultArgument;
      argument0 = JSON.parse(argument0)["Unit"];
    }
  }else{
    argument0 = JSON.parse(argument0)["Unit"];
    argument1 = JSON.parse(argument1)["Unit"];
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};
Blockly.JavaScript['prompt_negate'] = function(block) {
  // Negation.
  var order = Blockly.JavaScript.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};
Blockly.JavaScript['prompt_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['prompt_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['prompt_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.JavaScript.valueToCode(block, 'IF',
      Blockly.JavaScript.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.JavaScript.valueToCode(block, 'THEN',
      Blockly.JavaScript.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.JavaScript.valueToCode(block, 'ELSE',
      Blockly.JavaScript.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.JavaScript.ORDER_CONDITIONAL];
};

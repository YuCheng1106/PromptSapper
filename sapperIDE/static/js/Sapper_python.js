/*
----------------------------------------------------------------------------
Project Name: [Sapper IDE]
File: [Sapper_python.js]
Copyright (C) [2023] [Prompt Sapper]
License: [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License]
----------------------------------------------------------------------------
This file is part of [Sapper IDE].
[Sapper IDE] is free software: you can redistribute it and/or modify
it under the terms of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License as published by
the Creative Commons Corporation, either version 4.0 of the License,
or (at your option) any later version.
[Sapper IDE] is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License for more details.
You should have received a copy of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
along with [Sapper IDE]. If not, see https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.
----------------------------------------------------------------------------
*/
Blockly.Python['Prompt'] = function(block) {
    // TODO: Assemble Python into code variable.
    var text_prompt_value = block.getFieldValue('prompt_value');
  // TODO: Change ORDER_NONE to the correct strength.
    return [text_prompt_value, Blockly.Python.ORDER_NONE];
};
Blockly.Python['Model'] = function(block) {
    // TODO: Assemble Python into code variable.
    var text_model_value = block.getFieldValue('model_value');
  // TODO: Change ORDER_NONE to the correct strength.
    return text_model_value;
};
Blockly.Python['Tool_Model'] = function(block) {
    // TODO: Assemble Python into code variable.
    var text_model_value = block.getFieldValue('model_value');
  // TODO: Change ORDER_NONE to the correct strength.
    return text_model_value;
};
Blockly.Python['Module'] = function(block) {
    var text_module_name = block.getFieldValue('Module_Name');
    var statements_premodules = Blockly.Python.statementToCode(block, 'Premodules');
    var dropdown_contain = block.getFieldValue('Contain');
    var statements_contain = Blockly.Python.statementToCode(block, 'Contain');
    // TODO: Assemble Python into code variable.
    Module1 = {}
    Module1["Module_Name"] = text_module_name
    Module1[dropdown_contain] = []
    Module1["premodules"] = []
    var code = "";
    if(statements_premodules != ""){
      // Module1["premodules"] = JSON.parse(statements_premodules)
        statements_premodules = statements_premodules.split("#*#*");
        for (var i = 1; i < statements_premodules.length; i++) {
            code += JSON.parse(statements_premodules[i])["Code"];
        }
    }
    if (statements_contain != ""){
      // Module1["units"] = JSON.parse(statements_unit);
      statements_contain = statements_contain.split("#*#*");
      for (i = 1; i < statements_contain.length; i++) {
           code += JSON.parse(statements_contain[i])["Code"];
      }
    }
    return "#*#*" + JSON.stringify({"Code": code});
};
Blockly.Python['AI_Unit'] = function(block) {
    var text_unit_name = block.getFieldValue('Unit_Name');
    var statements_preunits = Blockly.Python.statementToCode(block, 'PreWorkers');
    var value_prompt = Blockly.Python.valueToCode(block, 'Prompt', Blockly.Python.ORDER_ATOMIC);
    var value_model = Blockly.Python.valueToCode(block, 'Model', Blockly.Python.ORDER_ATOMIC);
    var prompt = block.getInputTargetBlock("Prompt");
    var promptId = prompt.id;
    var promptname = prompt.getFieldValue("Prompt_Name");
    var example = prompt.getInputTargetBlock("prompt_value");
    var examplename = [];
    examplename.push(example.getFieldValue("Example_value"));
    var exampleId = [];
    exampleId.push(example.id);
    var j=0;
    while(example.nextConnection.isConnected()){
        example = example.getNextBlock();
        examplename.push(example.getFieldValue("Example_value"));
        exampleId.push(example.id);
    }
    PythonPromptValues[promptname]={};
    for(j =0;j<exampleId.length;j++){
        PythonPromptValues[promptname][examplename[j]] = RunPromptAspect[exampleId[j][1]];
    }
    var model = block.getInputTargetBlock('Model');
    var engine = model.getInputTargetBlock("Model");
    var enginetype = engine.type;
    // TODO: Assemble JavaScript into code variable.
    AI_Unit = {}
    AI_Unit["Unit_Name"] = text_unit_name;
    AI_Unit["prompt"] = value_prompt.replace("(", "").replace(")", "");
    AI_Unit["model"] = value_model.replace("(", "").replace(")", "");
    AI_Unit["preunits"] = []
    var code ="";
    if (statements_preunits !== ""){
        statements_preunits = statements_preunits.split("#*#*");
        for (var i = 1; i < statements_preunits.length; i++) {
            if(statements_preunits[i].includes("Unit")) {
                AI_Unit["preunits"] = AI_Unit["preunits"].concat(JSON.parse(statements_preunits[i])["Unit"])
            }
            if(statements_preunits[i].includes("Code")){
                code += JSON.parse(statements_preunits[i])["Code"]
            }
        }
    }
    code += AI_Unit["Unit_Name"] + " = chain.worker(" + AI_Unit["prompt"] + ",[" + AI_Unit["preunits"].join(",") + "],"+ AI_Unit["model"] + ")\n";
    initvariables.push(AI_Unit["Unit_Name"])
    return "#*#*" + JSON.stringify({"Unit": [AI_Unit["Unit_Name"]], "Code": code});
};
Blockly.Python['Tool_Unit'] = function(block) {
    var text_unit_name = block.getFieldValue('Unit_Name');
    var statements_preunits = Blockly.Python.statementToCode(block, 'Preunits');
    var value_prompt = Blockly.Python.valueToCode(block, 'Prompt', Blockly.Python.ORDER_ATOMIC);
    var value_model = Blockly.Python.valueToCode(block, 'Model', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    AI_Unit = {}
    AI_Unit["Unit_Name"] = text_unit_name;

    AI_Unit["prompt"] = value_prompt.replace("(", "").replace(")", "");
    AI_Unit["model"] = value_model.replace("(", "").replace(")", "");
    AI_Unit["preunits"] = []
    var code ="";
    if (statements_preunits !== ""){
        statements_preunits = statements_preunits.split("#*#*");
        for (var i = 1; i < statements_preunits.length; i++) {
            if(statements_preunits[i].includes("Unit")) {
                AI_Unit["preunits"] = AI_Unit["preunits"].concat(JSON.parse(statements_preunits[i])["Unit"])
            }
            if(statements_preunits[i].includes("Code")){
                code += JSON.parse(statements_preunits[i])["Code"]
            }
        }
    }
    code += AI_Unit["Unit_Name"] + " = chain.run_"+JSON.parse(AI_Unit["model"])["engine"].replace(" ","")+"(" + AI_Unit["prompt"] + ",[" + AI_Unit["preunits"].join(",") + "],"+ AI_Unit["model"] + ")\n";
    return "#*#*" + JSON.stringify({"Unit": [AI_Unit["Unit_Name"]], "Code": code});
};
Blockly.Python['Set_value'] = function(block) {
  var value_variable = Blockly.Python.valueToCode(block, 'variable', Blockly.Python.ORDER_ATOMIC).replace("(", "").replace(")", "").replace("#*#*", "");
  var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = JSON.parse(value_variable)["Unit"] + " = " + value_value + "\n";
  return "#*#*" + JSON.stringify({"Code": code});
};
Blockly.Python['For_each'] = function(block) {
  // For each loop.
    console.log("yew1")
  var variable0 = Blockly.Python.valueToCode(block, 'Var', Blockly.Python.ORDER_NONE).replace("(", "").replace(")", "").replace("#*#*", "");
  var argument0 = Blockly.Python.valueToCode(block, 'List', Blockly.Python.ORDER_NONE).replace("(", "").replace(")", "").replace("#*#*", "");
  var branch = Blockly.Python.statementToCode(block, 'Func');
  var code = '';
  var branchcode = '';
  if (branch != ""){
      // Module1["units"] = JSON.parse(statements_unit);
      branch = branch.split("#*#*");
      for (var i = 1; i < branch.length; i++) {
           branchcode += "\t" + JSON.parse(branch[i])["Code"];
      }
  }
  argument0 = JSON.parse(argument0)["Unit"]
  variable0 = JSON.parse(variable0)["Unit"]
  code += "for "+ variable0 + " in "+ argument0 + ":\n\t" +variable0+"="+ argument0 + "[" + variable0 + "];\n" + branchcode + "";
  return "#*#*" + JSON.stringify({"Code": code});
};
Blockly.Python['Input'] = function(block) {
  var statements_input_var = Blockly.Python.statementToCode(block, 'input_var');
  // TODO: Assemble Python into code variable.
  var preunits = []
    var code ="";
    if (statements_input_var != ""){
        statements_input_var = statements_input_var.split("#*#*");
        for (var i = 1; i < statements_input_var.length; i++) {
            if(statements_input_var[i].includes("Unit")) {
                preunits = preunits.concat(JSON.parse(statements_input_var[i])["Unit"]);
            }
            if(statements_input_var[i].includes("Code")){
                code += JSON.parse(statements_input_var[i])["Code"]
            }
        }
    }
    for(var j = 0; j < preunits.length; j++){
        code += preunits[j] + " = input(\"" + preunits[j] + ":\")\n";
    }
  return "#*#*" + JSON.stringify({"Unit": preunits, "Code": code});
};
Blockly.Python['Output'] = function(block) {
  var statements_Output_var = Blockly.Python.statementToCode(block, 'Output_var');
  // TODO: Assemble Python into code variable.
  var preunits = []
    var code ="";
    if (statements_Output_var != ""){
        statements_Output_var = statements_Output_var.split("#*#*");
        for (var i = 1; i < statements_Output_var.length; i++) {
            if(statements_Output_var[i].includes("Unit")) {
                preunits = preunits.concat(JSON.parse(statements_Output_var[i])["Unit"]);
            }
            if(statements_Output_var[i].includes("Code")){
                code += JSON.parse(statements_Output_var[i])["Code"]
            }
        }
    }
    for(var j = 0; j < preunits.length; j++){
        code += "print(" + preunits[j] + ")\n";
    }
  return "#*#*" + JSON.stringify({"Unit": preunits, "Code": code});
};
Blockly.Python['unit_var'] = function(block) {
    // TODO: Assemble Python into code variable.
    var text_unit_value = block.getFieldValue('unit_value');
  // TODO: Change ORDER_NONE to the correct strength.
    initvariables.push(text_unit_value);
    return "#*#*" + JSON.stringify({"Unit": text_unit_value});
};
Blockly.Python['unit_var_value'] = function(block) {
    // TODO: Assemble Python into code variable.
     var text_unit_value = block.getFieldValue('unit_value');
     initvariables.push(text_unit_value);
  // TODO: Change ORDER_NONE to the correct strength.
    return ["#*#*" + JSON.stringify({"Unit": text_unit_value}),Blockly.Python.ORDER_NONE];
};
Blockly.Python['Prompt_template'] = function(block) {
    var text_name = block.getFieldValue('Prompt_Name');
    var statements_name = Blockly.Python.statementToCode(block, 'prompt_value').split("#*#*");
    var promptexample = []
    for (var i = 1; i < statements_name.length; i++) {
        promptexample.push(statements_name[i])
    }
    return [JSON.stringify({"text_name": promptexample}).replace("text_name",text_name), Blockly.Python.ORDER_NONE];
};
Blockly.Python['Example'] = function(block) {
    // TODO: Assemble Python into code variable.
  var text_name = block.getFieldValue('Example_value');
  return "#*#*" + text_name;
};
Blockly.Python['LLM_Model'] = function(block){
    // TODO: Assemble Python into code variable.
    var model_name = block.getFieldValue('LLM_Name');
    var model = Blockly.Python.statementToCode(block, 'Model');
    var configvalue = {}
    configvalue["engine"] = model.replace(" ","");
    try{
        var comfig = Blockly.Python.statementToCode(block, 'configuration').split("#*#*");
        for (var i = 1; i < comfig.length; i++) {
        configvalue = Object.assign(configvalue, JSON.parse(comfig[i]))
        }
    }
    catch(err){
        console.log("")
    }

    return [JSON.stringify(configvalue), Blockly.Python.ORDER_NONE];
};
Blockly.Python['LLM_top_p'] = function(block) {
    // TODO: Assemble Python into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"top_p": text_name});
};
Blockly.Python['LLM_frequency'] = function(block) {
    // TODO: Assemble Python into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"frequency_penalty": text_name});
};
Blockly.Python['LLM_presence'] = function(block) {
    // TODO: Assemble Python into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"presence_penalty": text_name});
};
Blockly.Python['LLM_max_tokens'] = function(block) {
    // TODO: Assemble Python into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"max_tokens": text_name});
};
Blockly.Python['LLM_stop_strs'] = function(block) {
    // TODO: Assemble Python into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"stop_strs": text_name});
};
Blockly.Python['LLM_temperature'] = function(block) {
    // TODO: Assemble Python into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"temperature": text_name});
};

// Logic Unit
Blockly.Python['prompt_controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Python.valueToCode(block, 'BOOL',
      until ? Blockly.Python.ORDER_LOGICAL_NOT :
      Blockly.Python.ORDER_NONE) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block) || Blockly.Python.PASS;
  if(branch != Blockly.Python.PASS){
        branch = branch.split("#*#*");
        var code = "";
        for(var i = 1; i < branch.length; i++){
            code += JSON.parse(branch[i])["Code"]
        }
        branch = code;
        if(branch==""){
            branch="pass";
        }
        var branch_list = branch.split("\n");
        var branch_code = "";
        for(var j = 0; j<branch_list.length-1;j++){
            branch_code += "\t" +branch_list[j] + "\n"
        }
        branch = branch_code
  }
  if (until) {
    argument0 = 'not ' + argument0;
  }
  var code = 'while ' + argument0 + ':\n' + branch;
  return "#*#*" + JSON.stringify({"Code": code + "\n"});
};
Blockly.Python['prompt_control'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', conditionCode, branchInfo;
  var branchCode = '';
  if (Blockly.Python.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.Python.injectId(Blockly.Python.STATEMENT_PREFIX,
        block);
  }
  do {
    conditionCode = Blockly.Python.valueToCode(block, 'IF' + n,
        Blockly.Python.ORDER_NONE) || 'False';
    branchInfo = Blockly.Python.statementToCode(block, 'DO' + n);
    if (Blockly.Python.STATEMENT_SUFFIX) {
      branchInfo = Blockly.Python.prefixLines(
          Blockly.Python.injectId(Blockly.Python.STATEMENT_SUFFIX,
          block), Blockly.Python.INDENT) + branchInfo;
    }
    if (branchInfo != ""){
        branchInfo = branchInfo.split("#*#*");
        for (var i = 1; i < branchInfo.length; i++) {
            if(branchInfo[i].includes("Code")){
                branchCode += JSON.parse(branchInfo[i])["Code"];
            }
        }
    }
    if(branchCode==""){
        branchCode = "pass\n";
    }
    var branch_list = branchCode.split("\n");
    var branch_code = "";
    for(var j = 0; j<branch_list.length-1;j++){
        branch_code += "\t" +branch_list[j] + "\n"
    }
    code += (n == 0 ? 'if ' : 'elif ') + conditionCode + ':\n' + branch_code;
    branchCode = "";
    ++n;
  } while (block.getInput('IF' + n));
    branchCode = "";
  if (block.getInput('ELSE') || Blockly.Python.STATEMENT_SUFFIX) {
    branchInfo = Blockly.Python.statementToCode(block, 'ELSE');
    if (Blockly.Python.STATEMENT_SUFFIX) {
      branchInfo = Blockly.Python.prefixLines(
          Blockly.Python.injectId(Blockly.Python.STATEMENT_SUFFIX,
          block), Blockly.Python.INDENT) + branchInfo;
    }
    if (branchInfo != ""){
        branchInfo = branchInfo.split("#*#*");
        for (var i = 1; i < branchInfo.length; i++) {
            if(branchInfo[i].includes("Code")){
                branchCode += JSON.parse(branchInfo[i])["Code"]
            }
        }
    }
    if(branchCode==""){
        branchCode = "pass\n";
    }
    branch_list = branchCode.split("\n");
    branch_code = "";
    for(var j = 0; j<branch_list.length-1;j++){
        branch_code += "\t" +branch_list[j] + "\n"
    }
    code += 'else:\n' + branch_code ;
  }
  return "#*#*" + JSON.stringify({"Code": code + "\n"});
};
Blockly.Python['prompt_controls_ifelse'] = Blockly.Python['controls_if'];
Blockly.Python['prompt_compare'] = function(block) {
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
  var order = Blockly.Python.ORDER_RELATIONAL;
  var argument0 = Blockly.Python.valueToCode(block, 'A', order) || '0';
  if(argument0 != "0"){
      try{
          argument0 = JSON.parse(argument0.replace("#*#*","").replace("(","").replace(")",""))["Unit"]
      }
        catch(err){
          console.log("")
        }

  }
  var argument1 = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_ATOMIC) || '0';
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
Blockly.Python['prompt_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == 'and') ? Blockly.Python.ORDER_LOGICAL_AND :
      Blockly.Python.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Python.valueToCode(block, 'A', order);
  var argument1 = Blockly.Python.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'False';
    argument1 = 'False';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == 'and') ? 'True' : 'False';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};
Blockly.Python['prompt_negate'] = function(block) {
  // Negation.
  var argument0 = Blockly.Python.valueToCode(block, 'BOOL',
      Blockly.Python.ORDER_LOGICAL_NOT) || 'True';
  var code = 'not ' + argument0;
  return [code, Blockly.Python.ORDER_LOGICAL_NOT];
};
Blockly.Python['prompt_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'True' : 'False';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['prompt_null'] = function(block) {
  // Null data type.
  return ['None', Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['prompt_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Python.valueToCode(block, 'IF',
      Blockly.Python.ORDER_CONDITIONAL) || 'False';
  var value_then = Blockly.Python.valueToCode(block, 'THEN',
      Blockly.Python.ORDER_CONDITIONAL) || 'None';
  var value_else = Blockly.Python.valueToCode(block, 'ELSE',
      Blockly.Python.ORDER_CONDITIONAL) || 'None';
  var code = value_then + ' if ' + value_if + ' else ' + value_else;
  return [code, Blockly.Python.ORDER_CONDITIONAL];
};


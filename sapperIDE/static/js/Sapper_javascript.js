/*
----------------------------------------------------------------------------
Project Name: [Sapper IDE]
File: [Sapper_javascript.js]
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
Blockly.JavaScript['File'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var text_unit_value = block.getFieldValue('File_Name').replace(".","_");
    var fileid = "debug" + block.id;
    var code = "var " + text_unit_value + " = document.getElementById('"+ fileid + "').value;\n";
    console.log(code)
  // TODO: Change ORDER_NONE to the correct strength.
    initvariables.push(text_unit_value)
    return "#*#*" + JSON.stringify({"Unit": text_unit_value,"Code": code});
};
Blockly.JavaScript['Fold'] = function(block) {
    var text_name = block.getFieldValue('File_Name');
    var statements_Output_var = Blockly.JavaScript.statementToCode(block, 'allFile').split("#*#*");
    var promptexample = []
    var code = '';
    for (var i = 1; i < statements_Output_var.length; i++) {
        if(statements_Output_var[i].includes("Code")){
            code += JSON.parse(statements_Output_var[i])["Code"]
        }
        if(statements_Output_var[i].includes("Unit")) {
            promptexample.push(JSON.parse(statements_Output_var[i])["Unit"]);
        }
    }
    code += `var allfiles = [${promptexample}];\nif(allfiles.length === 0){allfiles = await uploadflod('${block.id}');\n}\n var ` + text_name + " = allfiles;\n";
    return "#*#*" + JSON.stringify({"Unit": text_name, "Code": code});
};
Blockly.JavaScript['Download'] = function(block) {
  var statements_Output_var = Blockly.JavaScript.statementToCode(block, 'Output_var');
  // TODO: Assemble JavaScript into code variable.
  var preunits = []
    var code ="";
    if (statements_Output_var !== ""){
        statements_Output_var = statements_Output_var.split("#*#*");
        for (var i = 1; i < statements_Output_var.length; i++) {
            if(statements_Output_var[i].includes("Code")){
                code += JSON.parse(statements_Output_var[i])["Code"]
            }
            if(statements_Output_var[i].includes("Unit")) {
                preunits = preunits.concat(JSON.parse(statements_Output_var[i])["Unit"]);
            }
        }
    }
    for(var j = 0; j < preunits.length; j++){
        code += "download_value('" + preunits[j] + "', "+ preunits[j] +",'" + block.id +"');\n";
    }
  return "#*#*" + JSON.stringify({"Unit": preunits, "Code": code});
};
Blockly.JavaScript['Prompt'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var text_prompt_value = block.getFieldValue('prompt_value');
  // TODO: Change ORDER_NONE to the correct strength.
    return text_prompt_value;
};
Blockly.JavaScript['Model'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var text_model_value = block.getFieldValue('modelName');
  // TODO: Change ORDER_NONE to the correct strength.
    return text_model_value;
};
Blockly.JavaScript['Tool_Model'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var text_model_value = block.getFieldValue('model_value');
  // TODO: Change ORDER_NONE to the correct strength.
    return text_model_value;
  };
Blockly.JavaScript['Module'] = function(block) {
    var text_module_name = block.getFieldValue('Module_Name');
    var statements_premodules = Blockly.JavaScript.statementToCode(block, 'Premodules');
    var dropdown_contain = block.getFieldValue('Contain');
    var statements_contain = Blockly.JavaScript.statementToCode(block, 'Contain');
    // TODO: Assemble JavaScript into code variable.
    Module1 = {}
    Module1["Module_Name"] = text_module_name
    Module1[dropdown_contain] = []
    Module1["premodules"] = []
    var code = "";
    if(statements_premodules !== ""){
      // Module1["premodules"] = JSON.parse(statements_premodules)
        statements_premodules = statements_premodules.split("#*#*");
        for (var i = 1; i < statements_premodules.length; i++) {
            code += JSON.parse(statements_premodules[i])["Code"];
        }
    }
    if (statements_contain !== ""){
      // Module1["units"] = JSON.parse(statements_unit);
      statements_contain = statements_contain.split("#*#*");
      for (i = 1; i < statements_contain.length; i++) {
           code += JSON.parse(statements_contain[i])["Code"];
      }
    }
    return "#*#*" + JSON.stringify({"Code": code});
};
Blockly.JavaScript['AI_Unit'] = function(block) {
    var text_unit_name = block.getFieldValue('Unit_Name');
    var statements_preunits = Blockly.JavaScript.statementToCode(block, 'PreWorkers');
    var value_prompt = Blockly.JavaScript.valueToCode(block, 'Prompt', Blockly.JavaScript.ORDER_ATOMIC);
    var value_model = Blockly.JavaScript.valueToCode(block, 'Model', Blockly.JavaScript.ORDER_ATOMIC);
    var prompt = block.getInputTargetBlock("Prompt");
    var promptId = prompt.id;
    var example = prompt.getInputTargetBlock("prompt_value");
    var exampleId = [];
    exampleId.push(example.id);
    while(example.nextConnection.isConnected()){
        example = example.getNextBlock();
        exampleId.push(example.id);
    }
    var model = block.getInputTargetBlock('Model');
    var enginetype = '';
    var engine = model.getInputTargetBlock("Model") ? model.getInputTargetBlock("Model") : null;
    enginetype = engine ? engine.type : '';

    // TODO: Assemble JavaScript into code variable.
    AI_Unit = {}
    AI_Unit["Unit_Name"] = text_unit_name;
    AI_Unit["prompt"] = JSON.parse(value_prompt.replace("(", "").replace(")", ""));
    AI_Unit["model"] = value_model.replace("(", "").replace(")", "");
    AI_Unit["preunits"] = []
    var code =""
    code += "var pro_" + AI_Unit["prompt"]["Unit"] + "= prompt_template('" + promptId + "', ['"+ exampleId.join("','") + "']);\n";
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
    code += "if (signal.aborted) {\n" +
        "      console.log('aborted');\n" +
        "      return;\n" +
        "    }"
    if(enginetype==="Model"){
        code += "var " + AI_Unit["Unit_Name"] + " = await run_code('"+ AI_Unit["Unit_Name"]+"',pro_" + AI_Unit["prompt"]["Unit"] + ",[" + AI_Unit["preunits"].join(",") + "],'"+ AI_Unit["model"] + "','" + block.id +"' );\n";
    }
    else{
        code += "var " + AI_Unit["Unit_Name"] + " = await run_" +JSON.parse(AI_Unit["model"])["engine"].replace(" ","") +"('" + AI_Unit["Unit_Name"] + "',pro_" +AI_Unit["prompt"]["Unit"] + ",[" + AI_Unit["preunits"].join(",") + "],'"+ AI_Unit["model"] + "','" + block.id +"' );\n";
    }
    initvariables.push(AI_Unit["Unit_Name"])
    return "#*#*" + JSON.stringify({"Unit": [AI_Unit["Unit_Name"]], "Code": code});
};
Blockly.JavaScript['Parallel_Work'] = function(block) {
  var statements_input_var = Blockly.JavaScript.statementToCode(block, 'workers');
  // TODO: Assemble JavaScript into code variable.
  var preunits = []
    var parallerId = []
    var parallel_work = block.getInputTargetBlock('workers')
    if(parallel_work.getField('debug')){
        parallerId.push(parallel_work.id);
    }
    while(parallel_work.nextConnection.isConnected()){
        parallel_work = parallel_work.getNextBlock();
        if(parallel_work.getField('debug')){
            parallerId.push(parallel_work.id);
        }
    }
    var code = "parallel_work(['"+ parallerId.join("','") + "']);\n";
    if (statements_input_var !== ""){
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
  return "#*#*" + JSON.stringify({"Unit": preunits, "Code": code});
};
Blockly.JavaScript['Tool_Unit'] = function(block) {
    var text_unit_name = block.getFieldValue('Unit_Name');
    var statements_preunits = Blockly.JavaScript.statementToCode(block, 'Preunits');
    var value_prompt = Blockly.JavaScript.valueToCode(block, 'Prompt', Blockly.JavaScript.ORDER_ATOMIC);
    var value_model = Blockly.JavaScript.valueToCode(block, 'Model', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    AI_Unit = {}
    AI_Unit["Unit_Name"] = text_unit_name;
    AI_Unit["prompt"] = JSON.parse(value_prompt.replace("(", "").replace(")", ""));
    AI_Unit["model"] = value_model.replace("(", "").replace(")", "");
    AI_Unit["preunits"] = []
    var code ="";
    code += AI_Unit["prompt"]["Unit"] + "= prompt_template('" + AI_Unit["prompt"]["Unit"] + "', ['"+ AI_Unit["prompt"]["Code"].join("','") + "']);\n";
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
    code += "var " + AI_Unit["Unit_Name"] + " = await run_" +JSON.parse(AI_Unit["model"])["engine"].replace(" ","") +"(" + AI_Unit["prompt"]["Unit"] + ",[" + AI_Unit["preunits"].join(",") + "],'"+ AI_Unit["model"] + "' );\n";
    initvariables.push(AI_Unit["Unit_Name"])
    return "#*#*" + JSON.stringify({"Unit": [AI_Unit["Unit_Name"]], "Code": code});
};
Blockly.JavaScript['Input'] = function(block) {
  var statements_input_var = Blockly.JavaScript.statementToCode(block, 'input_var');
  // TODO: Assemble JavaScript into code variable.
  var preunits = []
    var code =""
    if (statements_input_var !== ""){
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
    code += "if (signal.aborted) {\n" +
        "      console.log('aborted');\n" +
        "      return;\n" +
        "    }"
    for(var j = 0; j < preunits.length; j++){
        code += "var " + preunits[j] + " = await input_value('" + preunits[j] + "','" +block.id + "');\n";
    }
  return "#*#*" + JSON.stringify({"Unit": preunits, "Code": code});
};
Blockly.JavaScript['Output'] = function(block) {
  var statements_Output_var = Blockly.JavaScript.statementToCode(block, 'Output_var');
  // TODO: Assemble JavaScript into code variable.
  var preunits = []
    var code ="";
    if (statements_Output_var !== ""){
        statements_Output_var = statements_Output_var.split("#*#*");
        for (var i = 1; i < statements_Output_var.length; i++) {
            if(statements_Output_var[i].includes("Code")){
                code += JSON.parse(statements_Output_var[i])["Code"]
            }
            if(statements_Output_var[i].includes("Unit")) {
                preunits = preunits.concat(JSON.parse(statements_Output_var[i])["Unit"]);
            }
        }
    }
    for(var j = 0; j < preunits.length; j++){
        code += "await output_value('" + preunits[j] + "', "+ preunits[j] +",'" + block.id +"');\n";
    }
  return "#*#*" + JSON.stringify({"Unit": preunits, "Code": code});
};
Blockly.JavaScript['Set_value'] = function(block) {
  var value_variable = Blockly.JavaScript.valueToCode(block, 'variable', Blockly.JavaScript.ORDER_ATOMIC).replace("(", "").replace(")", "").replace("#*#*", "");
  var value_value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
  var code = "";
  if(value_value.indexOf("#*#*")!==-1){
      value_value = value_value.replace("(", "").replace(")", "").replace("#*#*", "");
      code = JSON.parse(value_variable)["Unit"] + " = " + JSON.parse(value_value)["Unit"] + ";\n";
  }
  else{
      code = JSON.parse(value_variable)["Unit"] + " = " + value_value + ";\n";
  }
  // TODO: Assemble JavaScript into code variable.
  return "#*#*" + JSON.stringify({"Code": code,"Unit":JSON.parse(value_variable)["Unit"]});
};
Blockly.JavaScript['Append_text'] = function(block) {
  var value_variable = Blockly.JavaScript.valueToCode(block, 'variable', Blockly.JavaScript.ORDER_ATOMIC).replace("(", "").replace(")", "").replace("#*#*", "");
  var value_value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
  var code = "";
  if(value_value.indexOf("#*#*")!==-1){
      value_value = value_value.replace("(", "").replace(")", "").replace("#*#*", "");
      code = JSON.parse(value_variable)["Unit"] + " = " + JSON.parse(value_variable)["Unit"] + " + " + JSON.parse(value_value)["Unit"] + ";\n";
  }
  else{
      code = JSON.parse(value_variable)["Unit"] + " = " + JSON.parse(value_variable)["Unit"] + " + " +value_value + ";\n";
  }
  // TODO: Assemble JavaScript into code variable.
  return "#*#*" + JSON.stringify({"Code": code,"Unit": JSON.parse(value_variable)["Unit"]});
};
Blockly.JavaScript['Set_value2_list'] = function(block) {
  var value_variable = Blockly.JavaScript.valueToCode(block, 'variable', Blockly.JavaScript.ORDER_ATOMIC).replace("(", "").replace(")", "").replace("#*#*", "");
  // TODO: Assemble JavaScript into code variable.
  var code = JSON.parse(value_variable)["Unit"] + " = eval(" + JSON.parse(value_variable)["Unit"] + ");console.log(eval("+JSON.parse(value_variable)["Unit"]+"));\n";
  return "#*#*" + JSON.stringify({"Unit": JSON.parse(value_variable)["Unit"] ,"Code": code});
};
Blockly.JavaScript['For_each'] = function(block){
  // For each loop.
  var variable0 = Blockly.JavaScript.valueToCode(block, 'Var', Blockly.JavaScript.ORDER_ASSIGNMENT).replace("(", "").replace(")", "").replace("#*#*", "");
  var argument0 = Blockly.JavaScript.valueToCode(block, 'List', Blockly.JavaScript.ORDER_ASSIGNMENT).replace("(", "").replace(")", "").replace("#*#*", "");
  var branch = Blockly.JavaScript.statementToCode(block, 'Func');
  var code = '';
  var branchcode = '';

  if (branch !== ""){
      // Module1["units"] = JSON.parse(statements_unit);
      branch = branch.split("#*#*");
      for (var i = 1; i < branch.length; i++) {
           branchcode += JSON.parse(branch[i])["Code"];
      }
  }
  argument0 = JSON.parse(argument0)["Unit"]
  variable0 = JSON.parse(variable0)["Unit"]
  code += "if (!Array.isArray("+ argument0 + ")){"+ argument0 + " = eval("+ argument0 +");\n}\nfor(var "+ variable0 + " in "+ argument0 + "){" +variable0+"="+ argument0 + "[" + variable0 + "];\n" + branchcode + "};";
  return "#*#*" + JSON.stringify({"Code": code});
};
Blockly.JavaScript['unit_var'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var text_unit_value = block.getFieldValue('unit_value');
    var code = "var " + text_unit_value + " = '';\n";
  // TODO: Change ORDER_NONE to the correct strength.
    initvariables.push(text_unit_value)
    return "#*#*" + JSON.stringify({"Unit": text_unit_value},{"Code": code});
};
Blockly.JavaScript['unit_var_value'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
     var text_unit_value = block.getFieldValue('unit_value');
  // TODO: Change ORDER_NONE to the correct strength.
    initvariables.push(text_unit_value)
    return ["#*#*" + JSON.stringify({"Unit": text_unit_value}),Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['Prompt_template'] = function(block) {
    var text_name = block.getFieldValue('Prompt_Name');
    var statements_name = Blockly.JavaScript.statementToCode(block, 'prompt_value').split("#*#*");
    var promptexample = []
    for (var i = 1; i < statements_name.length; i++) {
        promptexample.push(statements_name[i])
    }
    return [JSON.stringify({"Unit": text_name, "Code": promptexample}), Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['Example'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
  var text_name = block.getFieldValue('Example_value');
  return "#*#*" + text_name;
};
Blockly.JavaScript['LLM_Model'] = function(block){
    // TODO: Assemble JavaScript into code variable.
    var model_name = block.getFieldValue('LLM_Name');
    var model = Blockly.JavaScript.statementToCode(block, 'Model');
    var configvalue = {}
    configvalue = JSON.parse(JSON.stringify(RunEngineConfigs[block.id]));
    for(var i =0;i<Object.keys(configvalue).length;i++){
        configvalue[Object.keys(configvalue)[i]] = Object.values(configvalue)[i][0]
    }
    configvalue["engine"] = model.replace(" ","");

    return [JSON.stringify(configvalue), Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['APIEngine'] = function(block){
    // TODO: Assemble JavaScript into code variable.
    var model_name = block.getFieldValue('LLM_Name');
    var configvalue = {}
    configvalue["engine"] = model_name.replace(" ","");

    return [JSON.stringify(configvalue), Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['LLM_top_p'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"top_p": text_name});
};
Blockly.JavaScript['LLM_frequency'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"frequency_penalty": text_name});
};
Blockly.JavaScript['LLM_presence'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"presence_penalty": text_name});
};
Blockly.JavaScript['LLM_max_tokens'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"max_tokens": text_name});
};
Blockly.JavaScript['LLM_stop_strs'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"stop_strs": text_name});
};
Blockly.JavaScript['LLM_temperature'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
  var text_name = block.getFieldValue('config_value');
  return "#*#*" + JSON.stringify({"temperature": text_name});
};

// Logic Unit
Blockly.JavaScript['prompt_controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
      until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  if(branch != "false"){
        branch = branch.split("#*#*");
        var code = "";
        for(var i = 1; i < branch.length; i++){
            code += JSON.parse(branch[i])["Code"]
        }
        branch = code;
  }
  if (until) {
    argument0 = '!' + argument0;
  }
  var code = 'while (' + argument0 + ') {\n' + branch + '}\n';
  return "#*#*" + JSON.stringify({"Code": code});
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
    branchCode = "";
  } while (block.getInput('IF' + n));
    branchCode = "";
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

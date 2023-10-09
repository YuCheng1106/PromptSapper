Blockly.Blocks["File"] = {
  init: function() {
    this.jsonInit({
    "type": "file",
  "message0": "%1 %2 %3",
  "args0": [
      {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/debugblack.png",
          "width": 12,
          "height": 12,
          "alt": "file",
          "flipRtl": false,
         "name":"debug"
        },
      {
      "type": "field_label_serializable",
      "name": "File_Name",
      "text": "File"
    },
    {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/file-add-fill.png",
          "width": 24,
          "height": 24,
          "alt": "file",
          "flipRtl": false,
         "name":"fileadd"
        },
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
    this.getField('fileadd').clickHandler_=uploadfileclick;
    this.getField('debug').clickHandler_= debugclick;
    var debugconsole =document.createElement("textarea");
    debugconsole.setAttribute("class", "ProjectPromptTemplate");
    debugconsole.setAttribute("style", "width: 100%; height: 100%;display: none");
    debugconsole.setAttribute("readonly", "readonly");
    debugconsole.setAttribute("id", "debug" + this.id);
    document.getElementById("BlockDebugValue").appendChild(debugconsole);
    BlockDebugIDs.push("debug" + this.id);
  }
};
Blockly.Blocks["Fold"] = {
  init: function() {
    this.jsonInit({
    "type": "files",
  "message0": "%1 %2 %3 %4",
  "args0": [
      {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/debugblack.png",
          "width": 12,
          "height": 12,
          "alt": "files",
          "flipRtl": false,
         "name":"debug"
        },
      {
      "type": "field_label_serializable",
      "name": "File_Name",
      "text": "Fold"
    },
    {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/file-add-fill.png",
          "width": 24,
          "height": 24,
          "alt": "fold",
          "flipRtl": false,
         "name":"fileadd"
        },
      {
      "type": "input_statement",
      "name": "allFile"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
   // "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
    this.getField('fileadd').clickHandler_=uploadfilesclick;
    // this.getField('debug').clickHandler_= debugclick;
    // var debugconsole =document.createElement("textarea");
    // debugconsole.setAttribute("class", "ProjectPromptTemplate");
    // debugconsole.setAttribute("style", "width: 100%; height: 100%;display: none");
    // debugconsole.setAttribute("readonly", "readonly");
    // debugconsole.setAttribute("id", "debug" + this.id);
    // document.getElementById("BlockDebugValue").appendChild(debugconsole);
    // BlockDebugIDs.push("debug" + this.id);
  }
};
Blockly.Blocks["Download"] = {
  init: function() {
    this.jsonInit({
    "type": "download",
  "message0": "download %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "Output_var"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
    });
  }
};
Blockly.Blocks['Prompt'] = {
  init: function() {
    this.jsonInit({
    "type": "prompt",
     "message0": "%1",
      "args0": [
        {
          "type": "field_label_serializable",
          "name": "prompt_value",
          "text": ""
        }
      ],
  "output": null,
  "colour": 345,
  "tooltip": "Prompt",
  "helpUrl": "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}"
    });
  }
};
Blockly.Blocks['Tool_Model'] = {
  init: function() {
    this.jsonInit({
    "type": "model",
     "message0": "%1",
      "args0": [
        {
          "type": "field_label_serializable",
          "name": "model_value",
          "text": ""
        }
      ],
  "previousStatement": null,
      "nextStatement": null,
  "colour": 85,
  "tooltip": "Model",
  "helpUrl": ""
    });
  }
}

Blockly.Blocks['Example1'] = {
  init: function() {
    this.jsonInit({
        "type": "example",
        "message0": "%1",
        "args0": [
            {
            "type": "field_dropdown",
            "name": "Example_value",
            "options": [
                ["Instruction", "Instruction"]
            ]
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 90,
    "tooltip": "",
    "helpUrl": ""
});
}
}
Blockly.Blocks['Module'] = {
  init: function() {
    this.jsonInit({
   "type": "module",
  "message0": "%1 %2 %3 %4 PreUnits %5 %6 %7",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "Module",
      "text": "Container"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "Module_Name",
      "text": "Container_Name"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "PreContainer"
    },
    {
      "type": "field_label_serializable",
      "name": "Contain",
      "text": "Units"
    },
    {
      "type": "input_statement",
      "name": "Contain"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 180,
  "tooltip": "Container",
  "helpUrl": ""
    });
  }
};
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
Blockly.Blocks['AI_Unit'] = {
  init: function() {
    this.jsonInit({
       "type": "ai_unit",
      "message0": "%1 %2 %3 %4 %5 PreWorkers %6 %7 Prompt %8 %9 Engine %10 %11",
      "args0": [
          {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/debugblack.png",
          "width": 12,
          "height": 12,
          "alt": "saa",
          "flipRtl": false,
            "name":"debug"
        },
        {
          "type": "field_label_serializable",
          "name": "AI_Unit",
          "text": "Worker"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "Unit_Name",
          "text": "Worker_Name"
        },
        {
          "type": "input_dummy"
        },
          {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/plus.png",
          "width": 12,
          "height": 12,
          "alt": "saa",
          "flipRtl": false,
          "name": "preworkplus"
        },
        {
          "type": "input_statement",
          "name": "PreWorkers",
          "check": "AI_Unit"
        },
        {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/plus.png",
          "width": 12,
          "height": 12,
          "alt": "saa",
          "flipRtl": false,
            "name":"promptplus"
        },
        {
          "type": "input_value",
          "name": "Prompt",
          "check": "prompt"
        },
          {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/plus.png",
          "width": 12,
          "height": 12,
          "alt": "saa",
          "flipRtl": false,
            "name":"modelplus"
        },
        {
          "type": "input_value",
          "name": "Model",
          "check": "model"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "AI_Unit",
      "helpUrl": ""
    });
    this.getField('preworkplus').clickHandler_= pluspreworkclick;
    // var show_model1 = show_model();
    // var show_prompt2 = show_prompt();
    this.getField('promptplus').clickHandler_= plusprompt;
    this.getField('modelplus').clickHandler_= plusmodel;
    this.getField('debug').clickHandler_= debugclick;
    var debugconsole =document.createElement("textarea");
    debugconsole.setAttribute("class", "ProjectPromptTemplate");
    debugconsole.setAttribute("style", "width: 100%; height: 100%;display: none");
    debugconsole.setAttribute("readonly", "readonly");
    debugconsole.setAttribute("id", "debug" + this.id);
    document.getElementById("BlockDebugValue").appendChild(debugconsole);
    BlockDebugIDs.push("debug" + this.id);
  }
};

Blockly.Blocks['Tool_Unit'] = {
  init: function() {
    this.jsonInit({
       "type": "ai_unit",
  "message0": "%1 %2 %3 %4 Preunits %5 Prompt %6 Model %7",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "AI_Unit",
      "text": "Tool_Unit"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "Unit_Name",
      "text": "Tool_Name"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "Preunits",
      "check": "AI_Unit"
    },
    {
      "type": "input_value",
      "name": "Prompt",
      "check": "prompt"
    },
    {
      "type": "input_value",
      "name": "Model",
      "check": "model"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 270,
  "tooltip": "Tool_Unit",
  "helpUrl": ""
    });
  }
};
Blockly.Blocks["Input"] = {
  init: function() {
    this.jsonInit({
    "type": "input",
  "message0": "%1 input %2",
  "args0": [
      {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/debugblack.png",
          "width": 12,
          "height": 12,
          "alt": "saa",
          "flipRtl": false,
            "name":"debug"
        },
    {
      "type": "input_statement",
      "name": "input_var"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
    this.getField('debug').clickHandler_= debugclick;
    var debugconsole =document.createElement("textarea");
    debugconsole.setAttribute("class", "ProjectPromptTemplate");
    debugconsole.setAttribute("style", "width: 100%; height: 100%;display: none");
    debugconsole.setAttribute("readonly", "readonly");
    debugconsole.setAttribute("id", "debug" + this.id);
    document.getElementById("BlockDebugValue").appendChild(debugconsole);
    BlockDebugIDs.push("debug" + this.id);
  }
};
Blockly.Blocks["Output"] = {
  init: function() {
    this.jsonInit({
    "type": "output",
  "message0": "%1 output %2",
  "args0": [
      {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/debugblack.png",
          "width": 12,
          "height": 12,
          "alt": "saa",
          "flipRtl": false,
            "name":"debug"
        },
    {
      "type": "input_statement",
      "name": "Output_var"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
  }
};
Blockly.Blocks["Set_value"] = {
  init: function() {
    this.jsonInit({
    "type": "set_value",
  "message0": "%1 set %2 to %3",
  "args0": [
      {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/debugblack.png",
          "width": 12,
          "height": 12,
          "alt": "saa",
          "flipRtl": false,
            "name":"debug"
        },
    {
      "type": "input_value",
      "name": "variable",
      "align": "CENTRE"
    },
    {
      "type": "input_value",
      "name": "value"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
  }
};
Blockly.Blocks["Append_text"] = {
  init: function() {
    this.jsonInit({
    "type": "Append_text",
  "message0": "%1 %2 append text %3",
  "args0": [
      {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/debugblack.png",
          "width": 12,
          "height": 12,
          "alt": "saa",
          "flipRtl": false,
            "name":"debug"
        },
    {
      "type": "input_value",
      "name": "variable",
      "align": "CENTRE"
    },
    {
      "type": "input_value",
      "name": "value"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
  }
};
Blockly.Blocks["Set_value2_list"] = {
  init: function() {
    this.jsonInit({
    "type": "set_value2_list",
  "message0": "set %1 to list",
  "args0": [
    {
      "type": "input_value",
      "name": "variable",
      "align": "CENTRE"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
  }
};
Blockly.Blocks["For_each"]={
  init: function() {
    this.jsonInit({
    "type": "for_each",
  "message0": "For each item %1 in list %2 do %3",
  "args0": [
    {
      "type": "input_value",
      "name": "Var"
    },
    {
      "type": "input_value",
      "name": "List"
    },
    {
      "type": "input_statement",
      "name": "Func"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "inputsInline": true,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
    });
  }
};
Blockly.Blocks['Model'] = {
  init: function() {
    this.jsonInit({
        "type": "Model",
      "message0": "%1",
      "args0": [
        {
          "type": "field_label_serializable",
          "name": "modelName",
          "text": "gpt-3.5-turbo"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "",
      "helpUrl": "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}"
    });
  },
};
Blockly.Blocks['unit_var'] = {
  init: function() {
    this.jsonInit({
        "type": "unit_var",
      "message0": "%1",
      "args0": [
        {
          "type": "field_input",
          "name": "unit_value",
          "text": ""
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "",
      "helpUrl": "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}"
    });
  }
};
Blockly.Blocks['unit_var_value'] = {
  init: function() {
    this.jsonInit({
        "type": "unit_var_value",
      "message0": "%1",
      "args0": [
        {
          "type": "field_input",
          "name": "unit_value",
          "text": "Unit_Name"
        }
      ],
      "output": null,
      "colour": 230,
      "tooltip": "",
      "helpUrl": "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}"
    });
  }
};
Blockly.Blocks['Prompt_template'] = {
  init: function() {
    this.jsonInit({
        "type": "prompt_template",
        "message0": "Prompt %1 %2 %3 %4 %5",
        "args0": [
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "Prompt_Name",
          "text": "Prompt_Name"
        },
        {
          "type": "input_dummy"
        },
            {
          "type": "field_image",
          // "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          "src": "https://www.promptsapper.tech:8000/sapperenterprise/static/images/plus.png",
          "width": 12,
          "height": 12,
          "alt": "null",
          "flipRtl": false,
            "name":"aspectplus"
        },
        {
          "type": "input_statement",
          "name": "prompt_value"
        }
        ],
        "output": null,
        "colour": 345,
        "tooltip": "",
        "helpUrl": "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}"
    });
    this.getField('aspectplus').clickHandler_= plusaspectclick;
  }
};
Blockly.Blocks['Example'] = {
  init: function() {
    this.jsonInit({
        "type": "example",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "Example_value",
                "options": [
                    ["Instruction", "Instruction"],
                    ["Context", "Context"],
                    ["Examples", "Examples"],
                    ["OutputFormatter", "OutputFormatter"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 90,
        "tooltip": "",
        "helpUrl": ""
    });
  }
};

Blockly.Blocks["Configura_container"] = {
  init: function() {
  this.setStyle("list_blocks");
  this.appendDummyInput().appendField("Configurations");
  this.appendStatementInput("STACK");
  this.contextMenu=!1}
};
Blockly.Blocks['Parallel_Work'] = {
  init: function() {
    this.jsonInit({
      "type": "parallel_work",
      "message0": "Parallel Work %1 %2",
      "args0": [
        {
          "type": "input_dummy"
        },
        {
          "type": "input_statement",
          "name": "workers"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 210,
      "tooltip": "",
      "helpUrl": ""
    });
  }
};
Blockly.Blocks['LLM_Model'] = {
  init: function() {
    this.jsonInit({
        "type": "llm",
       "message0": "Engine %1 %2 %3 Model %4 %5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "LLM_Name",
      "text": "Engine_Name"
    },
    {
      "type": "input_dummy"
    },
      {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "Model",
    },
  ],
  "output": null,
  "colour": 285,
  "tooltip": "",
  "helpUrl": "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}"
    });
    if(this.workspace.id === ModelWorkspace.id){
      this.bindFieldChangeListener()
    }
  },
  bindFieldChangeListener: function () {
    var block = this;
    block.workspace.addChangeListener(function (event) {

      if (event.type === 'change' && event.name === 'LLM_Name' && event.blockId === block.id) {
        // 获取modelName字段的新值
        var currentEnginename = block.getFieldValue('LLM_Name');
        if(document.getElementById('Engine_Name')){
          document.getElementById('Engine_Name').innerText = currentEnginename;
        }
      }
    });
  }
};
Blockly.Blocks['APIEngine'] = {
  init: function() {
    this.jsonInit({
        "type": "llm",
       "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "LLM_Name",
      "text": "PythonREPL"
    },

  ],
  "output": null,
  "colour": 285,
  "tooltip": "",
  "helpUrl": "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}"
    });
  },

};
Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  {
    "type": "prompt_controls_whileUntil",
    "message0": "%1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "MODE",
        "options": [
          ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_WHILE}", "WHILE"],
          ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL}", "UNTIL"]
        ]
      },
      {
        "type": "input_value",
        "name": "BOOL",
        "check": "Boolean"
      }
    ],
    "message1": "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    "args1": [{
      "type": "input_statement",
      "name": "DO"
    }],
    "previousStatement": null,
    "nextStatement": null,
    "style": "logic_blocks",
    "helpUrl": "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}",
    "extensions": ["controls_whileUntil_tooltip"]
  },
  {
    "type": "prompt_boolean",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BOOL",
        "options": [
          ["%{BKY_LOGIC_BOOLEAN_TRUE}", "TRUE"],
          ["%{BKY_LOGIC_BOOLEAN_FALSE}", "FALSE"]
        ]
      }
    ],
    "output": "Boolean",
    "style": "logic_blocks",
    "tooltip": "%{BKY_LOGIC_BOOLEAN_TOOLTIP}",
    "helpUrl": "%{BKY_LOGIC_BOOLEAN_HELPURL}"
  },
  // Block for if/elseif/else condition.
  {
    "type": "prompt_control",
    "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "Boolean"
      }
    ],
    "message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "logic_blocks",
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "mutator": "controls_if_mutator",
    "extensions": ["controls_if_tooltip"]
  },
  // If/else block that does not use a mutator.
  {
    "type": "controls_ifelse",
    "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "Boolean"
      }
    ],
    "message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0"
      }
    ],
    "message2": "%{BKY_CONTROLS_IF_MSG_ELSE} %1",
    "args2": [
      {
        "type": "input_statement",
        "name": "ELSE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "logic_blocks",
    "tooltip": "%{BKYCONTROLS_IF_TOOLTIP_2}",
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "extensions": ["controls_if_tooltip"]
  },
  // Block for comparison operator.
  {
    "type": "prompt_compare",
    "message0": "%1 %2 %3",
    "args0": [
      {
        "type": "input_value",
        "name": "A",

      },
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          ["=", "EQ"],
          ["\u2260", "NEQ"],
          ["\u200F<", "LT"],
          ["\u200F\u2264", "LTE"],
          ["\u200F>", "GT"],
          ["\u200F\u2265", "GTE"]
        ]
      },
      {
        "type": "input_value",
        "name": "B",
      }
    ],
    "inputsInline": true,
    "output": "Boolean",
    "style": "logic_blocks",
    "helpUrl": "%{BKY_LOGIC_COMPARE_HELPURL}",
    "extensions": [ "logic_op_tooltip"]
  },
  // Block for logical operations: 'and', 'or'.
  {
    "type": "prompt_operation",
    "message0": "%1 %2 %3",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "Boolean"
      },
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          ["%{BKY_LOGIC_OPERATION_AND}", "AND"],
          ["%{BKY_LOGIC_OPERATION_OR}", "OR"]
        ]
      },
      {
        "type": "input_value",
        "name": "B",
        "check": "Boolean"
      }
    ],
    "inputsInline": true,
    "output": "Boolean",
    "style": "logic_blocks",
    "helpUrl": "%{BKY_LOGIC_OPERATION_HELPURL}",
    "extensions": ["logic_op_tooltip"]
  },
  // Block for negation.
  {
    "type": "prompt_negate",
    "message0": "%{BKY_LOGIC_NEGATE_TITLE}",
    "args0": [
      {
        "type": "input_value",
        "name": "BOOL",
        "check": "Boolean"
      }
    ],
    "output": "Boolean",
    "style": "logic_blocks",
    "tooltip": "%{BKY_LOGIC_NEGATE_TOOLTIP}",
    "helpUrl": "%{BKY_LOGIC_NEGATE_HELPURL}"
  },
  // Block for null data type.
  {
    "type": "prompt_null",
    "message0": "%{BKY_LOGIC_NULL}",
    "output": null,
    "style": "logic_blocks",
    "tooltip": "%{BKY_LOGIC_NULL_TOOLTIP}",
    "helpUrl": "%{BKY_LOGIC_NULL_HELPURL}"
  },
  // Block for ternary operator.
  {
    "type": "prompt_ternary",
    "message0": "%{BKY_LOGIC_TERNARY_CONDITION} %1",
    "args0": [
      {
        "type": "input_value",
        "name": "IF",
        "check": "Boolean"
      }
    ],
    "message1": "%{BKY_LOGIC_TERNARY_IF_TRUE} %1",
    "args1": [
      {
        "type": "input_value",
        "name": "THEN"
      }
    ],
    "message2": "%{BKY_LOGIC_TERNARY_IF_FALSE} %1",
    "args2": [
      {
        "type": "input_value",
        "name": "ELSE"
      }
    ],
    "output": null,
    "style": "logic_blocks",
    "tooltip": "%{BKY_LOGIC_TERNARY_TOOLTIP}",
    "helpUrl": "%{BKY_LOGIC_TERNARY_HELPURL}",
    "extensions": ["logic_ternary"]
  }
]);

Blockly.defineBlocksWithJsonArray([
  {
    "type": "lists_create_with1",
    "message0": "%{BKY_LISTS_CREATE_EMPTY_TITLE} %1",
    "args0": [
      {
        "type": "input_dummy",
        "name": "EMPTY",
      },
    ],
    "output": "Array",
    "style": "list_blocks",
    "helpUrl": "%{BKY_LISTS_CREATE_WITH_HELPURL}",
    "tooltip": "%{BKY_LISTS_CREATE_WITH_TOOLTIP}",
    "mutator": "new_list_create_with_mutator",
  },
]);

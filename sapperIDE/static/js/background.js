/*
----------------------------------------------------------------------------
Project Name: [Sapper IDE]
File: [background.js]
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

// 初始化变量列表
function initVariables() {
  Code_xmlList = [];
  Variable_xmlList = [];
  PromptList = [];
  PrompttemplateList = [];
  ModelList = [];
  APIEngine = [];
  TraditionEngine = [];
  DIYmodelList = [];
  PromptValues = {};
  ModelValues = {};
  RunPromptValues = {};
  EngineConfigs = {
    'PLUSEngine':{
    'temperature': [0.7, 0.01, 1,'Temperature'],
    'max_tokens': [225, 1,2048,'Maximum length'],
    'top_p': [1, 0.01, 1,'Top P'],
    'frequency_penalty': [0 ,0.01,2,'Frequency penalty'],
    'presence_penalty': [0,0.01,2,'Presence penalty'],
    },
  }
  RunEngineConfigs = {}
  ModelConfigs = {
'text-davinci-003':{
'temperature': [0.7, 0.01, 1,'Temperature'],
'max_tokens': [225, 1,4000,'Maximum length'],
'stop_strs': ['','Stop sequences'],
'top_p': [1, 0.01, 1,'Top P'],
'frequency_penalty': [0 ,0.01,2,'Frequency penalty'],
'presence_penalty': [0,0.01,2,'Presence penalty'],
// 'Best of': [1,1,20],
},
'gpt-3.5-turbo':{
'temperature': [0.7, 0.01, 1,'Temperature'],
'max_tokens': [225, 1,2048,'Maximum length'],
'top_p': [1, 0.01, 1,'Top P'],
'frequency_penalty': [0 ,0.01,2,'Frequency penalty'],
'presence_penalty': [0,0.01,2,'Presence penalty'],
},
'DALL-E':{
'n': [1, 1, 1,'Top P'],
},
};
  RunModelConfigs = {};
  RunPromptAspect = {}
  PromptValue = {'Prompt_Name':[['Instruction', '']]}
  ImportPromptValue = {}
  BlockDebugIDs = ["input_value"]
  DebugFlag = false
  RerunFlag = false
  InputFlag = false
  PromptValues = {};
  PythonPromptValues = {}
  initvariables = []
  recordinput = "preInfo"
  workerindex = 0
  ClarifyConversion = [];
  ExploreConversion = [];
  DesignManager = '';
}
// 初始化IDE界面及其相关功能
function initIDE() {
    ClearExplore()
    document.getElementById('taskNodeDisplay').value = ''
    ClearClarify()
    document.getElementById('Require_display').value = ''
  // 清空blocklyDiv的内容
  document.getElementById("blocklyDiv").innerHTML = "";
  // 创建Blockly工作区
  demoWorkspace = Blockly.inject('blocklyDiv', {
    media: serviceurl + 'static/media/',
    toolbox: document.getElementById('toolbox'),
    collapse: false,
    scrollbars: true,
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    zoom: {
      controls: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    trashcan: true,
  });

  // 初始化变量
  initVariables();
  // 注册回调函数
  demoWorkspace.registerButtonCallback("Create_Prompt", function (d) { show_prompt(); });
  demoWorkspace.registerButtonCallback("Create_Variable", function (d) { create_variable() });
  demoWorkspace.registerButtonCallback("Create_Model", function (d) { show_model(); });
  demoWorkspace.registerToolboxCategoryCallback('Myvariables', myCategoryFlyoutVariableback);
  demoWorkspace.registerToolboxCategoryCallback('DIYPrompt', myCategoryFlyoutDIYCallback);
  demoWorkspace.registerToolboxCategoryCallback('Mymodels', myCategoryFlyoutModelCallback);

  // 更新项目
  update_project(initproject);

  // 添加工作区更改监听器
  demoWorkspace.addChangeListener(ShowPromptEvent);
  // 更新保存项目名称的按钮样式
  document.getElementById("Save_Project_Name").style.width = "110px";
  document.getElementById("Save_Project_Name").innerText = "Undefined Name";
}
// 初始化控制台
function init_console() {
  var eve = document.getElementById("result");
  eve.value = "";
}
uploadfileclick = function () {
    var blockid = this.getSourceBlock().id;
    var c = demoWorkspace.getBlockById(this.getSourceBlock().id)
    var a = document.createElement('input');
    a.type = "file";
    // a.webkitdirectory = true;
    // a.directory = true;
    // a.multiple = true;
    a.click();

    a.addEventListener('change', function(e) {
        var file = e.target.files[0];
        var ProjectName = file.name;
        c.setFieldValue(ProjectName, 'File_Name');
        var reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('debug' + blockid).value = event.target.result;
    };

    reader.onerror = function(event) {
        console.error("File could not be read:", event.target.error);
    };

    reader.readAsText(file);
    })
}

uploadfilesclick = function () {
    var blockid = this.getSourceBlock().id;
    var c = demoWorkspace.getBlockById(this.getSourceBlock().id)
    var a = document.createElement('input');
    a.type = "file";
    a.webkitdirectory = true;
    a.directory = true;
    a.multiple = true;
    a.click();


    a.addEventListener('change', function(e) {
        // var file = e.target.files[0];
        // var ProjectName = file.name;
        // var reader = new FileReader();
        // reader.onload = function(event) {
        // var fileContent = event.target.result;
        // document.getElementById('debug' + blockid).value = fileContent;
        // };
        const files = e.target.files;
        const fileArray = Array.from(files);
        var folderName = 'Fold';
        fileArray.forEach(file => {
            let reader = new FileReader();
            folderName = file.webkitRelativePath.split('/')[0];
            var variableBlock;
            variableBlock = demoWorkspace.newBlock('File');
            variableBlock.initSvg();
            variableBlock.render();
            var FileName = file.name;
            variableBlock.setFieldValue(FileName, 'File_Name');
            var fileid = variableBlock.id;
            reader.onload = function(event) {
                document.getElementById('debug' + fileid).value = event.target.result;
            }
            var d = c.getInput("allFile")
            var connection = d.connection;
            if (connection.targetConnection) {
                var lastBlock = connection.targetConnection.sourceBlock_;
                while (lastBlock.nextConnection && lastBlock.nextConnection.targetConnection) {
                  lastBlock = lastBlock.nextConnection.targetConnection.sourceBlock_;
                }

                if (lastBlock.nextConnection) {
                  lastBlock.nextConnection.connect(variableBlock.previousConnection);
                }
            } else {
                d.connection.connect(variableBlock.previousConnection);
            }

            reader.onerror = function(event) {
                console.error("File could not be read:", event.target.error);
            };

            reader.readAsText(file);
        });
        c.setFieldValue(folderName, 'File_Name');
    })
}

function targt2SPL(id){
    let screenWidth = window.innerWidth ||
                  document.documentElement.clientWidth ||
                  document.body.clientWidth; // 获取屏幕宽度

    let screenHeight = window.innerHeight ||
                       document.documentElement.clientHeight ||
                       document.body.clientHeight; // 获取窗口高度

    let newWindowWidth = screenWidth * 0.5; // 计算屏幕宽度的50%
    let splJson = variableSPL.hasOwnProperty(id) ? variableSPL[id] : '';
    let urlcan = {'posiId': id, 'key': OpenAIKey, 'spl': splJson}
    let url = "https://www.promptsapper.tech/sappercommunity/workspace?sapper=" + encodeURIComponent(JSON.stringify(urlcan));

    let newWindow = window.open(url, "_blank",
                            "width=" + newWindowWidth + ",height=" + screenHeight);
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = event => resolve({ content: event.target.result, name: file.name });
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}

async function uploadflod(blockid) {
    var c = demoWorkspace.getBlockById(blockid)
    var a = document.createElement('input');
    a.type = "file";
    a.webkitdirectory = true;
    a.directory = true;
    a.multiple = true;
    a.click();

    return new Promise((resolve, reject) => {
        a.addEventListener('change', async function(e) {
            const files = e.target.files;
            const fileArray = Array.from(files);
            var folderName = 'Fold';

            try {
                const fileContents = await Promise.all(fileArray.map(file => readFileAsText(file)));

                fileContents.forEach(({ content, name }, index) => {
                    var variableBlock = demoWorkspace.newBlock('File');
                    variableBlock.initSvg();
                    variableBlock.render();
                    variableBlock.setFieldValue(name, 'File_Name');
                    var fileid = variableBlock.id;
                    document.getElementById('debug' + fileid).value = content;

                    var d = c.getInput("allFile")
                    var connection = d.connection;
                    if (connection.targetConnection) {
                        var lastBlock = connection.targetConnection.sourceBlock_;
                        while (lastBlock.nextConnection && lastBlock.nextConnection.targetConnection) {
                          lastBlock = lastBlock.nextConnection.targetConnection.sourceBlock_;
                        }

                        if (lastBlock.nextConnection) {
                          lastBlock.nextConnection.connect(variableBlock.previousConnection);
                        }
                    } else {
                        d.connection.connect(variableBlock.previousConnection);
                    }
                });
                c.setFieldValue(folderName, 'File_Name');
                resolve(fileContents.map(({ content }) => content));
            } catch (err) {
                console.error("File could not be read:", err);
                reject(err);
            }
        })
    });
}

// 添加前置任务点击事件
pluspreworkclick = function () {
  var c = demoWorkspace.getBlockById(this.getSourceBlock().id)
  // var variable_name = prompt("Please enter the variable name", "variable");
  // if (variable_name != null) {
    var variable_name = ''
    var variable0 = Blockly.utils.xml.createElement("block");
    variable0.setAttribute("type", "unit_var");
    var field0 = Blockly.utils.xml.createElement("field");
    field0.setAttribute("name", "unit_value");
    field0.appendChild(Blockly.utils.xml.createTextNode(variable_name));
    variable0.appendChild(field0);
    var block = Blockly.Xml.domToBlock(variable0, demoWorkspace);
    block.initSvg();
    var d = c.getInput("PreWorkers")
        var connection = d.connection;
      if (connection.targetConnection) {
        var lastBlock = connection.targetConnection.sourceBlock_;
        while (lastBlock.nextConnection && lastBlock.nextConnection.targetConnection) {
          lastBlock = lastBlock.nextConnection.targetConnection.sourceBlock_;
        }

        if (lastBlock.nextConnection) {
          lastBlock.nextConnection.connect(block.previousConnection);
        }
      } else {
        d.connection.connect(block.previousConnection);
      }
  // }
}
// plusaspectclick函数
function plusaspectclick() {
    var variableBlock;
    if(this.sourceBlock_.workspace.id === demoWorkspace.id){
        variableBlock = demoWorkspace.newBlock('Example');
        variableBlock.initSvg();
        variableBlock.render();
    }
    else if(this.sourceBlock_.workspace.id === PromptWorkspace.id){
        variableBlock = PromptWorkspace.newBlock('Example');
        variableBlock.initSvg();
        variableBlock.render();
    }
  var connection = this.sourceBlock_.getInput('prompt_value').connection;
  if (connection.targetConnection) {
    var lastBlock = connection.targetConnection.sourceBlock_;
    while (lastBlock.nextConnection && lastBlock.nextConnection.targetConnection) {
      lastBlock = lastBlock.nextConnection.targetConnection.sourceBlock_;
    }

    if (lastBlock.nextConnection) {
      lastBlock.nextConnection.connect(variableBlock.previousConnection);
    }
  } else {
    connection.connect(variableBlock.previousConnection);
  }
}
function plusprompt() {
    var variableBlock;
    if(this.sourceBlock_.workspace.id === demoWorkspace.id){
        variableBlock = demoWorkspace.newBlock('Prompt_template');
        variableBlock.initSvg();
        variableBlock.render();
    }
    else if(this.sourceBlock_.workspace.id === PromptWorkspace.id){
        variableBlock = PromptWorkspace.newBlock('Prompt');
        variableBlock.initSvg();
        variableBlock.render();
    }
  var connection = this.sourceBlock_.getInput('Prompt').connection;
  connection.connect(variableBlock.outputConnection)
}
function plusmodel() {
    var Block;
    if(this.sourceBlock_.workspace.id === demoWorkspace.id){
        Block = demoWorkspace.newBlock('LLM_Model');
        Block.setFieldValue('PLUSEngine', 'LLM_Name');
        Block.initSvg();
        Block.render();
        // Block.setFieldValue('Engine_Name', 'LLM_Name');
        var model = demoWorkspace.newBlock('Model');
        model.initSvg();
        model.render();
        Block.getInput('Model').connection.connect(model.previousConnection)
        var connection = this.sourceBlock_.getInput('Model').connection;
        connection.connect(Block.outputConnection)
    }

}
// 调试点击事件
debugclick = function () {
  var i;
  for (i = 0; i < BlockDebugIDs.length; i++) {
    document.getElementById(BlockDebugIDs[i]).style.display = "none";
  }
  document.getElementById("BlockConsoleOutput").className = "col-6";
  document.getElementById("BlockConsoleDebug").style.display = "block";
  document.getElementById("debug" + this.getSourceBlock().id).style.display = "block";
}

function run_block(){
    document.getElementById("show_promptconsole_button").style.backgroundColor="gainsboro";
    document.getElementById("show_engineconsole_button").style.backgroundColor="gainsboro";
    document.getElementById("show_blockconsole_button").style.backgroundColor="#7c7676";
    document.getElementById("output_value").value = "";
    if(document.getElementById('CodeDiv').style.display === 'none'){
        show_console();
    }
    document.getElementById('PromptConsole').style.display='none';
    document.getElementById('EngineConsole').style.display='none';
    document.getElementById('BlockConsole').style.display='block';
    DebugFlag = false
    run_Function();
}
function debug_block(){
    document.getElementById("show_promptconsole_button").style.backgroundColor="gainsboro";
    document.getElementById("show_engineconsole_button").style.backgroundColor="gainsboro";
    document.getElementById("show_blockconsole_button").style.backgroundColor="#7c7676";
    document.getElementById("output_value").value = "";
    if(document.getElementById('CodeDiv').style.display === 'none'){
        show_console();
    }
    document.getElementById('PromptConsole').style.display='none';
    document.getElementById('EngineConsole').style.display='none';
    document.getElementById('BlockConsole').style.display='block';
    DebugFlag = true
    run_Function();
}
function stop_block(){
    controller.abort()
}
// 将block转为js 代码，并且运行
function run_Function(){
    initvariables = [];
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code_info = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    OpenAIKey = document.getElementById("OpenAIKey").value;
    var i;
    var code = '';
    var newinitvariables = [];
    var myset = new Set(initvariables);//利用了Set结构不能接收重复数据的特点
    for(var val of myset){
        newinitvariables.push(val)
    }
    for(i = 0; i<newinitvariables.length;i++){
        code += "var " + newinitvariables[i] + "='';";
    }
    code_info = code_info.split("#*#*");
    for (i = 1; i < code_info.length; i++) {
        if(code_info[i].includes("Code")){
            code += JSON.parse(code_info[i])["Code"]
        }
    }
    controller = new AbortController();
    signal = controller.signal;
    $('#submit_value').removeAttr('disabled')
    $('#rerun_value').removeAttr('disabled')
    code = "async function asyncRun(){\n"  + code + "}\n" +
        "signal.addEventListener('abort', () => {\n" +
        "  });" +
        "asyncRun().then(() => {\n" +
        "    }).catch((e) => {\n" +
        "    });;";
        console.log(code)
     try {
        eval(code)
    } catch (error) {
         if (error instanceof SyntaxError && error.message.includes('Invalid or unexpected token')) {
            document.getElementById("output_value").value = 'Error: 请检查您的变量命名。确保变量名以字母、美元符号($)或下划线(_)开头，后面可以跟字母、数字、美元符号($)或下划线(_)'
        } else {
            document.getElementById("output_value").value = "Error: " + error
        }

    }
}
// 与后台通信，访问openai 模型
async function run_code(worker,prompt_name, preunits, model,workerid){
    var i;
    for(i=0;i<BlockDebugIDs.length;i++){
        document.getElementById(BlockDebugIDs[i]).style.display = "none";
    }
    document.getElementById("debug" + workerid).style.display = "block";
    var promptparam = getPromptParams(prompt_name);
    var workinput = prompt_name;
    for(i=0;i<promptparam.length;i++){
        workinput = workinput.replaceAll("{{" + promptparam[i] + "}}",preunits[i]);
    }
    document.getElementById("debug" + workerid).value = "";
    document.getElementById("debug" + workerid).value += workinput;
    document.getElementById("BlockConsoleOutput").style.width = "50%";
    document.getElementById("BlockConsoleDebug").style.display = "block";
    demoWorkspace.getBlockById(workerid).getField("debug").setValue( serviceurl + '/static/images/debuggreen.png');
    var send = {}
    if(DebugFlag){
        RerunFlag = true
        document.getElementById('submit_value').style.width = '50%';
        document.getElementById('rerun_value').style.display = 'block';
        document.getElementById("submit_value").style.display = "block";
        document.getElementById("debug" + workerid).readOnly = false;
        let input;
        while (!input) {
            input = await getInput(workerid);
        }
        send["debugvalue"] = input;
        while(RerunFlag){
            document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
            if(prompt_name !== ""){
                new Promise(resolve=>{
                    $('#submit_value').attr('disabled','disabled')
                    $('#rerun_value').attr('disabled','disabled')
                    send["action"] = "run_Function";
                    send["prompt_name"] = prompt_name;
                    send["preunits"] = "#*#*" + preunits.join("#*#*");
                    send["model"] = model;
                    send["OpenAIKey"] = OpenAIKey;
                  $.ajax({
                    async:true,
                    url: serviceurl + 'SapperUnit',//'https://www.jxselab.com:5000/'
                    type: 'POST',
                    data: {
                        "senddata": JSON.stringify(send),
                        csrfmiddlewaretoken: '{{ csrf_token }}'
                    }}).done(function (data) {
                        data = JSON.parse(data)
                       $('#submit_value').removeAttr('disabled')
                        $('#rerun_value').removeAttr('disabled')
                        if(Object.keys(data).indexOf('error') !== -1){
                            document.getElementById("debug" + workerid).value += data['error'];
                            demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                            demoWorkspace.getBlockById(workerid).getField("debug").setValue( serviceurl + 'static/images/debugred.png');
                            RerunFlag = false;
                            controller.abort()
                            resolve(data.error);
                        }
                        else{
                        document.getElementById("debug" + workerid).value += data['message'];
                        if(data['type'] === 'image'){
                            $('.ImageConsole').append(`
                            <div class="position-absolute draggable-img" style="width: 150px; height: 150px; cursor: move;right: 10px;top: 10px">
                                  <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                                  <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                             </div>
                            `)
                            $(".draggable-img").draggable();
                            // Delete the div when the delete button is clicked
                            $(".delete-btn-image").click(function() {
                              $(this).parent().remove()
                            });
                        }
                        resolve(data.message);}
                    });
                })
            }
            input = '';
            while (!input) {
                input = await getInput(workerid);
            }
            input = input.split("\nRunning-------------------------\n")[0]
            document.getElementById("debug" + workerid).value = input
            send["debugvalue"] = input;
        }
    }
    document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
    if(prompt_name !== ""){
        return new Promise(resolve=>{
            $('#submit_value').attr('disabled','disabled')
            $('#rerun_value').attr('disabled','disabled')
            send["action"] = "run_Function";
            send["prompt_name"] = prompt_name;
            send["preunits"] = "#*#*" + preunits.join("#*#*");
            send["model"] = model;
            send["OpenAIKey"] = OpenAIKey;
          $.ajax({
            async:true,
            url:serviceurl + 'SapperUnit',//'https://www.jxselab.com:5000/'
            type: 'POST',
            data: {
                "senddata": JSON.stringify(send),
                csrfmiddlewaretoken: '{{ csrf_token }}'
            }}).done(function (data) {
                data = JSON.parse(data)
              $('#submit_value').removeAttr('disabled')
              $('#rerun_value').removeAttr('disabled')
                if(Object.keys(data).indexOf('error') !== -1){
                    document.getElementById("debug" + workerid).value += data['error'];
                    demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                    controller.abort()
                    resolve(data.error);
                }
                else{
                document.getElementById("debug" + workerid).value += data['message'];
                if(data['type'] === 'image'){
                    $('#ImageConsole').append(`
                    <div class="position-absolute draggable-img" style="width: 150px; height: 150px; cursor: move;right: 10px;top: 10px">
                          <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                          <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                     </div>
                    `)
                    $(".draggable-img").draggable();
                    // Delete the div when the delete button is clicked
                    $(".delete-btn-image").click(function() {
                      $(this).parent().remove()
                    });
                }
                demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');
                document.getElementById('rerun_value').style.display = 'none';
                document.getElementById('submit_value').style.width = '100%';
                resolve(data.message);}
            });
        });
    }
}
// 与后台通信，访问python
async function run_PythonREPL(worker,prompt_name, preunits, model,workerid){
    var i;
    for(i=0;i<BlockDebugIDs.length;i++){
        document.getElementById(BlockDebugIDs[i]).style.display = "none";
    }
    document.getElementById("debug" + workerid).style.display = "block";
    var promptparam = getPromptParams(prompt_name);
    var workinput = prompt_name;
    for(i=0;i<promptparam.length;i++){
        workinput = workinput.replace("{{" + promptparam[i] + "}}",preunits[i]);
    }
    document.getElementById("debug" + workerid).value = ""
    document.getElementById("debug" + workerid).value +=workinput;
    document.getElementById("BlockConsoleOutput").style.width = "50%";
    document.getElementById("BlockConsoleDebug").style.display = "block";
    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debuggreen.png');
    var send = {};
    if(DebugFlag){
        RerunFlag = true;
        document.getElementById('submit_value').style.width = '50%';
        document.getElementById('rerun_value').style.display = 'block';
        document.getElementById("submit_value").style.display = "block";
        let input;
        while (!input) {
            input = await getInput(workerid);
        }
        send["debugvalue"] = input;
        while(RerunFlag){
            document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
            if(prompt_name !== ""){
                return new Promise(resolve=>{
                    $('#submit_value').attr('disabled','disabled')
                    $('#rerun_value').attr('disabled','disabled')
                    send["action"] = "run_PythonREPL";
                    send["prompt_name"] = prompt_name;
                    send["preunits"] = "#*#*" + preunits.join("#*#*");
                    send["model"] = model;
                  $.ajax({
                    async:true,
                    url:serviceurl + 'SapperUnit',
                    type: 'POST',
                    data: {
                        "senddata": JSON.stringify(send),
                    }}).done(function (data) {
                        data = JSON.parse(data)
                        $('#submit_value').removeAttr('disabled')
                        $('#rerun_value').removeAttr('disabled')
                        if(Object.keys(data).indexOf('error') !== -1){
                            document.getElementById("debug" + workerid).value += data["error"];
                            demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                            demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                            RerunFlag = false
                            controller.abort()
                            resolve(data.error);
                        }else {
                            if(data['type'] === 'image'){
                                $('.ImageConsole').append(`
                                <div class="position-absolute draggable-img" style="width: 150px; height: 150px; cursor: move;right: 10px;top: 10px">
                                      <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                                      <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                                 </div>
                                `)
                                $(".draggable-img").draggable();
                                // Delete the div when the delete button is clicked
                                $(".delete-btn-image").click(function() {
                                  $(this).parent().remove()
                                });
                            }
                        document.getElementById("debug" + workerid).value += data["message"];
                        resolve(data.message);}
                    });
                });
            }
            input = '';
            while (!input) {
                input = await getInput(workerid);
            }
            input = input.split("\nRunning-------------------------\n")[0]
            document.getElementById("debug" + workerid).value = input
            send["debugvalue"] = input;
        }
    }
    document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
    if(prompt_name !== ""){
        return new Promise(resolve=>{
            $('#submit_value').attr('disabled','disabled')
            $('#rerun_value').attr('disabled','disabled')
            send["action"] = "run_PythonREPL";
            send["prompt_name"] = prompt_name;
            send["preunits"] = "#*#*" + preunits.join("#*#*");
            send["model"] = model;
          $.ajax({
            async:true,
            url:serviceurl + 'SapperUnit',
            type: 'POST',
            data: {
                "senddata": JSON.stringify(send),
            }}).done(function (data) {
                data = JSON.parse(data)
                $('#submit_value').removeAttr('disabled')
                $('#rerun_value').removeAttr('disabled')
                if(Object.keys(data).indexOf('error') !== -1){
                    document.getElementById("debug" + workerid).value += data["error"];
                    demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl +"static/images/debugred.png";
                    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                    controller.abort()
                    resolve(data.error);
                }else {
                document.getElementById("debug" + workerid).value += data["message"];
                if(data['type'] === 'image'){
                    $('.ImageConsole').append(`
                    <div class="position-absolute draggable-img" style="width: 150px; height: 150px; cursor: move;right: 10px;top: 10px">
                          <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                          <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                     </div>
                    `)
                    $(".draggable-img").draggable();
                    // Delete the div when the delete button is clicked
                    $(".delete-btn-image").click(function() {
                      $(this).parent().remove()
                    });
                }
                demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl +"static/images/debugblack.png";
                demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');
                document.getElementById('rerun_value').style.display = 'none';
                document.getElementById('submit_value').style.width = '100%';
                resolve(data.message);}
            });
        });
    }
}

async function run_GetMovieReview(worker,prompt_name, preunits, model,workerid){
    var i;
    for(i=0;i<BlockDebugIDs.length;i++){
        document.getElementById(BlockDebugIDs[i]).style.display = "none";
    }
    document.getElementById("debug" + workerid).style.display = "block";
    var promptparam = getPromptParams(prompt_name);
    var workinput = prompt_name;
    for(i=0;i<promptparam.length;i++){
        workinput = workinput.replace("{{" + promptparam[i] + "}}",preunits[i]);
    }
    document.getElementById("debug" + workerid).value = ""
    document.getElementById("debug" + workerid).value +=workinput;
    document.getElementById("BlockConsoleOutput").style.width = "50%";
    document.getElementById("BlockConsoleDebug").style.display = "block";
    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debuggreen.png');
    var send = {};
    if(DebugFlag){
        RerunFlag = true;
        document.getElementById('submit_value').style.width = '50%';
        document.getElementById('rerun_value').style.display = 'block';
        document.getElementById("submit_value").style.display = "block";
        let input;
        while (!input) {
            input = await getInput(workerid);
        }
        send["debugvalue"] = input;
        while(RerunFlag){
            document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
            if(prompt_name !== ""){
                return new Promise(resolve=>{
                    $('#submit_value').attr('disabled','disabled')
                    $('#rerun_value').attr('disabled','disabled')
                    send["action"] = "GetMovieReview";
                    send["prompt_name"] = prompt_name;
                    send["preunits"] = "#*#*" + preunits.join("#*#*");
                    send["model"] = model;
                  $.ajax({
                    async:true,
                    url:serviceurl + 'SapperUnit',
                    type: 'POST',
                    data: {
                        "senddata": JSON.stringify(send),
                    }}).done(function (data) {
                        data = JSON.parse(data)
                        $('#submit_value').removeAttr('disabled')
                        $('#rerun_value').removeAttr('disabled')
                        if(Object.keys(data).indexOf('error') !== -1){
                            document.getElementById("debug" + workerid).value += data["error"];
                            demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                            demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                            RerunFlag = false
                            controller.abort()
                            resolve(data.error);
                        }else {
                            if(data['type'] === 'image'){
                                $('.ImageConsole').append(`
                                <div class="position-absolute draggable-img" style="width: 300px; height: 300px; cursor: move;right: 10px;top: 10px">
                                      <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                                      <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                                 </div>
                                `)
                                $(".draggable-img").draggable();
                                // Delete the div when the delete button is clicked
                                $(".delete-btn-image").click(function() {
                                  $(this).parent().remove()
                                });
                            }
                        document.getElementById("debug" + workerid).value += data["message"];
                        resolve(data.message);}
                    });
                });
            }
            input = '';
            while (!input) {
                input = await getInput(workerid);
            }
            input = input.split("\nRunning-------------------------\n")[0]
            document.getElementById("debug" + workerid).value = input
            send["debugvalue"] = input;
        }
    }
    document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
    if(prompt_name !== ""){
        return new Promise(resolve=>{
            $('#submit_value').attr('disabled','disabled')
            $('#rerun_value').attr('disabled','disabled')
            send["action"] = "GetMovieReview";
            send["prompt_name"] = prompt_name;
            send["preunits"] = "#*#*" + preunits.join("#*#*");
            send["model"] = model;
            console.log(send)
          $.ajax({
            async:true,
            url:serviceurl + 'SapperUnit',
            type: 'POST',
            data: {
                "senddata": JSON.stringify(send),
            }}).done(function (data) {
                data = JSON.parse(data)
                $('#submit_value').removeAttr('disabled')
                $('#rerun_value').removeAttr('disabled')
                if(Object.keys(data).indexOf('error') !== -1){
                    document.getElementById("debug" + workerid).value += data["error"];
                    demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl +"static/images/debugred.png";
                    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                    controller.abort()
                    resolve(data.error);
                }else {
                document.getElementById("debug" + workerid).value += data["message"];
                if(data['type'] === 'image'){
                    $('.ImageConsole').append(`
                    <div class="position-absolute draggable-img" style="width: 300px; height: 300px; cursor: move;right: 10px;top: 10px">
                          <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                          <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                     </div>
                    `)
                    $(".draggable-img").draggable();
                    // Delete the div when the delete button is clicked
                    $(".delete-btn-image").click(function() {
                      $(this).parent().remove()
                    });
                }
                demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl +"static/images/debugblack.png";
                demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');
                document.getElementById('rerun_value').style.display = 'none';
                document.getElementById('submit_value').style.width = '100%';
                resolve(data.message);}
            });
        });
    }
}

async function run_paperresearch(worker,prompt_name, preunits, model,workerid){
    var i;
    for(i=0;i<BlockDebugIDs.length;i++){
        document.getElementById(BlockDebugIDs[i]).style.display = "none";
    }
    document.getElementById("debug" + workerid).style.display = "block";
    var promptparam = getPromptParams(prompt_name);
    var workinput = prompt_name;
    for(i=0;i<promptparam.length;i++){
        workinput = workinput.replace("{{" + promptparam[i] + "}}",preunits[i]);
    }
    document.getElementById("debug" + workerid).value = ""
    document.getElementById("debug" + workerid).value +=workinput;
    document.getElementById("BlockConsoleOutput").style.width = "50%";
    document.getElementById("BlockConsoleDebug").style.display = "block";
    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debuggreen.png');
    var send = {};
    if(DebugFlag){
        RerunFlag = true;
        document.getElementById('submit_value').style.width = '50%';
        document.getElementById('rerun_value').style.display = 'block';
        document.getElementById("submit_value").style.display = "block";
        let input;
        while (!input) {
            input = await getInput(workerid);
        }
        send["debugvalue"] = input;
        while(RerunFlag){
            document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
            if(prompt_name !== ""){
                return new Promise(resolve=>{
                    $('#submit_value').attr('disabled','disabled')
                    $('#rerun_value').attr('disabled','disabled')
                    send["action"] = "paperresearch";
                    send["prompt_name"] = prompt_name;
                    send["preunits"] = "#*#*" + preunits.join("#*#*");
                    send["model"] = model;
                  $.ajax({
                    async:true,
                    url:serviceurl + 'SapperUnit',
                    type: 'POST',
                    data: {
                        "senddata": JSON.stringify(send),
                    }}).done(function (data) {
                        data = JSON.parse(data)
                        $('#submit_value').removeAttr('disabled')
                        $('#rerun_value').removeAttr('disabled')
                        if(Object.keys(data).indexOf('error') !== -1){
                            document.getElementById("debug" + workerid).value += data["error"];
                            demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                            demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                            RerunFlag = false
                            controller.abort()
                            resolve(data.error);
                        }else {
                            if(data['type'] === 'image'){
                                $('.ImageConsole').append(`
                                <div class="position-absolute draggable-img" style="width: 300px; height: 300px; cursor: move;right: 10px;top: 10px">
                                      <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                                      <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                                 </div>
                                `)
                                $(".draggable-img").draggable();
                                // Delete the div when the delete button is clicked
                                $(".delete-btn-image").click(function() {
                                  $(this).parent().remove()
                                });
                            }
                        document.getElementById("debug" + workerid).value += data["message"];
                        resolve(data.message);}
                    });
                });
            }
            input = '';
            while (!input) {
                input = await getInput(workerid);
            }
            input = input.split("\nRunning-------------------------\n")[0]
            document.getElementById("debug" + workerid).value = input
            send["debugvalue"] = input;
        }
    }
    document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
    if(prompt_name !== ""){
        return new Promise(resolve=>{
            $('#submit_value').attr('disabled','disabled')
            $('#rerun_value').attr('disabled','disabled')
            send["action"] = "paperresearch";
            send["prompt_name"] = prompt_name;
            send["preunits"] = "#*#*" + preunits.join("#*#*");
            send["model"] = model;
            console.log(send)
          $.ajax({
            async:true,
            url:serviceurl + 'SapperUnit',
            type: 'POST',
            data: {
                "senddata": JSON.stringify(send),
            }}).done(function (data) {
                data = JSON.parse(data)
                $('#submit_value').removeAttr('disabled')
                $('#rerun_value').removeAttr('disabled')
                if(Object.keys(data).indexOf('error') !== -1){
                    document.getElementById("debug" + workerid).value += data["error"];
                    demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl +"static/images/debugred.png";
                    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                    controller.abort()
                    resolve(data.error);
                }else {
                document.getElementById("debug" + workerid).value += data["message"];
                if(data['type'] === 'image'){
                    $('.ImageConsole').append(`
                    <div class="position-absolute draggable-img" style="width: 300px; height: 300px; cursor: move;right: 10px;top: 10px">
                          <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                          <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                     </div>
                    `)
                    $(".draggable-img").draggable();
                    // Delete the div when the delete button is clicked
                    $(".delete-btn-image").click(function() {
                      $(this).parent().remove()
                    });
                }
                demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl +"static/images/debugblack.png";
                demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');
                document.getElementById('rerun_value').style.display = 'none';
                document.getElementById('submit_value').style.width = '100%';
                resolve(data.message);}
            });
        });
    }
}

async function run_paperextract(worker,prompt_name, preunits, model,workerid){
    var i;
    for(i=0;i<BlockDebugIDs.length;i++){
        document.getElementById(BlockDebugIDs[i]).style.display = "none";
    }
    document.getElementById("debug" + workerid).style.display = "block";
    var promptparam = getPromptParams(prompt_name);
    var workinput = prompt_name;
    for(i=0;i<promptparam.length;i++){
        workinput = workinput.replace("{{" + promptparam[i] + "}}",preunits[i]);
    }
    document.getElementById("debug" + workerid).value = ""
    document.getElementById("debug" + workerid).value +=workinput;
    document.getElementById("BlockConsoleOutput").style.width = "50%";
    document.getElementById("BlockConsoleDebug").style.display = "block";
    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debuggreen.png');
    var send = {};
    if(DebugFlag){
        RerunFlag = true;
        document.getElementById('submit_value').style.width = '50%';
        document.getElementById('rerun_value').style.display = 'block';
        document.getElementById("submit_value").style.display = "block";
        let input;
        while (!input) {
            input = await getInput(workerid);
        }
        send["debugvalue"] = input;
        while(RerunFlag){
            document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
            if(prompt_name !== ""){
                return new Promise(resolve=>{
                    $('#submit_value').attr('disabled','disabled')
                    $('#rerun_value').attr('disabled','disabled')
                    send["action"] = "papersummary";
                    send["prompt_name"] = prompt_name;
                    send["preunits"] = "#*#*" + preunits.join("#*#*");
                    send["model"] = model;
                    send["OpenAIKey"] = OpenAIKey;
                  $.ajax({
                    async:true,
                    url:serviceurl + 'SapperUnit',
                    type: 'POST',
                    data: {
                        "senddata": JSON.stringify(send),
                    }}).done(function (data) {
                        data = JSON.parse(data)
                        $('#submit_value').removeAttr('disabled')
                        $('#rerun_value').removeAttr('disabled')
                        if(Object.keys(data).indexOf('error') !== -1){
                            document.getElementById("debug" + workerid).value += data["error"];
                            demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                            demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                            RerunFlag = false
                            controller.abort()
                            resolve(data.error);
                        }else {
                            if(data['type'] === 'image'){
                                $('.ImageConsole').append(`
                                <div class="position-absolute draggable-img" style="width: 300px; height: 300px; cursor: move;right: 10px;top: 10px">
                                      <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                                      <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                                 </div>
                                `)
                                $(".draggable-img").draggable();
                                // Delete the div when the delete button is clicked
                                $(".delete-btn-image").click(function() {
                                  $(this).parent().remove()
                                });
                            }
                        document.getElementById("debug" + workerid).value += data["message"];
                        resolve(data.message);}
                    });
                });
            }
            input = '';
            while (!input) {
                input = await getInput(workerid);
            }
            input = input.split("\nRunning-------------------------\n")[0]
            document.getElementById("debug" + workerid).value = input
            send["debugvalue"] = input;
        }
    }
    document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
    if(prompt_name !== ""){
        return new Promise(resolve=>{
            $('#submit_value').attr('disabled','disabled')
            $('#rerun_value').attr('disabled','disabled')
            send["action"] = "papersummary";
            send["prompt_name"] = prompt_name;
            send["preunits"] = "#*#*" + preunits.join("#*#*");
            send["model"] = model;
            send["OpenAIKey"] = OpenAIKey;
            console.log(send)
          $.ajax({
            async:true,
            url:serviceurl + 'SapperUnit',
            type: 'POST',
            data: {
                "senddata": JSON.stringify(send),
            }}).done(function (data) {
                data = JSON.parse(data)
                $('#submit_value').removeAttr('disabled')
                $('#rerun_value').removeAttr('disabled')
                if(Object.keys(data).indexOf('error') !== -1){
                    document.getElementById("debug" + workerid).value += data["error"];
                    demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl +"static/images/debugred.png";
                    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                    controller.abort()
                    resolve(data.error);
                }else {
                document.getElementById("debug" + workerid).value += data["message"];
                if(data['type'] === 'image'){
                    $('.ImageConsole').append(`
                    <div class="position-absolute draggable-img" style="width: 300px; height: 300px; cursor: move;right: 10px;top: 10px">
                          <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                          <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                     </div>
                    `)
                    $(".draggable-img").draggable();
                    // Delete the div when the delete button is clicked
                    $(".delete-btn-image").click(function() {
                      $(this).parent().remove()
                    });
                }
                demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl +"static/images/debugblack.png";
                demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');
                document.getElementById('rerun_value').style.display = 'none';
                document.getElementById('submit_value').style.width = '100%';
                resolve(data.message);}
            });
        });
    }
}
async function run_DataPlotting(worker,prompt_name, preunits, model,workerid){
    var i;
    for(i=0;i<BlockDebugIDs.length;i++){
        document.getElementById(BlockDebugIDs[i]).style.display = "none";
    }
    document.getElementById("debug" + workerid).style.display = "block";
    var promptparam = getPromptParams(prompt_name);
    var workinput = prompt_name;
    for(i=0;i<promptparam.length;i++){
        workinput = workinput.replace("{{" + promptparam[i] + "}}",preunits[i]);
    }
    document.getElementById("debug" + workerid).value = "";
    document.getElementById("debug" + workerid).value += workinput;
    document.getElementById("BlockConsoleOutput").style.width = "50%";
    document.getElementById("BlockConsoleDebug").style.display = "block";
    demoWorkspace.getBlockById(workerid).getField("debug").setValue( serviceurl + '/static/images/debuggreen.png');
    var send = {}
    if(DebugFlag){
        RerunFlag = true
        document.getElementById('submit_value').style.width = '50%';
        document.getElementById('rerun_value').style.display = 'block';
        document.getElementById("submit_value").style.display = "block";
        document.getElementById("debug" + workerid).readOnly = false;
        let input;
        while (!input) {
            input = await getInput(workerid);
        }
        send["debugvalue"] = input;
        while(RerunFlag){
            document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
            if(prompt_name !== ""){
                new Promise(resolve=>{
                    $('#submit_value').attr('disabled','disabled')
                    $('#rerun_value').attr('disabled','disabled')
                    send["action"] = "DrawData";
                    send["prompt_name"] = prompt_name;
                    send["preunits"] = "#*#*" + preunits.join("#*#*");
                    send["model"] = model;
                    send["OpenAIKey"] = OpenAIKey;
                  $.ajax({
                    async:true,
                    url: serviceurl + 'SapperUnit',//'https://www.jxselab.com:5000/'
                    type: 'POST',
                    data: {
                        "senddata": JSON.stringify(send),
                        csrfmiddlewaretoken: '{{ csrf_token }}'
                    }}).done(function (data) {
                        data = JSON.parse(data)
                       $('#submit_value').removeAttr('disabled')
                        $('#rerun_value').removeAttr('disabled')
                        if(Object.keys(data).indexOf('error') !== -1){
                            document.getElementById("debug" + workerid).value += data['error'];
                            demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                            demoWorkspace.getBlockById(workerid).getField("debug").setValue( serviceurl + 'static/images/debugred.png');
                            RerunFlag = false;
                            controller.abort()
                            resolve(data.error);
                        }
                        else{
                        document.getElementById("debug" + workerid).value += data['message'];
                        if(data['type'] === 'image'){
                            $('.ImageConsole').append(`
                            <div class="position-absolute draggable-img" style="width: 650px; height: 400px; cursor: move;right: 10px;top: 10px">
                                  <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                                  <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                             </div>
                            `)
                            $(".draggable-img").draggable();
                            // Delete the div when the delete button is clicked
                            $(".delete-btn-image").click(function() {
                              $(this).parent().remove()
                            });
                        }
                        resolve(data.message);}
                    });
                })
            }
            input = '';
            while (!input) {
                input = await getInput(workerid);
            }
            input = input.split("\nRunning-------------------------\n")[0]
            document.getElementById("debug" + workerid).value = input
            send["debugvalue"] = input;
        }
    }
    document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
    if(prompt_name !== ""){
        return new Promise(resolve=>{
            $('#submit_value').attr('disabled','disabled')
            $('#rerun_value').attr('disabled','disabled')
            send["action"] = "DrawData";
            send["prompt_name"] = prompt_name;
            send["preunits"] = "#*#*" + preunits.join("#*#*");
            send["model"] = model;
            send["OpenAIKey"] = OpenAIKey;
          $.ajax({
            async:true,
            url:serviceurl + 'SapperUnit',//'https://www.jxselab.com:5000/'
            type: 'POST',
            data: {
                "senddata": JSON.stringify(send),
                csrfmiddlewaretoken: '{{ csrf_token }}'
            }}).done(function (data) {
                data = JSON.parse(data)
              $('#submit_value').removeAttr('disabled')
              $('#rerun_value').removeAttr('disabled')
                if(Object.keys(data).indexOf('error') !== -1){
                    document.getElementById("debug" + workerid).value += data['error'];
                    demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                    controller.abort()
                    resolve(data.error);
                }
                else{
                document.getElementById("debug" + workerid).value += data['message'];
                if(data['type'] === 'image'){
                    $('#ImageConsole').append(`
                    <div class="position-absolute draggable-img" style="width: 650px; height: 400px; cursor: move;right: 10px;top: 10px">
                          <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                          <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                     </div>
                    `)
                    $(".draggable-img").draggable();
                    // Delete the div when the delete button is clicked
                    $(".delete-btn-image").click(function() {
                      $(this).parent().remove()
                    });
                }
                demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');
                document.getElementById('rerun_value').style.display = 'none';
                document.getElementById('submit_value').style.width = '100%';
                resolve(data.message);}
            });
        });
    }
}
async function run_paperplotting(worker,prompt_name, preunits, model,workerid){
    var i;
    for(i=0;i<BlockDebugIDs.length;i++){
        document.getElementById(BlockDebugIDs[i]).style.display = "none";
    }
    document.getElementById("debug" + workerid).style.display = "block";
    var promptparam = getPromptParams(prompt_name);
    var workinput = prompt_name;
    for(i=0;i<promptparam.length;i++){
        workinput = workinput.replace("{{" + promptparam[i] + "}}",preunits[i]);
    }
    document.getElementById("debug" + workerid).value = "";
    document.getElementById("debug" + workerid).value += workinput;
    document.getElementById("BlockConsoleOutput").style.width = "50%";
    document.getElementById("BlockConsoleDebug").style.display = "block";
    demoWorkspace.getBlockById(workerid).getField("debug").setValue( serviceurl + '/static/images/debuggreen.png');
    var send = {}
    if(DebugFlag){
        RerunFlag = true
        document.getElementById('submit_value').style.width = '50%';
        document.getElementById('rerun_value').style.display = 'block';
        document.getElementById("submit_value").style.display = "block";
        document.getElementById("debug" + workerid).readOnly = false;
        let input;
        while (!input) {
            input = await getInput(workerid);
        }
        send["debugvalue"] = input;
        while(RerunFlag){
            document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
            if(prompt_name !== ""){
                new Promise(resolve=>{
                    $('#submit_value').attr('disabled','disabled')
                    $('#rerun_value').attr('disabled','disabled')
                    send["action"] = "paperplotting";
                    send["prompt_name"] = prompt_name;
                    send["preunits"] = "#*#*" + preunits.join("#*#*");
                    send["model"] = model;
                    send["OpenAIKey"] = OpenAIKey;
                  $.ajax({
                    async:true,
                    url: serviceurl + 'SapperUnit',//'https://www.jxselab.com:5000/'
                    type: 'POST',
                    data: {
                        "senddata": JSON.stringify(send),
                        csrfmiddlewaretoken: '{{ csrf_token }}'
                    }}).done(function (data) {
                        data = JSON.parse(data)
                       $('#submit_value').removeAttr('disabled')
                        $('#rerun_value').removeAttr('disabled')
                        if(Object.keys(data).indexOf('error') !== -1){
                            document.getElementById("debug" + workerid).value += data['error'];
                            demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                            demoWorkspace.getBlockById(workerid).getField("debug").setValue( serviceurl + 'static/images/debugred.png');
                            RerunFlag = false;
                            controller.abort()
                            resolve(data.error);
                        }
                        else{
                        document.getElementById("debug" + workerid).value += data['message'];
                        if(data['type'] === 'image'){
                            $('.ImageConsole').append(`
                            <div class="position-absolute draggable-img" style="width: 1500px; height: 800px; cursor: move;right: 10px;top: 10px">
                                  <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                                  <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                             </div>
                            `)
                            $(".draggable-img").draggable();
                            // Delete the div when the delete button is clicked
                            $(".delete-btn-image").click(function() {
                              $(this).parent().remove()
                            });
                        }
                        resolve(data.message);}
                    });
                })
            }
            input = '';
            while (!input) {
                input = await getInput(workerid);
            }
            input = input.split("\nRunning-------------------------\n")[0]
            document.getElementById("debug" + workerid).value = input
            send["debugvalue"] = input;
        }
    }
    document.getElementById("debug" + workerid).value += "\nRunning-------------------------\n"
    if(prompt_name !== ""){
        return new Promise(resolve=>{
            $('#submit_value').attr('disabled','disabled')
            $('#rerun_value').attr('disabled','disabled')
            send["action"] = "paperplotting";
            send["prompt_name"] = prompt_name;
            send["preunits"] = "#*#*" + preunits.join("#*#*");
            send["model"] = model;
            send["OpenAIKey"] = OpenAIKey;
          $.ajax({
            async:true,
            url:serviceurl + 'SapperUnit',//'https://www.jxselab.com:5000/'
            type: 'POST',
            data: {
                "senddata": JSON.stringify(send),
                csrfmiddlewaretoken: '{{ csrf_token }}'
            }}).done(function (data) {
                data = JSON.parse(data)
              $('#submit_value').removeAttr('disabled')
              $('#rerun_value').removeAttr('disabled')
                if(Object.keys(data).indexOf('error') !== -1){
                    document.getElementById("debug" + workerid).value += data['error'];
                    demoWorkspace.getBlockById(workerid).inputList[0].fieldRow[0].value_ = serviceurl + "static/images/debugred.png";
                    demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugred.png');
                    controller.abort()
                    resolve(data.error);
                }
                else{
                document.getElementById("debug" + workerid).value += data['message'];
                if(data['type'] === 'image'){
                    $('#ImageConsole').append(`
                    <div class="position-absolute draggable-img" style="width: 1500px; height: 800px; cursor: move;right: 10px;top: 10px">
                          <img src="${data['message']}" alt="Your Image" class="img-thumbnail" style="width: 100%; height: 100%;">
                          <button type="button" class="btn btn-danger btn-sm position-absolute delete-btn-image" style="top: -5px; right: -5px;">&times;</button>
                     </div>
                    `)
                    $(".draggable-img").draggable();
                    // Delete the div when the delete button is clicked
                    $(".delete-btn-image").click(function() {
                      $(this).parent().remove()
                    });
                }
                demoWorkspace.getBlockById(workerid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');
                document.getElementById('rerun_value').style.display = 'none';
                document.getElementById('submit_value').style.width = '100%';
                resolve(data.message);}
            });
        });
    }
}
function download_value(filename, value){
  var data = new Blob([value]);
  var clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
  });
  var a = document.createElement('a');
  a.href = window.URL.createObjectURL(data);
  a.download = filename + ".txt";
  a.textContent = 'Download file!';
  a.dispatchEvent(clickEvent);
}
/**
用于生成提示信息的函数
@param {string} prompt_name - 提示名称
@param {array} prompt_context - 提示上下文信息
@return {string} - 生成的提示信息
*/
function prompt_template(prompt_name, prompt_context){
    // 初始化 promptvalue 为空字符串
    var promptvalue = '';
    // 循环遍历提示上下文信息，根据提示名称和上下文信息生成提示信息并添加到 promptvalue 中
    for(var i = 0; i < prompt_context.length; i++){
        // 获取提示名称和上下文信息对应的值，并将其添加到 promptvalue 中
        promptvalue += RunPromptAspect[prompt_context[i]][1] + "\n";
    }
    // 返回生成的提示信息
    return promptvalue;
}
/**
 * Asynchronously prompts the user to input a value and returns it.
 *
 * @param {string} info - A description of the value being requested.
 * @param {string} blockid - The ID of the block associated with the value being requested.
 * @returns {Promise} - A promise that resolves with the user's input.
 */
async function input_value(info, blockid) {
  // Set a flag to indicate that the user is currently being prompted for input.
  InputFlag = true;

  // Hide any previously displayed debug information.
  for (var i = 0; i < BlockDebugIDs.length; i++) {
    document.getElementById(BlockDebugIDs[i]).style.display = "none";
  }

  // Adjust the layout of the debugging console to display the input prompt.
  document.getElementById('BlockConsoleOutput').style.width = '50%';
  document.getElementById("BlockConsoleDebug").style.display = "block";
  // document.getElementById('BlockDebugValue').style.height = document.getElementById('BlockDebugValue').getAttribute("debugheight");

  // Display the input prompt.
  var inputvalue = document.getElementById("debug" + blockid);
  inputvalue.value = "";
  inputvalue.style.display = 'block';
  inputvalue.readOnly = false;

  // Disable the proceed button while the user is being prompted for input.
  const proceedButton = document.getElementById("submit_value");
  const blockDebugValue = document.getElementById("BlockDebugValue");
  proceedButton.style.display = "block";
  blockDebugValue.style.height = "calc(100% - 22px)";

  // Set the placeholder text for the input field.
  inputvalue.setAttribute("placeholder", "please input the value of " + info + "...");

  // Display a green debug icon to indicate that input is being awaited.
  demoWorkspace.getBlockById(blockid).getField("debug").setValue(serviceurl + 'static/images/debuggreen.png');

  // Wait for the user to submit their input.
  let input;
  while (!input) {
    input = await getInput(blockid);
  }

  // Display a black debug icon to indicate that input has been received.
  demoWorkspace.getBlockById(blockid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');

  // Hide the input prompt and re-enable the proceed button.
  document.getElementById("submit_value").style.display = "none";
  document.getElementById('BlockDebugValue').style.height = "100%";

  // Display the user's input in the output console.
  var co_area = document.getElementById("output_value");
  co_area.value += info + ": " + input + "\n\n";

  // Lock the input field.
  inputvalue.readOnly = true;

  // Set the input flag to indicate that input has been received.
  InputFlag = false;

  // Return the user's input.
  return input;
}
/**
该函数用于获取用户输入的值，并返回一个 Promise 对象，以便在其他代码中使用 async/await 语法处理用户输入。
@param {string} blockid - 表示块的 ID。
@returns {Promise} - 该函数返回一个 Promise 对象，当用户点击“提交”或“重新运行”按钮时，Promise 对象将解析为用户输入的值。
*/
async function getInput(blockid) {
    // 使输入框可编辑
    document.getElementById("debug" + blockid).readOnly = false
    // 设置 flag 的默认值为 true，以便后面的 while 循环正常运行
    var flag = true
    // 定义一个 Promise 对象 c，用于存储用户输入的值
    var c;
    c = new Promise((resolve) => {
        // 当用户点击“提交”按钮时，将用户输入的值存储在变量 value 中，并将 flag 和 RerunFlag 的值分别设置为 false 和 false，然后解析 Promise 对象 c 为 value
        const inputElement = document.getElementById('submit_value');
        inputElement.addEventListener('click', (event) => {
            var value = document.getElementById("debug" + blockid).value;
            flag = false
            RerunFlag = false
            resolve(value);
        });
        // 当用户点击“重新运行”按钮时，将用户输入的值存储在变量 value 中，并将 flag 和 RerunFlag 的值分别设置为 false 和 true，然后解析 Promise 对象 c 为 value
        const rerunElement = document.getElementById('rerun_value');
        rerunElement.addEventListener('click', (event) => {
            var value = document.getElementById("debug" + blockid).value;
            flag = false
            RerunFlag = true
            resolve(value);
        });
    });
    // 当 flag 的值为 true 时，继续等待用户输入
    while(flag){
        // 如果接收到 signal 的信号，则将 DebugFlag 和 InputFlag 的值分别设置为 false，然后模拟点击“提交”按钮
        if (signal.aborted){
            DebugFlag = false;
            InputFlag = false;
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "cancelable": false
            });
            document.getElementById('submit_value').dispatchEvent(clickEvent);
            // 将块的调试图标设置为黑色
            demoWorkspace.getBlockById(blockid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png');
            // 禁用输入框
            document.getElementById("debug" + blockid).readOnly = true;
            // 隐藏“提交”按钮
            document.getElementById("submit_value").style.display="none";
            // 将“块控制台输出”区域的高度设置为 100%
            document.getElementById("BlockDebugValue").style.height = "100%";
            // 在“块控制台输出”区域中显示用户输入的值
            var co_area = document.getElementById("output_value");
            co_area.value += info +": "+ input + "\n\n";
            return;
        }
        // 每隔一秒钟检查一次 flag 的值
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // 返回 Promise 对象
    return c;
}

function output_value(info,value,blockid){
    demoWorkspace.getBlockById(blockid).getField("debug").setValue(serviceurl +'static/images/debuggreen.png')
    var co_area = document.getElementById("output_value");
    co_area.value += info + ": " + value + "\n\n";
    demoWorkspace.getBlockById(blockid).getField("debug").setValue(serviceurl + 'static/images/debugblack.png')
}

function parallel_work(parallerId){
    for (var i= 0;i<parallerId.length;i++){
        demoWorkspace.getBlockById(parallerId[i]).getField("debug").setValue(serviceurl + 'static/images/debuggreen.png');
    }
}

// 将代码部署到云端
function deploymentCloud(){
    var filename = document.getElementById("Save_Project_Name").innerText
    if(filename.replace(" ","") === 'UndefinedName'){
        filename = prompt("Please enter the name of the project you want to download", filename.replace(" ",""));
          if(filename === null){
              return;
          }
    }
    var deployPreInfor = ''
    initvariables = []
    recordinput = ""
    PythonPromptValues = {}
    Blockly.JavaScript.workspaceToCode(demoWorkspace);
    Blockly.Python.workspaceToCode(demoWorkspace);
    $.ajax({
        url:serviceurl + 'DeployPreInfo',
        method: 'POST',
        data: {
            "prompt":JSON.stringify(PythonPromptValues),
            "OpenAIKey": OpenAIKey,
        },
        asyne: true
    }).done(function (data1) {
        deployPreInfor = data1
    var PreInfor = prompt("Please enter a prompt statement that informs the user in advance", deployPreInfor);
    if (PreInfor === '') {
        return;
    }
    var code = '';
    var myset = new Set(initvariables);//利用了Set结构不能接收重复数据的特点
    var varycode = ''
    for(var val of myset){
        varycode += `${val} = ''\n`
    }
    varycode += `${val} = ''\n`
    Blockly.Python.INFINITE_LOOP_TRAP = null;
    var code_info = Blockly.Python.workspaceToCode(demoWorkspace);
    code_info = code_info.split("#*#*");
    for (var i = 1; i < code_info.length; i++) {
        if(code_info[i].includes("Code")){
            code += JSON.parse(code_info[i])["Code"]
        }
    }
    code = code.split('\n').join('\n\t')
    code ="preInfor = \"\"\"" + PreInfor +"\"\"\"\nawait send_message(websocket, json.dumps({'Answer': [preInfor]}))\nwhile True:\n\t" + code
    code = varycode + code
    var data = new Blob([JSON.stringify(PythonPromptValues)]);
    var clickEvent = new MouseEvent("click", {
      "view": window,
      "bubbles": true,
      "cancelable": false
    });
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(data);
    a.download = "prompt" + ".json";
    a.textContent = 'Download file!';
    // a.dispatchEvent(clickEvent);
    $.ajax({
        url:serviceurl + 'Deploy',
        method: 'POST',
        data: {
            "prompt":JSON.stringify(PythonPromptValues),
            "GenCode":code
        },
        asyne: true
    }).done(function (data) {
        var message = `${data}/${filename}`;
        if (confirm(message)) {
          window.open(`${data}/${encodeURIComponent(filename)}`, "_blank");
        }
    });
    });
}

function downloadpythoncode() {
    var deployPreInfor = ''
    initvariables = []
    recordinput = ""
    PythonPromptValues = {}
    Blockly.JavaScript.workspaceToCode(demoWorkspace);
    Blockly.Python.workspaceToCode(demoWorkspace);
    $.ajax({
        url:serviceurl + 'DeployPreInfo',
        method: 'POST',
        data: {
            "prompt":JSON.stringify(PythonPromptValues),
            "OpenAIKey": OpenAIKey,
            // "GenCode":code
        },
        asyne: true
    }).done(function (data1) {
        var PreInfor = data1
        var code = '';
        var newinitvariables = [];
        var myset = new Set(initvariables);//利用了Set结构不能接收重复数据的特点
        for (var val of myset) {
            newinitvariables.push(val)
        }
        newinitvariables.push("preInfo")
        recordinput = "preInfo";
        var record = {"id": "", "input": recordinput, "output": [], "runflag": ""}
        for (i = 0; i < newinitvariables.length; i++) {
            record[newinitvariables[i]] = "";
        }
        code += "initrecord = " + JSON.stringify(record) + "\n"
        code += "sapper_query = update_request(initrecord, sapper_request)\n";
        for (i = 0; i < newinitvariables.length; i++) {
            record[newinitvariables[i]] = "";
            code += newinitvariables[i] + "=sapper_query[\"" + newinitvariables[i] + "\"]\n";
        }
        code += "sapper_query[\"output\"] = []\n"
        code += "if sapper_query[\"runflag\"]:\n    preInfo = \"\"\"" + PreInfor + "\"\"\"\nsapper_query[\"preInfo\"]=preInfo\nif sapper_query[\"runflag\"]:\n    sapper_query[\"output\"].append(preInfo)\n    stop, sapper_query, Unit = get_value(\"preInfo\", sapper_request, sapper_query)\n"
        Blockly.Python.INFINITE_LOOP_TRAP = null;
        var code_info = Blockly.Python.workspaceToCode(demoWorkspace);
        code_info = code_info.split("#*#*");
        for (var i = 1; i < code_info.length; i++) {
            if (code_info[i].includes("Code")) {
                code += JSON.parse(code_info[i])["Code"]
            }
        }
   var xhr = new XMLHttpRequest();
        xhr.open('POST', serviceurl +'download', true);
        xhr.responseType = "blob";
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var blob = xhr.response;
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "compressed_files.zip";
                link.click();
            }
        };
        var dataToSend = JSON.stringify({"data": {
            "prompt":JSON.stringify(PythonPromptValues),
            "GenCode":code
        }});
        xhr.send(dataToSend);
        });
}

// 显示用户的所有 project
function show_project(){
    if(document.getElementById('ShowProjectDiv').style.display === 'none'){
        document.getElementById('Show_Project_List').style.backgroundColor="#7c7676";
        document.getElementById("ShowProjectDiv").style.display = "block";
        onresize();
    }
    else{
        document.getElementById('Show_Project_List').style.backgroundColor="gainsboro"
        document.getElementById("ShowProjectDiv").style.display = "none";
        onresize();
    }
}
// 显示控制台
function show_console() {
  if (document.getElementById('CodeDiv').style.display === 'none') {
    // 获取工作区的高度
    let height = document.getElementById('WorkDiv').offsetHeight;
    // 获取控制台的高度
    let consoleheight = parseInt(document.getElementById('CodeDiv').style.height.replace("px", ""));
    // 调整工作区和blocklyDiv的高度
    document.getElementById('WorkDiv').style.height = height - consoleheight + "px";
    document.getElementById('blocklyDiv').style.height = height - consoleheight + "px";
    // 显示代码控制台
    document.getElementById('CodeDiv').style.display = 'block';
  }
}
// 显示Python控制台
function show_python_console() {
  // 初始化变量
  initvariables = []
  recordinput = ""
  PythonPromptValues = {}

  // 将工作区中的块转换为JavaScript代码和Python代码
  Blockly.JavaScript.workspaceToCode(demoWorkspace);
  Blockly.Python.workspaceToCode(demoWorkspace);

  var code = '';

  // 生成Python代码
  var newinitvariables = [];
  var myset = new Set(initvariables);
  for (var val of myset) {
    newinitvariables.push(val)
  }
  var record = { "id": "", "input": recordinput, "output": [], "runflag": "" }
  for (i = 0; i < newinitvariables.length; i++) {
    record[newinitvariables[i]] = "";
  }
  code += "initrecord = " + JSON.stringify(record) + "\n"
  code += "query = update_request(initrecord, request)\n";
  for (i = 0; i < newinitvariables.length; i++) {
    record[newinitvariables[i]] = "";
    code += newinitvariables[i] + "=query[\"" + newinitvariables[i] + "\"]\n";
  }
  code += "query[\"output\"] = []\n"

  // 将工作区中的块转换为Python代码
  Blockly.Python.INFINITE_LOOP_TRAP = null;
  var code_info = Blockly.Python.workspaceToCode(demoWorkspace);
  code_info = code_info.split("#*#*");
  for (var i = 1; i < code_info.length; i++) {
    if (code_info[i].includes("Code")) {
      code += JSON.parse(code_info[i])["Code"]
    }
  }
}
// 显示块控制台
function show_block_console() {
    // 修改按钮的样式
    document.getElementById("show_promptconsole_button").style.backgroundColor = "gainsboro";
    document.getElementById("show_engineconsole_button").style.backgroundColor = "gainsboro";
    document.getElementById("show_blockconsole_button").style.backgroundColor = "#7c7676";

    if (document.getElementById('CodeDiv').style.display === 'none') {
        // 显示控制台
        show_console();
        document.getElementById("show_blockconsole_button").style.backgroundColor = "#7c7676";
    } else if (document.getElementById("BlockConsole").style.display === 'block') {
        // 隐藏块控制台
        document.getElementById('CodeDiv').style.display = 'none';
        document.getElementById('WorkDiv').style.height = WindowHeight - 80 + 'px';
        document.getElementById('blocklyDiv').style.height = WindowHeight - 80 + 'px';
        document.getElementById("show_blockconsole_button").style.backgroundColor = "gainsboro";
    }

    document.getElementById('PromptConsole').style.display = 'none';
    document.getElementById('EngineConsole').style.display = 'none';
    document.getElementById('BlockConsole').style.display = 'block';
}
// 显示提示控制台
function show_prompt_console() {
    // 修改按钮的样式
    document.getElementById("show_blockconsole_button").style.backgroundColor = "gainsboro";
    document.getElementById("show_engineconsole_button").style.backgroundColor = "gainsboro";
    document.getElementById("show_promptconsole_button").style.backgroundColor = "#7c7676";

    if (document.getElementById('CodeDiv').style.display === 'none') {
        // 显示控制台
        show_console();
        document.getElementById("show_promptconsole_button").style.backgroundColor = "#7c7676";
    } else if (document.getElementById("PromptConsole").style.display === 'block') {
        // 隐藏提示控制台
        document.getElementById('CodeDiv').style.display = 'none';
        document.getElementById('WorkDiv').style.height = WindowHeight - 80 + 'px';
        document.getElementById('blocklyDiv').style.height = WindowHeight - 80 + 'px';
        document.getElementById("show_promptconsole_button").style.backgroundColor = "gainsboro";
    }

    document.getElementById('BlockConsole').style.display = 'none';
    document.getElementById('EngineConsole').style.display = 'none';
    document.getElementById('PromptConsole').style.display = 'block';
}
// 显示模型控制台
function show_engine_console() {
    // 修改按钮的样式
    document.getElementById("show_blockconsole_button").style.backgroundColor = "gainsboro";
    document.getElementById("show_promptconsole_button").style.backgroundColor = "gainsboro";
    document.getElementById("show_engineconsole_button").style.backgroundColor = "#7c7676";

    if (document.getElementById('CodeDiv').style.display === 'none') {
        // 显示控制台
        show_console();
        document.getElementById("show_engineconsole_button").style.backgroundColor = "#7c7676";
    } else if (document.getElementById("EngineConsole").style.display === 'block') {
        // 隐藏提示控制台
        document.getElementById('CodeDiv').style.display = 'none';
        document.getElementById('WorkDiv').style.height = WindowHeight - 80 + 'px';
        document.getElementById('blocklyDiv').style.height = WindowHeight - 80 + 'px';
        document.getElementById("show_engineconsole_button").style.backgroundColor = "gainsboro";
    }

    document.getElementById('BlockConsole').style.display = 'none';
    document.getElementById('PromptConsole').style.display = 'none';
    document.getElementById('EngineConsole').style.display = 'block';
}
// project button operation

function save_project(){
    var filename=document.getElementById("Save_Project_Name").innerText;
    var Code_xmlListtext = [];
    var i;
    for(var Code_xml in Code_xmlList){
        Code_xmlListtext.push(Blockly.Xml.domToText(Code_xmlList[Code_xml]));
    }
    var Variable_xmlListtext = [];
    for(i=1; i<Variable_xmlList.length; i++){
        Variable_xmlListtext.push(Blockly.Xml.domToText(Variable_xmlList[i]));
    }
    var PromptListtext = [];
    for(i=1; i<PromptList.length; i++){
        PromptListtext.push(Blockly.Xml.domToText(PromptList[i]));
    }
    var PrompttemplateListtext = [];
    for(var Prompttemplate in PrompttemplateList){
        PrompttemplateListtext.push(Blockly.Xml.domToText(PrompttemplateList[Prompttemplate]));
    }
    var ModelListtext = [];
    for(i=1; i<ModelList.length; i++){
        ModelListtext.push(Blockly.Xml.domToText(ModelList[i]));
    }
    var DIYmodelListtext = [];
    for(i = 1; i < DIYmodelList.length; i++){
        DIYmodelListtext.push(Blockly.Xml.domToText(DIYmodelList[i]));
    }
    var APIEnginetext = [];
    for(i = 1; i < APIEngine.length; i++){
        APIEnginetext.push(Blockly.Xml.domToText(APIEngine[i]));
    }
    var TraditionEnginetext = [];
    for(i = 1; i < TraditionEngine.length; i++){
        TraditionEnginetext.push(Blockly.Xml.domToText(TraditionEngine[i]));
    }
    const dataContainer = document.getElementById("data-container");
    const topLevelCards = dataContainer.querySelectorAll("#data-container> .task-container > .card");
    const parsedCards = parseNesting(topLevelCards);
    var project = { "Code_xmlList": Code_xmlListtext,"Variable_xmlList": Variable_xmlListtext,
        "PromptList": PromptListtext,"PrompttemplateList": PrompttemplateListtext,
        "ModelList": ModelListtext,
        "DIYmodelList": DIYmodelListtext,"APIEngine": APIEnginetext,"PromptValue": PromptValue,
        "ModelValues": ModelValues,"RunPromptAspect":RunPromptAspect,
        "ImportPromptValue" :ImportPromptValue,"TraditionEngine" :TraditionEnginetext,
        "RunEngineConfigs": RunEngineConfigs,"EngineConfigs":EngineConfigs,
        "DesignManager" : DesignManager, "ExploreConversion" : ExploreConversion,
        "ClarifyConversion" :ClarifyConversion, 'TaskCards': parsedCards,
        'Require': document.getElementById('Require_display').value,
    };
    var workspacexml = Blockly.Xml.workspaceToDom(demoWorkspace);
    project["workspace"] = Blockly.Xml.domToPrettyText(workspacexml);
    ProjectValues[filename] = project

    // document.getElementById("Save_Project_Name").innerText = filename
    // document.getElementById("Save_Project_Name").style.color = "black";
}
function update_project(UploadProject){
    var workspacexml_str = UploadProject["workspace"];
    var workspacexml = Blockly.Xml.textToDom(workspacexml_str);
    Blockly.Xml.domToWorkspace(workspacexml, demoWorkspace);
    ModelValues = {};
    PromptValues = {};
    RunPromptValues = {};
    RunPromptAspect = {}
    ImportPromptValue = {};
    PromptValue = {};
    ModelValues = Object.assign(ModelValues, UploadProject["ModelValues"]);
    RunEngineConfigs = Object.assign(RunEngineConfigs, UploadProject["RunEngineConfigs"]);
    ImportPromptValue = UploadProject["ImportPromptValue"] ? UploadProject["ImportPromptValue"]:{};
    PromptValue = UploadProject["PromptValue"] ? UploadProject["PromptValue"]:{};
    RunPromptAspect = UploadProject["RunPromptAspect"] ? UploadProject["RunPromptAspect"]:{};
    EngineConfigs = Object.assign(EngineConfigs, UploadProject["EngineConfigs"]);
    ClarifyConversion = UploadProject["ClarifyConversion"] ? UploadProject["ClarifyConversion"]:[];
    ExploreConversion = UploadProject["ExploreConversion"] ? UploadProject["ExploreConversion"]:[];
    DesignManager = UploadProject['DesignManager'] !== "undefined" ? UploadProject['DesignManager'] : '';
    document.getElementById('taskNodeDisplay').value = DesignManager ? DesignManager : '';
    var TaskCards =  UploadProject['TaskCards'] ? UploadProject['TaskCards']:[];
    update_explore()
    update_clarify()
    document.getElementById('Require_display').value = UploadProject['Require'] ? UploadProject['Require'] : '';
    document.getElementById('data-container').innerHTML = '';
    document.getElementById('cardsContainer').innerHTML = '';
    workerindex = 0;
    update_cards(TaskCards, $('#data-container'))
    var i;
    for(i = 0; i < UploadProject["Code_xmlList"].length; i++){
        var Code_xml = Blockly.Xml.textToDom(UploadProject["Code_xmlList"][i]);
        Code_xmlList.push(Code_xml);
    }
    for(i = 0; i < UploadProject["Variable_xmlList"].length; i++){
        var Variable_xml = Blockly.Xml.textToDom(UploadProject["Variable_xmlList"][i]);
        Variable_xmlList.push(Variable_xml);
    }
    for(i = 0; i < UploadProject["PromptList"].length; i++){
        var Prompt = Blockly.Xml.textToDom(UploadProject["PromptList"][i]);
        PromptList.push(Prompt);
    }
    for(i = 0; i < UploadProject["PrompttemplateList"].length; i++){
        var Prompttemplate = Blockly.Xml.textToDom(UploadProject["PrompttemplateList"][i]);
        PrompttemplateList.push(Prompttemplate);
    }
    for(i = 0; i < UploadProject["ModelList"].length; i++){
        var Model = Blockly.Xml.textToDom(UploadProject["ModelList"][i]);
        ModelList.push(Model);
    }
    for(i = 0; i < UploadProject["DIYmodelList"].length; i++){
        var DIYmodel = Blockly.Xml.textToDom(UploadProject["DIYmodelList"][i]);
        DIYmodelList.push(DIYmodel);
    }
    for(i = 0; i < UploadProject["APIEngine"].length; i++){
        var APIEngines = Blockly.Xml.textToDom(UploadProject["APIEngine"][i]);
        APIEngine.push(APIEngines);
    }
    for(i = 0; i < UploadProject["TraditionEngine"].length; i++){
        var TraditionEngines = Blockly.Xml.textToDom(UploadProject["TraditionEngine"][i]);
        TraditionEngine.push(TraditionEngines);
    }
}
function update_explore(){
    for(var i=0;i<ExploreConversion.length; i++){
        let currentDialog = $('#Explore_conversation>.conversation-dialog').last()
        let convWrapper = $('#Explore_conversation')
        // if send from the same user, append message in current dialog
        if (ExploreConversion[i]['role'] === 'user'){
            if(currentDialog && currentDialog.attr('data-role') === "User"){
                currentDialog.find('.dialog-msg-wrapper').append(generateMessage(ExploreConversion[i]['content']))
            }
            else{
                convWrapper.append(generateDialog("User", ExploreConversion[i]['content']))
            }
        }
        // else create a new dialog
        else{
            convWrapper.append(generateDialog("Sapper", ExploreConversion[i]['content']))
        }
    }
}
function update_clarify(){
    for(var i=0;i<ClarifyConversion.length; i++){
        let currentDialog = $('#Clarify_conversation>.conversation-dialog').last()
        let convWrapper = $('#Clarify_conversation')
        // if send from the same user, append message in current dialog
        if (ClarifyConversion[i]['role'] === 'User'){
            if(currentDialog && currentDialog.attr('data-role') === "User"){
                currentDialog.find('.dialog-msg-wrapper').append(generateMessage(ClarifyConversion[i]['content']))
            }
            else{
                convWrapper.append(generateDialog("User", ClarifyConversion[i]['content']))
            }
        }
        // else create a new dialog
        else{
            convWrapper.append(generateDialog("Sapper", ClarifyConversion[i]['content']))
        }
    }
}
function update_cards(jsondata, contain){
    jsondata.forEach((data, index) => {
        index = workerindex;
        workerindex += 1
        if(data.type === 'task'){
          // document.getElementById('data-container').innerHTML = '';
          // document.getElementById('cardsContainer').innerHTML = '';
          $('#cardsContainer').append(createCard(data.taskcard, index));
          contain.append(createTaskCard(data.taskcard, index));

          document.getElementById("addItem" + index).addEventListener("click",function () {
              $("#collapsePrework"+ index + " .card-body").append(addNewItem());
          })
            switchPrompt( index, 0)
          const currentPrompt = document.getElementById(`taskname${index}`);
          const secondCardPrompt = document.getElementById(`workername${index}`);

          // 为当前选择的文本域添加事件监听器
          currentPrompt.addEventListener('input', (event) => {
            secondCardPrompt.value = event.target.value;
          });

          // 为第二个卡片的 Prompt 文本域添加事件监听器
          secondCardPrompt.oninput = (event) => {
            currentPrompt.value = event.target.value;
          };
        }
        else{
            let html = `
              <div class="col-12 mb-3 task-container" style="margin-bottom: 2px;">
          <div class="card logic-card" data-task-id="${index}" draggable="true" style="border: 2px solid #a1c4fd;">
            <div class="card-header" draggable="true" style="background-color: gainsboro">
              <div class="d-flex align-items-center">
                <h5 class="card-title me-2">${data.type}</h5>
                <div class="input-group input-group-sm flex-grow-1">
                  <input type="text" class="form-control" placeholder="输入值1" value="${data.input1}">
                  <select class="form-select" aria-label="逻辑运算符">
                    <option ${data.logicOperator === "=" ? ' selected="selected"' : ''}> = </option>
                    <option ${data.logicOperator === ">" ? ' selected="selected"' : ''}> > </option>
                    <option ${data.logicOperator === "<" ? ' selected="selected"' : ''}> < </option>
                    <option ${data.logicOperator === "≥" ? ' selected="selected"' : ''}> ≥ </option>
                    <option ${data.logicOperator === "≤" ? ' selected="selected"' : ''}> ≤ </option>
                    <option ${data.logicOperator === "≠" ? ' selected="selected"' : ''}> ≠ </option>
                  </select>
                  <input type="text" class="form-control" placeholder="输入值2" value="${data.input2}">
                </div>
                <button type="button" class="btn btn-primary btn-sm ms-2" data-bs-toggle="collapse" data-bs-target="#card-content-${index}" aria-expanded="false" aria-controls="card-content-${index}"><i class="bi bi-chevron-down"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeCard(${index})">&times;</button>
              </div>
            </div>
            <div class="collapse show" id="card-content-${index}">
              <div class="card-body card-body-${index}" >
              </div>
            </div>
          </div>
        </div>
            `;
            contain.append(html)
            const logicCards = document.querySelectorAll('.logic-card');
            logicCards.forEach(function (logicCard) {
                new Sortable(logicCard.querySelector('.card-body'), {
                    group: 'shared',
                    animation: 300,
                });

                // Add dragstart event to the card header instead of the card itself
                const cardHeader = logicCard.querySelector('.card-header');
                cardHeader.addEventListener('dragstart', function (e) {
                  e.dataTransfer.setData('text/plain', '');
            });
          });
            update_cards(data.nestedCards,$(`.card-body-${index}`))
        }
    });
}
function upload_project1(ProjectName,UploadProject){
    if(Object.keys(ProjectValues).indexOf(ProjectName) !== -1){
        var Sure = confirm("Project " + ProjectName + " already exists, do you want to overwrite it?");
        if(Sure === false){
            return;
        }
        ProjectValues[ProjectName] = {};
        ProjectValues[ProjectName] = UploadProject
        initIDE();
        update_project(UploadProject);
        return;
    }
    ProjectValues[ProjectName] = {};
    ProjectValues[ProjectName] = UploadProject
    var name_width = getTextWidth(ProjectName,13);
    ProjectList.push(ProjectName);
    var project = document.createElement('button');
    project.innerHTML = ProjectName;
    project.setAttribute('type', 'button');
    project.setAttribute("class", "btn content_button");
    project.style.marginBottom = "2px";
    // project.style.width = '80px';
    project.style.textAlign = "left";
    document.getElementById("ShowProjectDiv").appendChild(project);
    for(var i = 0; i < document.getElementById('ShowProjectDiv').children.length; i++){
        document.getElementById('ShowProjectDiv').children[i].style.backgroundColor = 'gainsboro';
    }
    project.style.backgroundColor = '#b4afaf';
    initIDE();
    document.getElementById("Save_Project_Name").style.width = name_width + "px";
    document.getElementById("Save_Project_Name").innerText=ProjectName;
    update_project(UploadProject);
}
function upload_project(){
    var a = document.createElement('input');
    a.type = "file";
    a.accept = ".json";
    a.click();
    a.addEventListener('change', function(e) {
        var file = e.target.files[0];
        var ProjectName = file.name.replace(".json", "").replace(" ", "");

        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (evt) {
            var UploadProject = JSON.parse(evt.target.result);
            if(Object.keys(ProjectValues).indexOf(ProjectName) !== -1){
                var Sure = confirm("Project " + ProjectName + " already exists, do you want  it?");
                if(Sure === false){
                    return;
                }
                ProjectValues[ProjectName] = {};
                ProjectValues[ProjectName] = UploadProject
                const surecovert = window.confirm("the project will be opened in a new window, if you wish to be in the current window, please click Cancel")
                if(surecovert === true){
                    initIDE();
                }
                update_project(UploadProject);
                return;
            }
            const surecovert = window.confirm("the project will be opened in a new window, if you wish to be in the current window, please click Cancel")
            if(surecovert === true){
                ProjectValues[ProjectName] = {};
                ProjectValues[ProjectName] = UploadProject
                var name_width = getTextWidth(ProjectName,13);
                ProjectList.push(ProjectName);
                var project = document.createElement('button');
                project.innerHTML = ProjectName;
                project.setAttribute('type', 'button');
                project.setAttribute("class", "btn content_button");
                project.style.marginBottom = "2px";
                // project.style.width = document.getElementById("sapper_body").offsetWidth*0.1 + "px";
                project.style.textAlign = "left";
                document.getElementById("ShowProjectDiv").appendChild(project);
                for(var i = 0; i < document.getElementById('ShowProjectDiv').children.length; i++){
                    document.getElementById('ShowProjectDiv').children[i].style.backgroundColor = 'gainsboro';
                }
                project.style.backgroundColor = '#b4afaf';
                initIDE();
                document.getElementById("Save_Project_Name").style.width = name_width + "px";
                document.getElementById("Save_Project_Name").innerText=ProjectName;
            }
            update_project(UploadProject);
        }
    });
}
function download_project(){
    var filename = document.getElementById("Save_Project_Name").innerText
    filename = prompt("Please enter the name of the project you want to download", filename.replace(" ",""));
      if(filename === null){
          return;
      }

    var Code_xmlListtext = [];
    var i;
    for(var Code_xml in Code_xmlList){
        Code_xmlListtext.push(Blockly.Xml.domToText(Code_xmlList[Code_xml]));
    }
    var Variable_xmlListtext = [];
    for(i=1; i<Variable_xmlList.length; i++){
        Variable_xmlListtext.push(Blockly.Xml.domToText(Variable_xmlList[i]));
    }
    var PromptListtext = [];
    for(i=1; i<PromptList.length; i++){
        PromptListtext.push(Blockly.Xml.domToText(PromptList[i]));
    }
    var PrompttemplateListtext = [];
    for(var Prompttemplate in PrompttemplateList){
        PrompttemplateListtext.push(Blockly.Xml.domToText(PrompttemplateList[Prompttemplate]));
    }
    var ModelListtext = [];
    for(i=1; i<ModelList.length; i++){
        ModelListtext.push(Blockly.Xml.domToText(ModelList[i]));
    }
    var DIYmodelListtext = [];
    for(i = 1; i < DIYmodelList.length; i++){
        DIYmodelListtext.push(Blockly.Xml.domToText(DIYmodelList[i]));
    }
    var APIEnginetext = [];
    for(i = 1; i < APIEngine.length; i++){
        APIEnginetext.push(Blockly.Xml.domToText(APIEngine[i]));
    }
    var TraditionEnginetext = [];
    for(i = 1; i < TraditionEngine.length; i++){
        TraditionEnginetext.push(Blockly.Xml.domToText(TraditionEngine[i]));
    }
    const dataContainer = document.getElementById("data-container");
    const topLevelCards = dataContainer.querySelectorAll("#data-container> .task-container > .card");
    const parsedCards = parseNesting(topLevelCards);
    var project = { "Code_xmlList": Code_xmlListtext,"Variable_xmlList": Variable_xmlListtext,
        "PromptList": PromptListtext,"PrompttemplateList": PrompttemplateListtext,
        "ModelList": ModelListtext,
        "DIYmodelList": DIYmodelListtext,"APIEngine": APIEnginetext,"PromptValue": PromptValue,
        "ModelValues": ModelValues,"RunPromptAspect":RunPromptAspect,
        "ImportPromptValue" :ImportPromptValue,"TraditionEngine" :TraditionEnginetext,
        "RunEngineConfigs": RunEngineConfigs,"EngineConfigs":EngineConfigs,
        "DesignManager" : document.getElementById('taskNodeDisplay').value, "ExploreConversion" : ExploreConversion,
        "ClarifyConversion" :ClarifyConversion, 'TaskCards': parsedCards,
        'Require': document.getElementById('Require_display').value,
    };
    var workspacexml = Blockly.Xml.workspaceToDom(demoWorkspace);
    project["workspace"] = Blockly.Xml.domToPrettyText(workspacexml);
    var data = new Blob([JSON.stringify(project)]);
    var clickEvent = new MouseEvent("click", {
      "view": window,
      "bubbles": true,
      "cancelable": false
    });
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(data);
    a.download = filename + ".json";
    a.textContent = 'Download file!';
    a.dispatchEvent(clickEvent);
}
function open_project(){
    var a = document.createElement('ShowProjectDiv');
    a.addEventListener('click', function(e) {
        var file = e.target.value;
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (evt) {
            var UploadProject = JSON.parse(evt.target.result);
            update_project(UploadProject);
        }
    });
}
function new_project(){
    var filename = prompt("Please enter the name of the project you want to create","Undefined Name").replace(" ","");
      if(filename === null){
          return;
      }
      if(Object.keys(ProjectValues).indexOf(filename) !== -1){
                var Sure = confirm("Project " + filename + " already exists, do you want to overwrite it?");
                if(Sure === false){
                    return;
                }
                ProjectValues[filename] = {};
                ProjectValues[filename] = initproject
                initIDE();
                return;
      }
      ProjectValues[filename] = {};
      ProjectValues[filename] = initproject
    var project1 = document.createElement('button');
    project1.innerHTML = filename;
    project1.setAttribute('type', 'button');
    project1.setAttribute("class", "btn content_button");
    project1.style.marginBottom = "2px";
    // project1.style.width = document.getElementById("sapper_body").offsetWidth*0.1 + "px";
    project1.style.textAlign = "left";
    document.getElementById("ShowProjectDiv").appendChild(project1);
    initIDE();
    document.getElementById("Save_Project_Name").innerText=filename;
}

function getPromptParams(prompt_template){
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(prompt_template)) !== null) {
    matches.push(match[1]);
    }
    return Array.from(new Set(matches));
}
function download_prompt(){
  var filename = prompt("Please enter the name of the prompts you want to download");
  if(filename === null){
      return;
  }
  var data = new Blob([JSON.stringify(PromptValue)]);
  var clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
  });
  var a = document.createElement('a');
  a.href = window.URL.createObjectURL(data);
  a.download = filename + ".json";
  a.textContent = 'Download file!';
  a.dispatchEvent(clickEvent);
}
function upload_prompt(){
    var a = document.createElement('input');
    a.type = "file";
    a.accept = ".json";
    a.click();
    a.addEventListener('change', function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (evt) {
            var UploadPrompt = JSON.parse(evt.target.result);
            for(var key in UploadPrompt){
                var prompttemplate = Blockly.utils.xml.createElement("block");
                prompttemplate.setAttribute("type", "Prompt_template");
                prompttemplate.setAttribute("collapsed", "true");
                var promptname = Blockly.utils.xml.createElement("field");
                promptname.setAttribute("name", "Prompt_Name");
                promptname.appendChild(Blockly.utils.xml.createTextNode(key));
                prompttemplate.appendChild(promptname);
                var promptvalue = Blockly.utils.xml.createElement("statement");
                promptvalue.setAttribute("name", "prompt_value");

                var promptexample = Blockly.utils.xml.createElement("block");
                promptexample.setAttribute("type", "Example");
                var promptexample_name = Blockly.utils.xml.createElement("field");
                promptexample_name.setAttribute("name", "Example_value");
                promptexample_name.appendChild(Blockly.utils.xml.createTextNode(UploadPrompt[key][0][0]));
                promptexample.appendChild(promptexample_name);
                promptvalue.appendChild(promptexample);
                prompttemplate.appendChild(promptvalue);
                for(var i = 1; i < UploadPrompt[key].length; i++){
                    var next = Blockly.utils.xml.createElement("next");
                    var promptexample1 = Blockly.utils.xml.createElement("block");
                    promptexample1.setAttribute("type", "Example");
                    var promptexample_name1 = Blockly.utils.xml.createElement("field");
                    promptexample_name1.setAttribute("name", "Example_value");
                    promptexample_name1.appendChild(Blockly.utils.xml.createTextNode(UploadPrompt[key][i][0]));
                    promptexample1.appendChild(promptexample_name1);
                    next.appendChild(promptexample1);
                    promptexample.appendChild(next);
                    promptexample = promptexample1;
                }
                PromptList.push(prompttemplate);
                PrompttemplateList.push(prompttemplate);
            }
            PromptValue = Object.assign(PromptValue, UploadPrompt);
        }
    });
}
function show_prompt(){
    if(document.getElementById("PromptDiv").style.display === "none"){
        var workxml = Blockly.Xml.workspaceToDom(PromptWorkspace);
        document.getElementById('ProjectDiv').className = 'col-7'
        // document.getElementById('blocklyDiv').style.width= "100%"
        document.getElementById('ModelDiv').style.display='none';
        document.getElementById('PromptDiv').style.display='block';
        document.getElementById("CreatePromptDiv").innerHTML = "";
        PromptWorkspace = Blockly.inject('CreatePromptDiv',{
          media: serviceurl + 'static/media/',
          toolbox: document.getElementById('prompttoolbox'),
          collapse : false,
          grid: {
              spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true},
          zoom: {controls: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
          trashcan: true,
        });
        PromptWorkspace.registerToolboxCategoryCallback('DIYPrompttemplate', myCategoryFlyoutPrompttemplateCallback);
        Blockly.Xml.domToWorkspace(PromptWorkspace, workxml);
        PromptWorkspace.addChangeListener(CreatePromptEvent);
        document.getElementById('show_modelpanel_button').style.backgroundColor="gainsboro";
        document.getElementById('show_promptpanel_button').style.backgroundColor="#7c7676";
    }
    else{
        document.getElementById('PromptDiv').style.display='none';
        document.getElementById('ProjectDiv').className = 'col-12'
        // document.getElementById('WorkDiv').style.width= '100%';
        document.getElementById('blocklyDiv').style.width= document.getElementById('WorkDiv').offsetWidth + "px";
        document.getElementById('PromptDiv').style.display='none';
        document.getElementById('show_promptpanel_button').style.backgroundColor="gainsboro";
    }
}
function save_prompt(){
    var promptxml = Blockly.Xml.workspaceToDom(PromptWorkspace);
    var prompttemplate = PromptWorkspace.getBlockById(promptxml.childNodes[0].getAttribute("id"));
    var promptname = prompttemplate.getFieldValue("Prompt_Name");
    PromptValue[promptname] = []
    var i;
    for(i = 0; i < PrompttemplateList.length; i++){
        if(Blockly.Xml.domToText(PrompttemplateList[i]).indexOf(promptname) !== -1){
            PrompttemplateList.splice(i, 1);
            break;
        }
    }
    PrompttemplateList.push(promptxml.childNodes[0]);
    var tragetblock = prompttemplate.getInputTargetBlock('prompt_value');
    PromptValue[promptname].push(RunPromptAspect[tragetblock.id])
    while(tragetblock.nextConnection.isConnected()){
        tragetblock = tragetblock.getNextBlock();
        PromptValue[promptname].push(RunPromptAspect[tragetblock.id])
    }
}
function import_prompt(){
    var promptxml = Blockly.Xml.workspaceToDom(PromptWorkspace);
    var prompttemplate = PromptWorkspace.getBlockById(promptxml.childNodes[0].getAttribute("id"));
    var promptname = prompttemplate.getFieldValue("Prompt_Name");
    ImportPromptValue[promptname] = []
    var i;
    if(Object.keys(PromptValue).indexOf(promptname) !== -1) {
        var Sure = confirm(promptname + " already imported, do you want to overwrite it?");
        if (Sure === false) {
            return;
        }
    }
    for(i = 0; i < PromptList.length; i++){
        if(Blockly.Xml.domToText(PromptList[i]).indexOf(promptname) !== -1){
            // use is get the value of the XML node
            PromptList.splice(i, 1);
            break;
        }
    }
    PromptList.push(promptxml.childNodes[0]);
    var tragetblock = prompttemplate.getInputTargetBlock('prompt_value');
    ImportPromptValue[promptname].push(RunPromptAspect[tragetblock.id])
    while(tragetblock.nextConnection.isConnected()){
        tragetblock = tragetblock.getNextBlock();
        ImportPromptValue[promptname].push(RunPromptAspect[tragetblock.id])
    }
}

function save_model(){
    var element = document.querySelector('[data-engine-id]');
    var engineId = element.getAttribute('data-engine-id');
    var model = document.querySelector('[data-model-id]');
    var modelconfig = model.getAttribute('data-model-id');
    var modelxml = Blockly.Xml.blockToDom(ModelWorkspace.getBlockById(engineId));
    var modelcode = ModelWorkspace.getBlockById(engineId).getFieldValue("LLM_Name");
    var i;
    if(Object.keys(ModelValues).indexOf(modelcode) !== -1) {
        var Sure = confirm(modelcode + " already exists, do you want to overwrite it?");
        if (Sure === false) {
            return;
        }
    }
    for(i = 0; i < DIYmodelList.length; i++){
        if(Blockly.Xml.domToText(DIYmodelList[i]).indexOf(modelcode) !== -1){
            DIYmodelList.splice(i, 1);
            break;
        }
    }
    RunModelConfigs[modelconfig]['model'] = ModelWorkspace.getBlockById(engineId).getInputTargetBlock('Model').getFieldValue("modelName")
    ModelValues[modelcode] = JSON.parse(JSON.stringify(RunModelConfigs[modelconfig]));
    DIYmodelList.push(modelxml);
}

function import_model(){
    var element = document.querySelector('[data-engine-id]');
    if(element){
        var engineId = element.getAttribute('data-engine-id');
        var model = document.querySelector('[data-model-id]');
        var modelconfig = model.getAttribute('data-model-id');
        var modelxml = Blockly.Xml.blockToDom(ModelWorkspace.getBlockById(engineId));
        var modelcode = ModelWorkspace.getBlockById(engineId).getFieldValue("LLM_Name");
        var i;
        if(Object.keys(EngineConfigs).indexOf(modelcode) !== -1) {
        var Sure = confirm(modelcode + " already exists, do you want to overwrite it?");
        if (Sure === false) {
            return;
        }
    }
        EngineConfigs[modelcode] = {}
        EngineConfigs[modelcode] = JSON.parse(JSON.stringify(RunModelConfigs[modelconfig]));
        for(i = 0; i < ModelList.length; i++){
            if(Blockly.Xml.domToText(ModelList[i]).indexOf(modelcode) !== -1){
                ModelList.splice(i, 1);
                break;
            }
        }
        ModelList.push(modelxml);
    }
    else{
        var workxml = Blockly.Xml.workspaceToDom(ModelWorkspace);
        var prompttemplate = ModelWorkspace.getBlockById(workxml.childNodes[0].getAttribute("id"));
        if(prompttemplate.type === 'APIEngine'){
            ModelList.push(Blockly.Xml.blockToDom(prompttemplate));
        }
    }
}
function download_model(){
    var filename = prompt("Please enter the name of the model you want to download");
    if(filename === null){
        return;
    }
  var data = new Blob([JSON.stringify(ModelValues)]);
  var clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
  });
  var a = document.createElement('a');
  a.href = window.URL.createObjectURL(data);
  a.download = filename + ".json";
  a.textContent = 'Download file!';
  a.dispatchEvent(clickEvent);
}
function upload_model(){
    var a = document.createElement('input');
    a.type = "file";
    a.accept = ".json";
    a.click();
    a.addEventListener('change', function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (evt) {
            var UploadModel = JSON.parse(evt.target.result);
            for(var key in UploadModel){
                var LLM = Blockly.utils.xml.createElement("block");
                LLM.setAttribute("type", "LLM_Model");
                var LLM_name = Blockly.utils.xml.createElement("field");
                LLM_name.setAttribute("name", "LLM_Name");
                LLM_name.appendChild(Blockly.utils.xml.createTextNode(key));
                LLM.appendChild(LLM_name);
                var LLM_model = Blockly.utils.xml.createElement("statement");
                LLM_model.setAttribute("name", "Model");
                var LLM_model1 = Blockly.utils.xml.createElement("block");
                LLM_model1.setAttribute("type", "Model");
                var LLM_model1_name = Blockly.utils.xml.createElement("field");
                LLM_model1_name.setAttribute("name", "modelName");
                LLM_model1_name.appendChild(Blockly.utils.xml.createTextNode(UploadModel[key]['model']));
                LLM_model1.appendChild(LLM_model1_name);
                LLM_model.appendChild(LLM_model1);
                LLM.appendChild(LLM_model);
                ModelList.push(LLM);
                DIYmodelList.push(LLM);
            }
            ModelValues = Object.assign(ModelValues, UploadModel);
        }
    });
}
function show_model(){
    if(document.getElementById("ModelDiv").style.display === "none"){
        document.getElementById('ProjectDiv').className = 'col-7'
        // document.getElementById('blocklyDiv').style.width= "100%"
        document.getElementById('PromptDiv').style.display='none';
        document.getElementById('ModelDiv').style.display='block';
        var workxml = Blockly.Xml.workspaceToDom(ModelWorkspace);
        document.getElementById("CreateModelDiv").innerHTML = "";
        ModelWorkspace = Blockly.inject('CreateModelDiv',{
            media: serviceurl + 'static/media/',
            toolbox: document.getElementById('modeltoolbox'),
            collapse : true,
            comments : true,
            disable : true,
            maxBlocks : Infinity,
            trashcan : true,
            // horizontalLayout : true,
            toolboxPosition : 'start',
            css : true,
            rtl : false,
            scrollbars : true,
            sounds : true,
            oneBasedIndex : true,
            grid : {
                spacing : 20,
                length : 1,
                colour : '#888',
                snap : false
            },
            zoom : {
                controls : true,
                startScale : 1,
                maxScale : 3,
                minScale : 0.3,
                scaleSpeed : 1.2
            }
        });
        ModelWorkspace.registerToolboxCategoryCallback('DIYModel', myCategoryFlyoutDIYModelCallback);
        ModelWorkspace.registerToolboxCategoryCallback('APIEngine', myCategoryFlyoutAPIEngineCallback);
        ModelWorkspace.registerToolboxCategoryCallback('TraditionEngine', myCategoryFlyoutTraditionEngineCallback);
        Blockly.Xml.domToWorkspace(ModelWorkspace, workxml);
        ModelWorkspace.addChangeListener(CreateModelEvent);
        document.getElementById('show_promptpanel_button').style.backgroundColor="gainsboro";
        document.getElementById('show_modelpanel_button').style.backgroundColor="#7c7676";
    }
    else{
        document.getElementById('ModelDiv').style.display='none';
        document.getElementById('ProjectDiv').className = 'col-12'
        document.getElementById('ModelDiv').style.display='none';
        document.getElementById('show_modelpanel_button').style.backgroundColor="gainsboro";
    }
}

function create_variable(){
    var variable_name = prompt("Please enter the variable name", "variable");
    if(variable_name !== null){
        var variable0 = Blockly.utils.xml.createElement("block");
        variable0.setAttribute("type", "unit_var");
        variable0.setAttribute("deleteinfo", variable_name);
        variable0.setAttribute("id", "var" + randomString(6));
        var field0 = Blockly.utils.xml.createElement("field");
        field0.setAttribute("name", "unit_value");
        field0.appendChild(Blockly.utils.xml.createTextNode(variable_name));
        variable0.appendChild(field0);
        Variable_xmlList.push(variable0);
        var variable1 = Blockly.utils.xml.createElement("block");
        variable1.setAttribute("type", "unit_var_value");
        variable1.setAttribute("deleteinfo", "id"+variable_name);
        variable1.setAttribute("id", "value" + randomString(6));
        var field1 = Blockly.utils.xml.createElement("field");
        field1.setAttribute("name", "unit_value");
        field1.appendChild(Blockly.utils.xml.createTextNode(variable_name));
        variable1.appendChild(field1);
        Variable_xmlList.push(variable1);
        demoWorkspace.toolbox_.refreshSelection();
    }
}

function draftwidth(boxdiv){
    let box = document.getElementById(boxdiv);
    box.onmousedown = function(e){
        if(e.target.id !== "ProjectConsole"){
            return;
        }
        let x = e.clientX,
            y = e.clientY,
            w = box.offsetWidth,
            h = box.offsetHeight;

        document.onmousemove = function(e){
            if(e.clientY>150){
                let l = x-e.clientX,
                    t = y-e.clientY;
                // box.style.width = w + l + 'px';
                var boxWidth = w + l;
                var boxHeight = h + t;
                // var max = document.getElementById('ProjectDiv').offsetWidth - 100;
                if(h + y-e.clientY > 40){
                   document.getElementById('CodeDiv').style.height = boxHeight + 'px';
                    // box.style.width = document.getElementById('blocklyDiv').offsetWidth + 'px';
                    // let height = document.getElementById('WorkDiv').offsetHeight;
                    // document.getElementById("ProjectMainDiv").style.height = document.getElementById('sapper_body').offsetHeight -h -t -30+ 'px';
                    document.getElementById('WorkDiv').style.height = document.getElementById('sapper_body').offsetHeight -h -t -25+ 'px';
                    document.getElementById('blocklyDiv').style.height = document.getElementById('sapper_body').offsetHeight -h -t -25+ 'px';
                    // var debugheight = document.getElementById("ProjectConsole").offsetHeight - 25 + 'px';
                    // document.getElementById('BlockDebugValue').setAttribute("debugheight", debugheight);
                    // if(DebugFlag || InputFlag){
                    //     document.getElementById("BlockDebugValue").style.height = document.getElementById("ProjectConsole").offsetHeight - 25 + 'px';
                    // }
                    // onresize()
                }
            }
        }
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}
function onresize(){
    Blockly.svgResize(demoWorkspace);
}
function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}


// design view
function show_design(){
    if(document.getElementById("DesignDiv").style.display === "none"){
        document.getElementById('ProjectDiv').style.width= '58%';
        document.getElementById('blocklyDiv').style.width= "100%"
        document.getElementById('PromptDiv').style.display='none';
        document.getElementById('ModelDiv').style.display='none'
        document.getElementById('DesignDiv').style.display='block';
        document.getElementById('show_modelpanel_button').style.backgroundColor="gainsboro";
        document.getElementById('show_promptpanel_button').style.backgroundColor="gainsboro";
        document.getElementById('show_designpanel_button').style.backgroundColor="#7c7676";
    }
    else{
        document.getElementById('DesignDiv').style.display='none';
        document.getElementById('ProjectDiv').style.width= '100%';
        // document.getElementById('WorkDiv').style.width= '100%';
        document.getElementById('blocklyDiv').style.width= document.getElementById('WorkDiv').offsetWidth + "px";
        document.getElementById('DesignDiv').style.display='none';
        document.getElementById('show_designpanel_button').style.backgroundColor="gainsboro";
    }
}
function splitSteps(){
    var require = document.getElementById("Require_display").value;
    // document.getElementById('data-container').innerHTML = '';
    document.getElementById('ReadySplit').style.display = 'block';
    document.getElementById('DecomposeButton').className = 'btn btn-msg disabled';
    $.ajax({
        url: serviceurl + 'Decompose',
        type: 'post',
        data:{
            'message': require,
            'OpenAIKey': OpenAIKey
        },
        success: function (steps){
            steps = JSON.parse(steps)
           // for(i=0;i<Object.keys(steps).length;i++){
                $.ajax({
                    url: serviceurl + 'Getprompt',
                    type: 'post',
                    data:{
                        'message': JSON.stringify(steps),
                        'OpenAIKey': OpenAIKey
                    },
                    success: function (res){
                        var i;
                        var j=0;
                        res = JSON.parse(res)
                        for(i=0;i<Object.values(res).length;i++){
                            console.log(steps)
                            steps["step" + i]["prompt"] = []
                            for(j=0;j < Object.values(res)[i].length;j++){
                                steps["step" + i]["prompt"].push(Object.values(res)[i][j]['context'])
                            }
                        }
                        var genalprompt = [];
                        for(i = 0;i<Object.values(steps).length;i++){
                            genalprompt.push(steps["step" + i])
                        }
                        genalprompt.forEach((data, index) => {
                            renderData(data, index);
                        });
                        document.getElementById('ReadySplit').style.display = 'none';
                        document.getElementById('DecomposeButton').className = 'btn btn-msg';
                    },
                    error: function (res){
                        document.getElementById('ReadySplit').style.display = 'none';
                        document.getElementById('DecomposeButton').className = 'btn btn-msg';
                        alert('Result error')
                    }
                })
        },
        error: function (res){
            document.getElementById('ReadySplit').style.display = 'none';
            document.getElementById('DecomposeButton').className = 'btn btn-msg';
            alert('Result error')
        }
    })
}

function getshiftprompt(){
    var i;
    for(i=0;i<genalprompt.length;i++){
        promptchain[Object.keys(promptchain)[i]] = {"context": document.getElementById("prompt-" + i).value};
    }
}
function shift_view(select){
    const view = [['blocklyDiv','ShowBlockViewButton' ],['draftBlocklyDiv' , 'ShowDesignViewButton'],['explorationDiv','ShowExplorationViewButton']]
    var selectview = '';
    for(var i=0;i<view.length;i++){
        if(view[i][1] === select){
            document.getElementById(select).style.backgroundColor="#7c7676";
            selectview = view[i][0]
        }
        else{
            document.getElementById(view[i][0]).style.display = 'none';
            document.getElementById(view[i][1]).style.backgroundColor = 'gainsboro';
        }
    }
    document.getElementById(selectview).style.display = 'block';
    if(selectview==="blocklyDiv"){
        // document.getElementById("draftBlocklyDiv").style.display = "none";
        // document.getElementById("blocklyDiv").style.display = "block";
        var workxml = Blockly.Xml.workspaceToDom(demoWorkspace);
        document.getElementById("blocklyDiv").innerHTML = "";
        demoWorkspace = Blockly.inject('blocklyDiv',{
          media: serviceurl + 'static/media/',
          toolbox: document.getElementById('toolbox'),
          collapse : false,
          scrollbars : true,
          grid: {
              spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true},
          zoom: {controls: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
          trashcan: true,
        });
        demoWorkspace.registerButtonCallback("Create_Prompt",function(d){show_prompt();});
        demoWorkspace.registerButtonCallback("Create_Variable",function(d){create_variable()});
        demoWorkspace.registerButtonCallback("Create_Model",function(d){show_model()});
        // demoWorkspace.registerToolboxCategoryCallback('Mycodes', myCategoryFlyoutCodeback);
        demoWorkspace.registerToolboxCategoryCallback('Myvariables', myCategoryFlyoutVariableback);
        demoWorkspace.registerToolboxCategoryCallback('DIYPrompt', myCategoryFlyoutDIYCallback);
        demoWorkspace.registerToolboxCategoryCallback('Mymodels', myCategoryFlyoutModelCallback);
        demoWorkspace.addChangeListener(ShowPromptEvent);
        Blockly.Xml.domToWorkspace(demoWorkspace, workxml);
        workxml = null;
        // document.getElementById('ShowDesignViewButton').style.backgroundColor="gainsboro";
    }
}

function ClearClarify(){
    ClarifyConversion = []
    document.getElementById("Clarify_conversation").innerHTML = ''
}
function Chathistory(){
    // let currentDialog = document.getElementsByClassName('dialog-msg')
    let currentDialog = $('#Clarify_conversation>.conversation-dialog>.dialog-msg-wrapper>.dialog-msg')
    let expansion_prompt = 'Functional requirement: ' + currentDialog[0].innerText
    let history = ''
    let flag = 1
    for(var i=1;i<currentDialog.length;i++){
        if(flag===1){
            history +='\n' + 'Requirement guidance: ' + currentDialog[i].innerText;
            flag = 0;
        }
        else{
            history +='\n' + 'Answer: ' + currentDialog[i].innerText + '\n'
            flag = 1;
        }
    }
    expansion_prompt += '\n' + history
    return expansion_prompt
}
function SendClarify(){
    // * display the input message in the conversation wrapper
        let currentDialog = $('#Clarify_conversation>.conversation-dialog').last()
        let convWrapper = $('#Clarify_conversation')
        let msgInput = $('#msgInput')
        // if send from the same user, append message in current dialog
        if (currentDialog.attr('data-role') === "User"){
            currentDialog.find('.dialog-msg-wrapper').append(generateMessage(msgInput.val()))
        }
        // else create a new dialog
        else{
            convWrapper.append(generateDialog("User", msgInput.val()))
        }
        convWrapper.animate({
            scrollTop: convWrapper.prop('scrollHeight')
        }, 500)
        // wait for response
        let message = Chathistory()
        ClarifyConversion.push({'role':'User','content': msgInput.val()})
        msgInput.val('')
        msgInput.attr('disabled','disabled')
        // * send input message to server through ajax
        // e.preventDefault()
        console.log(OpenAIKey)
        $.ajax({
            url: serviceurl + 'Clarify', //  https://www.jxselab.com:8000/Clarify
            type: 'post',
            data:{
                'function': "clarify",
                'behaviour': document.getElementById('taskNodeDisplay').value,
                'message': JSON.stringify(ClarifyConversion),
                'OpenAIKey': OpenAIKey
            },
            success: function (res){
                if (res === -1){
                    alert("Connection to Server Error")
                }
                else {
                    res = JSON.parse(res)
                    // let answer = res.answer.slice(2).replaceAll('\n', '<br><br>')
                    $('#Clarify_conversation').append(generateDialog('Sapper', res["question"]))
                    ClarifyConversion.push({'role':'Sapper','content': res["question"]})
                    document.getElementById("Require_display").value = res["result"];
                    convWrapper.animate({
                        scrollTop: convWrapper.prop('scrollHeight')
                    }, 500)
                    msgInput.removeAttr('disabled')
                }
            },
            error: function (res){
                alert('Error')
                console.log(res)
                msgInput.removeAttr('disabled')
            }
        })
}
function generateDialog(user, msg){
        return "<div class=\"conversation-dialog dialog-" + user.toLowerCase() + "\" data-role=\"" + user + "\">\n" +
            "    <div class=\"dialog-portrait\">\n" +
            "        <img src=\"" + serviceurl + "static/images/" + user.toLowerCase() + ".jpg\" class=\"dialog-portrait-img\">\n" +
            "        <p class=\"dialog-portrait-name\">" + user + "</p>\n" +
            "    </div>\n" +
            "    <div class=\"dialog-msg-wrapper\">\n" +
            "        <p class=\"dialog-msg\">" + msg + "</p>\n" +
            "    </div>\n" +
            "</div>"
    }
function generateMessage(msg){
        return '<p class="dialog-msg">'+ msg +"</p>"
}
function DisplayChat(){
    if(document.getElementById('ChatClarify').style.display === 'block'){
        document.getElementById('ChatClarify').style.display = 'none'
        document.getElementById('RequireDecompose').className = 'col-lg-12'
    }
    else{
        document.getElementById('RequireDecompose').className = 'col-lg-8'
        document.getElementById('ChatClarify').style.display = 'block'
    }
}

function ClearExplore(){
    ExploreConversion = []
    document.getElementById("Explore_conversation").innerHTML = ''
}
function SendExplore(){
    // * display the input message in the conversation wrapper
        let currentDialog = $('#Explore_conversation>.conversation-dialog').last()
        let convWrapper = $('#Explore_conversation')
        let msgInput = $('#ExploreInput')
        // if send from the same user, append message in current dialog
        if (currentDialog.attr('data-role') === "User"){
            currentDialog.find('.dialog-msg-wrapper').append(generateMessage(msgInput.val()))
        }
        // else create a new dialog
        else{
            convWrapper.append(generateDialog("User", msgInput.val()))
        }
        convWrapper.animate({
            scrollTop: convWrapper.prop('scrollHeight')
        }, 500)
        // wait for response

        ExploreConversion.push({"role": "user", "content": msgInput.val()})
        msgInput.val('')
        msgInput.attr('disabled','disabled')
        $.ajax({
            url: serviceurl + 'Explore', //http://127.0.0.1:5000/Clarify
            type: 'post',
            data:{'senddata': JSON.stringify({
                'function': "Explore",
                'message': ExploreConversion,
                'OpenAIKey': OpenAIKey
            })},
            success: function (res){
                if (res === -1){
                    alert("Connection to Server Error")
                }
                else {
                    res = JSON.parse(res)
                    ExploreConversion.push(res['Answer'])
                    $('#Explore_conversation').append(generateDialog('Sapper', res['Answer']["content"]))
                    DesignManager = res['Design'];
                    document.getElementById("taskNodeDisplay").value = DesignManager
                    convWrapper.animate({
                        scrollTop: convWrapper.prop('scrollHeight')
                    }, 500)
                    msgInput.removeAttr('disabled')
                }
            },
            error: function (res){
                alert('Error')
                console.log(res)
                msgInput.removeAttr('disabled')
            }
        })
}

// 分解后task对应的prompt卡片
function renderData(data, index) {
    workerindex += 1
  // document.getElementById('data-container').innerHTML = '';
  // document.getElementById('cardsContainer').innerHTML = '';

  $('#cardsContainer').append(createCard(data, index));
  $('#data-container').append(createTaskCard(data, index));

  document.getElementById("addItem" + index).addEventListener("click",function () {
      $("#collapsePrework"+ index + " .card-body").append(addNewItem());
  })
    switchPrompt( index, 0)
  const currentPrompt = document.getElementById(`taskname${index}`);
  const secondCardPrompt = document.getElementById(`workername${index}`);

  // 为当前选择的文本域添加事件监听器
  currentPrompt.addEventListener('input', (event) => {
    secondCardPrompt.value = event.target.value;
  });

  // 为第二个卡片的 Prompt 文本域添加事件监听器
  secondCardPrompt.oninput = (event) => {
    currentPrompt.value = event.target.value;
  };
}
function createTaskCard(data, index){
    let html = `
      <div class="col-12 mb-3 task-container" style="margin-bottom: 5px">
        <div class="card task-card" data-task-id="${index}" style="margin-bottom: 5px;border: 2px solid #a1c4fd;" draggable="true">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: gainsboro" >
    
                <input type="text" class="form-control" value="${data.output[0]}" id= "taskname${index}" style="width:auto;">
                <div>
                    <button type="button" class="btn btn-primary btn-sm me-2" data-bs-toggle="collapse" data-bs-target="#card-content-${index}" aria-expanded="false" aria-controls="card-content-${index}" ><i class="bi bi-chevron-down"></i></button>
                    <button type="button" class="btn btn-primary btn-sm me-2" onclick="showWorker(${index})"><i class="bi bi-eye"></i></>
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeCard(${index})">&times;</button>
                </div>
            </div>
            <div class="collapse" id="card-content-${index}">
                <div class="card-body card-body-${index}">
                    <div class="row">
                        <div class="col-md-5">
                            <label for="context-${index}" class="form-label">Task</label>
                            <textarea style="width: 100%" id="context-${index}" rows="3">${data.content}</textarea>
                        </div>
                        <div class="col-md-1 d-flex align-items-center justify-content-center">
                            <i class="bi bi-arrow-right" style="font-size: 24px;" onclick="regetprompt(${index})"></i>
                        </div>
                        <div class="col-md-6">
                    <div class="d-flex align-items-center">
                        <label for="prompt-${index}" class="form-label me-3">Prompt</label>
                        <div class="btn-group" role="group" id="prompt-group-${index}">
                            ${data.prompt.map((_, i) => `
                                <button type="button" class="btn btn-smaller${i === 0 ? ' btn-prompt-active' : ' btn-prompt'}" id="prompt-btn-${index}-${i}" onclick="switchPrompt(${index}, ${i})">${i + 1}</button>
                            `).join('')}
                            <button type="button" class="btn btn-secondary btn-smaller" id="add-prompt-btn-${index}" onclick="addPrompt(${index})"><i class="bi bi-plus"></i></button>
                        </div>
                    </div>
                    <div id="prompt-container-${index}">
                        ${data.prompt.map((prompt, i) => `
                            <textarea class="mt-1${i === 0 ? '' : ' d-none'}" id="prompt-${index}-${i}" rows="3" style="width: 100%">${prompt}</textarea>
                        `).join('')}
                    </div>
                </div>
                </div>
            </div>
        </div>
        </div>
    `;
    return html
}
// 分解后task对应的worker卡片
function createCard(data, index) {
    let preworkItems = '';
    data.input.forEach(item => {
        preworkItems += `
            <div class="prework-item input-group mb-3" style="border: 1px solid transparent;">
                    <input type="text" class="form-control" placeholder="Enter Prework Item" value="${item[0]}">
                    <button type="button" class="btn confirm-button" data-output="${item[1]}" style="border-color: black;background-color: white">
                        <i class="fa fa-check" style="display: ${item[1] === 'yes' ? 'block': 'none'}"></i>
                    </button>
                    <button type="button" class="btn btn-light delete-button" style="border-color: black;">
                        <i class="fa fa-minus" style="color: black;"></i>
                    </button>
                </div>`;
    });
    let card1 = `
        <div class="card text-black my-3 worker-card" style="display: none; border: 2px solid black; width: 100%;" data-worker-id="${index}">
            <div class="card-header">
                <h5 class="card-title text-center">Worker</h5>
            </div>
            <div class="card-body">
                <div class="input-group mb-3">
                    <span class="input-group-text">Work Name</span>
                    <input type="text" class="form-control" value="${data.output[0]}" placeholder="Enter Worker Name" id= "workername${index}">
                    <button type="button" class="btn output-button" data-output="${data.output[1]}" style="background-color: white;border-color: black">
                        <i class="fa fa-check" style="display: ${data.output[1] === 'yes' ? 'block': 'none'}"></i>
                    </button>
                </div>
                <div class="card">
                    <div class="card-header">
                        <a class="collapsed btn" data-bs-toggle="collapse" href="#collapsePrework${index}" style="text-align: center; height: 20px; padding-top: 0;">
                            Prework
                        </a>
                        <i class="fa fa-plus" id="addItem${index}" style="height: 20px; padding-top: 3px; float: right; padding-right: 5px; cursor:pointer;"></i>
                    </div>
                    <div id="collapsePrework${index}" class="collapse show">
                        <div class="card-body" style="padding-top: 5px;padding-bottom: 5px">
                            ${preworkItems}
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <a class="collapsed btn" data-bs-toggle="collapse" href="#collapsePrompt${index}" style="text-align: center; height: 20px; padding-top: 0;">
                            Prompt
                        </a>
                    </div>
                    <div id="collapsePrompt${index}" class="collapse show">
                        <div class="card-body">
                            <div class="form-floating">
                                <textarea onclick="targt2SPL(this.id)" class ='prompt-control' id="promptInput${index}" placeholder="Enter Prompt" style="width: 100%">${data.prompt[0]}</textarea>
<!--                                <label class="form-label" for="promptInput${index}"></label>-->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">Model</span>
                    <label>
                        <select class="form-select">
                            <option${data.model === "gpt-3.5-turbo" ? ' selected="selected"' : ''}>gpt-3.5-turbo</option>
                            <option${data.model === "text-davinci-3" ? ' selected="selected"' : ''}>text-davinci-003</option>
                            <option${data.model === "DALL-E" ? ' selected="selected"' : ''}>DALL-E</option>
                            <option${data.model === "PythonREPL" ? ' selected="selected"' : ''}>PythonREPL</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>`;
    return card1;
}

function createlogiccard(logic, index , logiccard){
    logiccard = logiccard ? logiccard: initlogiccard
    workerindex += 1
    let html = `
      <div class="col-12 mb-3 task-container" style="margin-bottom: 2px;">
  <div class="card logic-card" data-task-id="${index}" draggable="true" style="border: 2px solid #a1c4fd;">
    <div class="card-header" draggable="true" style="background-color: gainsboro">
      <div class="d-flex align-items-center">
        <h5 class="card-title me-2">${logic}</h5>
        <div class="input-group input-group-sm flex-grow-1">
          <input type="text" class="form-control" placeholder="Input1" value="${logiccard.input1}">
          <select class="form-select" aria-label="逻辑运算符">
            <option selected>=</option>
            <option>></option>
            <option><</option>
            <option>≥</option>
            <option>≤</option>
            <option>≠</option>
          </select>
          <input type="text" class="form-control" placeholder="Input2" value="${logiccard.input2}">
        </div>
        <button type="button" class="btn btn-primary btn-sm ms-2" data-bs-toggle="collapse" data-bs-target="#card-content-${index}" aria-expanded="false" aria-controls="card-content-${index}"><i class="bi bi-chevron-down"></i></button>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeCard(${index})">&times;</button>
      </div>
    </div>
    <div class="collapse show" id="card-content-${index}">
      <div class="card-body card-body-${index}" >
      </div>
    </div>
  </div>
</div>
    `;
    $('#data-container').append(html)
    const logicCards = document.querySelectorAll('.logic-card');
  logicCards.forEach(function (logicCard) {
    new Sortable(logicCard.querySelector('.card-body'), {
      group: 'shared',
      animation: 300,
    });

    // Add dragstart event to the card header instead of the card itself
    const cardHeader = logicCard.querySelector('.card-header');
    cardHeader.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', '');
    });
  });
}
function switchPrompt(index, promptIndex) {
    // Update the active state of prompt buttons
    const promptGroup = document.getElementById(`prompt-group-${index}`);
    for (let i = 0; i < promptGroup.childElementCount - 1; i++) {
        const button = document.getElementById(`prompt-btn-${index}-${i}`);
        if (i === promptIndex) {
            button.classList.add('btn-prompt-active');
            button.classList.remove('btn-prompt');
        } else {
            button.classList.add('btn-prompt');
            button.classList.remove('btn-prompt-active');
        }
    }

    // Show the selected prompt textarea and hide others
    const promptContainer = document.getElementById(`prompt-container-${index}`);
    for (let i = 0; i < promptContainer.childElementCount; i++) {
        const textarea = document.getElementById(`prompt-${index}-${i}`);
        if (i === promptIndex) {
            textarea.classList.remove('d-none');
        } else {
            textarea.classList.add('d-none');
        }
    }

    // 获取第一个卡片中的当前选择的 Prompt 文本域
  const currentPrompt = document.getElementById(`prompt-${index}-${promptIndex}`);
  const secondCardPrompt = document.getElementById(`promptInput${index}`);

  // 解除先前绑定的事件监听器
  secondCardPrompt.oninput = null;

  // 为当前选择的文本域添加事件监听器
  currentPrompt.addEventListener('input', (event) => {
    secondCardPrompt.value = event.target.value;
  });

  // 为第二个卡片的 Prompt 文本域添加事件监听器
  secondCardPrompt.oninput = (event) => {
    currentPrompt.value = event.target.value;
  };

  // 同步初始值
  secondCardPrompt.value = currentPrompt.value;
}
function addPrompt(index) {
    const promptGroup = document.getElementById(`prompt-group-${index}`);
    const newPromptIndex = promptGroup.childElementCount - 1;
    const newPromptButton = document.createElement('button');
    newPromptButton.type = 'button';
    newPromptButton.classList.add('btn', 'btn-prompt', 'btn-smaller');
    newPromptButton.id = `prompt-btn-${index}-${newPromptIndex}`;
    newPromptButton.textContent = newPromptIndex + 1;
    newPromptButton.onclick = () => switchPrompt(index, newPromptIndex);

    promptGroup.insertBefore(newPromptButton, promptGroup.lastElementChild);

    // Create a new prompt textarea
    const promptContainer = document.getElementById(`prompt-container-${index}`);
    const newPromptTextarea = document.createElement('textarea');
    newPromptTextarea.classList.add('mt-1', 'd-none');
    newPromptTextarea.style.width = '100%'
    newPromptTextarea.id = `prompt-${index}-${newPromptIndex}`;
    newPromptTextarea.rows = 3;
    promptContainer.appendChild(newPromptTextarea);

    // Call the switchPrompt function with the new prompt index
    switchPrompt(index, newPromptIndex);
}
function toggleWorkerCard(workerId) {
  const workerCard = document.querySelector(`[data-worker-id="${workerId}"]`);
  if (workerCard.style.display === "none") {
    workerCard.style.display = "block";
  } else {
    workerCard.style.display = "none";
  }
}
function deletePrompt(index) {
    const promptGroup = document.getElementById(`prompt-group-${index}`);
    const activePromptButton = promptGroup.querySelector('.btn-prompt-active');
    if (!activePromptButton) {
        return;
    }

    const activePromptIndex = Array.from(promptGroup.children).indexOf(activePromptButton);
    activePromptButton.remove();

    // Update the index numbers for the remaining buttons
    for (let i = activePromptIndex; i < promptGroup.childElementCount - 1; i++) {
        const button = promptGroup.children[i];
        button.textContent = i + 1;
        button.id = `prompt-btn-${index}-${i}`;
        button.onclick = () => switchPrompt(index, i);
    }

    // Call the switchPrompt function with the new active prompt index
    const newActivePromptIndex = Math.max(activePromptIndex - 1, 0);
    switchPrompt(index, newActivePromptIndex);
}
function removeCard(index) {
  // delete promptchain[genalprompt[index]["output"]]
  // genalprompt.splice(index, 1);
  const attributeName = 'data-worker-id';
  const taskname = 'data-task-id';
  const card1 = document.querySelector(`[${attributeName}="${index}"]`);
  if(card1){
      card1.remove();
  }
  const card2 = document.querySelector(`[${taskname}="${index}"]`);
  if(card2){
      card2.remove();
  }
  // renderData(genalprompt);
}
function regetprompt(index){
    var data1 = {
            'input': genalprompt[index]["input"],
            'message': document.getElementById("context-" + index).value
        }
    $.ajax({
        url: serviceurl + 'Regetprompt', //http://127.0.0.1:5000/Clarify
        type: 'post',
        data: {"data" : JSON.stringify(data1)},
        success: function (res){
            if (res === -1){
                alert("Connection to Server Error")
            }
            else {
                document.getElementById("prompt-" + index).value = res;
            }
        },
        error: function (res){
            alert('Error')
            console.log(res)
        }
    })
}
function showWorker(index) {
    const workercontainer = document.getElementById("cardsContainer")
    if(workercontainer.style.display === "none"){
        document.getElementById('stepsContainer').style.width = '65%';
        workercontainer.style.display = "block";
    }

  // 获取所有 Worker 卡片


  // 显示指定索引的 Worker 卡片
  const targetWorkerCard = document.querySelector(`.worker-card[data-worker-id="${index}"]`);

  if (targetWorkerCard) {
      if(targetWorkerCard.style.display === 'block'){
          workercontainer.style.display = 'none';
          document.getElementById('stepsContainer').style.width = '100%';
          const workerCards = document.querySelectorAll('.worker-card');
          // 隐藏所有 Worker 卡片
          workerCards.forEach((card) => {
            card.style.display = 'none';
          });
          return
      }
      const workerCards = document.querySelectorAll('.worker-card');
      // 隐藏所有 Worker 卡片
      workerCards.forEach((card) => {
        card.style.display = 'none';
      });
      targetWorkerCard.style.display = 'block';
  }
}
function addNewItem() {
    var newItem = `
        <div class="prework-item input-group mb-3">
            <input type="text" class="form-control" placeholder="Enter Prework Item">
            <button type="button" class="btn confirm-button" style="border-color: black">
                <i class="fa fa-check" style="display: none"></i>
            </button>
            <button type="button" class="btn btn-light delete-button" style="border-color: black">
                <i class="fa fa-minus" style="color: black;"></i>
            </button>
        </div>`;
    return newItem;
}
function extractDataFromCards() {
    // let workerCards = document.querySelectorAll('.worker-card');
    let data = [];
    let taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(taskcard => {
        const cardId = taskcard.getAttribute("data-task-id");
        const attributeName = 'data-worker-id';

        const card = document.querySelector(`[${attributeName}="${cardId}"]`);

        // let card = document.querySelector(`[data-worker-id =cardId]`);
        let workerId = card.getAttribute("data-worker-id");

        let workNameInput = card.querySelector('input.form-control');
        let workName = workNameInput.value;
        let outputButton = workNameInput.nextElementSibling;
        let output = outputButton.getAttribute("data-output");

        let preworkItems = card.querySelectorAll('.prework-item');
        let preworkData = [];
        preworkItems.forEach(item => {
            let preworkInput = item.querySelector('input.form-control');
            let preworkName = preworkInput.value;
            let preworkButton = preworkInput.nextElementSibling;
            let preworkStatus = preworkButton.getAttribute("data-output");
            preworkData.push([preworkName, preworkStatus]);
        });

        let promptTextarea = card.querySelector('textarea.form-control');
        let prompt = promptTextarea.value;

        let modelSelect = card.querySelector('select.form-select');
        let model = modelSelect.value;

        data.push({
            workerId: workerId,
            workName: workName,
            promptName: workName,
            output: output,
            prework: preworkData,
            "prompt": {"context": prompt},
            model: model
        });
    });

    return data;
}

function parseNesting(cards) {
  const result = [];

  cards.forEach(card => {
    const cardData = {
      id: card.getAttribute('data-task-id'),
      type: card.classList.contains("task-card") ? "task" : card.querySelector('h5.card-title').textContent.toLowerCase(),
      nestedCards: []
    };

    if (cardData.type === 'task') {
      // 仅解析任务卡片的id
        const attributeName = 'data-worker-id';

        const worker = document.querySelector(`[${attributeName}="${cardData.id}"]`);


        // let card = document.querySelector(`[data-worker-id =cardId]`);
        // let workerId = worker.getAttribute("data-worker-id");
        let workNameInput = worker.querySelector('input.form-control');
        let workName = workNameInput.value;
        let outputButton = workNameInput.nextElementSibling;
        let output = outputButton.getAttribute("data-output");

        let modelSelect = worker.querySelector('select.form-select');
        let model = modelSelect.value;

        let preworkItems = worker.querySelectorAll('.prework-item');
        let preworkData = [];
        const promptContainer = document.getElementById(`prompt-container-${cardData.id}`);
        const prompts = promptContainer.querySelectorAll('textarea');
        const promptContents = Array.from(prompts).map(prompt => prompt.value);

        preworkItems.forEach(item => {
            let preworkInput = item.querySelector('input.form-control');
            let preworkName = preworkInput.value;
            let preworkButton = preworkInput.nextElementSibling;
            let preworkStatus = preworkButton.getAttribute("data-output");
            preworkData.push([preworkName, preworkStatus]);
        });
        let taskcard = {
            'content': document.getElementById(`context-${cardData.id}`).value,
            'input': preworkData,
             'prompt': promptContents,
            'output': [workName,output],
            'model': model
        }
        let promptTextarea = worker.querySelector('textarea.prompt-control');
        let prompt = promptTextarea.value;


         //   "content": "",
    // "input": [],
    // "prompt": [""],
    // "output": "",
    // "model": "LLM"


        cardData.workName = workName;
        cardData.promptName = workName;
        cardData.output =  output;
        cardData.prework = preworkData;
        cardData.prompt =  {"Instruction": prompt};
        cardData.model = model;
        cardData.taskcard = taskcard;
    } else {
      const input1 = card.querySelector('.input-group input:nth-child(1)').value;
      const logicOperator = card.querySelector('.input-group select').value;
      const input2 = card.querySelector('.input-group input:nth-child(3)').value;
      cardData.input1 = input1;
      cardData.logicOperator = logicOperator;
      cardData.input2 = input2;

    }

    const nestedCardContainer = card.querySelector(".card-body");
    if (nestedCardContainer) {
      const nestedCards = nestedCardContainer.querySelectorAll(`.card-body-${cardData.id}>.task-container>.card`);
      if (nestedCards.length > 0) {
        cardData.nestedCards = parseNesting(nestedCards);
      }
    }

    result.push(cardData);
  });

  return result;
}
function parseCards() {
  const dataContainer = document.getElementById("data-container");
  const topLevelCards = dataContainer.querySelectorAll("#data-container> .task-container > .card");
  const parsedCards = parseNesting(topLevelCards);
  var variableBlock =StepstoUnit(parsedCards)
}

function StepstoUnit(promptchain){
    // promptchain= [{
    //         workerId: workerId,
    //         workName: workName,
    //         promptName: workName,
    //         output: output,
    //         prework: [preworkData,"yes"],
    //         prompt: {context:prompt},
    //         model: model
    //     }]
    var unitxml = document.createElement("xml");
    var unitjson = {}
    var alltaskunit = []
    for(var l=0;l<promptchain.length;l++) {
        var i;
        var worker = promptchain[l]
        if (worker.type === 'while') {
            if(Object.values(unitjson).length !== 0) {
                unitxml.appendChild(Object.values(unitjson)[0]);
                for (i = 1; i < Object.values(unitjson).length; i++) {
                    const UnitNext = Blockly.utils.xml.createElement("next");
                    UnitNext.appendChild(Object.values(unitjson)[i]);
                    Object.values(unitjson)[i - 1].appendChild(UnitNext)
                }
                const pretaskBlock = Blockly.Xml.domToBlock(unitxml.firstChild, demoWorkspace);
                unitxml = document.createElement("xml");
                unitjson = {}
                alltaskunit.push(pretaskBlock)
            }
            const newBlock = demoWorkspace.newBlock('prompt_controls_whileUntil');
            newBlock.initSvg();
            newBlock.render();
            const compareBlock = createcompare(worker)
            // 获取 prompt_controls_whileUntil 块的 IF0 输入连接
            const if0Connection = newBlock.getInput('BOOL').connection;

            // 获取 prompt_compare 块的输出连接
            const compareOutputConnection = compareBlock.outputConnection;

            // 将 prompt_compare 块连接到 prompt_controls_whileUntil 块的 IF0 输入
            if0Connection.connect(compareOutputConnection);
            // pretaskBlock.nextConnection.connect(newBlock.previousConnection);
            const doInputBlock = newBlock.getInputTargetBlock('DO');
            const taskBlock = StepstoUnit(worker.nestedCards)
            // 连接变量块到 DO 输入语句中
            if (doInputBlock) {
                // 如果 DO 输入语句中已经有一个块，则将变量块插入到该块的前面
                taskBlock.nextConnection.connect(doInputBlock.previousConnection);
            } else {
                // 如果 DO 输入语句中没有任何块，则将变量块直接连接到输入语句中
                newBlock.getInput('DO').connection.connect(taskBlock.previousConnection);
            }

            alltaskunit.push(newBlock)
        }
        else if (worker.type === "if") {
            if(Object.values(unitjson).length !== 0) {
                unitxml.appendChild(Object.values(unitjson)[0]);
                for (i = 1; i < Object.values(unitjson).length; i++) {
                    const UnitNext = Blockly.utils.xml.createElement("next");
                    UnitNext.appendChild(Object.values(unitjson)[i]);
                    Object.values(unitjson)[i - 1].appendChild(UnitNext)
                }
                const pretaskBlock = Blockly.Xml.domToBlock(unitxml.firstChild, demoWorkspace);
                unitxml = document.createElement("xml");
                unitjson = {}
                alltaskunit.push(pretaskBlock)
            }
            const newBlock = demoWorkspace.newBlock('prompt_control');
            newBlock.initSvg();
            newBlock.render();
            const compareBlock = createcompare(worker)
            // 获取 prompt_controls_whileUntil 块的 IF0 输入连接
            const if0Connection = newBlock.getInput('IF0').connection;

            // 获取 prompt_compare 块的输出连接
            const compareOutputConnection = compareBlock.outputConnection;

            // 将 prompt_compare 块连接到 prompt_controls_whileUntil 块的 IF0 输入
            if0Connection.connect(compareOutputConnection);
            // pretaskBlock.nextConnection.connect(newBlock.previousConnection);
            const doInputBlock = newBlock.getInputTargetBlock('DO0');
            const taskBlock = StepstoUnit(worker.nestedCards)
            // 连接变量块到 DO 输入语句中
            if (doInputBlock) {
                // 如果 DO 输入语句中已经有一个块，则将变量块插入到该块的前面
                taskBlock.nextConnection.connect(doInputBlock.previousConnection);
            } else {
                // 如果 DO 输入语句中没有任何块，则将变量块直接连接到输入语句中
                newBlock.getInput('DO0').connection.connect(taskBlock.previousConnection);
            }
            alltaskunit.push(newBlock)
        }
        else {
            var UnitPrompts = Blockly.utils.xml.createElement("block");
            UnitPrompts.setAttribute("type", "Prompt_template");
            UnitPrompts.setAttribute("collapsed", "true");
            var UnitPromptsId = Blockly.utils.genUid()
            UnitPrompts.setAttribute("id", UnitPromptsId);
            // RunPromptAspect[UnitPromptsId] = []
            PromptValue[worker.workName] = {}

            var UnitPromptfield = Blockly.utils.xml.createElement("field");
            UnitPromptfield.setAttribute("name", "Prompt_Name");
            UnitPromptfield.appendChild(Blockly.utils.xml.createTextNode(worker.workName));
            UnitPrompts.appendChild(UnitPromptfield);
            var UnitPromptstate = Blockly.utils.xml.createElement("statement");
            UnitPromptstate.setAttribute("name", "prompt_value");
            UnitPrompts.appendChild(UnitPromptstate);
            var UnitPromptExample = Blockly.utils.xml.createElement("block");
            UnitPromptExample.setAttribute("type", "Example");
            var UnitPromptExampleId = Blockly.utils.genUid()
            UnitPromptExample.setAttribute("id", UnitPromptExampleId)
            // RunPromptValues[UnitPromptsId][UnitPromptExampleId] = Object.values(worker['prompt'])[0]
            RunPromptAspect[UnitPromptExampleId] = ['Instruction', Object.values(worker['prompt'])[0]]
            var UnitPromptExamplefield = Blockly.utils.xml.createElement("field");
            UnitPromptExamplefield.setAttribute("name", "Example_value");
            UnitPromptExamplefield.appendChild(Blockly.utils.xml.createTextNode(Object.keys(worker['prompt'])[0]));
            UnitPromptExample.appendChild(UnitPromptExamplefield);
            UnitPromptstate.appendChild(UnitPromptExample);
            for (i = 1; i < Object.keys(worker['prompt']).length; i++) {
                var UnitPromptNext = Blockly.utils.xml.createElement("next");
                var UnitPromptExample1 = Blockly.utils.xml.createElement("block");
                UnitPromptExample1.setAttribute("type", "Example");
                var UnitPromptExample1Id = Blockly.utils.genUid();
                UnitPromptExample1.setAttribute("id", UnitPromptExample1Id)
                RunPromptAspect[UnitPromptExample1Id] = ['Instruction', Object.values(worker['prompt'])[i]]
                // PromptValues[worker.workName][Object.keys(worker['prompt'])[i]] = Object.values(worker['prompt'])[i]
                var UnitPromptExamplefield1 = Blockly.utils.xml.createElement("field");
                UnitPromptExamplefield1.setAttribute("name", "Example_value");
                UnitPromptExamplefield1.appendChild(Blockly.utils.xml.createTextNode(Object.keys(worker['prompt'])[i]));
                UnitPromptExample1.appendChild(UnitPromptExamplefield1);
                UnitPromptNext.appendChild(UnitPromptExample1);
                UnitPromptExample.appendChild(UnitPromptNext);
                UnitPromptExample = UnitPromptExample1;
            }
            // PromptList.push(UnitPrompts)

            var Unit = Blockly.utils.xml.createElement("block");
            Unit.setAttribute("type", "AI_Unit");
            var unitfield1 = Blockly.utils.xml.createElement("field");
            unitfield1.setAttribute("name", "AI_Unit");
            unitfield1.appendChild(Blockly.utils.xml.createTextNode("Worker"));
            Unit.appendChild(unitfield1)
            var unitfield2 = Blockly.utils.xml.createElement("field");
            unitfield2.setAttribute("name", "Unit_Name");
            unitfield2.appendChild(Blockly.utils.xml.createTextNode(worker['workName']));
            Unit.appendChild(unitfield2);

            var unitpreunit = document.createElement("statement");
            unitpreunit.setAttribute("name", "PreWorkers");
            if (worker.prework.length !== 0) {
                var unit_variable1 = "";
                if (Object.keys(unitjson).indexOf(worker.prework[0][0]) === -1) {
                    unit_variable1 = Blockly.utils.xml.createElement("block");
                    unit_variable1.setAttribute("type", "unit_var");
                    var var_field1 = Blockly.utils.xml.createElement("field");
                    var_field1.setAttribute("name", "unit_value");
                    var_field1.appendChild(Blockly.utils.xml.createTextNode(worker.prework[0][0]));
                    unit_variable1.appendChild(var_field1);
                    var unit_io = "";
                    var unitIOstate = "";
                    if (worker.prework[0][1] === "yes") {
                        unit_io = Blockly.utils.xml.createElement("block");
                        unitIOstate = Blockly.utils.xml.createElement("statement");
                        unit_io.setAttribute("type", "Input");
                        unitIOstate.setAttribute("name", "input_var");
                        unitIOstate.appendChild(unit_variable1)
                        unit_io.appendChild(unitIOstate);
                        unitpreunit.appendChild(unit_io);
                        unit_variable1 = unit_io;
                    } else {
                        unitpreunit.appendChild(unit_variable1);
                    }
                } else {
                    unitpreunit.appendChild(unitjson[worker.prework[0][0]]);
                    unit_variable1 = unitjson[worker.prework[0][0]];
                    delete unitjson[worker.prework[0][0]];
                }
                for (i = 1; i < worker.prework.length; i++) {
                    var next = document.createElement("next");
                    var unit_variable2 = "";
                    if (Object.keys(unitjson).indexOf(worker.prework[i][0]) === -1) {
                        unit_variable2 = Blockly.utils.xml.createElement("block");
                        unit_variable2.setAttribute("type", "unit_var");
                        var var_field2 = Blockly.utils.xml.createElement("field");
                        var_field2.setAttribute("name", "unit_value");
                        var_field2.appendChild(Blockly.utils.xml.createTextNode(worker.prework[i][0]));
                        unit_variable2.appendChild(var_field2);
                        if (worker.prework[i][1] === "yes") {
                            unit_io = Blockly.utils.xml.createElement("block");
                            unitIOstate = Blockly.utils.xml.createElement("statement");
                            unit_io.setAttribute("type", "Input");
                            unitIOstate.setAttribute("name", "input_var");
                            unitIOstate.appendChild(unit_variable2)
                            unit_io.appendChild(unitIOstate);
                            unit_variable2 = unit_io;
                        }
                        next.appendChild(unit_variable2);
                    } else {
                        next.appendChild(unitjson[worker.prework[i][0]]);
                        unit_variable2 = unitjson[worker.prework[i][0]]
                        delete unitjson[worker.prework[i][0]];
                    }
                    unit_variable1.appendChild(next);
                    unit_variable1 = unit_variable2;
                }
            }
            Unit.appendChild(unitpreunit);

            var unitpromptvalue = Blockly.utils.xml.createElement("value");
            unitpromptvalue.setAttribute("name", "Prompt");
            unitpromptvalue.appendChild(UnitPrompts)
            Unit.appendChild(unitpromptvalue);

            var unitmodelvalue = Blockly.utils.xml.createElement("value");
            unitmodelvalue.setAttribute("name", "Model");
            var unitmodelparam = Blockly.utils.xml.createElement("block");
            unitmodelparam.setAttribute("type", "LLM_Model");
            unitmodelparam.setAttribute("collapsed", "true");
            var unitmodelId = Blockly.utils.genUid();
            unitmodelparam.setAttribute('id', unitmodelId)
            var unitmodelparamfield1 = Blockly.utils.xml.createElement("field");
            unitmodelparamfield1.setAttribute("name", "LLM_Name");
            unitmodelparamfield1.appendChild(Blockly.utils.xml.createTextNode(worker.model));
            RunEngineConfigs[unitmodelId] = {}
            RunEngineConfigs[unitmodelId] = JSON.parse(JSON.stringify(EngineConfigs['PLUSEngine']));
            unitmodelparam.appendChild(unitmodelparamfield1);
            var unitmodelparamstate = Blockly.utils.xml.createElement("statement");
            unitmodelparamstate.setAttribute("name", "Model");

            var unitmodelparamengine = Blockly.utils.xml.createElement("block");
            unitmodelparamengine.setAttribute("type", "Model");
            var unitmodelparamfield2 = Blockly.utils.xml.createElement("field");
            unitmodelparamfield2.setAttribute("name", "modelName");
            unitmodelparamfield2.appendChild(Blockly.utils.xml.createTextNode(worker.model));

            unitmodelparamengine.appendChild(unitmodelparamfield2);
            unitmodelparamstate.appendChild(unitmodelparamengine)
            unitmodelparam.appendChild(unitmodelparamstate);
            if(worker.model==='PythonREPL'){
                unitmodelparam = Blockly.utils.xml.createElement("block");
                unitmodelparam.setAttribute("type", "APIEngine");
                unitmodelparamfield2 = Blockly.utils.xml.createElement("field");
                unitmodelparamfield2.setAttribute("name", "LLM_Name");
                unitmodelparamfield2.appendChild(Blockly.utils.xml.createTextNode('PythonREPL'));
                unitmodelparam.appendChild(unitmodelparamfield2);
            }
            unitmodelvalue.appendChild(unitmodelparam);
            Unit.appendChild(unitmodelvalue);

            if (worker.output === 'yes') {
                var UnitOutput = Blockly.utils.xml.createElement("block");
                UnitOutput.setAttribute("type", "Output");
                var UnitOutputstate = Blockly.utils.xml.createElement("statement");
                UnitOutputstate.setAttribute("name", "Output_var");
                UnitOutput.appendChild(UnitOutputstate);
                UnitOutputstate.appendChild(Unit);
                Unit = UnitOutput;
            }
            unitjson[worker.workName] = Unit;
        }
    }
    if(Object.values(unitjson).length !== 0) {
        unitxml.appendChild(Object.values(unitjson)[0]);
        for (i = 1; i < Object.values(unitjson).length; i++) {
            var UnitNext = Blockly.utils.xml.createElement("next");
            UnitNext.appendChild(Object.values(unitjson)[i]);
            Object.values(unitjson)[i - 1].appendChild(UnitNext)
        }
        const taskBlock1 = Blockly.Xml.domToBlock(unitxml.firstChild, demoWorkspace);
        alltaskunit.push(taskBlock1)
    }
    for(i = 0;i < alltaskunit.length-1;i++){
        alltaskunit[i].nextConnection.connect(alltaskunit[i+1].previousConnection);
    }
     // newBlock.moveBy(100, 100);
    return alltaskunit[0]
}

function createcompare(worker){
    const compareBlock = demoWorkspace.newBlock('prompt_compare');
    compareBlock.initSvg();
    compareBlock.render();

    // 创建 unit_var 块并设置其 unit_value
    const unitVarBlock = demoWorkspace.newBlock('unit_var_value');
    unitVarBlock.setFieldValue(worker.input1, 'unit_value');
    unitVarBlock.initSvg();
    unitVarBlock.render();

    // 创建 text 块并设置其值
    const textBlock = demoWorkspace.newBlock('text');
    textBlock.setFieldValue(worker.input2, 'TEXT');
    textBlock.initSvg();
    textBlock.render();

    // 将 unit_var 块连接到 prompt_control 的 A 输入
    const controlCompareInputA = compareBlock.getInput('A');
    const unitVarConnection = unitVarBlock.outputConnection;
    controlCompareInputA.connection.connect(unitVarConnection);

    // 将 text 块连接到 prompt_control 的 B 输入
    const controlCompareInputB = compareBlock.getInput('B');
    const textConnection = textBlock.outputConnection;
    controlCompareInputB.connection.connect(textConnection);


    // 设置逻辑操作符的值
    switch (worker.logicOperator) {
      case '=':
        compareBlock.setFieldValue('EQ', 'OP');
        break;
      case '≠':
        compareBlock.setFieldValue('NEQ', 'OP');
        break;
      case '<':
        compareBlock.setFieldValue('LT', 'OP');
        break;
      case '≤':
        compareBlock.setFieldValue('LTE', 'OP');
        break;
      case '>':
        compareBlock.setFieldValue('GT', 'OP');
        break;
      case '≥':
        compareBlock.setFieldValue('GTE', 'OP');
        break;
    }
    return compareBlock
}

function toggleArrowIcon() {
    var arrowButton = $('#arrow-button');
    var arrowIcon = arrowButton.find('.fa');

    if (arrowIcon.hasClass('fa-chevron-up')) {
        document.getElementById('Require_display_container').style.display = 'none';
        document.getElementById('data-container').style.height = '60vh';
        arrowIcon.removeClass('fa-chevron-up');
        arrowIcon.addClass('fa-chevron-down');
    } else {
        document.getElementById('Require_display_container').style.display = 'block';
        document.getElementById('data-container').style.height = '45vh';
        arrowIcon.removeClass('fa-chevron-down');
        arrowIcon.addClass('fa-chevron-up');
    }
}

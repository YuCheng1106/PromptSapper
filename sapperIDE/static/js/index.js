/*
----------------------------------------------------------------------------
Project Name: [Sapper IDE]
File: [index.js]
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
var serviceurl = ""


var ProjectList = [];
// Variable of created block
var Variable_xmlList = [];
var variableSPL = {};
// project prompt
var PromptList = [];
// prompt base
var PrompttemplateList = [];
// engine of AI model
var EngineConfigs = {
    'PLUSEngine':{
    'temperature': [0.7, 0.01, 1,'Temperature'],
    'max_tokens': [225, 1,2048,'Maximum length'],
    'top_p': [1, 0.01, 1,'Top P'],
    'frequency_penalty': [0 ,0.01,2,'Frequency penalty'],
    'presence_penalty': [0,0.01,2,'Presence penalty'],
    },
}
var RunEngineConfigs = {}
var ModelConfigs = {
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
var RunModelConfigs = {};
// project model
var ModelList = [];
// model base
var DIYmodelList = [];
var APIEngine = [];
var TraditionEngine = [];
var RunPromptAspect = {}
var PromptValue = {'Prompt_Name':[['Instruction', '']]}
var ImportPromptValue = {}

// ID of the prompt context block created
var CreateExample = [];
var BlockDebugIDs = ["input_value"]
var DebugFlag = false
var RerunFlag = false
// var controller;
var InputFlag = false
// ID of the prompt block created
// prompt's values of prompt base
var PromptValues = {};

var PythonPromptValues = {}
// model's values of model base
var ModelValues = {};
// upload and save projects
var ProjectValues = {}
var OpenAIKey = "";
var initvariables = []
// 云端部署时记录第一个接收input数据的变量
var recordinput = "preInfo"
// worker的编号
var workerindex = 0

// design view 的聊天记录
var ClarifyConversion = [];
// exploration view  的聊天记录
var ExploreConversion = [];
// 该project的产品经理
var DesignManager = '';
let WindowHeight = window.innerHeight;
var PromptTemplateShownId = "";
// create main workspace of blockly

document.getElementById('sapper_body').style.height = WindowHeight - 55 + 'px';
document.getElementById("WorkDiv").style.height = WindowHeight - 80 + 'px';

document.getElementById("BlockConsoleDebug").style.display = "none";
function storeApiKeyToCookie() {
    var apiKeyInput = document.getElementById("OpenAIKey");
    OpenAIKey = apiKeyInput
    var apiKeyValue = apiKeyInput.value;

    // 存储API密钥到Cookie，有效期设置为365天
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 365);

    document.cookie = "openai_api_key=" + encodeURIComponent(apiKeyValue) + "; expires=" + expirationDate.toUTCString() + "; path=/";
}

// 如果Cookie中已经存在API密钥，则在输入框中填充它
function fillApiKeyFromCookie() {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf("openai_api_key=") === 0) {
            var apiKeyValue = decodeURIComponent(cookie.substring("openai_api_key=".length, cookie.length));
            document.getElementById("OpenAIKey").value = apiKeyValue;
            break;
        }
    }
}

// 当页面加载时，尝试从Cookie中填充API密钥
window.onload = function() {
    fillApiKeyFromCookie();
    OpenAIKey = document.getElementById("OpenAIKey").value;
};
document.getElementById('ShowProjectDiv').addEventListener('click',function(event){
    if(event.target.className !== 'btn content_button'){
        return;
    }
    for(var i = 0; i < document.getElementById('ShowProjectDiv').children.length; i++){
        document.getElementById('ShowProjectDiv').children[i].style.backgroundColor = 'gainsboro';
    }
    save_project()
    event.target.style.backgroundColor = '#b4afaf';
    initIDE();
    // update_project(initproject);
    var name_width = getTextWidth(event.target.innerText,13);
    document.getElementById("Save_Project_Name").style.width = name_width + 10 + "px";
    document.getElementById("Save_Project_Name").innerText=event.target.innerText;
    update_project(ProjectValues[event.target.innerText]);
});

function getTextWidth(str,fontSize){
    let result = 10;

    let ele = document.createElement('span')
    //字符串中带有换行符时，会被自动转换成<br/>标签，若需要考虑这种情况，可以替换成空格，以获取正确的宽度
    //str = str.replace(/\\n/g,' ').replace(/\\r/g,' ');
    ele.innerText = str;
    //不同的大小和不同的字体都会导致渲染出来的字符串宽度变化，可以传入尽可能完备的样式信息
    ele.style.fontSize = fontSize;

    //由于父节点的样式会影响子节点，这里可按需添加到指定节点上
    document.documentElement.append(ele);

    result =  ele.offsetWidth;

    document.documentElement.removeChild(ele);
    return result;
}

var demoWorkspace = Blockly.inject('blocklyDiv',{
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
// create model workspace of blockly
var ModelWorkspace = Blockly.inject('CreateModelDiv',{
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
	zoom : {media: serviceurl + 'static/media/',
		controls : true,
		startScale : 1,
		maxScale : 3,
		minScale : 0.3,
		scaleSpeed : 1.2
	}
});
// create prompt workspace of blockly
var PromptWorkspace = Blockly.inject('CreatePromptDiv',{
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

// Initial interface state.
var initproject = {
    "DesignManager":'',
    "PromptValue": {'Prompt_Name':[['Instruction', '']]},
    "ImportPromptValue" : {},
    "RunPromptAspect" :{},
  "Code_xmlList":[],
  "Variable_xmlList":["<button xmlns=\"http://www.w3.org/1999/xhtml\" text=\"Create Variable...\" callbackkey=\"Create_Variable\"></button>"],
  "PromptList":["<button xmlns=\"http://www.w3.org/1999/xhtml\" text=\"Import Prompt...\" callbackkey=\"Create_Prompt\"></button>"],
  "PrompttemplateList":[],
  "ModelList":["<button xmlns=\"http://www.w3.org/1999/xhtml\" text=\"Import Engine...\" callbackkey=\"Create_Model\"></button>"],
  "DIYmodelList":["<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"LLM_Model\"></block>"],
  "APIEngine":["<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"APIEngine\"></block>", "<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"APIEngine\"><field name=\"LLM_Name\">GetMovieReview</field></block>", "<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"APIEngine\"><field name=\"LLM_Name\">paperresearch</field></block>", "<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"APIEngine\"><field name=\"LLM_Name\">paperextract</field></block>","<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"APIEngine\"><field name=\"LLM_Name\">paperplotting</field></block>","<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"APIEngine\"><field name=\"LLM_Name\">DataPlotting</field></block>"],
  "TraditionEngine":["<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"LLM_Model\"></block>"],
  "PromptValues":{},
  "ModelValues":{},
    "RunPromptValues":{},
  "workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"></xml>"
}
var huixiaoshi = {"Code_xmlList":[],"Variable_xmlList":[],"PromptList":[],"PrompttemplateList":[],"ModelList":[],"DIYmodelList":[],"APIEngine":[],"PromptValue":{"Prompt_Name":[["Instruction",""]],"Artistic_Conception1":{},"Artistic_Conception2":{},"Artistic_Conception3":{},"Concise_Phrases":{},"Suitable_Phrases":{},"Painting_Style":{},"Style_Characteristics1":{},"Style_Characteristics2":{},"Style_Characteristics":{},"Refined_Artistic_Conception":{},"Style_Characteristics3":{}},"ModelValues":{},"RunPromptAspect":{"C$/s!BL(8]lrP_z(Ke(U":["Instruction","Create a visual artwork based on the following lines of poetry: {{Poetry_Lines}}. Consider using a variety of mediums such as painting, sculpture, photography, etc. to express the emotion and imagery of the poem."],":*/Mgkx%f4U|EYKNPTMO":["Instruction","Create a visual artwork inspired by the following lines of poetry: {{Poetry_Lines}}. Incorporate elements of color, texture, and shape to represent the mood and themes of the poem."],"0}Jpc=i:Y~U@JbG839ye":["Instruction","Generate a visual representation of {{Poetry_Lines}} that conveys a mood or emotion. Consider elements such as color, texture, and composition to create a unique artistic conception."],"M`VAI7@SgN(?TGY%z/{=":["Instruction","Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three and synthesize them into a new unified concept."],"WRdbh0v}aQ@8oQvivrPo":["Instruction","Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. Focus on the main components of the idea and explain them in clear language."],"%}mEp9C4%.y@wce01kFj":["Instruction","Select the phrases from the list of {{Concise_Phrases}} that best describe the mood, atmosphere, and theme of a painting. Consider factors such as color, light, and texture."],"Rj+CUTj{#([MMS6IhdMZ":["Instruction","Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood, tone, and imagery of the poem when making your selection."],"c6h,bs][@$CLUoiDyNI8":["Instruction","Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition, and other elements. Include examples of artwork that demonstrate these characteristics."],"bq^.nJ9K~MWZVnw,2S4q":["Instruction","Use {{Poetry_Lines}} to create a painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."],"OlVfohj__mmOo$5b8/K^":["Instruction","Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."],"Tk{L4(GtiZ~`#P:sJQ5,":["Instruction","Create a visual artwork based on the following lines of poetry: {{Poetry_Lines}}. Consider using a variety of mediums such as painting, sculpture, photography, etc. to express the emotion and imagery of the poem."],"M}lf~{#hau(%IoaorFK]":["Instruction","Create a visual artwork inspired by the following lines of poetry: {{Poetry_Lines}}. Incorporate elements of color, texture, and shape to represent the mood and themes of the poem."],"j=4yy]0%c:8?23?X+#-,":["Instruction","Generate a visual representation of {{Poetry_Lines}} that conveys a mood or emotion. Consider elements such as color, texture, and composition to create a unique artistic conception."],"d`pj/*$.pN|#m)jj;$JW":["Instruction","Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three and synthesize them into a new unified concept."],"lBnV8*jK=EndyvHJ{=VJ":["Instruction","Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. Focus on the main components of the idea and explain them in clear language."],"b;+G+pT29E5t={.$4.AQ":["Instruction","Select the phrases from the list of {{Concise_Phrases}} that best describe the mood, atmosphere, and theme of a painting. Consider factors such as color, light, and texture."],"kgyGc!?m1iw,:DR+iT4V":["Instruction","Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood, tone, and imagery of the poem when making your selection."],"A5c`4c4yRN~?*C]DRRMa":["Instruction","Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition, and other elements. Include examples of artwork that demonstrate these characteristics."],"U$hBJo}dnq5G!S;tM6(W":["Instruction","Use {{Poetry_Lines}} to create a painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."],"v:Q@}9H0DH`n3M[}XlA.":["Instruction","Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."],"MWx^z6!RwN=[12GZ*Xzi":["Instruction","Create a visual artwork based on the following lines of poetry: {{Poetry_Lines}}. Consider using a variety of mediums such as painting, sculpture, photography, etc. to express the emotion and imagery of the poem."],"t#8*_X;|5I;r|eg#6iMs":["Instruction","Create a visual artwork inspired by the following lines of poetry: {{Poetry_Lines}}. Incorporate elements of color, texture, and shape to represent the mood and themes of the poem."],"hnw)G@$dPLBrJn7@Jtu(":["Instruction","Generate a visual representation of {{Poetry_Lines}} that conveys a mood or emotion. Consider elements such as color, texture, and composition to create a unique artistic conception."],"3$f(zez~.`0UP1eHyK[T":["Instruction","Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three and synthesize them into a new unified concept."],"4]+JJnrhW?41AZH@xiNB":["Instruction","Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. Focus on the main components of the idea and explain them in clear language."],"Wa@;]**3g/`Z-(YG)9zB":["Instruction","Select the phrases from the list of {{Concise_Phrases}} that best describe the mood, atmosphere, and theme of a painting. Consider factors such as color, light, and texture."],"}YQ=@+wriSgGcvDt8LJp":["Instruction","Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood, tone, and imagery of the poem when making your selection."],"ERYciE,91%HEB~5fO^.N":["Instruction","Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition, and other elements. Include examples of artwork that demonstrate these characteristics."],"c%[;$ZS8{.uN[jV}5`P4":["Instruction","Use {{Poetry_Lines}} to create a painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."],".|PmhpjZa10nX2V8+!Sb":["Instruction","Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."],",XNb$r(){}o2KI0OSdX%":["Instruction","Create a visual artwork based on the following lines of poetry: {{Poetry_Lines}}. Consider using a variety of mediums such as painting, sculpture, photography, etc. to express the emotion and imagery of the poem."],"bmRGFGm#*#iFv4%RB6vn":["Instruction","Create a visual artwork inspired by the following lines of poetry: {{Poetry_Lines}}. Incorporate elements of color, texture, and shape to represent the mood and themes of the poem."],"}DOs{{A?Z,CBqFGp!RN-":["Instruction","Generate a visual representation of {{Poetry_Lines}} that conveys a mood or emotion. Consider elements such as color, texture, and composition to create a unique artistic conception."],"],HD[I~]kd+|)/m4Vc-O":["Instruction","Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three and synthesize them into a new unified concept."],"Ymn@B(CZNVS0~`(Q)#Ic":["Instruction","Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. Focus on the main components of the idea and explain them in clear language."],"5P8%2**o:`s.u#]/FNaz":["Instruction","Select the phrases from the list of {{Concise_Phrases}} that best describe the mood, atmosphere, and theme of a painting. Consider factors such as color, light, and texture."],"0OAxF.Y{Mqd^oqH#)V-C":["Instruction","Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood, tone, and imagery of the poem when making your selection."],"t_Q]DH3C8Ts800ONGVvk":["Instruction","Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition, and other elements. Include examples of artwork that demonstrate these characteristics."],"8HMoa^}ls5}@ppsyk(er":["Instruction","Use {{Poetry_Lines}} to create a painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."],"/B-29AH|O1`]01EpW06@":["Instruction","Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."],"h!,y;Bn`}`cNM;E_-d)r":["Instruction","Create a visual artwork based on the following lines of poetry: {{Poetry_Lines}}. Consider using a variety of mediums such as painting, sculpture, photography, etc. to express the emotion and imagery of the poem."],"ds.^^]ZvCu;@MgXW83`,":["Instruction","Create a visual artwork inspired by the following lines of poetry: {{Poetry_Lines}}. Incorporate elements of color, texture, and shape to represent the mood and themes of the poem."],"P;le3o7B/EH2aUGrXX.*":["Instruction","Generate a visual representation of {{Poetry_Lines}} that conveys a mood or emotion. Consider elements such as color, texture, and composition to create a unique artistic conception."],":H:iF^GGF5^OE?v_)+fe":["Instruction","Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three and synthesize them into a new unified concept."],",Zqjt*~$S:(qZ[LD0us$":["Instruction","Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. Focus on the main components of the idea and explain them in clear language."],"smFm-t*CGXVNL]I4OXh7":["Instruction","Select the phrases from the list of {{Concise_Phrases}} that best describe the mood, atmosphere, and theme of a painting. Consider factors such as color, light, and texture."],"=?I|I2}j]Jh$Y:w{?(3F":["Instruction","Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood, tone, and imagery of the poem when making your selection."],"T6%X}5lK.y2Zd+]8r5YR":["Instruction","Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition, and other elements. Include examples of artwork that demonstrate these characteristics."],"I=h_FxJDkn1RZ#c26w@s":["Instruction","Use {{Poetry_Lines}} to create a painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."],"`hXE6}e2yNJIK-[Y}hSR":["Instruction","Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."],"%TF5JU5s5E/6SOK|#z}@":["Instruction","Create a visual artwork based on the following lines of poetry: {{Poetry_Lines}}. Consider using a variety of mediums such as painting, sculpture, photography, etc. to express the emotion and imagery of the poem."],"716z0o+w}BiZ@Bn/T`!N":["Instruction","Create a visual artwork inspired by the following lines of poetry: {{Poetry_Lines}}. Incorporate elements of color, texture, and shape to represent the mood and themes of the poem."],"?JUk@.Yh^JnGBb2J7,p^":["Instruction","Generate a visual representation of {{Poetry_Lines}} that conveys a mood or emotion. Consider elements such as color, texture, and composition to create a unique artistic conception."],"DA.#@j4thzRXT)M!,4Qr":["Instruction","Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three and synthesize them into a new unified concept."],"UiJAN0U4`BfnCa:pund7":["Instruction","Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. Focus on the main components of the idea and explain them in clear language."],"iEhVPoQ:?+k4uJm:Zsf=":["Instruction","Select the phrases from the list of {{Concise_Phrases}} that best describe the mood, atmosphere, and theme of a painting. Consider factors such as color, light, and texture."],"TVYf3nepI$c$aX,)ZTB2":["Instruction","Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood, tone, and imagery of the poem when making your selection."],"9YHMVY4*vSC`4o8FPp{(":["Instruction","Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition, and other elements. Include examples of artwork that demonstrate these characteristics."],"K0bUbmmo4A;XD%e,r0L^":["Instruction","Use {{Poetry_Lines}} to create a painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."],"xfKVms+289^}@R{?2#cb":["Instruction","Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."],")qy=SJ/G-tC)VL8e19l+":["Instruction","Create an artistic conception based on the following lines of poetry: {{Poetry_Lines}}. Consider using a variety of mediums such as painting, sculpture, photography, etc. to express the emotion and imagery of the poem."],"Vgz:o-S}_feZ3AF(u!k[":["Instruction","Create an artistic conception inspired by the following lines of poetry: {{Poetry_Lines}}. Incorporate elements of color, texture, and shape to represent the mood and themes of the poem."],"L.FGGy?[!]YY!ov)BMip":["Instruction","Generate an artistic conception of {{Poetry_Lines}} that conveys a mood or emotion. Consider elements such as color, texture, and composition to create a unique artistic conception."],"7fP6o5GjA8|^2OQiN*1m":["Instruction","Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three."],"(tnk;[8Trvmk`+keGMUo":["Instruction","Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. Focus on the main components of the idea and explain them in clear language."],"/D5MyKxRsOWgfzpJE,Rl":["Instruction","Select the phrases from the list of {{Concise_Phrases}} that best describe theme of a painting."],"wO{8c_g2(u3$BLuT.qvP":["Instruction","Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood, tone, and imagery of the poem when making your selection."],"-mHOWcX5jH$M1t]Je]F!":["Instruction","Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition, and other elements. Include examples of artwork that demonstrate these characteristics."],"?efji/i[(1|G[9pQl86,":["Instruction","Use {{Poetry_Lines}} to create a painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."],"q_Q=FmLV^LcxAB$KfDN@":["Instruction","Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."],"dmSqOrBFowB*9peJuCfo":["Instruction","Create an artistic conception based on the following lines of poetry: {{Poetry_Lines}}. "],"vzXky4gZP)76ezMvjnlK":["Instruction","Create an artistic conception inspired by the following lines of poetry: {{Poetry_Lines}}. "],"7g7Jy09A@4#[)0TSBFih":["Instruction","Generate an artistic conception of {{Poetry_Lines}} that conveys a mood or emotion."],"9${;zq*M4by,L;TXh2jp":["Instruction","Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three."],"tf0s+/cQlg;K3REQ7sh$":["Instruction","Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. "],"cX+!yW8GP,E~uHB0yijL":["Instruction","Select the phrases from the list of {{Concise_Phrases}} that best describe theme of a painting."],"Sxp7?en8a,=x8*?%gG19":["Instruction","Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood of the poem when making your selection."],"ga$=l:{Di0iKy[7$|-OE":["Instruction","Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition."],"i^,Ebk[|^6tk.:r[/ZPs":["Instruction","Use {{Poetry_Lines}} to create a {{Painting_Style}} painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."],"EF+OqTvx@`,xN#BB;2^t":["Instruction","Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."]},"ImportPromptValue":{},"TraditionEngine":[],"RunEngineConfigs":{"YHh?2l3(])]E.DQSNyJn":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"v?bn`3LKwXENLqZRq}Vg":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"b%j8K7W,GO=/QHosH:wC":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"]:4%kWl#9{a-_{n`F/f{":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"d?g^+}hy?3UcQElV/J4}":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"{.KU3*(n:}sd^Ercii,2":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"*^vYebdF;LaaK7Jo{ngy":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"B{nTzG^z2cBioRvE#vJR":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},")!`rcqAtG$5D7yOk8C[1":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},":,GD+R+kB)WxY[XSMEUZ":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"6FZzCoFyciUh.dlX^VrU":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"QeHrND=3*rDfRgqnCbXw":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"SZFOx9}0d9p2%M*bVlM-":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"eKeuy1;-v^5qdb|p9.?8":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"u]1%Rv7WOmKOm.P,LXm@":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"S6S+?}%8_10dAJGF9j6%":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"s)1w#32Z+#$XxQ2y,;l]":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"$O1;j{zuk(JmZ4ZB5`;o":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"c8s,b/vswMsJ~r.GuhGY":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"~Tts5,M:%dPohZpoDu,/":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"ZnRUOh{lF+aU4O$u4{.1":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"al^V}1rW~iCIYn+VGG~`":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"%,0:F(k0HP;cB4v+G.T-":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"/5A#V8iL{;A4Rro8238j":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"4L)2Gx@Wkmi^UxtsX+Km":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"wweQX4+!{%}neSSzN5u1":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"4#-SC0w],0L6}Ujly*is":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"IUOI_.c4?/KVu98ZjMEg":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"c@v0C}:#)7}]X~5tM#b%":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"lOqcc*t:v$8QZE|gr/zI":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"tlzRl~1~?qdNSDz`EEww":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"oIiBpB_o^vFy~j+KUZlF":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"SwxjL*AZag]mX-gR-73u":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"L%A*39#N!vgA_PGwiyiW":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"(VqmO00jd@^+e0#AOB*/":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"z^6CcF5:^F??e:i1qqB2":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"z%mzwa%e,]5^U%24X??4":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"V0#nur%[C3(q9`}.tK!%":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"or0j[B+91h|z2-bJKNfR":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"hbwDAup6d(E,(b/:SBd$":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"X5/{S=a=ih@*y,T-EFO(":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"zr@zO|rWL_qZ=}8^?ygI":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"qKQa^R)io_mwa|yZD$aQ":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"qCpInw/q5ylG!v*U^)/0":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"wFE5+/({uAa`TV2;=U/x":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"%Woq_d*.$dmLr|6Sr`kn":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"U~U-x+zL}44I9wHsG!.N":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"OO:6gtBDl#4QAz:tuc|0":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"qjF+?_iVuC^,cxtZd/|8":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"j8uI{rZzH)d{VLo$UM(:":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"-@|o--q.t/k[G)LF{BTs":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"2PV8js{/N7dz[t+/E5=n":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"//~]5$|Hy)tPn@]oummW":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"V)J-:*Rc-dhy}*$SdO/!":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"EuZ4TLyw*G229^BnZBDq":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"9aJWz)z*^{gze#XZ$mza":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"xLUoG#6iZ-V%H%EONx0(":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"9SJ,,Ju6agbxhANYLq6h":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"T?FY[fB2(k`-(;;[a]``":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},";ttoE!5O}Hv/J96U^rK~":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"DU-T6$Tt1WE]Y-Q8At-=":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"}n5ZqjiAK.txDpC9^+,n":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"Rc)`,;lA+@xq!g%~(nQ1":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"GFwx{oazlS%1HQ7bYEYr":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"f}*ZQwi,33L6X)`}kMGL":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"4w-8Dj;p%v.L3#-|}x(8":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"GSBFR2O3j!=xkX0}#Elw":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"0F[tLYttx6GJ4!p_.|O^":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"Q|*SF.W~qQ)pR:eUITR*":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"-3g3DX?ZvtVkhuqbk)8n":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"Ptx_05,$9l(C~F28Ze,6":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"*nEc(ZnamR1r.};8nJKJ":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"psk7WIDInfG^4JZ2!iPM":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"Q_P)Cp(X^)klhX@s,!Am":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"E.(HKld$jm+89w9Rvi%#":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"@rKN1H#~rLQR}JA+IA*d":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"qOoL({+llY#uod:55b+U":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"Z~vvwoI|(_!Gl,4{0e4J":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"cMi^s5@%S:eeEe-Lx@g6":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]},"Ssht6!!H#t96S-C1+Xw1":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]}},"EngineConfigs":{"PLUSEngine":{"temperature":[0.7,0.01,1,"Temperature"],"max_tokens":[225,1,2048,"Maximum length"],"top_p":[1,0.01,1,"Top P"],"frequency_penalty":[0,0.01,2,"Frequency penalty"],"presence_penalty":[0,0.01,2,"Presence penalty"]}},"DesignManager":"1. Key Requirements:\n- Develop a software to convert ancient poems into paintings.\n- Extract images from ancient poems to be used in the paintings.\n- Choose a painting style suitable for the content of the ancient poems.\n- Enhance the painting from two other dimensions.\n\n2. User Preference:\n- The software should enhance the picture from two additional dimensions: historical and cultural context and symbolism and metaphor.\n- The software should be able to create paintings that are nuanced and sophisticated, providing a more immersive experience for the viewer.\n- The user prefers a painting style that matches the tone and style of the poem, which could be determined through machine learning algorithms and deep neural networks.\n- The user wants the painting style to be consistent with the cultural and historical context of the poem.\n\n3. Implementing Considerations:\n- The software should use natural language processing techniques to analyze the text and identify words or phrases that relate to visual elements.\n- The software should be able to synthesize texture and pattern from an existing painting or use a pre-trained neural network to generate a new painting that matches the style of the poem.\n- The software should analyze the color palette, brush strokes, composition, and other visual features that are characteristic of the selected style.\n- The software should take into account the historical and cultural context of the poem to guide the visual treatment.\n- The software should identify the symbolic and metaphorical elements in the poem to guide the visual elements in the painting.","ExploreConversion":[{"role":"user","content":"If I want to make a software to convert ancient poems into paintings, how should the software analyze ancient poems"},{"role":"assistant","content":"As an AI language model, I can suggest the following steps for analyzing ancient poems in order to convert them into paintings:\n\n1. Parse the text: The first step is to analyze the text to identify the words and their meanings. This can be done using natural language processing (NLP) techniques.\n\n2. Identify themes: Next, the software should identify the themes and imagery present in the poem. This can be done by analyzing the language used and identifying repeated words, motifs, and patterns.\n\n3. Determine colors: Based on the themes and imagery, the software can determine what colors would be associated with the poem. For example, a poem about the sea might be associated with shades of blue and green.\n\n4. Assign styles: Based on the poem's language and the colors determined, the software can assign a style or visual aesthetic to the painting. For example, a poem about nature may be interpreted in a more impressionistic style.\n\n5. Generate a painting: Finally, the software would use algorithms and artificial intelligence to create a digital painting based on the poem's analysis. The resulting painting would be a synthesis of the themes, colors, and style of the poem."},{"role":"user","content":"The soft ware needs to extract images from poem."},{"role":"assistant","content":"As an AI language model, I can suggest the following steps for extracting images from a poem using software:\n\n1. Identify keywords and phrases: The software should use Natural Language Processing (NLP) to analyze the text of the poem and identify important words and phrases that create images in the reader's mind.\n\n2. Determine image type: The software can use a database of images to determine what types of images would fit these keywords and phrases. For example, if the keyword is \"rose,\" the software could select images of roses.\n\n3. Select the images: The software would then select the most appropriate images from the database and arrange them in a way that represents the flow of the poem. The selected images could be a combination of photographs, illustrations, or any other visual media.\n\n4. Create a painting: Once the images have been selected and arranged, the software would merge them into a digital painting that represents the poem's imagery. The painting could be created in a range of styles and color schemes, depending on the preferences of the user.\n\n5. Revise the painting: The software would allow the user to revise the painting by selecting different images, changes in layout, or editing the image's colors and effects. The revised painting would represent the poet's original vision mixed with the user's creativity."},{"role":"user","content":"The software needs to choose a painting style suitable for poem according to the content of poem,and analyze the charicteristics of this painting style."},{"role":"assistant","content":"As an AI language model, I can suggest the following steps for choosing appropriate painting style for a poem according to its content and analyzing the characteristics of that style:\n\n1. Analyze the poem’s content: The software should analyze the poem’s content such as its themes, tone, mood, and imagery using natural language processing techniques.\n\n2. Determine suitable painting styles: Then, based on the characteristics and themes of the poem, the software can identify suitable painting styles. For example, if the poem has a romantic theme, the software could suggest a style such as impressionism, which often features soft and dreamy atmospheres.\n\n3. Analyze the characteristics of the style: Once the suitable painting style is selected, the software should analyze the characteristics of that style. For example, impressionism is known for its loose brushstrokes, use of color to capture emotions, and focus on capturing the moment rather than a great deal of detail.\n\n4. Apply the painting style to the painting: After analyzing the characteristics of the painting style, the software should apply it to the digital painting created from the poem. Based on the chosen painting style, the software should incorporate the related characteristics, such as the use of color and brushstrokes.\n\n5. Revise and adjust painting style: The software should allow for the revision and adjustment of the painting style based on user preferences. The revised painting would integrating the characteristics of the chosen painting style with the user's creative inputs, in a way that the style reflects the poet’s original vision and the user’s interpretation."},{"role":"user","content":"In addition to style, is it better to enhance the picture from two other dimensions?"},{"role":"assistant","content":"Yes, enhancing the picture from two other dimensions can greatly improve its quality and impact. Here are two possible dimensions to consider:\n\n1. Emotion: Paintings are not just about aesthetic, but also convey emotions. Enhancing the emotional impact of the painting can help create a deeper connection with the viewer. A software that analyzes the emotions of the poem and translates them into the painting can help achieve this. NLP techniques can be used to determine the emotional sentiment of the poem as positive, negative, or neutral. Based on this, the software can manipulate the color schemes, lighting, and saturation to enhance the emotional impact of the painting.\n\n2. Culture: Poems often reflect the specific culture in which they were written. Enhancing the cultural elements of the painting can help create a better fit with the poem and its cultural context. The software can analyze the cultural elements of the poem using NLP or other techniques and incorporate them into the painting. This includes elements like art styles, symbols, and motifs from the culture in which it was written. Incorporating these elements into the painting enhances the cultural context and relevance of the poem for its audience.\n\nIncorporating these dimensions along with style can help create an immersive and impactful painting that effectively captures the essence of the poem."}],"ClarifyConversion":[{"role":"User","content":"Generate a picture from an ancient Chinese poem"},{"role":"Sapper","content":"You need to consider what elements to include in the picture. For example, the painting style, color palette, brush strokes, composition, and other visual features that are characteristic of the selected style. Additionally, you need to consider the historical and"},{"role":"User","content":"Choose the most suitable painting style according to the content of the poem"},{"role":"Sapper","content":"Analyze the text of the poem to identify words or phrases that relate to visual elements and use natural language processing techniques to do so. Additionally, consider the color palette, brush strokes, composition, and other visual features that are characteristic of the"},{"role":"User","content":"There is no need to considering the historical and cultural context of the poem, as well as any symbolic or metaphorical elements that may be present in the poem.Instead,you should extract the specific image in the poem."},{"role":"Sapper","content":"You need to analyze the text of the poem and identify words or phrases that relate to visual elements. Additionally, use natural language processing techniques to synthesize texture and pattern from an existing painting or use a pre-trained neural network to generate a"},{"role":"User","content":"I think considering the painting techniques, color palette, brush strokes, and composition that are characteristic of the selected style is useless, but I think Follow these steps to extract the specific image from the poem is useful. Steps:Generate three artistic conceptions based on the lines of poetry, and analyze and summarize them to create a refined new artistic conception. Decompose this conception into a series of concise phrases, and filter out the phrases suitable for painting as the final imagery."},{"role":"Sapper","content":"You need to consider how to generate the painting from the extracted image. Additionally, consider the painting techniques, color palette, brush strokes, and composition that are characteristic of the selected style."},{"role":"User","content":"There is no need to consider how to synthesize texture and pattern from an existing painting or use a pre-trained neural network, instead just need to  select a painting style based on poem and describe the characteristics of this style. "},{"role":"Sapper","content":"You need to determine the painting style suitable for the content of the poem. Additionally, consider the painting techniques, color palette, brush strokes, and composition that are characteristic of the selected style."},{"role":"User","content":"Combining the painting style and the poem, provide two dimensions that can enhance the sense of painting. "},{"role":"Sapper","content":"You need to consider how to use natural language processing techniques to analyze the text and identify words or phrases that relate to visual elements. Additionally, consider how to synthesize texture and pattern from an existing painting or use a pre-trained neural network"}],"TaskCards":[{"id":"0","type":"task","nestedCards":[],"workName":"Artistic_Conception1","promptName":"Artistic_Conception1","output":"no","prework":[["Poetry_Lines","yes"]],"prompt":{"Instruction":"Create an artistic conception based on the following lines of poetry: {{Poetry_Lines}}. "},"model":"gpt-3.5-turbo","taskcard":{"content":"Generate the first artistic conception based on the lines of poetry.","input":[["Poetry_Lines","yes"]],"prompt":["Create an artistic conception based on the following lines of poetry: {{Poetry_Lines}}. ","Create a visual representation of the following lines of poetry: {{Poetry_Lines}}. Consider aspects such as color, composition, and symbolism when creating your piece.","Create a visual artwork inspired by the poem {{Poetry_Lines}}, including elements such as color, texture, and emotion. Consider using a range of mediums, both digital and physical, to create a unique artwork."],"output":["Artistic_Conception1","no"],"model":"gpt-3.5-turbo"}},{"id":"1","type":"task","nestedCards":[],"workName":"Artistic_Conception2","promptName":"Artistic_Conception2","output":"no","prework":[["Poetry_Lines","no"]],"prompt":{"Instruction":"Create an artistic conception inspired by the following lines of poetry: {{Poetry_Lines}}. "},"model":"gpt-3.5-turbo","taskcard":{"content":"Generate the second artistic conception based on the lines of poetry.","input":[["Poetry_Lines","no"]],"prompt":["Create an artistic conception inspired by the following lines of poetry: {{Poetry_Lines}}. ","Use the following lines of poetry as inspiration to create an artwork: {{Poetry_Lines}}. Think about how the ideas and imagery can be translated into a visual representation. Consider the use of color, texture, and line to create depth and emotion in the artwork.","Based on the following lines of poetry: {{Poetry_Lines}}, generate an artistic visual representation that captures the feeling evoked by the lines. Consider the themes or moods in the poem and present a creative interpretation that flows from the words."],"output":["Artistic_Conception2","no"],"model":"gpt-3.5-turbo"}},{"id":"2","type":"task","nestedCards":[],"workName":"Artistic_Conception3","promptName":"Artistic_Conception3","output":"no","prework":[["Poetry_Lines","no"]],"prompt":{"Instruction":"Generate an artistic conception of {{Poetry_Lines}} that conveys a mood or emotion."},"model":"gpt-3.5-turbo","taskcard":{"content":"Generate the third artistic conception based on the lines of poetry.","input":[["Poetry_Lines","no"]],"prompt":["Generate an artistic conception of {{Poetry_Lines}} that conveys a mood or emotion.","Generate a visual representation of {{Poetry_Lines}} that conveys a unique emotion or idea. Consider elements such as composition, color, texture, and symbolism.","Describe a visual image inspired by the following lines of poetry: {{Poetry_Lines}} Include sensory details such as color, texture, lighting, and include how the image makes the viewer feel."],"output":["Artistic_Conception3","no"],"model":"gpt-3.5-turbo"}},{"id":"3","type":"task","nestedCards":[],"workName":"Refined_Artistic_Conception","promptName":"Refined_Artistic_Conception","output":"no","prework":[["Artistic_Conception1","no"]],"prompt":{"Instruction":"Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three."},"model":"gpt-3.5-turbo","taskcard":{"content":"Analyze and summarize the three artistic conceptions to create a refined new artistic conception.","input":[["Artistic_Conception1","no"]],"prompt":["Analyze and summarize {{Artistic_Conception1}}, {{Artistic_Conception2}}, and {{Artistic_Conception3}} to create a new artistic conception. Consider the similarities and differences between the three.","Compare and contrast {{Artistic_Conception1}} with two other artistic conceptions. Evaluate the similarities and differences and synthesize a new, refined artistic conception. Include a summary of your findings.","Compare and contrast {{Artistic_Conception1}} with two other artistic conceptions and create a synthesis of key features that can be used to create a new and refined artistic conception. Describe how this new artistic conception fits within the existing art-making traditions."],"output":["Refined_Artistic_Conception","no"],"model":"gpt-3.5-turbo"}},{"id":"4","type":"task","nestedCards":[],"workName":"Concise_Phrases","promptName":"Concise_Phrases","output":"no","prework":[["Refined_Artistic_Conception","no"]],"prompt":{"Instruction":"Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. "},"model":"gpt-3.5-turbo","taskcard":{"content":"Decompose the refined artistic conception into a series of concise phrases.","input":[["Refined_Artistic_Conception","no"]],"prompt":["Break down the concept of {{Refined_Artistic_Conception}} into a series of short, descriptive phrases that capture the essence of the idea. ","Break down the {{Refined_Artistic_Conception}} into a set of short simple phrases that are easy to understand and convey the same meaning.","Write a set of concise phrases that capture the essence of the {{Refined_Artistic_Conception}}. Consider different aspects, such as visual details, emotions or physical sensations that could be evoked."],"output":["Concise_Phrases","no"],"model":"gpt-3.5-turbo"}},{"id":"5","type":"task","nestedCards":[],"workName":"Suitable_Phrases","promptName":"Suitable_Phrases","output":"no","prework":[["Concise_Phrases","no"]],"prompt":{"Instruction":"Select the phrases from the list of {{Concise_Phrases}} that best describe theme of a painting."},"model":"gpt-3.5-turbo","taskcard":{"content":"Filter out the phrases suitable for painting as the final imagery.","input":[["Concise_Phrases","no"]],"prompt":["Select the phrases from the list of {{Concise_Phrases}} that best describe theme of a painting.","Filter out 3-5 concise phrases that evoke a visual image and could be used as the basis for a painting. Consider phrases such as \"dawn of a new day\" or \"seas of possibility\".","Identify which of the following phrases best conveys the mood and feel of {{Concise_Phrases}} in a visual art medium. Consider conveying emotions or a journey as well as discussing thephrases' metaphors and/or verbiage."],"output":["Suitable_Phrases","no"],"model":"gpt-3.5-turbo"}},{"id":"6","type":"task","nestedCards":[],"workName":"Painting_Style","promptName":"Painting_Style","output":"no","prework":[["Poetry_Lines","no"]],"prompt":{"Instruction":"Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood of the poem when making your selection."},"model":"gpt-3.5-turbo","taskcard":{"content":"Select a painting style based on the lines of poetry.","input":[["Poetry_Lines","no"]],"prompt":["Select a painting style that best captures the emotion of the following lines of poetry: {{Poetry_Lines}}. Consider the mood of the poem when making your selection.","Create a painting inspired by the following lines of poetry: {{Poetry_Lines}}. Select a painting style that complements the mood of the poem. Include colors, textures, and brush strokes that are visually appealing.","Select a painting style that conveys the emotion, tone and imagery in the following lines of poetry: {{Poetry_Lines}}. Consider factors such as color, texture, form and line."],"output":["Painting_Style","no"],"model":"gpt-3.5-turbo"}},{"id":"7","type":"task","nestedCards":[],"workName":"Style_Characteristics1","promptName":"Style_Characteristics1","output":"no","prework":[["Painting_Style","no"]],"prompt":{"Instruction":"Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition."},"model":"gpt-3.5-turbo","taskcard":{"content":"Describe the characteristics of the painting style.","input":[["Painting_Style","no"]],"prompt":["Describe the main characteristics of {{Painting_Style}} paintings, such as color palette, brush strokes, texture, composition.","Describe the visual characteristics of {{Painting_Style}}. Focus on elements such as brushstrokes, color palettes, texture, composition, etc.","Describe the use of color, brush techniques, and other techniques that are part of the {{Painting_Style}} style. Explain how it stands out from other painting styles and how it could be used in artwork."],"output":["Style_Characteristics1","no"],"model":"gpt-3.5-turbo"}},{"id":"8","type":"task","nestedCards":[],"workName":"Style_Characteristics2","promptName":"Style_Characteristics2","output":"no","prework":[["Poetry_Lines","no"],["Painting_Style",null]],"prompt":{"Instruction":"Use {{Poetry_Lines}} to create a {{Painting_Style}} painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery."},"model":"gpt-3.5-turbo","taskcard":{"content":"Combining the painting style and the lines of poetry, provide two dimensions that can enhance the sense of imagery.","input":[["Poetry_Lines","no"],["Painting_Style",null]],"prompt":["Use {{Poetry_Lines}} to create a {{Painting_Style}} painting that reflects the tone and imagery of the poem. Incorporate elements such as color, texture, and composition to enhance the sense of imagery.","Using the {{Poetry_Lines}}, create a painting that illustrates the poem in a way that enhances the imagery. Consider elements such as color, texture, line, and shape to create a piece that evokes emotion.","Using {{Poetry_Lines}}, create a {{Painting_Style}}painting that focuses on color, texture, and line to evoke an emotional response from the audience. ",""],"output":["Style_Characteristics2","no"],"model":"gpt-3.5-turbo"}},{"id":"9","type":"task","nestedCards":[],"workName":"Style_Characteristics3","promptName":"Style_Characteristics3","output":"yes","prework":[["Suitable_Phrases","null"],["Painting_Style","null"],["Style_Characteristics1","null"],["Style_Characteristics2","null"]],"prompt":{"Instruction":"Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}."},"model":"DALL-E","taskcard":{"content":"Generate an image based on the lines of poetry, painting style, style characteristics, and dimensions.","input":[["Suitable_Phrases","null"],["Painting_Style","null"],["Style_Characteristics1","null"],["Style_Characteristics2","null"]],"prompt":["Create an image based on the following lines of poetry: {{Poetry_Lines}}. Use a painting style of {{Painting_Style}} and style characteristics of {{Style_Characteristics}}. The dimensions of the image should be {{Dimensions}}.","Generate an image based on the following lines of poetry {{Poetry_Lines}}, a painting style of your choice, the dimensions of 500x500 pixels, and the following style characteristics: vibrant colors, abstract shapes, and bold lines.","Create an image using the following parameters: painting style {{Painting_Style}}, style characteristics {{Style_Characteristic}}, and dimensions {{Dimensions}}. Use the following poetry lines as inspiration: {{Poetry_Lines}}."],"output":["Style_Characteristics3","yes"],"model":"DALL-E"}}],"Require":"Generate three artistic conceptions based on the lines of poetry, and analyze and summarize them to create a refined new artistic conception. Decompose this conception into a series of concise phrases, and filter out the phrases suitable for painting as the final imagery.  Select a painting style based on the lines of poetry and describe the characteristics of this style.  Combining the painting style and the lines of poetry, provide two dimensions that can enhance the sense of imagery. Generate an image based on the lines of poetry, painting style, style characteristics, and dimensions.","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\">\n  <block type=\"Output\" id=\"}4iNacb;Jx(=h.$`a|,Y\" x=\"90\" y=\"70\">\n    <statement name=\"Output_var\">\n      <block type=\"AI_Unit\" id=\"0{a4mXCsWe{x!M]_og)$\">\n        <field name=\"AI_Unit\">Worker</field>\n        <field name=\"Unit_Name\">Style_Characteristics3</field>\n        <statement name=\"PreWorkers\">\n          <block type=\"AI_Unit\" id=\"Iy[Eb3A:xGmD-N8c!nCa\">\n            <field name=\"AI_Unit\">Worker</field>\n            <field name=\"Unit_Name\">Suitable_Phrases</field>\n            <statement name=\"PreWorkers\">\n              <block type=\"AI_Unit\" id=\"oE61D@od*:oL`[QcE)Kg\">\n                <field name=\"AI_Unit\">Worker</field>\n                <field name=\"Unit_Name\">Concise_Phrases</field>\n                <statement name=\"PreWorkers\">\n                  <block type=\"AI_Unit\" id=\"5BebX]iUv-DV)^U)(H2-\">\n                    <field name=\"AI_Unit\">Worker</field>\n                    <field name=\"Unit_Name\">Refined_Artistic_Conception</field>\n                    <statement name=\"PreWorkers\">\n                      <block type=\"AI_Unit\" id=\"5rVzGrt{GbJFdVaX*TOF\">\n                        <field name=\"AI_Unit\">Worker</field>\n                        <field name=\"Unit_Name\">Artistic_Conception1</field>\n                        <statement name=\"PreWorkers\">\n                          <block type=\"Input\" id=\":nC=T[pPc,jE#Q*o,j=8\">\n                            <statement name=\"input_var\">\n                              <block type=\"unit_var\" id=\"R:`PmJE9bYaGg-{Kp#9`\">\n                                <field name=\"unit_value\">Poetry_Lines</field>\n                              </block>\n                            </statement>\n                          </block>\n                        </statement>\n                        <value name=\"Prompt\">\n                          <block type=\"Prompt_template\" id=\"OJ{aW;e,aWljr$aM`^Z?\" collapsed=\"true\">\n                            <field name=\"Prompt_Name\">Artistic_Conception1</field>\n                            <statement name=\"prompt_value\">\n                              <block type=\"Example\" id=\"dmSqOrBFowB*9peJuCfo\">\n                                <field name=\"Example_value\">Instruction</field>\n                              </block>\n                            </statement>\n                          </block>\n                        </value>\n                        <value name=\"Model\">\n                          <block type=\"LLM_Model\" id=\"Ptx_05,$9l(C~F28Ze,6\" collapsed=\"true\">\n                            <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                            <statement name=\"Model\">\n                              <block type=\"Model\" id=\"sS4l^oY_H8AtiAxt%rJL\">\n                                <field name=\"modelName\">gpt-3.5-turbo</field>\n                              </block>\n                            </statement>\n                          </block>\n                        </value>\n                        <next>\n                          <block type=\"AI_Unit\" id=\"-vEDIJw?,-AnI})_aOil\">\n                            <field name=\"AI_Unit\">Worker</field>\n                            <field name=\"Unit_Name\">Artistic_Conception2</field>\n                            <statement name=\"PreWorkers\">\n                              <block type=\"unit_var\" id=\"s.jCx|SsC_hy`O|DB~$W\">\n                                <field name=\"unit_value\">Poetry_Lines</field>\n                              </block>\n                            </statement>\n                            <value name=\"Prompt\">\n                              <block type=\"Prompt_template\" id=\"T5/h(PiL]WpvE=5ON/5k\" collapsed=\"true\">\n                                <field name=\"Prompt_Name\">Artistic_Conception2</field>\n                                <statement name=\"prompt_value\">\n                                  <block type=\"Example\" id=\"vzXky4gZP)76ezMvjnlK\">\n                                    <field name=\"Example_value\">Instruction</field>\n                                  </block>\n                                </statement>\n                              </block>\n                            </value>\n                            <value name=\"Model\">\n                              <block type=\"LLM_Model\" id=\"*nEc(ZnamR1r.};8nJKJ\" collapsed=\"true\">\n                                <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                                <statement name=\"Model\">\n                                  <block type=\"Model\" id=\"_+6.|ocCeNa%b:n}`y`y\">\n                                    <field name=\"modelName\">gpt-3.5-turbo</field>\n                                  </block>\n                                </statement>\n                              </block>\n                            </value>\n                            <next>\n                              <block type=\"AI_Unit\" id=\"XN7`ErY~nR_s}B!va{Nw\">\n                                <field name=\"AI_Unit\">Worker</field>\n                                <field name=\"Unit_Name\">Artistic_Conception3</field>\n                                <statement name=\"PreWorkers\">\n                                  <block type=\"unit_var\" id=\"ZuR^fK}oKW,nk@POdqbQ\">\n                                    <field name=\"unit_value\">Poetry_Lines</field>\n                                  </block>\n                                </statement>\n                                <value name=\"Prompt\">\n                                  <block type=\"Prompt_template\" id=\"-rYL3;_Hu.|P.,WP3$3B\" collapsed=\"true\">\n                                    <field name=\"Prompt_Name\">Artistic_Conception3</field>\n                                    <statement name=\"prompt_value\">\n                                      <block type=\"Example\" id=\"7g7Jy09A@4#[)0TSBFih\">\n                                        <field name=\"Example_value\">Instruction</field>\n                                      </block>\n                                    </statement>\n                                  </block>\n                                </value>\n                                <value name=\"Model\">\n                                  <block type=\"LLM_Model\" id=\"psk7WIDInfG^4JZ2!iPM\" collapsed=\"true\">\n                                    <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                                    <statement name=\"Model\">\n                                      <block type=\"Model\" id=\".zhKoY(I].CEfv@J8gsz\">\n                                        <field name=\"modelName\">gpt-3.5-turbo</field>\n                                      </block>\n                                    </statement>\n                                  </block>\n                                </value>\n                              </block>\n                            </next>\n                          </block>\n                        </next>\n                      </block>\n                    </statement>\n                    <value name=\"Prompt\">\n                      <block type=\"Prompt_template\" id=\"Ik#qLbnB][y(WQnp7BJ[\" collapsed=\"true\">\n                        <field name=\"Prompt_Name\">Refined_Artistic_Conception</field>\n                        <statement name=\"prompt_value\">\n                          <block type=\"Example\" id=\"9${;zq*M4by,L;TXh2jp\">\n                            <field name=\"Example_value\">Instruction</field>\n                          </block>\n                        </statement>\n                      </block>\n                    </value>\n                    <value name=\"Model\">\n                      <block type=\"LLM_Model\" id=\"Q_P)Cp(X^)klhX@s,!Am\" collapsed=\"true\">\n                        <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                        <statement name=\"Model\">\n                          <block type=\"Model\" id=\"7ou7I`U](kQ;Ux+%QGhb\">\n                            <field name=\"modelName\">gpt-3.5-turbo</field>\n                          </block>\n                        </statement>\n                      </block>\n                    </value>\n                  </block>\n                </statement>\n                <value name=\"Prompt\">\n                  <block type=\"Prompt_template\" id=\"LL}ml^,:dalgV;z6).e5\" collapsed=\"true\">\n                    <field name=\"Prompt_Name\">Concise_Phrases</field>\n                    <statement name=\"prompt_value\">\n                      <block type=\"Example\" id=\"tf0s+/cQlg;K3REQ7sh$\">\n                        <field name=\"Example_value\">Instruction</field>\n                      </block>\n                    </statement>\n                  </block>\n                </value>\n                <value name=\"Model\">\n                  <block type=\"LLM_Model\" id=\"E.(HKld$jm+89w9Rvi%#\" collapsed=\"true\">\n                    <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                    <statement name=\"Model\">\n                      <block type=\"Model\" id=\"yCw:-SJu1o(|/EQ,O9D0\">\n                        <field name=\"modelName\">gpt-3.5-turbo</field>\n                      </block>\n                    </statement>\n                  </block>\n                </value>\n              </block>\n            </statement>\n            <value name=\"Prompt\">\n              <block type=\"Prompt_template\" id=\"(~^sRk4A2g2f`jFczSnw\" collapsed=\"true\">\n                <field name=\"Prompt_Name\">Suitable_Phrases</field>\n                <statement name=\"prompt_value\">\n                  <block type=\"Example\" id=\"cX+!yW8GP,E~uHB0yijL\">\n                    <field name=\"Example_value\">Instruction</field>\n                  </block>\n                </statement>\n              </block>\n            </value>\n            <value name=\"Model\">\n              <block type=\"LLM_Model\" id=\"@rKN1H#~rLQR}JA+IA*d\" collapsed=\"true\">\n                <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                <statement name=\"Model\">\n                  <block type=\"Model\" id=\"7O,TXQ{X{7LnS!^fTI7/\">\n                    <field name=\"modelName\">gpt-3.5-turbo</field>\n                  </block>\n                </statement>\n              </block>\n            </value>\n            <next>\n              <block type=\"unit_var\" id=\"r{zzzsH7:L@}m?si2-lp\">\n                <field name=\"unit_value\">Painting_Style</field>\n                <next>\n                  <block type=\"AI_Unit\" id=\"t):U105B7nz8d%v(Wa3z\">\n                    <field name=\"AI_Unit\">Worker</field>\n                    <field name=\"Unit_Name\">Style_Characteristics1</field>\n                    <statement name=\"PreWorkers\">\n                      <block type=\"AI_Unit\" id=\"%Rn`|dXlp(A[;@Z_DDP_\">\n                        <field name=\"AI_Unit\">Worker</field>\n                        <field name=\"Unit_Name\">Painting_Style</field>\n                        <statement name=\"PreWorkers\">\n                          <block type=\"unit_var\" id=\"xrlrew/XxNCPpTHmwTV~\">\n                            <field name=\"unit_value\">Poetry_Lines</field>\n                          </block>\n                        </statement>\n                        <value name=\"Prompt\">\n                          <block type=\"Prompt_template\" id=\"(iQ[LaZRx_LFF8-djt~q\" collapsed=\"true\">\n                            <field name=\"Prompt_Name\">Painting_Style</field>\n                            <statement name=\"prompt_value\">\n                              <block type=\"Example\" id=\"Sxp7?en8a,=x8*?%gG19\">\n                                <field name=\"Example_value\">Instruction</field>\n                              </block>\n                            </statement>\n                          </block>\n                        </value>\n                        <value name=\"Model\">\n                          <block type=\"LLM_Model\" id=\"qOoL({+llY#uod:55b+U\" collapsed=\"true\">\n                            <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                            <statement name=\"Model\">\n                              <block type=\"Model\" id=\"FQkl:08^k+:nG~B}lWx)\">\n                                <field name=\"modelName\">gpt-3.5-turbo</field>\n                              </block>\n                            </statement>\n                          </block>\n                        </value>\n                      </block>\n                    </statement>\n                    <value name=\"Prompt\">\n                      <block type=\"Prompt_template\" id=\"o%)m_zuCA@=e=jb;0h-Z\" collapsed=\"true\">\n                        <field name=\"Prompt_Name\">Style_Characteristics1</field>\n                        <statement name=\"prompt_value\">\n                          <block type=\"Example\" id=\"ga$=l:{Di0iKy[7$|-OE\">\n                            <field name=\"Example_value\">Instruction</field>\n                          </block>\n                        </statement>\n                      </block>\n                    </value>\n                    <value name=\"Model\">\n                      <block type=\"LLM_Model\" id=\"Z~vvwoI|(_!Gl,4{0e4J\" collapsed=\"true\">\n                        <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                        <statement name=\"Model\">\n                          <block type=\"Model\" id=\"Tmi3lyshftH4k~Gfx4(I\">\n                            <field name=\"modelName\">gpt-3.5-turbo</field>\n                          </block>\n                        </statement>\n                      </block>\n                    </value>\n                    <next>\n                      <block type=\"AI_Unit\" id=\":m3WEp*vm^uC9090}!N+\">\n                        <field name=\"AI_Unit\">Worker</field>\n                        <field name=\"Unit_Name\">Style_Characteristics2</field>\n                        <statement name=\"PreWorkers\">\n                          <block type=\"unit_var\" id=\"|=J6D,MNFz(L5)Y$%Ukn\">\n                            <field name=\"unit_value\">Poetry_Lines</field>\n                            <next>\n                              <block type=\"unit_var\" id=\"9{jzeJnI[s5X#DdH(xMa\">\n                                <field name=\"unit_value\">Painting_Style</field>\n                              </block>\n                            </next>\n                          </block>\n                        </statement>\n                        <value name=\"Prompt\">\n                          <block type=\"Prompt_template\" id=\"VBw549LRw$=WoQ{vy+3b\" collapsed=\"true\">\n                            <field name=\"Prompt_Name\">Style_Characteristics2</field>\n                            <statement name=\"prompt_value\">\n                              <block type=\"Example\" id=\"i^,Ebk[|^6tk.:r[/ZPs\">\n                                <field name=\"Example_value\">Instruction</field>\n                              </block>\n                            </statement>\n                          </block>\n                        </value>\n                        <value name=\"Model\">\n                          <block type=\"LLM_Model\" id=\"cMi^s5@%S:eeEe-Lx@g6\" collapsed=\"true\">\n                            <field name=\"LLM_Name\">gpt-3.5-turbo</field>\n                            <statement name=\"Model\">\n                              <block type=\"Model\" id=\"Y2]{]%MIpIq@/LqeR[x)\">\n                                <field name=\"modelName\">gpt-3.5-turbo</field>\n                              </block>\n                            </statement>\n                          </block>\n                        </value>\n                      </block>\n                    </next>\n                  </block>\n                </next>\n              </block>\n            </next>\n          </block>\n        </statement>\n        <value name=\"Prompt\">\n          <block type=\"Prompt_template\" id=\"8o+8E3SnWDO~#z0[T823\" collapsed=\"true\">\n            <field name=\"Prompt_Name\">Style_Characteristics3</field>\n            <statement name=\"prompt_value\">\n              <block type=\"Example\" id=\"EF+OqTvx@`,xN#BB;2^t\">\n                <field name=\"Example_value\">Instruction</field>\n              </block>\n            </statement>\n          </block>\n        </value>\n        <value name=\"Model\">\n          <block type=\"LLM_Model\" id=\"Ssht6!!H#t96S-C1+Xw1\" collapsed=\"true\">\n            <field name=\"LLM_Name\">DALL-E</field>\n            <statement name=\"Model\">\n              <block type=\"Model\" id=\"kHQee+F7hXMocpMs-_jN\">\n                <field name=\"modelName\">DALL-E</field>\n              </block>\n            </statement>\n          </block>\n        </value>\n      </block>\n    </statement>\n  </block>\n</xml>"}

// Listen to prompt create event, then create a textarea for user to input prompt value from prompt workspace
PromptWorkspace.addChangeListener(CreatePromptEvent);
ModelWorkspace.addChangeListener(CreatePromptEvent);
demoWorkspace.addChangeListener(ShowPromptEvent);

var Originalcopyblock = '' ;
const originalBlocklyCopy = Blockly.copy;
// 覆盖 Blockly.copy 方法
Blockly.copy = function (block) {
  // 在这里，我们可以访问复制前的块
    Originalcopyblock = block;
  return originalBlocklyCopy.call(this, block);
};

// 定义一个标志变量
let blockCreatedByPaste = false;

// 保存原始的 Blockly.WorkspaceSvg.prototype.paste 函数
const originalBlocklyPaste = Blockly.WorkspaceSvg.prototype.paste;

// 覆盖 Blockly.WorkspaceSvg.prototype.paste 方法
Blockly.WorkspaceSvg.prototype.paste = function (clipboardXml) {
  // 设置标志变量
  blockCreatedByPaste = true;

  // 调用原始的 Blockly.WorkspaceSvg.prototype.paste 函数以保持正常的粘贴行为
  return originalBlocklyPaste.call(this, clipboardXml);
};
function findBlocksByType(block, finalblock, type, work) {
  const result = [];
  if (block.type === type) {
    result.push([block.id, finalblock.id]);
    RunPromptAspect[finalblock.id] = [finalblock.getFieldValue('Example_value'),  RunPromptAspect[block.id][1]];
  }
  if (block.type === 'LLM_Model' && work === "demoWorkspace") {
    RunEngineConfigs[finalblock.id] = {};
    RunEngineConfigs[finalblock.id] = JSON.parse(JSON.stringify(RunEngineConfigs[block.id]));
  }
  console.log(work)
  if(block.type === 'Model' && work === "ModelWorkspace"){
      RunModelConfigs[finalblock.id] = {}
      RunModelConfigs[finalblock.id] = JSON.parse(JSON.stringify(RunModelConfigs[block.id]));
  }
  const children = block.getChildren();
  const finalchildren = finalblock.getChildren();
  for (let i = 0; i < children.length; i++) {
    const childResult = findBlocksByType(children[i], finalchildren[i], type, work);
    result.push(childResult);
  }
  return result;
}

function CreatePromptEvent(primaryEvent) {
  if (primaryEvent instanceof Blockly.Events.Ui) {
      return
  }
  var promptblock;
  if(primaryEvent instanceof Blockly.Events.BlockCreate){
    promptblock = PromptWorkspace.getBlockById(primaryEvent.blockId);
    var promptBlockType = promptblock.type;
    var promptBlockId = promptblock.id;
    if(promptBlockType === 'Prompt_template' && !blockCreatedByPaste){
        var promptname = promptblock.getFieldValue('Prompt_Name')
        var i = 0;
        if(promptblock.getInputTargetBlock('prompt_value')){
            var targetBlock = promptblock.getInputTargetBlock('prompt_value');
            RunPromptAspect[targetBlock.id] = [targetBlock.getFieldValue('Example_value'), PromptValue[promptname][i][1]];
            while(targetBlock.nextConnection.isConnected()){
                i+=1;
                targetBlock = targetBlock.getNextBlock();
                RunPromptAspect[targetBlock.id] = [targetBlock.getFieldValue('Example_value'), PromptValue[promptname][i][1]];
            }
        }
    }
    else if(promptBlockType === 'Example' && !blockCreatedByPaste){
        RunPromptAspect[promptBlockId] = [promptblock.getFieldValue('Example_value'), ''];
    }
    else if(blockCreatedByPaste){
        const promptasceptBlocks = findBlocksByType(Originalcopyblock, promptblock, 'Example');
    }
    blockCreatedByPaste = false;
  }
  if(primaryEvent.type === "click" && primaryEvent.targetType === 'block'){
        if(PromptWorkspace.getBlockById(primaryEvent.blockId).type === "Prompt_template"){
             PromptTemplateShownId = primaryEvent.blockId;
             promptblock = PromptWorkspace.getBlockById(primaryEvent.blockId);
             var promptvalue = '';
             var tragetblock = promptblock.getInputTargetBlock('prompt_value');
             if(tragetblock){
                 promptvalue += RunPromptAspect[tragetblock.id][1] + "\n"
                 while(tragetblock.nextConnection.isConnected()){
                     tragetblock = tragetblock.getNextBlock();
                     promptvalue += RunPromptAspect[tragetblock.id][1] + "\n";
                 }
             }
             document.getElementById('PromptContentDiv').innerHTML = `<textarea onclick="targt2SPL(this.id)" id="${promptBlockId}" class="prompttemplate" readonly="readonly" style="display: block">${promptvalue}</textarea>`
        }
        else if(PromptWorkspace.getBlockById(primaryEvent.blockId).type === "Example"){
            const promptplaceholder ="Please input " + PromptWorkspace.getBlockById(primaryEvent.blockId).getFieldValue('Example_value')
            promptBlockId = primaryEvent.blockId;
            const promptvalue = RunPromptAspect[promptBlockId][1];
            document.getElementById('PromptContentDiv').innerHTML = `<textarea onclick="targt2SPL(this.id)" id="${promptBlockId}" class="promptexample" style="display: block" placeholder="${promptplaceholder}" oninput="RunPromptAspect['${promptBlockId}'][1] = this.value;">${promptvalue}</textarea>`
        }
  }
}
function CreateModelEvent(primaryEvent) {
    if (primaryEvent.type === Blockly.Events.UI && primaryEvent.element === 'trashcanOpen') {
    let currentDraggedBlock = ModelWorkspace.getBlockById(Blockly.dragging_block_);
    if (currentDraggedBlock) {
      console.log('Block dragged to trash:', currentDraggedBlock.id);
    }
  }
  if (primaryEvent instanceof Blockly.Events.Ui) {
      return
  }
  var promptblock;
  if(primaryEvent instanceof Blockly.Events.BlockCreate){
    promptblock = ModelWorkspace.getBlockById(primaryEvent.blockId);
    var promptBlockType = promptblock.type;
    var promptBlockId = promptblock.id;
    if(promptBlockType === 'LLM_Model' && !blockCreatedByPaste){
        if(promptblock.getInputTargetBlock('Model')){
          var model = promptblock.getInputTargetBlock('Model')
          RunModelConfigs[model.id] = {}
          RunModelConfigs[model.id] = JSON.parse(JSON.stringify(ModelValues[promptblock.getFieldValue('LLM_Name')]));
            generateModelConfigForm(RunModelConfigs[model.id], model.id, promptBlockId)
        }
    }
    else if(promptBlockType === 'Model' && !blockCreatedByPaste){
      var modelname = promptblock.getFieldValue('modelName')
      RunModelConfigs[promptblock.id] = {}
      RunModelConfigs[promptblock.id] = JSON.parse(JSON.stringify(ModelConfigs[modelname]));
    }
    else if(blockCreatedByPaste){
        const promptasceptBlocks = findBlocksByType(Originalcopyblock, promptblock, 'Example', "ModelWorkspace");
    }
    blockCreatedByPaste = false;
  }
  if(primaryEvent.type === "click" && primaryEvent.targetType === 'block'){
      if(ModelWorkspace.getBlockById(primaryEvent.blockId).type === "LLM_Model"){
          var engine = ModelWorkspace.getBlockById(primaryEvent.blockId);
          model = engine.getInputTargetBlock('Model')
          if(model){
              generateModelConfigForm(RunModelConfigs[model.id], model.id, primaryEvent.blockId)
          }
          return;
      }
  }
  if (primaryEvent.type === Blockly.Events.MOVE && ModelWorkspace.getBlockById(primaryEvent.blockId).type === 'Model'){
      var llmBlock = ModelWorkspace.getBlockById(primaryEvent.blockId);
    if (llmBlock.parentBlock_ && llmBlock.parentBlock_.type === 'LLM_Model') {
      generateModelConfigForm(RunModelConfigs[llmBlock.id], llmBlock.id, llmBlock.parentBlock_.id)
    }
    else{
        var element = document.querySelector('[data-model-id]');
        if (element) {
          // 获取 "data-engine-id" 属性的值
          var engineId = element.getAttribute('data-model-id');
          console.log(engineId)
            console.log(llmBlock.id)
          if(engineId === llmBlock.id){
            document.getElementById('ModelContentDiv').style.display = 'none';
            document.getElementById('ModelContentDiv').innerHTML = '';
            document.getElementById('CreateModelDiv').style.height = 'calc(100% - 30px)';
            Blockly.svgResize(ModelWorkspace);
          }
        }
    }
  }
}

window.addEventListener('message', (event) => {
  // We recommend checking the origin for security reasons

  if (event.origin !== "https://www.promptsapper.tech")
    return;
  const data = JSON.parse(event.data);
  const id = data['id'];
  document.getElementById(id).value = data['spl'];
  variableSPL[id] = data['splJson'];
  if(RunPromptAspect.hasOwnProperty(id)){
      RunPromptAspect[id][1] = data['spl']
  }
});
// create a textarea for user to see the prompt value from main workspace
function ShowPromptEvent(primaryEvent) {
  if (primaryEvent instanceof Blockly.Events.Ui) {
    return;
  }
  if(primaryEvent instanceof Blockly.Events.BlockCreate) {
    var promptblock = demoWorkspace.getBlockById(primaryEvent.blockId);
    if(!promptblock){
        return;
    }
    var promptBlockType = promptblock.type;
    var promptBlockId = promptblock.id;
    if(promptBlockType === 'LLM_Model' && !blockCreatedByPaste){
        if(promptblock.getInputTargetBlock('Model')){
          RunEngineConfigs[promptBlockId] = {}
          RunEngineConfigs[promptBlockId] = JSON.parse(JSON.stringify(EngineConfigs[promptblock.getFieldValue('LLM_Name')]));
        }
    }
    else if(promptBlockType === 'Model'){
      var modelname = promptblock.getFieldValue('modelName')
      RunModelConfigs[promptblock.id] = {}
      RunModelConfigs[promptblock.id] = JSON.parse(JSON.stringify(ModelConfigs[modelname]));
    }
    if(promptBlockType === 'Prompt_template' && !blockCreatedByPaste){
        var promptname = promptblock.getFieldValue('Prompt_Name')
        i = 0;
        if(promptblock.getInputTargetBlock('prompt_value')){
            var targetBlock = promptblock.getInputTargetBlock('prompt_value');
            RunPromptAspect[targetBlock.id] = [targetBlock.getFieldValue('Example_value'), ImportPromptValue[promptname][i][1]];
            while(targetBlock.nextConnection.isConnected()){
                i+=1;
                targetBlock = targetBlock.getNextBlock();
                RunPromptAspect[targetBlock.id] = [targetBlock.getFieldValue('Example_value'), ImportPromptValue[promptname][i][1]];
            }
        }
    }
    else if(promptBlockType === 'Example'){
        RunPromptAspect[promptBlockId] = [promptblock.getFieldValue('Example_value'), ''];
    }
    else if(blockCreatedByPaste){
        const promptasceptBlocks = findBlocksByType(Originalcopyblock, promptblock, 'Example',"demoWorkspace");
    }
    blockCreatedByPaste = false;
  }
  if(primaryEvent.type === "click" && primaryEvent.targetType === 'block'){
      if(demoWorkspace.getBlockById(primaryEvent.blockId).type === "LLM_Model"){
          generateEngineConfigForm(RunEngineConfigs[primaryEvent.blockId], primaryEvent.blockId, primaryEvent.blockId)
          return;
      }
    if(demoWorkspace.getBlockById(primaryEvent.blockId).type === "Prompt_template"){
         promptblock = demoWorkspace.getBlockById(primaryEvent.blockId);
         var promptvalue = '';
         var tragetblock = promptblock.getInputTargetBlock('prompt_value');
         if(tragetblock){
             promptvalue += RunPromptAspect[tragetblock.id][1] + "\n"
             while(tragetblock.nextConnection.isConnected()){
                 tragetblock = tragetblock.getNextBlock();
                 promptvalue += RunPromptAspect[tragetblock.id][1] + "\n";
             }
         }
         document.getElementById('PromptConsoleValue').innerHTML = `<textarea id="${promptBlockId}" class="ProjectPromptTemplate" readonly="readonly" style="display: block">${promptvalue}</textarea>`
    }
    else if(demoWorkspace.getBlockById(primaryEvent.blockId).type === "Example"){
        const promptplaceholder ="Please input " + demoWorkspace.getBlockById(primaryEvent.blockId).getFieldValue('Example_value')
        promptBlockId = primaryEvent.blockId;
        const promptvalue = RunPromptAspect[promptBlockId][1];
        document.getElementById('PromptConsoleValue').innerHTML = `<textarea id="${promptBlockId}" class="ProjectPromptTemplate" style="display: block" placeholder="${promptplaceholder}" oninput="RunPromptAspect['${promptBlockId}'][1] = this.value;">${promptvalue}</textarea>`
    }
  }
}

// init the project console
document.getElementById('ModelDiv').style.display='none';
document.getElementById('PromptDiv').style.display='none';
document.getElementById('CodeDiv').style.display='none';

draftwidth("ProjectConsole");

// mian workspace
// Variables category of the main workspace
myCategoryFlyoutVariableback = function(demoWorkspace) {return Variable_xmlList;};
// Prompt category of the main workspace
myCategoryFlyoutDIYCallback = function(demoWorkspace) {return PromptList;};
// Model category of the main workspace
myCategoryFlyoutModelCallback = function(demoWorkspace) {return ModelList;};

// prompt workspace
// Promptbuilder category of the prompt workspace
myCategoryFlyoutPrompttemplateCallback = function(PromptWorkspace) {return PrompttemplateList;};

// model workspace
// Engine category of the model workspace
// AIengine category of the model workspace
myCategoryFlyoutDIYModelCallback = function(ModelWorkspace) {return DIYmodelList;};
myCategoryFlyoutAPIEngineCallback = function(ModelWorkspace) {return APIEngine;};
myCategoryFlyoutTraditionEngineCallback = function(ModelWorkspace) {return TraditionEngine;};

PromptWorkspace.registerToolboxCategoryCallback('DIYPrompttemplate', myCategoryFlyoutPrompttemplateCallback);
ModelWorkspace.registerToolboxCategoryCallback('DIYModel', myCategoryFlyoutDIYModelCallback);
ModelWorkspace.registerToolboxCategoryCallback('APIEngine', myCategoryFlyoutAPIEngineCallback);
ModelWorkspace.registerToolboxCategoryCallback('TraditionEngine', myCategoryFlyoutTraditionEngineCallback);
// document.getElementById("taskNodeDisplay").value = DesignManager
initIDE();
upload_project1("Hui Xiao Shi",huixiaoshi)
//
// upload_project1("todos2pic",todos2pic)
initIDE();

/*
让demoworkplace自动更新大小
 */
// 选取要监视的元素
const myDiv = document.querySelector('#ProjectDiv');
// 创建 MutationObserver 实例
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        onresize();
    }
  });
});
// 配置 MutationObserver
const config = {
  attributes: true,
  childList: false,
  characterData: false,
  attributeFilter: ['class']
};
// 开始监视
observer.observe(myDiv, config);
const myDiv1 = document.querySelector('#blocklyDiv');
// 创建 MutationObserver 实例
const observer1 = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        onresize();
    }
  });
});
// 配置 MutationObserver
const config1 = {
  attributes: true,
  childList: false,
  characterData: false,
  attributeFilter: ['style']
};
// 开始监视
observer1.observe(myDiv1, config1);


const jsonData = [
  {
    "content": "How are you",
    "input": ["history", "human"],
    "prompt": ["You are a chatbot having a conversation with a human.\n" +
    "\n" +
    "{{chat_history}}\n" +
    "Human: {{human_input}}\n" +
    "Chatbot:\n", "i am miss you"],
    "output": "chatbot",
    "model": "LLM"
  },
    {
    "content": "How are you",
    "input": ["history","human", "chatbot"],
    "prompt": ["chat = \"\"\"{{chat}}\"\"\"\n" +
    "human = \"\"\"Human: {{human}}\"\"\"\n" +
    "bot = \"\"\"Chatbot: {{bot}}\"\"\"\n" +
    "history = chat + \"\\n\" + human + \"\\n\" + bot + \"\\n\"\n" +
    "print(history)\n" +
    "\n", "i am miss you"],
    "output": "history",
    "model": "python"
  },
    {
    "content": "How are you",
    "input": ["history", "human"],
    "prompt": ["You are a chatbot having a conversation with a human.\n" +
    "\n" +
    "{{chat_history}}\n" +
    "Human: {{human_input}}\n" +
    "Chatbot:\n", "i am miss you"],
    "output": "chatbot",
    "model": "LLM"
  },
];
const inittaskcard = {
    "content": "",
    "input": [],
    "prompt": [""],
    "output": ["", 'no'],
    "model": "LLM"
}
const initlogiccard = {
    "input1" : '',
    "logicOperator" : '=',
    'input2': ''
}

$(document).ready(function () {
    // Make the div draggable


    $("#addItem").click(function () {
        $("#collapsePrework .card-body").append(addNewItem());
    });

    $(document).on('click', '.delete-button', function () {
        $(this).closest('.prework-item').remove();
    });

    $(document).on('keypress', '.form-control', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $(this).closest('.prework-item').after(addNewItem());
        }
    });

    $(document).on('click', '.confirm-button', function () {
        // 使用 jQuery 方法访问兄弟元素
        // $(this).siblings('.form-control').toggleClass('border-success');
        var checkIcon = $(this).children()
        checkIcon.each(function() {
            var currentDisplay = $(this).css('display');
            var newDisplay = currentDisplay === 'none' ? 'block' : 'none';
            $(this).css('display', newDisplay);
        });
        // 使用 jQuery 的 attr 方法获取和设置属性
        var data_output = $(this).attr("data-output") === "yes" ? "no" : "yes";

        $(this).attr("data-output", data_output);
    });

    $(document).on('click', '.output-button', function () {
        // 使用 jQuery 方法访问兄弟元素
        // $(this).closest('.worker-card').toggleClass('border-success');
        var checkIcon = $(this).children()
        checkIcon.each(function() {
            var currentDisplay = $(this).css('display');
            var newDisplay = currentDisplay === 'none' ? 'block' : 'none';
            $(this).css('display', newDisplay);
        });
        $(this).attr("data-output", $(this).attr("data-output") === "yes" ? "no" : "yes");
    });
});

// task分解后step和logic对应的卡片移动
document.addEventListener('DOMContentLoaded', function () {
  const cardContainer = document.getElementById('data-container');

  // Initialize Sortable on the card container
  let sortable = new Sortable(cardContainer, {
  group: "shared",
  animation: 150,
  onAdd: function (evt) {
      // Check if the dragged card is a task card or an If card
          if (evt.item.classList.contains('task-card') || evt.item.classList.contains('logic-card')) {
            // Get the parent If card
            const ifCardParent = evt.item.closest('.logic-card');

            // If the parent is an If card, append the dragged card header into it
            if (ifCardParent) {
              ifCardParent.querySelector('.card-body').appendChild(evt.item);
            }
          }
        },
    });
});
function updateJSON(key, value, modelIndex) {
    RunModelConfigs[modelIndex][key][0] = value;
}
function updateEngineJSON(key, value, modelIndex) {
    RunEngineConfigs[modelIndex][key][0] = value;
}

// config 参数信息， ModelId: 实时更新model, EngineId: save or import model 时指定Engine
function generateModelConfigForm(config, ModelId, EngineId) {
      const modelIndex = ModelId;
      const formHtml = `
          ${Object.entries(config).map(([key, value]) => {
            const id = key.replace(' ', '_') + "ModelId";
            if (key === 'stop_strs'){
              return `
                <div class="mb-3">
                  <label for="${id}" class="form-label">${value[1]}</label>
                  <input type="text" class="form-control" id="${id}" value="${value[0]}" oninput="updateJSON('${key}', this.value, '${modelIndex}')">
                </div>
                <hr>
              `;
            } else {
              return `
                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                    <label for="${id}" class="form-label">${value[3]}</label>
                    <input type="number" class="form-control-range" id="${id}Value" value="${value[0]}" oninput="${id}.value=${id}Value.value; updateJSON('${key}', parseFloat(this.value), '${modelIndex}')">
                  </div>
                  <input type="range" class="form-range" min="0" max="${value[2]}" step="${value[1]}" id="${id}" value="${value[0]}" oninput="${id}Value.value=${id}.value;  updateJSON('${key}', parseFloat(this.value), '${modelIndex}')">
                </div>
                <hr>
              `;
            }
          }).join('')}
      `;
      document.getElementById('ModelContentDiv').innerHTML = `<div data-engine-id = '${EngineId}' data-model-id = '${ModelId}' style=";background-color: white;padding-left: 5px;display: block">
           <div class="mb-3">
              <h5 id="Engine_Name">` + ModelWorkspace.getBlockById(EngineId).getFieldValue('LLM_Name') +`</h5>
           </div>
           <hr>` + formHtml + '<\div>';
      document.getElementById('CreateModelDiv').style.height = 'calc(60% - 30px)';
      document.getElementById('ModelContentDiv').style.display = 'block';
      Blockly.svgResize(ModelWorkspace);
}

// generateModelConfigForm(Configuration1, 'initmodel')
function generateEngineConfigForm(config, ModelId, EngineId) {
      const modelIndex = ModelId
      const formHtml = `
          ${Object.entries(config).map(([key, value]) => {
            const id = 'Engine' + key.replace(' ', '_');
            if (key === 'stop_strs'){
              return `
                <div class="mb-3">
                  <label for="${id}" class="form-label">${value[1]}</label>
                  <input type="text" class="form-control" id="${id}" value="${value[0]}" oninput="updateEngineJSON('${key}', this.value, '${modelIndex}')">
                </div>
                <hr>
              `;
            } else {
              return `
                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                    <label for="${id}" class="form-label">${value[3]}</label>
                    <input type="number" class="form-control-range" id="${id}Value" value="${value[0]}" oninput="${id}.value=${id}Value.value; updateEngineJSON('${key}', parseFloat(this.value), '${modelIndex}')">
                  </div>
                  <input type="range" class="form-range" min="0" max="${value[2]}" step="${value[1]}" id="${id}" value="${value[0]}" oninput="${id}Value.value=${id}.value;  updateEngineJSON('${key}', parseFloat(this.value), '${modelIndex}')">
                </div>
                <hr>
              `;
            }
          }).join('')}
      `;
      document.getElementById('EngineConsoleValue').innerHTML = `<div style=";background-color: white;padding-left: 5px;display: block">
            <br>` + formHtml + '<\div>';
}

function designSeparator() {
    const separator = document.getElementById('design-separator');
    const leftWrapper = document.getElementById('design-leftWrapper');
    let isMouseDown = false;

    separator.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isMouseDown = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        let newWidth = e.clientX - leftWrapper.offsetLeft;
        if (5<=newWidth) { // 设置左侧最小宽度防止变得太小
            leftWrapper.style.width = newWidth + 'px';
        }
    });

    document.addEventListener('mouseup', (e) => {
        isMouseDown = false;
    });
}
function exploreSeparator() {
    const separator = document.getElementById('explore-separator');
    const leftWrapper = document.getElementById('explore-leftWrapper');
    let isMouseDown = false;

    separator.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isMouseDown = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        let newWidth = e.clientX - leftWrapper.offsetLeft;
        if (newWidth >= 5) { // 设置左侧最小宽度防止变得太小
            leftWrapper.style.width = newWidth + 'px';
        }
    });

    document.addEventListener('mouseup', (e) => {
        isMouseDown = false;
    });
}

designSeparator()
exploreSeparator()

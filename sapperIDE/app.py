from flask import Flask, request, render_template
from flask_cors import CORS
import json
from SapperChain.exploration_view import exploration
from SapperChain.clarify import generate_query_expansion
from SapperChain.run_prompt import *
from SapperChain.decompose import Generasteps
from SapperChain.Metaprompt_gpt3 import gen_for_gpt3

app = Flask(__name__)
CORS(app)

from flask import Blueprint
bp = Blueprint('sapperenterprise', __name__, static_url_path='/sapperenterprise/static', static_folder='static', template_folder='templates')
app.register_blueprint(bp)


@app.route('/sapperenterprise/workspace')
def index():
    return render_template("promptsapper.html")

@app.route('/sapperenterprise/Clarify',methods = ['POST','GET'])
def Clarify():
    if request.method == 'POST':
        try:
            data = request.form
            OpenAIKey = data['OpenAIKey']
            print(data)
            question, result = generate_query_expansion(data['behaviour'] ,data['message'], OpenAIKey)
            return json.dumps({"question": question, "result": result})
        except Exception as e:
            print(e)
            return str(e), 500

@app.route('/sapperenterprise/Explore',methods = ['POST','GET'])
def Explore():
    if request.method == 'POST':
        try:
            data = request.form
            data = json.loads(data['senddata'])
            print(data['message'])
            OpenAIKey = data['OpenAIKey']
            explore = exploration(OpenAIKey)
            explore.prompt = data['message']
            # Call chatbot
            response = explore.chatbot()
            explore.prompt.append({"role": response["role"], "content": response["content"]})
            pre_design = explore.pre_design_view()
            return json.dumps({'Answer':{"role": response["role"], "content": response["content"]}, 'Design': pre_design})
        except Exception as e:
            print(e)
            return str(e), 500

@app.route('/sapperenterprise/Decompose',methods = ['POST','GET'])
def Decompose():
    if request.method == 'POST':
        try:
            data = request.form
            OpenAIKey = data['OpenAIKey']
            print(data)
            steps = Generasteps(data['message'], OpenAIKey)
            print(steps)
            return json.dumps(steps)
        except Exception as e:
            print(e)
            return str(e), 500

@app.route('/sapperenterprise/Regetprompt',methods = ['POST','GET'])
def Regetprompt():
    if request.method == 'POST':
        try:
            data = request.form
            OpenAIKey = data['OpenAIKey']
            print(data)
            textinfo = json.loads(data["data"])
            steps = gen_for_gpt3(textinfo["input"],textinfo['message'], OpenAIKey)[0]
            return steps
        except Exception as e:
            print(e)
            return str(e), 500

@app.route('/sapperenterprise/Getprompt',methods = ['POST','GET'])
def Getprompt():
    if request.method == 'POST':
        try:
            data = request.form
            OpenAIKey = data['OpenAIKey']
            requery = json.loads(data['message'])
            print(requery)
            res = {}
            for step in requery.keys():
                prompts = gen_for_gpt3(requery[step]['input'],requery[step]['content'], OpenAIKey)
                res[step] = []
                for pro in prompts:
                    res[step].append({'context': pro})
            return json.dumps(res)
        except Exception as e:
            print(e)
            return str(e), 500

@app.route('/sapperenterprise/SapperUnit',methods = ['POST','GET'])
def SapperUnit():
    if request.method == 'POST':
        data = request.form
        data = json.loads(data["senddata"])
        print(data["action"])
        try:
            debugvalue = ""
            if "debugvalue" in data.keys():
                debugvalue = data["debugvalue"]
            if data["action"] == "run_Function":
                OpenAIKey = data['OpenAIKey']
                preunits = data["preunits"].split("#*#*")
                preunits.reverse()
                preunits.pop()
                preunits.reverse()
                model = json.loads(data["model"])
                prompt = data["prompt_name"]
                output = run_Function(prompt, preunits, model, OpenAIKey, debugvalue)
                return json.dumps(output)
            if data["action"] == "run_PythonREPL":
                print("on_run")
                preunits = data["preunits"].split("#*#*")
                preunits.reverse()
                preunits.pop()
                preunits.reverse()
                model = json.loads(data["model"])
                prompt = data["prompt_name"]
                output = run_PythonREPL(prompt, preunits, model, debugvalue)
                return json.dumps(output)
        except Exception as e:
            print(e)
            return str(e), 500

if __name__ == '__main__':
    app.run(debug=False)

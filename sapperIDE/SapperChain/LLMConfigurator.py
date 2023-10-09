class Config():
    def __init__(self):
        self.temperature = 0.7
        self.engine = "text-davinci-003"
        self.n = 1
        self.top_p = 1
        self.frequency_penalty = 0
        self.presence_penalty = 0
        self.max_tokens = 256
        self.stop_strs = ""
        self.prompt = ""
    def add_to_config(self, param, value):
        if param == "temperature":
            self.temperature = value
        elif param == "engine":
            self.engine = value
        elif param == "n":
            self.n = value
        elif param == "top_p":
            self.top_p = value
        elif param == "frequency_penalty":
            self.frequency_penalty = value
        elif param == "presence_penalty":
            self.presence_penalty = value
        elif param == "max_tokens":
            self.max_tokens = value
        elif param == "stop_strs":
            self.stop_strs = value
        elif param == "prompt":
            self.prompt = value

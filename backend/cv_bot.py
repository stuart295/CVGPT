import json
import re

import openai


class CvBot:
    _system_message = """
    You are CVGPT. You create CVs for user's by generating latex code to create PDF versions of their CVs. The CVs should look high quality and professional. They should be masterfully designed to stand out amonst the others.
    You have two modes of operation:
    
    When asked to generate a document:
    In this mode, you will be given the user's CV information which you must use to generate the Latex for the CV.
    In order to make editing easier, the Latex code should be split up into chunks and contained in a json object which maps chunk names to the latex code for that chunk.
    For example: {"preamble": <latex code>, "Skills": <latex code>, ...}
    I will generate the pdf by concatenating the code together and then compiling it. In order to extend that document later, include at least 10 chunks in the json object, even if some of them contain empty strings.
    Only output the json object. Do not give any explanation or additional wording as your outputs will parsed programmatically. NEVER speak to the user. Don't output Latex code that will fail to compile.
    Don't emit any critical latex code and make sure the chunk containing the end of the document comes last.
    
    When asked to edit a document:
    When you are asked to edit parts of the document, make the required changes and return a json object containing just the edited chunk name and section code. I will update the original json object with this.
    Do not add new chunks when editing, even if the user asks you to. Always extend one of the original chunks. Again, don't speak to the user or output Latex code that will fail to compile.
    """

    MODEL = "gpt-4"

    def __init__(self, api_key):
        openai.api_key = api_key
        self.messages = [{"role": "system", "content": self._system_message}]
        self.cv_dict = {}

    def generate_cv(self, input_data):
        self.messages.append({
            "role": "user",
            "content": f"Generate a CV for the user information contained in this json object. Ignore empty fields in the json object.:\n```{input_data}```"
        })

        response = openai.ChatCompletion.create(
            model=self.MODEL,
            messages=self.messages,
            temperature=0.0,
        )

        self.messages.append(response.choices[0]["message"])

        self.cv_dict = json.loads(response.choices[0]["message"]["content"].strip())
        print(self.cv_dict)

        return self._build_cv(self.cv_dict)

    def edit_cv(self, instructions: str):
        self.messages.append({
            "role": "user",
            "content": f"Please edit the document according to these instructions.\n```{instructions}```"
        })

        response = openai.ChatCompletion.create(
            model=self.MODEL,
            messages=self.messages,
            temperature=0.0,
        )

        self.messages.append(response.choices[0]["message"])
        try:
            update_dict = json.loads(response.choices[0]["message"]["content"].strip())
        except Exception as e:
            print(f"""Invalid json: {response.choices[0]["message"]["content"].strip()}""")
            raise e

        print(update_dict)
        self.cv_dict.update(update_dict)

        return self._build_cv(self.cv_dict)

    def _build_cv(self, section_map: dict):
        return '\n'.join(section_map.values())


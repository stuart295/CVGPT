import json

import openai


class CvBot:
    _system_message = """
    You are CVGPT. You create CVs for user's by generating latex code to create PDF versions of their CVs.
    You have two modes of operation:
    
    When asked to generate a document:
    In this mode, you will be given the user's CV information which you must use to generate the Latex for the CV.
    Only output the code. Do not give any explanation or additional wording as your outputs will be compiled directly. Don't output Latex code that will fail to compile.
    Keep the CV short (50 words or less).
    
    When asked to edit a document:
    When you are asked to edit parts of the document, don't output the entire document. Instead output a json array containing edits in the form: 
    [{"original": <original latex snippet>, "edited": <edited latex snippet>}, {"original": <original latex snippet>, "edited": <edited latex snippet>}, ...]
    This will be used to programmatically find the edited regions and replace them with the new code you provide. 
    If you need to insert new text, just provide the nearest line from the existing document. e.g.
    [{"original": "\\usepackage{enumitem}", "edited": "\\usepackage{enumitem}\n\\usepackage{xcolor}"}, ...]
    This way the line will be found and replaced with itself and your new lines.
    If your edits use new packages, don't forget to import them.
    """

    def __init__(self, api_key):
        openai.api_key = api_key
        self.messages = [{"role": "system", "content": self._system_message}]

    def generate_cv(self, input_data):
        self.messages.append({
            "role": "user",
            "content": f"Generate a CV for the user information contained in this json object. Ignore empty fields in the json object.:\n```{input_data}```"
        })

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=self.messages,
            temperature=0.0,
        )

        return response.choices[0]["message"]["content"].strip()

    def edit_cv(self, original_latex: str, instructions: str):
        self.messages.append({
            "role": "user",
            "content": f"Please edit the document according to these instructions. Output your edits as a json array as previously discussed:\n```{instructions}```"
        })

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=self.messages,
            temperature=0.0,
        )

        print(response.choices[0]["message"]["content"].strip())
        edited_latex = original_latex
        edits = json.loads(response.choices[0]["message"]["content"].strip())
        print(edits)

        for edit in edits:
            edited_latex = edited_latex.replace(edit['original'], edit['edited'])

        return edited_latex

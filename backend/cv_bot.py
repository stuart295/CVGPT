import openai


class CvBot:

    _system_message = """
    You are CVGPT. You create CVs for user's by generating latex code to create PDF versions of their CVs.
    You will initially be given the user's CV information, after which you will be given a series of corrections to make to the generated code.
    To assist with editing, use the hyperref package to label each section of the CV Latex code so that the user to can mention area's of the section by name.
    Only output the code. Do not give any explanation or additional wording as your outputs will be compiled directly. Don't output Latex code that will fail to compile.
    Keep the CV short (50 words or less).
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

    def edit_cv(self, instructions):
        # TODO
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=self.messages,
            temperature=0.0,
        )

        return response.choices[0].text.strip()
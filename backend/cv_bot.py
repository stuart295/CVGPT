import json
import openai


class CvBot:
    MODEL = "gpt-4"
    SYSTEM_MESSAGE_PATH = "./prompts/cv_bot_system_message.txt"

    def __init__(self, api_key):
        openai.api_key = api_key

        # Load the system message from a text file
        with open(self.SYSTEM_MESSAGE_PATH) as f:
            self.messages = [{"role": "system", "content": f.read().strip()}]

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


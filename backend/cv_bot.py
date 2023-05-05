import json
import openai
import logging

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")

class CvBot:
    MODEL = "gpt-4"
    SYSTEM_MESSAGE_PATH = "./prompts/cv_bot_system_message.txt"

    def __init__(self, api_key):
        openai.api_key = api_key
        self.messages = self._load_system_message()
        self.cv_dict = {}

    def _load_system_message(self):
        with open(self.SYSTEM_MESSAGE_PATH) as f:
            return [{"role": "system", "content": f.read().strip()}]

    def generate_cv(self, input_data):
        user_message = f"Generate a CV for the user information contained in this json object. Ignore empty fields in the json object.:\n```{input_data}```"
        self.messages.append({"role": "user", "content": user_message})

        response = self._chat_completion_request()

        self.messages.append(response.choices[0]["message"])

        self.cv_dict = json.loads(response.choices[0]["message"]["content"].strip())
        logger.debug(self.cv_dict)

        return self._build_cv(self.cv_dict)

    def edit_cv(self, instructions: str):
        user_message = f"Please edit the document according to these instructions.\n```{instructions}```"
        self.messages.append({"role": "user", "content": user_message})

        response = self._chat_completion_request()

        self.messages.append(response.choices[0]["message"])
        try:
            update_dict = json.loads(response.choices[0]["message"]["content"].strip())
        except Exception as e:
            logger.error(f"""Invalid json: {response.choices[0]["message"]["content"].strip()}""")
            raise e

        logger.debug(update_dict)
        self.cv_dict.update(update_dict)

        return self._build_cv(self.cv_dict)

    def _chat_completion_request(self):
        return openai.ChatCompletion.create(
            model=self.MODEL,
            messages=self.messages,
            temperature=0.3,
        )

    def _build_cv(self, section_map: dict):
        return '\n'.join(section_map.values())

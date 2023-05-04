import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from cv_bot import CvBot
from compile_latex import compile_latex


def create_app():
    app = Flask(__name__, static_folder="../frontend/dist/frontend", static_url_path="/")
    CORS(app)
    return app


def initialize_cv_bot():
    with open('openai_key') as f:
        cv_bot = CvBot(f.readline().strip())
    return cv_bot


app = create_app()
cv_bot = initialize_cv_bot()
doc_latex = ""


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/api/generate_cv", methods=["POST"])
def generate_cv():
    global doc_latex
    info_json = request.json
    app.logger.info(f"Generating CV with data: {info_json}")

    doc_latex = cv_bot.generate_cv(info_json)
    app.logger.debug(doc_latex)

    try:
        pdf_buffer = compile_latex(doc_latex)
    except Exception as e:
        app.logger.error(e)
        return jsonify({"status": "error", "message": "LaTeX code validation or compilation failed."})

    return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name="cv.pdf")


@app.route("/api/edit_cv", methods=["POST"])
def edit_cv():
    global doc_latex
    message_json = request.json
    instructions = message_json['instr']
    app.logger.info(f"Editing CV with instructions: {instructions}")

    doc_latex = cv_bot.edit_cv(instructions)
    app.logger.debug(doc_latex)

    try:
        pdf_buffer = compile_latex(doc_latex)
    except Exception as e:
        app.logger.error(e)
        return jsonify({"status": "error", "message": "LaTeX code validation or compilation failed."})

    return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name="cv.pdf")


if __name__ == "__main__":
    app.run(debug=True)

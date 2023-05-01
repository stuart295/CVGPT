from flask import Flask, render_template, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from cv_bot import CvBot
from compile_latex import compile_latex

# App setup
app = Flask(__name__, static_folder="../frontend/dist/frontend", static_url_path="/")
CORS(app)

with open('openai_key') as f:
    cv_bot = CvBot(f.readline().strip())

doc_latex = ""

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/api/generate_cv", methods=["POST"])
def generate_cv():
    global doc_latex
    info_json = request.json
    print(f"Generating CV with data: {info_json}")

    doc_latex = cv_bot.generate_cv(info_json)
    print(doc_latex)

    try:
        pdf_buffer = compile_latex(doc_latex)
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "LaTeX code validation or compilation failed."})

    return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name="cv.pdf")

    # file_path = 'static'  # the folder where the sample PDF resides
    # pdf_filename = 'out.pdf'
    #
    # # send the local file instead of generating a new one
    # return send_from_directory(file_path, pdf_filename)

@app.route("/api/edit_cv", methods=["POST"])
def edit_cv():
    global doc_latex
    message_json = request.json
    instructions = message_json['instr']
    print(f"Editing CV with instructions: {instructions}")

    doc_latex = cv_bot.edit_cv(doc_latex, instructions)
    print(doc_latex)

    try:
        pdf_buffer = compile_latex(doc_latex)
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "LaTeX code validation or compilation failed."})

    return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name="cv.pdf")


if __name__ == "__main__":
    app.run(debug=True)

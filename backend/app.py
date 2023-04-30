from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
from cv_bot import CvBot
from compile_latex import compile_latex

# App setup
app = Flask(__name__, static_folder="../frontend/dist/frontend", static_url_path="/")
CORS(app)

with open('openai_key') as f:
    cv_bot = CvBot(f.readline().strip())

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/api/generate_cv", methods=["POST"])
def generate_cv():
    info_json = request.json
    print(f"Generating CV with data: {info_json}")

    latex = cv_bot.generate_cv(info_json)
    print(latex)

    try:
        pdf_buffer = compile_latex(latex)
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "LaTeX code validation or compilation failed."})

    return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name="cv.pdf")


if __name__ == "__main__":
    app.run(debug=True)

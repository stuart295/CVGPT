from flask import Flask, render_template, jsonify

app = Flask(__name__, static_folder="../frontend/dist/frontend", static_url_path="/")

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/api/generate_cv", methods=["POST"])
def generate_cv():
    # Add your PDF generation and editing logic here
    return jsonify({"status": "success", "message": "CV generated"})

if __name__ == "__main__":
    app.run(debug=True)

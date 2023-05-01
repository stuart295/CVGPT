import os
import subprocess
import tempfile
from io import BytesIO

def compile_latex(latex_code):
    with tempfile.TemporaryDirectory() as temp_dir:
        output_filename = os.path.join(temp_dir, 'output')

        # Save the LaTeX code to a .tex file
        with open(f"{output_filename}.tex", "w") as tex_file:
            tex_file.write(latex_code)

        # Run pdflatex to generate the PDF
        subprocess.run(['pdflatex', '-output-directory', temp_dir, f'{output_filename}.tex'])

        # Read the generated PDF and return its content
        with open(f"{output_filename}.pdf", "rb") as pdf_file:
            pdf_content = pdf_file.read()

    return BytesIO(pdf_content)
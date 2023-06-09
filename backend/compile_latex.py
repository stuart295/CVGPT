import os
import subprocess
import tempfile
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

def compile_latex(latex_code):
    with tempfile.TemporaryDirectory() as tempdir:
        tex_file = os.path.join(tempdir, "temp.tex")
        pdf_file = os.path.join(tempdir, "temp.pdf")

        with open(tex_file, "w") as f:
            f.write(latex_code)

        try:
            # Compile twice to resolve references
            for _ in range(2):
                # Note: The --enable-installer flag is risky and shouldn't be used normally
                result = subprocess.run(['pdflatex', '-interaction=nonstopmode', '--enable-installer', '-output-directory', tempdir, tex_file], check=True, text=True, capture_output=True)
                logger.debug(result.stdout)

            if os.path.exists(pdf_file):
                with open(pdf_file, 'rb') as f:
                    pdf_content = f.read()

                pdf_buffer = BytesIO(pdf_content)
                logger.info("PDF generated successfully.")
                return pdf_buffer
            else:
                logger.error("Error: PDF file not found.")

        except subprocess.CalledProcessError as e:
            logger.error(f"Error: {e.returncode}")
            logger.error(e.stderr)

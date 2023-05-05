# CV GPT Prototype

This project is me experimenting with using OpenAI's GPT models to generate and edit PDF documents through Latex code. CV's were used as they have common structures by still offer a wide-range of styling possibilities. While the current version is able to generate and edit documents, it is not very good at it.

This project is far from production-ready. Use with caution.

## Quick start
1. Install docker & docker-compose
2. Add a `openai_key` file to the project root folder containing your OpenAI API key with GPT4 access. 
   1. This isn't great. Make sure you trust the code in this project before doing this.
2. Run `start-services.bat` on Windows or `start_services.sh` on Linux to start the services in Docker.
3. Go to `localhost:80`



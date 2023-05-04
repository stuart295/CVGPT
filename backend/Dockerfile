# Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt ./

RUN apt-get update && \
    apt-get install -y --no-install-recommends texlive && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --trusted-host pypi.python.org -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["gunicorn", "-b", "0.0.0.0:5001", "app:app"]

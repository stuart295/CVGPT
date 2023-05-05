# Dockerfile
FROM python:3.10-slim-bullseye

WORKDIR /app

COPY requirements.txt ./

RUN apt-get update && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --trusted-host pypi.python.org -r requirements.txt

RUN apt-get update && \
    apt-get install -y wget lsb-release gnupg && \
    wget -qO - https://keyserver.ubuntu.com/pks/lookup?op=get\&search=0xD6BC243565B2087BC3F897C9277A7293F59E4889 | apt-key add - && \
    echo "deb http://miktex.org/download/debian $(lsb_release -cs) universe" | tee /etc/apt/sources.list.d/miktex.list && \
    apt-get update && \
    apt-get install -y miktex

ENV MIKTEX_USERCONFIG=/miktex/.miktex/texmfs/config \
    MIKTEX_USERDATA=/miktex/.miktex/texmfs/data \
    MIKTEX_USERINSTALL=/miktex/.miktex/texmfs/install

RUN miktexsetup --shared=yes finish && \
    initexmf --admin --set-config-value [MPM]AutoInstall=1 && \
    mpm --admin --update-db && \
    mpm --admin --update

RUN initexmf --update-fndb && \
    mpm --update

RUN useradd -m myuser && \
    mkdir -p /miktex/.miktex/texmfs/config /miktex/.miktex/texmfs/data /miktex/.miktex/texmfs/install && \
    chown -R myuser:myuser /miktex

USER myuser

COPY *.py ./
COPY openai_key ./
COPY prompts ./prompts/

EXPOSE 5001

CMD ["gunicorn", "-b", "0.0.0.0:5001", "app:app"]

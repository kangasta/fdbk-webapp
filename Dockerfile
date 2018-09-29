FROM python:3-alpine

WORKDIR /app/
COPY server/requirements.txt ./
RUN pip install -r requirements.txt && rm -f requirements.txt

COPY server/*.py ./

ENTRYPOINT [ "python", "server.py" ]
CMD [ "-p", "3030" ]

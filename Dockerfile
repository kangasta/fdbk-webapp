FROM python:3-alpine

COPY server/requirements.txt ./
RUN pip install -r requirements.txt && rm -f requirements.txt

WORKDIR /app/web
# Copy server to webapp folder for easier flask setup
COPY server/*.py ./

WORKDIR /app/
COPY webapp/ .
RUN apk add nodejs npm && \
	export http_proxy="" && \
	npm install && \
	npm run build && \
	mv build/* web && \
	rm -rf node_modules && \
	apk del nodejs npm;

WORKDIR /app/web
EXPOSE 3030
ENTRYPOINT [ "python", "server.py" ]
CMD [ "-p", "3030" ]

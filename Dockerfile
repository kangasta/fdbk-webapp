FROM python:3-alpine

RUN pip install fdbk

WORKDIR /app/web

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
EXPOSE 8080
ENTRYPOINT [ "fdbk-server" ]
CMD [ "-p", "8080" ]

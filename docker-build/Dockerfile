FROM python:3-alpine
ARG webapp_version="0.8.3"

RUN pip install fdbk==$(echo ${webapp_version} | sed -Ee "s#(.\..\.).#\1*#")

WORKDIR /app/
RUN wget https://github.com/kangasta/fdbk-webapp/releases/download/v${webapp_version}/webapp-build-v${webapp_version}.tar.gz && \
	tar zxf webapp-build-v${webapp_version}.tar.gz
WORKDIR /app/build

EXPOSE 8080
ENTRYPOINT [ "fdbk-server" ]
CMD [ "-p", "8080" ]

# fdbk-webapp

[![Build Status](https://travis-ci.org/kangasta/fdbk-webapp.svg?branch=master)](https://travis-ci.org/kangasta/fdbk-webapp)

Webapp for [kangasta/fdbk](https://github.com/kangasta/fdbk.git).

## Usage

For demo with either MongoDB or local Python dict as the database, run:

```bash
# MongoDB as the back-end
docker-compose up -d

# OR

# Local Python dict as the back-end
docker build . -t fdbk
docker run -d \
	-p 8080:8080 \
	-v ${PWD}/config/dict.json:/app/config.json \
	--name=fdbk \
	fdbk --config-file /app/config.json --port 8080
```

And navigate to `http://localhost:8080/` with your web browser.

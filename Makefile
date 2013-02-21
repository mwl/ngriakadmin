RIAK_HOST=localhost
RIAK_PORT=8098
RIAK_HOME=http://$(RIAK_HOST):$(RIAK_PORT)
BUCKET_NAME=ngriakadmin
BUCKET_HOME=$(RIAK_HOME)/buckets/$(BUCKET_NAME)
BUCKET_HOME_OLD=$(RIAK_HOME)/riak/$(BUCKET_NAME)

check:
ifneq '$(shell curl -s http://localhost:8098/ping)' 'OKs'
	@echo Riak does not responds to ping on $(RIAK_HOME)/ping
	@exit 1
else
	@echo Riak responds to ping. Good.
endif


install: check
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/index.html $(BUCKET_HOME)/keys/index.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/home.html $(BUCKET_HOME)/keys/home.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/riak.html $(BUCKET_HOME)/keys/riak.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/settings.html $(BUCKET_HOME)/keys/settings.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/buckets.html $(BUCKET_HOME)/keys/buckets.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/bucket.html $(BUCKET_HOME)/keys/bucket.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/key.html $(BUCKET_HOME)/keys/key.html
	@curl -XPUT -H "Content-Type: text/javascript" --data-binary @src/ngriakadmin.js $(BUCKET_HOME)/keys/ngriakadmin.js
	@curl -XPUT -H "Content-Type: application/json" --data-binary @src/settings.json $(BUCKET_HOME)/keys/settings.json
	@echo NgRiakAdmin was installed. Open $(BUCKET_HOME_OLD)/index.html

insecure: install
	@curl -XPUT -H "Content-Type: application/json" --data-binary @src/settings_insecure.json $(BUCKET_HOME)/keys/settings.json


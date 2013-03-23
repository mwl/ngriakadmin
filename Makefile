RIAK_HOST=localhost
RIAK_PORT=8098
RIAK_HOME=http://$(RIAK_HOST):$(RIAK_PORT)
BUCKET_NAME=ngriakadmin
BUCKET_HOME=$(RIAK_HOME)/buckets/$(BUCKET_NAME)
BUCKET_HOME_OLD=$(RIAK_HOME)/riak/$(BUCKET_NAME)

check:
ifneq '$(shell curl -s http://localhost:8098/ping)' 'OK'
	@echo Riak does not responds to ping on $(RIAK_HOME)/ping
	@exit 1
else
	@echo Riak responds to ping. Good.
endif

clean:
	@curl -s -XDELETE $(BUCKET_HOME)/keys/index.html
	@curl -s -XDELETE $(BUCKET_HOME)/keys/home.html
	@curl -s -XDELETE $(BUCKET_HOME)/keys/riak.html
	@curl -s -XDELETE $(BUCKET_HOME)/keys/settings.html
	@curl -s -XDELETE $(BUCKET_HOME)/keys/buckets.html
	@curl -s -XDELETE $(BUCKET_HOME)/keys/bucket.html
	@curl -s -XDELETE $(BUCKET_HOME)/keys/key.html
	@curl -s -XDELETE $(BUCKET_HOME)/keys/mapred.html
	@curl -s -XDELETE $(BUCKET_HOME)/keys/ngriakadmin.js
	@curl -s -XDELETE $(BUCKET_HOME)/keys/ui-bootstrap-tpls-0.2.0.min.js
	@curl -s -XDELETE $(BUCKET_HOME)/keys/settings.json
	@curl -s -XDELETE $(BUCKET_HOME)/keys/mapred.json

install: check
	@curl -s -XPUT -H "Content-Type: text/html" --data-binary @src/index.html $(BUCKET_HOME)/keys/index.html
	@curl -s -XPUT -H "Content-Type: text/html" --data-binary @src/home.html $(BUCKET_HOME)/keys/home.html
	@curl -s -XPUT -H "Content-Type: text/html" --data-binary @src/riak.html $(BUCKET_HOME)/keys/riak.html
	@curl -s -XPUT -H "Content-Type: text/html" --data-binary @src/settings.html $(BUCKET_HOME)/keys/settings.html
	@curl -s -XPUT -H "Content-Type: text/html" --data-binary @src/buckets.html $(BUCKET_HOME)/keys/buckets.html
	@curl -s -XPUT -H "Content-Type: text/html" --data-binary @src/bucket.html $(BUCKET_HOME)/keys/bucket.html
	@curl -s -XPUT -H "Content-Type: text/html" --data-binary @src/key.html $(BUCKET_HOME)/keys/key.html
	@curl -s -XPUT -H "Content-Type: text/html" --data-binary @src/mapred.html $(BUCKET_HOME)/keys/mapred.html
	@curl -s -XPUT -H "Content-Type: text/javascript" --data-binary @src/ngriakadmin.js $(BUCKET_HOME)/keys/ngriakadmin.js
	@curl -s -XPUT -H "Content-Type: text/javascript" --data-binary @src/ui-bootstrap-tpls-0.2.0.min.js $(BUCKET_HOME)/keys/ui-bootstrap-tpls-0.2.0.min.js
	@curl -s -XPUT -H "Content-Type: application/json" --data-binary @src/settings.json $(BUCKET_HOME)/keys/settings.json
	@curl -s -XPUT -H "Content-Type: application/json" --data-binary @src/mapred.json $(BUCKET_HOME)/keys/mapred.json
	@echo NgRiakAdmin was installed. Open $(BUCKET_HOME_OLD)/index.html

insecure: install
	@curl -XPUT -H "Content-Type: application/json" --data-binary @src/settings_insecure.json $(BUCKET_HOME)/keys/settings.json


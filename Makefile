RIAK_NODE=http://localhost:8098
BUCKET_HOME=$(RIAK_NODE)/buckets/ngriakadmin
BUCKET_HOME_OLD=$(RIAK_NODE)/riak/ngriakadmin

install:
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/index.html $(BUCKET_HOME)/keys/index.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/home.html $(BUCKET_HOME)/keys/home.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/riak.html $(BUCKET_HOME)/keys/riak.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/buckets.html $(BUCKET_HOME)/keys/buckets.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/bucket.html $(BUCKET_HOME)/keys/bucket.html
	@curl -XPUT -H "Content-Type: text/html" --data-binary @src/key.html $(BUCKET_HOME)/keys/key.html
	@curl -XPUT -H "Content-Type: text/javascript" --data-binary @src/ngriakadmin.js $(BUCKET_HOME)/keys/ngriakadmin.js
	@echo NgRiakAdmin was install. Open $(BUCKET_HOME_OLD)/index.html

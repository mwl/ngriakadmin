RIAK_NODE=http://localhost:8098
BUCKET_HOME=$(RIAK_NODE)/buckets/ngriakadmin
BUCKET_HOME_OLD=$(RIAK_NODE)/riak/ngriakadmin

install:
	@curl -XPUT -H "Content-Type: text/html" --data @src/index.html $(BUCKET_HOME)/keys/index.html
	@curl -XPUT -H "Content-Type: text/html" --data @src/riak.html $(BUCKET_HOME)/keys/riak.html
	@curl -XPUT -H "Content-Type: text/html" --data @src/buckets.html $(BUCKET_HOME)/keys/buckets.html
	@curl -XPUT -H "Content-Type: text/html" --data @src/bucket.html $(BUCKET_HOME)/keys/bucket.html
	@curl -XPUT -H "Content-Type: text/javascript" --data @src/ngriakadmin.js $(BUCKET_HOME)/keys/ngriakadmin.js
	@echo NgRiakAdmin was install. Open $(BUCKET_HOME_OLD)/index.html

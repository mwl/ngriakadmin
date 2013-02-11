RIAK_NODE="http://localhost:8098"
BUCKET_HOME=$(RIAK_NODE)/riak/ngriakadmin
install:
	@curl -XPUT -H "Content-Type: text/html" --data @src/index.html $(BUCKET_HOME)/index.html
	@curl -XPUT -H "Content-Type: text/html" --data @src/riak.html $(BUCKET_HOME)/riak.html
	@curl -XPUT -H "Content-Type: text/html" --data @src/buckets.html $(BUCKET_HOME)/buckets.html
	@curl -XPUT -H "Content-Type: text/html" --data @src/bucket.html $(BUCKET_HOME)/bucket.html
	@curl -XPUT -H "Content-Type: text/javascript" --data @src/ngriakadmin.js $(BUCKET_HOME)/ngriakadmin.js
	@echo NgRiakAdmin was install. Open $(BUCKET_HOME)/index.html

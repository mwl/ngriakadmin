NgRiakAdmin
===

NgRiakAdmin tries to be to Riak what [phpMyAdmin](http://phpmyadmin.net) is for MySQL. A tool for inspecting your favourite database.

NgRiakAdmin relies on nothing but (obviously) a Riak clustor and full access to the Riak http interface and a browser on the client.

Disclaimer
---
NgRiakAdmin is **not** ready for production environments as it is listing both buckets and keys. Listing buckets and keys is a big no-go in production environments.

Installation
---
Clone this repository on one of the clusternodes. Assuming the http interface is enabled on port 8098 fire of

```
$ make install
```

And open [http://localhost:8098/riak/ngriakadmin/index.html](http://localhost:8098/riak/ngriakadmin/index.html) in your browser.
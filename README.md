NgRiakAdmin
===

NgRiakAdmin tries to be to Riak what [phpMyAdmin](http://phpmyadmin.net) is for MySQL. A tool for inspecting your favourite database.

NgRiakAdmin relies on nothing but (obviously) a Riak cluster and full access to the Riak http interface and a browser on the client.

Installation
---
Clone this repository on one of the clusternodes. Assuming the http interface is enabled on port 8098 fire of

```
$ make install
```

And open [http://localhost:8098/riak/ngriakadmin/index.html](http://localhost:8098/riak/ngriakadmin/index.html) in your browser.

Listing buckets and keys
---
Please be aware that this is **not** for use in production environments.

Make sure you have followed instructions in this Installation section above and fire off the following command in your cloned repository

```
$ make install insecure
```

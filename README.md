# graphql-mesh-sandbox

# objective
To examine the possibilities of merging types across MariaDB and MongoDB data sources
Attempt to write in (pseudo-)code in `example.graphql`. 

# requirements
- Docker
- NodeJS
- yarn

# caveat
@graphql-mesh/mongoose's connection parameters (logger, loggerLevel) are not accepted by a newer MongoDB container
I believe somewhere around v3.6 is the cap.
eg. something like this in the `docker-compose.yml`

```
services:
  mongo:
    image: mongo:3.6
    platform: linux/amd64
```

Unfortunately I could not get this to work for me.


# installation
```bash
yarn install
cp ./patch-graphql-mesh-mongoose-cjs-index.js node_modules/@graphql-mesh/mongoose/cjs/index.js
```

# running
```bash
docker compose up & mesh dev
```

You should now be able to use both queries in `example-query.graphql` with variables;
```
{
  "AGBCode": "01052222"
}
```


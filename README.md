# Getting Started

## Prerequisites
1. Node version `v20.10.0`
2. Should `docker-compose` installed
3. Add the following mandatory environment variables
   1. `DB_PASSWORD`
   2. `CSV_PATH` - See the example in `.env.example` (optional)
      1. Add the value of `CSV_PATH` to the settings in docker. (optional)
          **If you're in MacOS:**
          ```sh
          vim ~/Library/Group\ Containers/group.com.docker/settings.json
          ```

          Find the `filesharingDirectories`
          ```diff
          "filesharingDirectories": [
              "/Users",
              "/Volumes",
              "/private",
              "/tmp",
              "/var/folders",
          +   "/Users/<username>/hanpoom-db-backend-exam/public/imports"
            ],
          ```

### Install using `npm`
```sh
npm i
```

### Run PostgreSQL container
```sh
docker-compose up -d
```

### Run the migration and seed
```sh
node ace migration:fresh --seed
```

### Run the dev environment
```sh
npm run dev
```
> Then go localhost:3333/api

## API Endpoint
### `GET /picking-slips`

#### Query Strings
| query strings       | type                            | default |
| ------------------- | ------------------------------- | ------- |
| page                | number                          | 1       |
| limit               | number                          | 20      |
| picking_slip_status | enum: printed,not printed, held | -       |
| has_pre_order_item  | boolean                         | -       |

### Response
```json
{
  "meta": {
    "total": 2713,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 136,
    "firstPage": 1,
    "firstPageUrl": "/?page=1",
    "lastPageUrl": "/?page=136",
    "nextPageUrl": "/?page=2",
    "previousPageUrl": null
  },
  "data": [
    {
      "picking_slip_id": 2878,
      "order_id": "1463",
      "picking_slip_status": "not printed",
      "has_pre_order_item": true
    },
    {
      "picking_slip_id": 2877,
      "order_id": "1462",
      "picking_slip_status": "not printed",
      "has_pre_order_item": true
    },
    {
      "picking_slip_id": 2875,
      "order_id": "1461",
      "picking_slip_status": "not printed",
      "has_pre_order_item": false
    },
    ....
  ]
}
```

### Example
```sh
curl -H Content-Type: application/json "http://localhost:3333/api/picking-slips?page=1&limit=10&picking_slip_status=printed" | jq '.'
```

> **NOTE**
> 
> If `jq` is not available you can install it via homebrew.
>
> `brew install jq`



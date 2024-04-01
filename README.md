# Getting Started

## Prerequisites
1. Should `docker-compose` installed
2. Add the following mandatory environment variables
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
> Then go localhost:3333

## API Endpoint
### `GET /picking-slips`

#### Query Strings
| query strings       | type                            |
| ------------------- | ------------------------------- |
| page                | number                          |
| limit               | number                          |
| picking_slip_status | enum: printed,not printed, held |
| has_pre_order_item  | boolean                         |

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



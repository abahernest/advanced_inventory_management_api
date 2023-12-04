# Advanced Inventory Management API - AIMA

## Project Description
A simple REST API that allows the management of product inventory with added complexity in data retrieval.

## Repository Architecture

This monorepo implements Clean NestJs Architecture with Typescript (Controller, Service, and Data Layer).

## App Features

- Product, Vendor, Sales, Inventory API Endpoints (CRUD)
- Pagination and Postgres Full-Text-Search available on Products and Vendor EPs
- Postgres transactions on critical sections.
- Restock Report Endpoint
- Containerization with Docker
- Postman Documentation


## Restock Report Endpoint

Models Used in the query and information obtained from them

### MonthlySales (Sales and Product Tables): 

```

    This is the first sub query to obtain the average monthly sales.
    Perform JOIN from Sales table to Product table, selecting only sales records 
    from 1 month ago and applying the AVG aggregation function on the `quantity_sold`
    field. Ofc we GROUPED BY by product ID.
    
```

### CurrentInventory (Inventory Table):

```

    Here, we just directly obtain the minimum stock threshold 
    and available product quantity from the Inventory table.

```

### SupplierInfo (Product and Vendor Tables):

```

    Since the vendor_id column is optional on the Product table, 
    to include restock data for products without vendor, we perform a LEFT JOIN 
    from Product table to Vendor Table and then set "NO_VENDOR" as the default 
    vendor name for when vendor_id is null using the COALESCE function.

```



## Postman Documentation

[https://documenter.getpostman.com/view/11044390/2s9YeK5B1r](https://documenter.getpostman.com/view/11044390/2s9YeK5B1r)


## Installation

```bash
$ yarn install
```

## Running the app

```bash
# with docker compose
$ docker-compose up

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Limitations

- Unit Testing
- Authentication & Authorization
## Query Builder for PostgreSQL
With jsonb support. Written in TypeScript.

#### install

```
npm install pg-query-config
```

#### example

```javascript
const { QueryConfig } = require('pg-query-config');
const db = require('./myPgClient'); // pg or typeorm

const query = new QueryConfig({ table: 'account' });

query.where({ status: 'active', profile: { name: ['John', 'Peter'], email: 'example@mail.com' } });

query.text // SELECT * FROM account WHERE status = $1 AND profile->>'name' IN ($2,$3) AND profile->>'email' = $4
query.values // [ 'active', 'John', 'Peter', 'example@mail.com' ]

db.query(query);
```

#### typescript example

```javascript
import { QueryConfig, LeftContain } from 'pg-query-config';

type Color = 'black' | 'white' | 'blue' | 'red';
type Brand = 'BMW' | 'Audi' | 'TOYOTA';
type Engine = {
    cylinders: number;
    hp: number;
};
type Car = {
    brand: Brand;
    color: Color;
    engine: Engine;
};
type User = {
    id: number;
    name: string;
    car: Car;
};

const query = new QueryConfig<User>({ table: 'car_user' });

query
    .select(['name', 'car'])
    .where({ id: 100 })
    .orWhere([
        { car: { engine: LeftContain({ hp: 500 }) } }, 
        { car: { engine: LeftContain({ cylinders: 8 }) } }
    ]);

query.text // SELECT name,car FROM car_user WHERE id = $1 AND (car->>'engine' @> $2 OR car->>'engine' @> $3)
query.values // [ 100, '{"hp":500}', '{"cylinders":8}' ]
```

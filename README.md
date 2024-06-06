Environment:

- Node.js 20.11.0
- PostgreSQL 16.2
- ts-postgres 2.0.2
- pg 8.12.0

# Installing

```
npm ci
```

# Running

Test using ts-postgres

```
npx vitest src/ts-postgres.test.ts
```

Test using pg

```
npx vitest src/pg.test.ts
```

Warning: tests create and delete temporary PostgreSQL databases with random names
in form `test_<random-id>` 

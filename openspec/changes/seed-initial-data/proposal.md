# Change: Seed Initial Data

## Why

The application requires initial data for locations and segments to function correctly, mirroring the structure of idreau.com.br.

## What Changes

- Create migration `000003_seed_initial_data.up.sql` to insert `localidades` and `segmentos`.
- Create migration `000003_seed_initial_data.down.sql` to clean up inserted data.

## Impact

- Affected specs: `data-population`
- Affected code: `db/migrations/`

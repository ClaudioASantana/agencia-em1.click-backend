# Database Schema

## MODIFIED Requirements

### Primary Keys must use UUID
All database tables, specifically `users`, must use Universally Unique Identifiers (UUID) as their Primary Key type instead of Auto-Incrementing Integers.

#### Scenario: Registering a new user
- Given the system is running with the new schema
- When a new user registers
- Then the created user record in the database should have a `id` that is a valid UUID string (e.g., "123e4567-e89b-12d3-a456-426614174000")
- And the API response should return this UUID string.

#### Scenario: Looking up via Repository
- Given a user exists with a UUID id
- When the `UserRepository.findById` method is called with this UUID string
- Then it should successfully query the database without casting to Integer.

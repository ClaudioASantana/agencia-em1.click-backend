# Tasks: Migrate DB to UUID

- [ ] Update Prisma Schema [/]
    - [ ] Change `User.id` to `String @id @default(uuid())`.
    - [ ] Change Foreign Keys in `schema.prisma` to `String`. (Note: Only User table is actively used in new backend, but others exist).
- [ ] Apply Migration [ ]
    - [ ] Run `npx prisma migrate dev --name move_to_uuid` (Accept data reset).
- [ ] Update Types & Code [ ]
    - [ ] Clean `PrismaUserRepository` (remove `Number()` casts).
    - [ ] Ensure `User` entity creation uses UUIDs.
- [ ] Verify [ ]
    - [ ] Register new user (should have UUID).
    - [ ] Login (should work with UUID).

# Fix Publication Persistence

## Problem

Users report that saving a record in the `Publication` table fails silently or without a clear error message.
Analysis revealed that the Backend (`bureau-backend`) does not have Global Validation enabled.
This means that when the Frontend sends a payload with missing or invalid fields (specifically `establishmentId`, which can be `undefined` or `0` in some frontend states), the `PublicationController` accepts it, but the Service/Prisma layer throws a database constraint error (500 Internal Server Error).

The Frontend catches this 500 error but may not display it clearly to the user, or the user may miss the generic "Error" toast.

## Solution

Enable `ValidationPipe` globally in the NestJS application (`src/main.ts`).
This will ensure that:

1.  Invalid payloads (missing `establishmentId`) are rejected with a **400 Bad Request**.
2.  The error message will clearly state which field is missing.
3.  The application adheres to the `CreatePublicationDto` constraints.

## Risks

- Existing endpoints that rely on loose validation might start returning 400 errors. However, given this is early development, strict validation is preferred.

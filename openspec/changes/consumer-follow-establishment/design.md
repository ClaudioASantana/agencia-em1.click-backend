# Design: Consumer Follow Establishment

## Database Schema

A new join table `Follow` will be introduced to support the many-to-many relationship between `User` and `Establishment`.

```prisma
model Follow {
  id              Int           @id @default(autoincrement())
  userId          Int
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  establishmentId Int
  establishment   Establishment @relation(fields: [establishmentId], references: [id], onDelete: Cascade)
  createdAt       DateTime      @default(now())

  @@unique([userId, establishmentId])
}
```

## API Endpoints

### 1. Follow Establishment

- **Endpoint**: `POST /establishments/:id/follow`
- **Auth**: Required (JWT)
- **Role**: `CONSUMER` (Optional constraint, but recommended)
- **Response**: `201 Created` or `200 OK` (if toggle)

### 2. Unfollow Establishment

- **Endpoint**: `DELETE /establishments/:id/follow`
- **Auth**: Required (JWT)
- **Response**: `204 No Content`

### 3. List Followed Establishments

- **Endpoint**: `GET /establishments?followed=true` (Adding a query parameter to existing list endpoint)
- **Auth**: Required (JWT)
- **Response**: List of Establishments

## Frontend Architecture

- **AgencyCard**: Displays a heart icon. Clicking it triggers the follow/unfollow API.
- **FilterBar**: Adds a toggle switch "Minhas Lojas". When active, sends `followed=true` to the backend.
- **Session State**: When the user logs in, the list of followed establishment IDs should be fetched and stored globally to update all cards in real-time.

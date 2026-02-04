# Design: Unified Store Management

## Problem

The "Lojistas" view is user-centric, filtering only users with `establishmentId`. This hides:

1.  Establishments with no users (Orphans).
2.  Establishments where the user is inactive or deleted (potentially).

Maintaining two synchronized views ("Lojistas" and "Lojas") adds cognitive load and code maintenance overhead.

## Solution Architecture

Shift to a **Store-Centric** model. The `Establishment` is the root entity; the `User` (Owner) is a property of the establishment.

### UI Changes

1.  **AdminLayout**: Remove `Lojistas` menu item.
2.  **AdminEstablishmentsView**:
    - **Table Column**: "Responsável" (Owner).
      - Display: Avatar + Name + Status (Active/Inactive).
      - Action: "Manage" button (Icon: UserCog).
    - **Modal**: `StoreOwnerManagerModal`.
      - **State 1: No Owner**:
        - Input: Name, Email, Password.
        - Action: "Create & Link Owner".
      - **State 2: Owner Exists**:
        - Display: Read-only Owner Details.
        - Action: "Unlink User" (Set `establishmentId` to null).
        - Action: "Edit User" (Update Name/Email/Active).
        - Action: "Reset Password".

### Backend Changes

- **EstablishmentService**: Ensure `findAllAdmin` returns full user details (already implemented).
- **UsersService**:
  - `createStoreOwner`: Helper to create a user and immediately link to an establishment.
  - `unlinkStoreOwner`: Helper to set `establishmentId` to null.

## Trade-offs

- **Pros**:
  - Single source of truth.
  - Orphans are visible.
  - Simplified navigation.
- **Cons**:
  - Loss of "bulk user management" view (e.g., if an admin wanted to see _only_ users regardless of store).
  - _Mitigation_: We only care about Store Owners here. Admins management is separate.

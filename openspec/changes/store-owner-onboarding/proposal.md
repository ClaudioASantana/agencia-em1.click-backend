# Store Owner Onboarding and Profile Management

## Problem

Currently, the system assumes a tight coupling between Users and Establishments during creation. The user wants to enable a flow where a Store Owner user is created first (potentially without a fully populated store profile, or not linked at all initially), and then the user logs in to "claim" or "fill" their store details.

Future state vision: Users self-register via email, receive a validation email, and then access the system to create their store profile.

## Proposed Solution

Decouple the "User Creation" from "Store Establishment" requirements.

1.  **User State**: Allow users to exist without an active store profile (or linked to an empty/inactive one).
2.  **Onboarding Flow**:
    - **Phase 1 (Current)**: Admin creates User. User receives credentials. User logs in. User fills Store Profile.
    - **Phase 2 (Future)**: User signs up. System sends email. User logs in. User creates Store Profile.

For this proposal, we focus on **Phase 1** to unblock the Admin-led onboarding.

## Architecture

- **Backend**: Ensure `establishmentId` in `User` model is optional (already seems to be nullable).
- **Frontend**:
  - Handle "No Establishment" state in `StoreLayout` and `StoreProfileView`.
  - If user has no establishment, redirect to a "Create/Claim Store" or "Empty Profile" view instead of failing on `GET /establishments/me`.
  - Allow `PATCH /establishments/me` or `POST /establishments` to initialize the store record if it doesn't exist.

## Risks

- Data consistency: ensuring every "Active" shopkeeper eventually has a Store.
- Access Control: Users without stores shouldn't see "manage offers" etc.

## Verification

- Create a user via API without `establishmentId`.
- Log in as that user.
- Verify redirection to Profile creation/edit page.
- Save Profile -> Verify Store is created/linked.

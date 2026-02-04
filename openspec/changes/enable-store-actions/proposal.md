# Enable Store Actions

## Summary

Enable "View Details" and "Edit" functionality for store cards in the "Manage My Stores" view. "View" will navigate to the store's dashboard, while "Edit" will open the store editing modal.

## Background

The "Manage My Stores" view currently lists stores but the "Eye" (View) icon functionality is merely a duplicate of "Edit" or inactive. The user needs properly distinct actions:

- **View**: Navigate to the Dashboard (`StoreProfileView`) to see stats for that specific store.
- **Edit**: Open the `StoreForm` modal to update store details.

## Goals

1.  **View Action**: Clicking the "Eye" icon navigates to `/store/profile/:id` (or similar) to show stats for the selected store.
2.  **Edit Action**: Clicking the "Edit" icon opens the edit modal (already partially implemented, consolidate).
3.  **Dashboard Context**: Update `StoreProfileView` to handle a specific `id` parameter, fetching data for that store instead of a generic "me" or first store.

## Dependencies

- Frontend Routing (`vue-router`).
- Backend API (likely `GET /establishments/:id` for the dashboard data, or reuse `findMe` logic with an ID override).

## Risk

- **Low**: Mainly frontend routing and parameter handling. Backend might need a permission check to ensure the user owns the requested store ID.

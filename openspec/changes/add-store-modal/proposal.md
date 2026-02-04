# Change: Add Store Modal

## Why

Using a modal (Dialog) for adding a new store improves the User Experience (UX) by keeping the user context on the "Manage Stores" screen, avoiding full page navigations and providing a faster, smoother interaction.

## What Changes

- Refactor `StoreProfileView.vue` to extract the form logic into a reusable `StoreForm.vue` component.
- Implement a Shadcn `Dialog` in `ManageStoresView.vue` initiated by the "Add New Store" buttons.
- Render `StoreForm` inside this Dialog for store creation.
- Ensure efficient data handling (Mock/API) for the creation process within the modal.

## Impact

- Affected specs: `store-management`
- Affected code: `bureau-frontend/src/views/store`, `bureau-frontend/src/components/store`

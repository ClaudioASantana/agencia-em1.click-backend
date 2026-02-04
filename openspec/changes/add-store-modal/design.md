# Design: Add Store Modal

## Refactoring Strategy

To avoid code duplication, the complex form logic currently residing in `StoreProfileView.vue` (validation, masks, UI structure) will be extracted into a new component `StoreForm.vue`.

- **StoreForm.vue**: Will accept an `initialData` prop (optional) and emit a `save` event with the form payload. It will handle its own internal validation state.
- **StoreProfileView.vue**: Will be simplified to fetch data from the API and pass it to `StoreForm`.
- **ManageStoresView.vue**: Will wrap `StoreForm` inside a `Dialog` component.

## UI/UX

- **Trigger**: Clicking "Adicionar Nova Loja" or the "Add Card".
- **Modal**:
  - Title: "Nova Loja"
  - Description: "Preencha os dados abaixo para cadastrar uma nova unidade."
  - Content: The `StoreForm` component (scrollable if needed).
  - Footer: Cancel and Save buttons (managed by the form or the modal wrapper).
- **Behavior**:
  - Validations prevent closing/saving.
  - Success closes the modal and refreshes the store grid (mock refresh for now).

## Technical Details

- Use `shadcn-vue` Dialog component.
- Ensure `z-index` handling so the modal appears above everything.
- Handle "unsaved changes" warning inside the modal if the user tries to click outside/close.

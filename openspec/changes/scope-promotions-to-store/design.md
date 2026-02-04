# Design: Store-Centric Promotions

## UX Flow

1.  **Initial State**: When entering "Destaque e Promoções", the user sees a "Selecione uma Loja" prompt if no store is pre-selected. The list of promotions is empty or disabled.
2.  **Selection**: The user selects a store from a dropdown (populated by `GET /my-units`).
3.  **Active State**:
    - The grid loads promotions _only_ for that store (`GET /offers?storeId=XYZ`).
    - The "Nova Promoção" button becomes active.
4.  **Creation**:
    - When clicking "Nova Promoção", the `storeId` is implicitly passed to the form.
    - The `Offer` created is linked to that store.

## Architecture

- **Frontend**:
  - `PromotionsView` will hold `selectedStore` state.
  - `PromotionList` will accept `storeId` prop and refetch on change.
  - `PromotionForm` will receive `storeId` prop.
- **Backend API**:
  - `POST /offers` body must include `establishmnetId`.
  - `GET /offers` should accept `establishmentId` query param.

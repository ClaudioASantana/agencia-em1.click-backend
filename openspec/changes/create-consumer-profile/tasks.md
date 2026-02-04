# Tasks: Create Consumer User Profile

## Backend (Bureau)

- [x] Add `CONSUMER` to allowed User roles (if enum exists) or validate in Service <!-- id: 0 -->
- [x] Update `AuthController.register` to accept `role` payload (defaulting to STORE_OWNER if missing, but allowing CONSUMER from vitrine) <!-- id: 1 -->
- [x] Validate registration payload for required fields (Name, Email, Password) <!-- id: 2 -->

## Frontend (Vitrine)

- [x] Create `src/views/auth/RegisterView.vue` using Premium Design (Modern Blue) <!-- id: 3 -->
  - Implement Form with: Name, Email, Password, Confirm Password
  - Use `primary` color for buttons/links
  - Add client-side validation (passwords match, email format)
- [x] Configure Router in `src/router/index.ts` to add `/register` path <!-- id: 4 -->
- [x] Integrate `api.registerConsumer` method in `services/api.ts` <!-- id: 5 -->
- [x] Verify registration flow success/error handling (Toasts/Modals) <!-- id: 6 -->

# Design Principle: Consumer Parity

The core design decision is to maintain **visual parity** between the Admin Preview and the Consumer View.

## Component Reuse

We are manually porting `AgencyModal.vue` rather than sharing a library because the repositories are separate.

- **Source**: `vitrine-frontend/src/components/AgencyModal.vue`
- **Destination**: `bureau-frontend/src/components/store/StorePreviewModal.vue`

## Modifications

- The modal in Bureau will be **Read-Only**. Actions like "WhatsApp" or "Share" will remain visual but might just show a "Demo" toast or work as actual links to test the configuration.
- We will retain the `lucide-vue-next` icons as both projects use them.

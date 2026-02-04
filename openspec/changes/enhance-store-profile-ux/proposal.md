# Enhance Store Profile UX/UI

## Problem Statement

The current store profile management interface (`/store/profile`) lacks modern UX patterns and validation mechanisms that could lead to data quality issues and poor user experience. Analysis revealed six critical areas for improvement:

1. **Missing Field Validation**: Users can save empty required fields (e.g., store name) without warnings
2. **Static Character Counter**: Description field shows "Máximo de 500 caracteres" but doesn't update as user types
3. **Technical URL Input Exposed**: Logo management uses a temporary text input for URLs instead of a proper file upload interface
4. **Manual Time Entry**: Business hours use plain text inputs prone to formatting errors
5. **Duplicate Save Buttons**: Two "Save" buttons (header and footer) without unsaved changes detection
6. **Inflexible Weekly Schedule**: "Segunda a Sexta" grouping prevents setting different hours for individual weekdays

## Proposed Solution

Modernize the store profile interface with industry-standard UX patterns:

- **Client-side Validation**: Real-time field validation with visual feedback
- **Dynamic Character Counter**: Live character count display (e.g., "120 / 500")
- **File Upload Component**: Drag-and-drop image upload with preview and cropping
- **Time Picker Components**: Structured time selection to prevent formatting errors
- **Sticky Action Bar**: Single save button that appears only when changes exist
- **Daily Hour Configuration**: Individual time settings per day with quick-copy options

## Benefits

- **Data Quality**: Validation prevents invalid/empty submissions
- **User Confidence**: Real-time feedback reduces uncertainty
- **Professional UX**: Matches modern SaaS application standards
- **Error Prevention**: Structured inputs eliminate format mistakes
- **Efficiency**: Smarter UI reduces unnecessary clicks and saves

## Scope

### In Scope

- Frontend validation and UX enhancements in `StoreProfileView.vue`
- Character counter and time picker components
- Sticky action bar with unsaved changes detection
- Daily hours configuration UI

### Out of Scope

- Image upload backend implementation (placeholder for future enhancement)
- Advanced image editing features (filters, effects)
- Automated business hour suggestions based on industry
- Mobile-specific optimizations (will follow responsive patterns)

## Technical Approach

### Frontend Changes

- Add `vue-[validator]` or custom validation composable
- Create reusable `CharacterCounter` component
- Implement unsaved changes tracker with `beforeRouteLeave` guard
- Build `TimePicker` component or integrate library (e.g., `@vuepic/vue-datepicker`)
- Redesign hours section with day-by-day inputs

### Validation Strategy

```typescript
const validationRules = {
  name: { required: true, minLength: 3, maxLength: 100 },
  description: { maxLength: 500 },
  segment: { required: true },
};
```

### UI Patterns

- Invalid fields: Red border + error message below
- Valid fields: Green checkmark icon
- Character counter: Gray → Yellow (80%) → Red (95%+)
- Sticky action bar: Fixed position, appears on form dirty state

## Dependencies

- Existing `StoreProfileView.vue` component
- Backend `/establishments/me` endpoints (no changes needed)
- Lucide Vue icons (already in use)

## Success Criteria

1. Form cannot be submitted with empty required fields
2. Character counter updates live and changes color near limit
3. Time pickers enforce valid 24h format (HH:mm)
4. Save button only appears when form has unsaved changes
5. Users can set different hours for each day of the week
6. All validations work without page reload

## Questions for Review

- Should we block navigation when there are unsaved changes (confirm dialog)?
- Do we need backend validation to match frontend rules?
- Should time pickers support 12h format with AM/PM toggle?
- Is drag-and-drop image upload a must-have or nice-to-have for v1?

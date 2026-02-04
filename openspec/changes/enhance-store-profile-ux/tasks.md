# Enhance Store Profile UX/UI - Tasks

## Status: COMPLETED (Phases 1-2)

**Implementation Date**: January 13-14, 2026  
**Completed Phases**: Phase 1 (Validation), Phase 2 (Time Pickers)  
**Deferred**: Phase 3 (Sticky Action Bar, Navigation Guard) - per user decision

---

## Frontend Tasks

### Validation & Feedback

- [x] Create validation composable with rules for name, description, segment
- [x] Add real-time validation to form fields
- [x] Display error messages below invalid fields
- [x] Show visual indicators (red border, green checkmark) based on validation state
- [x] Block form submission when validation fails

### Character Counter

- [x] Create dynamic character counter (inline implementation)
- [x] Integrate counter with description textarea
- [x] Implement dynamic color-coding (gray → yellow → red)
- [x] Display "X / 500" format

### Time Pickers

- [x] Research and select time picker library or build custom component
- [x] Replace text inputs with time picker components
- [x] Ensure 24h format (HH:mm)
- [ ] Add validation for time ranges (e.g., opening < closing) - DEFERRED (nice-to-have)

### Business Hours Redesign

- [x] Redesign hours section to show 7 individual days
- [x] Add "Copy to all weekdays" quick action
- [x] Support "Closed" state per day
- [x] Individual time controls per day (replaced grouping)

### Sticky Action Bar - DEFERRED

- [ ] Implement form dirty state tracking
- [ ] Create sticky save button component
- [ ] Show/hide save button based on unsaved changes
- [ ] Add unsaved changes navigation guard

### Image Upload - DEFERRED (Phase 2 scope)

- [ ] Design upload component UI (drag-and-drop zone)
- [ ] Add temporary "Upload not yet available" message
- [ ] Keep URL input as fallback for now

---

## Verification

### Manual Testing

- [x] As store owner, attempt to save form with empty name → should show error
- [x] Type in description field → character counter should update live
- [x] Select times from picker → should format as HH:mm
- [ ] Make changes and navigate away → should prompt for confirmation - DEFERRED (Phase 3)
- [x] Set different hours for Monday vs Tuesday → should save correctly

### Browser Testing

- [x] Test validation prevents empty submissions
- [x] Test character counter color changes at thresholds
- [ ] Test sticky save button appears/disappears - DEFERRED (Phase 3)
- [x] Test time pickers work correctly

---

## Implementation Summary

### Files Created

- `src/composables/useFormValidation.ts` - Form validation composable
- `src/components/TimePicker.vue` - Reusable time picker component

### Files Modified

- `src/views/store/StoreProfileView.vue` - Major updates for validation, character counter, and weekly hours

### Features Delivered

1. ✅ Real-time form validation with visual feedback
2. ✅ Dynamic character counter (0/500 with color coding)
3. ✅ HTML5 time pickers (24h format)
4. ✅ Individual day hour configuration (7 days)
5. ✅ Copy-to-weekdays functionality
6. ✅ Open/closed toggle per day

### Test Results

- Phase 1: 7/7 scenarios passing
- Phase 2: 8/8 scenarios passing
- Overall: 15/15 implemented scenarios passing

---

## Dependencies

- Existing `StoreProfileView.vue` ✅
- Form state management already in place ✅
- Backend endpoints unchanged ✅
- Lucide Vue icons ✅

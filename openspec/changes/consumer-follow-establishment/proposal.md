# Proposal: Consumer Follow Establishment

## Summary

Allow consumers to "follow" establishments to easily filter and find their favorite stores on the Vitrine platform.

## Why

Currently, consumers have to search for their favorite stores every time they visit the platform. Providing a "Follow" feature creates a personalized experience, increases return rates, and allows users to quickly access the shops they care about most via a simple filter.

## What Changes

### Backend (bureau-backend)

- **Database**: Add `Follow` model to create a many-to-many relationship between `User` and `Establishment`.
- **API**: Add endpoints to follow, unfollow, and list followed establishments.

### Frontend (vitrine-frontend)

- **UI Components**: Add a heart icon button to `AgencyCard` and a filter toggle to the home page.
- **State Management**: Manage the list of followed store IDs globally.

## Impact

- **bureau-backend**: New database schema and API logic.
- **vitrine-frontend**: Enhanced interaction on cards and filtering.

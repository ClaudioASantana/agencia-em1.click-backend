# Publication Fallback Logic Refinement

## Problem

Currently, the distinction between an "Active" publication (toggle) and a "Default" publication (checkbox) is slightly ambiguous and can lead to conflicts (e.g., active default vs active seasonal). The visibility logic depends on a combination of `active` flag, `isDefault` flag, and date ranges, which can be brittle.

## Proposed Solution

Refactor the publication model to use a strict **Status-based Priority System**:

1. **Status "ACTIVE"**:
   - Represents a seasonal or temporary campaign (e.g., "Summer Sale").
   - **MUST** have a valid date range (`startDate` <= NOW <= `endDate`).
   - Takes precedence over "DEFAULT".

2. **Status "PADRAO" (Default)**:
   - Represents the baseline vitrine when no campaigns are active.
   - **Ignored Date Range** (Always valid if no ACTIVE exists).
   - Serves as the fallback.

## Logic Flow

1. **Query**: Find Publication where `status = 'ACTIVE'` AND `NOW() BETWEEN startDate AND endDate`.
2. **Hit**: Return that publication.
3. **Miss**: Query Publication where `status = 'PADRAO'`.
4. **Hit**: Return that publication.
5. **Miss**: Return empty/404 (or generic system default).

## Schema Changes

- Modify `Publication` model:
  - Consolidate `active` (boolean) and `isDefault` (boolean) into `status` (String/Enum).
  - Values: `DRAFT`, `ACTIVE`, `PADRAO`, `ARCHIVED`.

## User Experience

- **Publication Editor**: Instead of "Tornar Padrão" switch, user selects "Tipo de Publicação" or "Status":
  - "Campanha (Temporária)" -> requires dates.
  - "Padrão (Permanente)" -> dates optional/ignored.

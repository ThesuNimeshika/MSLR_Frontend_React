# Implementation Plan - Overseas Field Refinement

Replace the irrelevant "Home District" field with a "Seek Field" dropdown to allow overseas candidates to specify their industry of interest.

## Proposed Changes

### [MODIFY] [OverseasRegistration.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/Discover/OverseasRegistration.tsx)
- **State Update**: Rename `district` state field to `seekField`.
- **UI Update**:
  - Change label from "Home District" to "Seek Field".
  - Replace the list of districts with job categories: Technology, Logistics, Design, Finance, Healthcare, Marketing.
- **Validation Update**: Update the validation logic to check for `seekField` instead of `district`.

## Verification Plan

### Manual Verification
1. Navigate to the Overseas Registration page.
2. Verify that "Home District" is gone and "Seek Field" is present.
3. Check the dropdown options for job categories.
4. Try to submit without selecting a field and verify the error message.

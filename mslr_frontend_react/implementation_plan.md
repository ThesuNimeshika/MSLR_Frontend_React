# Implementation Plan - Login UI Refinement

Finalize the login form by shortening the email label and ensuring validation messages are visible.

## Proposed Changes

### [MODIFY] [SeekerLogin.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/Auth/SeekerLogin.tsx)

- **Labels**:
  - Change "Email Address" back to "Email" for the login field.
- **Error Display**:
  - Add logic to display the error message text (e.g., "Invalid email address") below the input field when an error exists.
- **Code Fix**:
  - Remove the `type="info"` prop from the `ValidationCloud` call to resolve the TypeScript error.

## Verification Plan

### Manual Verification
1. Navigate to the Login view.
2. Observe the label is "Email".
3. Enter an invalid email and click "LOGIN".
4. Verify that the error message text appears below the input.
5. Verify the Signup form still works as expected.

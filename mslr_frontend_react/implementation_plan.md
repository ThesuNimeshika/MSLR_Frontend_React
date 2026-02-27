# Implementation Plan - Light Mode Input Borders

Ensure all input fields in the registration and login forms have solid black borders when the light theme is active, maintaining high contrast and readability.

## Proposed Changes

### [MODIFY] [SeekerLogin.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/Auth/SeekerLogin.tsx)
- Use the `useTheme` hook to detect the current theme.
- Update the `className` of all input fields and custom dropdowns.
- Apply `theme === 'light' ? 'border-black' : 'border-white/10'` for standard state.
- Keep `border-red-500` for error states regardless of theme.

### [MODIFY] [OverseasRegistration.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/Discover/OverseasRegistration.tsx)
- Apply the same theme-aware border logic to all inputs and custom dropdowns in this component.

## Verification Plan

### Manual Verification
1. Toggle the application to Light Mode.
2. Navigate to the Login, Sign-Up, and Overseas Registration pages.
3. Verify that all input fields (including custom dropdowns) have distinct black borders.
4. Toggle back to Dark Mode and verify the original light borders are restored.

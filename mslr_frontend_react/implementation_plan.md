# Implementation Plan - Fix Lint and Build Errors

Fix "components created during render" violations, unused variables, and explicit `any` types to allow the project to build and run successfully.

## Proposed Changes

### [Pages]

#### [MODIFY] [LandingPage.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/LandingPage/LandingPage.tsx)
- Remove unused `CompanyCard` import.
- Remove unused `companies` constant.

#### [MODIFY] [SeekerLogin.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/Auth/SeekerLogin.tsx)
- Move `ValidationCloud` component definition outside of `SeekerLogin` component.
- Replace `any` types in `setFormData` and `setErrors` with proper types or inferred types.

#### [MODIFY] [OverseasRegistration.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/Discover/OverseasRegistration.tsx)
- Move `ValidationCloud` component definition outside of `OverseasRegistration` component.

## Verification Plan

### Automated Tests
- Run `npm run lint` to verify all lint errors are resolved.
- Run `npm run build` to verify the project builds successfully.

### Manual Verification
- Run `npm run dev` and verify that the Landing Page, Login Page, and Overseas Registration page load correctly.

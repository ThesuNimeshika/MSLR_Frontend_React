# Registration 500 Error Resolution Plan

The 404 error is resolved, but registration now fails with a 500 error. This is likely an Oracle-specific issue during data insertion.

## Proposed Changes

### [Backend]
#### [MODIFY] [Program.cs](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Program.cs)
- Set `cmd.BindByName = true` for all Oracle commands to ensure parameter matching by name.
- Update the `catch` block to return the full exception message, helping us identify the specific Oracle error (e.g., ORA-XXXXX).
- Log the full exception to the console.

### [Frontend]
#### [MODIFY] [SeekerLogin.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/Auth/SeekerLogin.tsx)
- Update `handleSubmit` to read the error message from the response body when registration fails.

#### [MODIFY] [OverseasRegistration.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/Discover/OverseasRegistration.tsx)
- Apply the same error reporting improvements.

## Verification
1. Restart Backend.
2. User tests signup and reports the specific error message if it persists.

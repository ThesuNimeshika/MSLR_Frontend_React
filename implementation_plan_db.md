# Implementation Plan - Oracle Service Name Update

We will update the backend configuration to use the service name `MSLR` provided by the user.

## Proposed Changes

### [Backend]

#### [MODIFY] [appsettings.json](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/appsettings.json)
- Update `Data Source` to `192.168.250.22:1521/MSLR`.
- Retain `User Id=MSLR@TEST` and `Password=MSLR`.

#### [MODIFY] [Controllers/SectorsController.cs](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Controllers/SectorsController.cs)
- No changes needed, diagnostics already support name testing.

## Verification
1. Restart Backend.
2. Visit [http://localhost:5194/api/Sectors/test-connection?serviceName=MSLR&userName=MSLR@TEST&isSid=true](http://localhost:5194/api/Sectors/test-connection?serviceName=MSLR&userName=MSLR@TEST&isSid=true)
3. Check for "WORKING!" message.

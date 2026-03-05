# Implementation Plan - Alignment with User's Connection Structure

The goal is to update the `CONNECTION` class, `appsettings.json`, and all controllers to use the exact naming and structural pattern requested by the user.

## Proposed Changes

### [Backend]

#### [MODIFY] [CONNECTION.cs](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Data/CONNECTION.cs)
- Match the method signature: `public void openConnection(string Provider, string SYS_DBUser, string SYS_Server, string SYS_DBPwd)`.
- Use the field name `Conn`.
- Keep using `OracleConnection` for .NET 9 compatibility but honor the parameter names.

#### [MODIFY] [appsettings.json](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/appsettings.json)
- Rename `UserId` to `SYS_DBUser`.
- Rename `Password` to `SYS_DBPwd`.
- Rename `Server` to `SYS_Server`.
- Rename `Provider` to `SYS_Provider`.

#### [MODIFY] [Controllers](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Controllers/)
- Update `SectorsController.cs`, `LocationsController.cs`, and `JobsController.cs` to use the new `openConnection` signature and updated config keys.

## Verification Plan

### Manual Verification
1. **API Check**: Verify `Sectors`, `Locations`, and `Jobs` endpoints still return data.
2. **Health Check**: Verify `/api/health` still reports "Connected".

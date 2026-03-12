# Registration Fix - Schema & Type Alignment

We are resolving the "Specified argument was out of the range of valid values" error by ensuring explicit type mapping for Oracle parameters and fixing trailing syntax errors.

## Proposed Changes

### [Backend]
#### [MODIFY] [Program.cs](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Program.cs)
- Use explicit `OracleDbType` for all parameters (e.g., `Varchar2`, `Int32`).
- Ensure `BindByName = true` is set correctly.
- Ensure `CURRENT_TIMESTAMP` is correctly integrated into the SQL string.
- Perform a **perfectly clean overwrite** to remove the "Riverside" junk text once and for all.

#### [MODIFY] [AuthController.cs](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Controllers/AuthController.cs)
- Perform a **perfectly clean overwrite** to remove any trailing junk text.

## Verification
1. Restart Backend.
2. Verify startup header appears.
3. Test Registration and confirm success.

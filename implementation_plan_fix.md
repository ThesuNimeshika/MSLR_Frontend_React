# Implementation Plan - Fix Manual Connection & Restore Data

The goal is to fix the backend startup issue caused by the missing EF Core connection string and ensure the manual `CONNECTION` class is the sole data access method.

## Proposed Changes

### [Backend]

#### [MODIFY] [Program.cs](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Program.cs)
- Remove the `AddDbContext` registration (lines 11-14).
- Remove the `/api/health` check that uses `ApplicationDbContext`.
- Add a new `/api/health` check that uses the `CONNECTION` class.
- This will allow the backend to start without searching for the old `ConnectionStrings:OracleDb`.

#### [MODIFY] [LocationsController.cs](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Controllers/LocationsController.cs)
- (Verification) Ensure it also uses `IConfiguration` and `CONNECTION` correctly (this was done in the previous step, but I will double-check).

#### [MODIFY] [JobsController.cs](file:///d:/Thesu/MSLR_Frontend_React/mslr_backend/Controllers/JobsController.cs)
- (Verification) Ensure it also uses `IConfiguration` and `CONNECTION` correctly.

## Verification Plan

### Manual Verification
1. **Startup Check**: Run the backend and verify the console shows "MSLR Backend is Running!".
2. **Health Check**: Visit [http://localhost:5194/api/health](http://localhost:5194/api/health) to verify the manual connection works.
3. **Data Check**: Visit [http://localhost:5194/api/Sectors](http://localhost:5194/api/Sectors) to verify data is returned.
4. **Frontend Check**: Refresh the React app and verify dropdowns are populated.

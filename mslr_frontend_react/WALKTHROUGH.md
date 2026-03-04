# Walkthrough - Project Run and Lint Fixes

I have identified and resolved the issues preventing the project from running correctly.

## Changes Made

### 1. Fixed Lint Errors
- **SearchBar.tsx**: Fixed `no-explicit-any` by making the event parameter optional and removing the `as any` type cast.
- **SeekerLogin.tsx**: Fixed `no-explicit-any` in the `setFormData` call by allowing TypeScript to infer the type from the state.

### 2. Verified Build and Lint
- Ran `npm run lint` and confirmed that there are no remaining errors.
- Ran `npm run build` and confirmed that the project builds successfully.

### 3. Active Navigation States
- **Header Buttons**: Added `useLocation` to `Header.tsx` to detect the current page.
- **Visual Feedback**: Buttons highlight when active.

### 4. Frontend-Backend Integration
- **SearchBar**: Now fetches real-time Categories (Sectors) and Locations from the Oracle Database via the new C# API.
- **Dynamic Grouping**: Flat database sectors are automatically grouped into hierarchical UI categories (e.g., IT -> Software Development).
- **Featured Jobs**: The landing page now displays jobs directly from the `JOBS` table in the database.
- **Auto-Fallback**: If the API is not yet running, the UI gracefully falls back to descriptive sample data to ensure a smooth experience.

## Backend Technical Details
- **Tech Stack**: ASP.NET Core Web API with Oracle Entity Framework Core.
- **Endpoints**:
  - `GET /api/Sectors`: Fetches sectoral classification.
  - `GET /api/Locations`: Fetches active job locations.
  - `GET /api/Jobs`: Fetches featured job listings.
- **Connection**: Managed via `appsettings.json` using the provided Oracle connection string.

## How to Run the Project

The most likely reason the terminal was not running the project is that you were in the root directory. The React project is located in the `mslr_frontend_react` subdirectory.

To run the project:
1. Open your terminal.
2. Navigate to the project directory:
   ```bash
   cd mslr_frontend_react
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Note on Node.js Version
The project uses Vite 7, which requires Node.js **20.19+** or **22.12+**. Your current version is **20.14.0**. While the project currently runs, you may encounter issues in the future. It is recommended to upgrade your Node.js version.

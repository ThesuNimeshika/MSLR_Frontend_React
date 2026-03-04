# Implementation Plan - Final Full-Stack Binding

Complete the connection between the frontend and the Oracle database, ensuring the Search Bar is fully dynamic and functional.

## Proposed Changes

### [Frontend]

#### [MODIFY] [SearchBar.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Components/SearchBar.tsx)
- Add `onSearch` prop to the `SearchBar` component.
- Remove hardcoded default categories and locations; rely exclusively on API data (with a safe empty state).
- Group database results by `SectorName` to maintain the hierarchical dropdown view.
- Trigger `onSearch` with current title, selected locations, and selected categories when the "Search Jobs" button is clicked.

#### [MODIFY] [LandingPage.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/LandingPage/LandingPage.tsx)
- Define a `handleSearch` function that calls the backend `api/Jobs/search` endpoint.
- Pass `handleSearch` to the `SearchBar` component.
- Update the job display list when a search is performed.

## Verification Plan

### Manual Verification
- Populate the database using `sample_data.sql`.
- Verify the Search Bar dropdowns match the database content exactly.
- Perform a search (e.g., Category: "IT") and verify only IT jobs appear on the landing page.

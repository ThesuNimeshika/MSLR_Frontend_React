# Implementation Plan - Fix Hero Section Responsiveness (Laptop)

Address the visibility of the "The Future of Recruitment is Here" tag and general hero content layout on laptop screens (short viewports).

### [Components]

#### [MODIFY] [Header.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Components/Header.tsx)
- Import `useLocation` from `react-router-dom`.
- Define a helper function or logic to check if a path is active.
- Apply conditional CSS classes to "Post a Job", "Discover ME", and "Candidate Portal" buttons when active (e.g., using `text-primary` or background highlights).

## Verification Plan

### Automated Tests
- None.

### Manual Verification
- Navigate between Home, Discover ME, and Recruiter Guide pages.
- Verify that the corresponding button in the header reflects an "active" style (highlighted).

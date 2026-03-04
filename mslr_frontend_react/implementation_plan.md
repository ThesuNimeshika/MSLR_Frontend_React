# Implementation Plan - Fix Hero Section Responsiveness (Laptop)

Address the visibility of the "The Future of Recruitment is Here" tag and general hero content layout on laptop screens (short viewports).

## Proposed Changes

### [Landing Page]

#### [MODIFY] [LandingPage.css](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/css/LandingPage.css)
- Change `.hero-section` height from fixed `100vh` to `min-height: 100vh`.
- Increase `padding-top` for laptop viewports and above to clear the header.
- Add media queries to adjust font sizes and vertical spacing for viewports specifically in the laptop range (e.g., height < 800px).
- Use `flex-start` instead of `center` for vertical alignment on smaller heights to ensure the top content is always visible.

#### [MODIFY] [LandingPage.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Pages/LandingPage/LandingPage.tsx)
- No changes needed to the TSX structure, as the issue is purely CSS-driven.

## Verification Plan

### Automated Tests
- None.

### Manual Verification
- Verify on 1440x900 and 1366x768 resolutions.
- Check that the "The Future of Recruitment is Here" tag is visible below the header.
- Ensure the SearchBar is fully accessible and not pushed off-screen.

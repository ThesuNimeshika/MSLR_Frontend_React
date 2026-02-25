# Implementation Plan: Premium Light Mode Aesthetics

Transform the "boring" light mode cards into a creative, premium experience using layered shadows, subtle gradients, and refined interactive states.

## Proposed Changes

### [Styling]
#### [MODIFY] [index.css](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/index.css)
- Added `--card-shadow` and `--card-hover-shadow` variables.
- Refined light mode colors for a soft, premium feel.

### [Components]
#### [MODIFY] [JobCard.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Components/JobCard.tsx)
- Added soft shadows and subtle indigo tints.
- Enhanced hover animations and internal spacing.

#### [MODIFY] [CategoryCard.tsx](file:///d:/Thesu/MSLR_Frontend_React/mslr_frontend_react/src/Components/CategoryCard.tsx)
- Added icon-specific colorful backgrounds.
- Implemented elevation effects and hover accents.

## Verification Plan
- Toggle to Light mode.
- Inspect card depth and hover interactions.

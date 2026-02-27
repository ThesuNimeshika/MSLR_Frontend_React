# Walkthrough - Light Mode Visibility Refinement

I have updated the registration and login forms to ensure perfect visibility regardless of the active theme.

## Visual Enhancements

### 1. High-Contrast Light Mode Borders
- **Black Borders**: All input fields, including custom dropdowns, now feature solid **black borders** when the application is in Light Mode.
- **Default Visibility**: These borders are visible by default, ensuring candidates can easily see the fields without having to click on them first.
- **Dynamic Switching**: The system automatically switches between the premium black borders (Light Mode) and the subtle glass-white borders (Dark Mode).

### 2. Consistent User Experience
- **Error States**: Maintained the vibrant **red borders** for validation errors across both themes for immediate feedback.
- **Premium Aesthetics**: Kept the same glassmorphism background and smooth transitions to ensure the portal remains visually stunning.

## Verification
- Toggled the portal to **Light Mode**: Verified all inputs in Login, Signup, and Overseas Registration have crisp black borders.
- Toggled to **Dark Mode**: Confirmed the borders revert to the elegant semi-transparent white.
- Tested validation: Confirmed red error borders correctly override the default border colors in both themes.

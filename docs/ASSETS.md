# Asset System

This document outlines the required assets based on the visual reference image.

## Profile / Portrait

### `PROFILE_PORTRAIT`
- **Description**: A front-facing portrait with warm/bright facial lighting and a clean background. Used for the Hero and About sections.
- **Status**: REQUIRED — actual portfolio owner's image must be provided. Do not use random stock images.

## Profile / System UI

### `PROFILE_PANEL`
- **Description**: A large profile-style interface featuring the portrait, introduction, description, skill/role cards, and status indicator.
- **Components**: Recreated as ORIGINAL UI components.

## Hero Portrait Presentation

### `HERO_PROFILE_VISUAL`
- **Description**: A layered composition with the portrait, large typography, dark background, depth, and optional motion.

## Contact / Build Something UI

### `CONTACT_INTERFACE`
- **Description**: A contact form with inputs for name, email, message, and submit interaction on dark rounded UI panels. Original content is required.

## System / Architecture Visual

### `SYSTEM_ARCHITECTURE` / `TECHNICAL_PROFILE`
- **Description**: A visual map showing horizontal rounded cards representing technical concepts. Uses rounded corners, dark surfaces, small labels, and layered spacing.

## Project / UI Screen Mockups

### `PROJECT_SCREENSHOTS`
- **Description**: Dark UI screen presentations for each project (e.g., website interface, mobile interface).
- **Structure**:
  - `project-cover`
  - `project-screen`
  - `project-detail`
  - `project-mobile`
  - `project-ui`
- **Status**: REQUIRED — PROJECT ASSETS NOT PROVIDED. Do not fabricate screenshots of projects that do not exist.

## Status / Label Elements

### Components
- `StatusBadge`
- `SectionLabel`
- `TechBadge`
- `MetadataLabel`

## Asset Directory Structure
```text
assets/
├── images/
│   ├── profile/
│   │   └── profile-portrait
│   ├── hero/
│   │   └── hero-visual
│   ├── projects/
│   │   ├── project-01/
│   │   ├── project-02/
│   │   └── project-03/
│   └── backgrounds/
├── 3d/
│   └── hero/
├── icons/
│   ├── technology/
│   ├── social/
│   └── ui/
└── fonts/
```

## Asset Availability Rule
Every asset must have a status: `AVAILABLE`, `REQUIRED`, `PLACEHOLDER`, `OPTIONAL`.
Never mark an asset as `AVAILABLE` unless provided. Document missing assets here and use clear placeholders if necessary, without replacing important imagery with random stock photos.

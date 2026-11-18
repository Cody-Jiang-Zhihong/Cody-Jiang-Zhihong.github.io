# Cody's Castle

A private interactive design study for the redesign of codyjiang.com.

## Experience

The experience begins at the castle doors. Click or drag the doors to push them open and move into the central Hall. The Hall is the spatial navigation hub: large polygon hit areas follow its actual doorways, stairs, and passages. A doorway glows on hover or keyboard focus, with a small nearby caption. Entering a doorway takes the visitor directly into its room.

The four rooms are the Gallery (selected work), Observatory (research), Workshop (games and miniatures), and Study (about, CV, and contact). Objects inside each room open readable exhibits. The selected-work room keeps its existing `great-hall` route identifier; its visible name is the Gallery. The central Hall is a separate navigation scene.

The scene fills the experience without a large heading, navigation bar, or footer grid. A minimal HUD provides return navigation and an optional floorplan. The floorplan is an unobtrusive alternative way to understand the castle and reach its rooms, rather than the primary navigation surface.

## Input and navigation

- Desktop visitors can click the gate or drag it open, then select architectural entrances and objects. Keyboard users have focusable controls with visible focus feedback and descriptive labels.
- On mobile, each scene fits in full so its entrances remain visible. Hot areas must use the same positioning and scale as the scene artwork. A single tap enters a destination; essential navigation never depends on hover.
- Hash routing represents the Hall, room, and open exhibit. Direct links restore the requested location without forcing a replay of the gate animation. Browser Back follows visited locations, while in-scene return controls provide a direct route back to the Hall.
- Exhibits and the optional floorplan can be dismissed without losing the current room. Focus returns to the control that opened them.
- Reduced-motion preferences replace the gate swing and camera-like movement with immediate or short fade transitions.

## Visual approach and content

Generated gate, hall, and room illustrations are combined with layered door motion, architectural hit areas, object hotspots, and scene transitions. This is a 2.5D interaction study, not a real-time 3D mesh or free-roaming environment.

Project descriptions are grounded in Cody's existing portfolio. The illustrations are concept art, not photographs of his miniature collection or actual project screenshots. The finished miniature gallery should use photographs of his own work. The JEPA entry is explicitly an NYU Deep Learning course project; the prototype makes no additional claims about measured project outcomes. The CV link identifies the February 2026 document already hosted on the original website and should not be presented as the latest CV.

## Files

- `dist/index.html`: semantic application shell.
- `dist/styles.css`: responsive visual design and transitions.
- `dist/app.js`: gate interaction, scene navigation, hash routing, architectural hit areas, image loading, and exhibit dialogs.
- `dist/content.js`: room and project content.
- `dist/assets/*.png`: generated scene illustrations.

No dependencies or build step are required. The deployment serves `dist/`.

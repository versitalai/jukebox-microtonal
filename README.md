# JukeBox — Microtonal Testing

A fork of [CoolTasDude's JukeBox](https://jukeebox.github.io/microtonal-testing) (which itself is a mod of Slarmoo's Box → UltraBox → GoldBox → JummBox → BeepBox) with enhanced microtonal capabilities.

**Live demo:** [https://jukeebox.github.io/microtonal-testing](https://jukeebox.github.io/microtonal-testing)

---

## What's New (Microtonal Features)

### ✅ EDO Selector in Song Settings
An **EDO dropdown** is now available directly in the Song Settings panel (between Scale and Key), so you can change the equal division of the octave without opening a dialog. Supports EDO values from **1 to 63**.

Common/practical EDOs are ★-marked: 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 22, 24, 26, 27, 29, 31, 34, 36, 37, 41, 43, 46, 48, 50, 53, 63.

### ✅ Non-Destructive EDO Changes
Changing the EDO no longer wipes all your notes and reloads the page. Just changes the tuning system and rebuilds the UI.

### ✅ Auto-Rebuilding Scales & Keys
When you change the EDO, the **Scale and Key dropdowns rebuild instantly** with the correct note names and scale modes for that EDO. The underlying `createKeys()`, `createScales()`, and `createMOS()` functions were already in the codebase — they just weren't connected to inline controls.

> **Note:** This project builds on top of the existing microtonal infrastructure that was already present in JukeBox's source code (the `song.edo` property, `frequencyFromPitch(_, edo)`, `createKeys(edo)`, `createScales(edo)`, `createMOS()`). Our changes expose and improve these features.

### ✅ Extended EDO Range
Range expanded from **5–53 → 1–63** (max limited to 63 to maintain single-base64-char serialization compatibility).

---

## Planned Features (Original JukeBox Roadmap)

These were listed as planned on the [JukeBox features page](https://jukeebox.github.io/microtonal-testing/manual/features.html):

| Feature | Status | Notes |
|---------|--------|-------|
| **EdoBox changable song edo** | ✅ **Done** | Inline dropdown + Edit menu prompt |
| **Setting for changing octave count** | 🔲 Not implemented | Would let you control how many octaves appear in the piano roll |
| Octave shift ±8 (existing) | ✅ In JukeBox 0.3.0 | Already works |
| Custom scale defaults to blank | ✅ In JukeBox 0.3.0 | Already works |

### Other planned features from the features page:
- **Effects:** AbyssBox Phaser, Dogebox2 Invert Wave, Dogebox2 Note Range
- **Other Major:** Dogebox2 custom FM frequencies, AbyssBox Song Description box
- **Max Values:** Unbox Testing ±48 pitch shift range, AbyssBox 0-100 pulse width
- **Visuals:** D's Quick Box "REAL show all channels", Dogebox "Highlight Third Notes", AbyssBox Song Player Layouts, LemmBox colored beepmods in credits
- **Keybind updates:** Add/delete instrument within channel keybinds auto-enable setting

---

## Known Issues (portable from EdoBox)

Based on the [EdoBox issue tracker](https://github.com/UnbihexiumFan/edobox/issues) (a related microtonal BeepBox mod):

1. **Piano key names too long for high EDOs** — names like "C♯F♯-+" overflow the key display
2. **Song player, pitch shift, and note recording assume 12-EDO** — `song.edo` is used in the editor but the standalone player page and note recording feature still hardcode 12

---

## Repository Structure

```
├── index.html              # Main editor page (loads beepbox_editor.js)
├── index_debug.html        # Debug version (loads unminified JS)
├── beepbox_editor.js       # Main editor JS (our changes here)
├── beepbox_editor.min.js   # Minified version (needs rebuild)
├── beepbox_synth.js        # Synth engine JS
├── beepbox_synth.min.js    # Minified synth
├── manual/                 # Documentation pages
├── player/                 # Standalone song player
├── offline/                # Offline-capable version
└── theme_resources/        # CSS/theming
```

Our changes are in `beepbox_editor.js`. To use them, `index.html` loads the unminified version. For production, minify with `terser` or equivalent.

---

## Building from Source

The original JukeBox doesn't ship TypeScript source — only compiled JS output. For proper development, check out [EdoBox](https://github.com/UnbihexiumFan/edobox) which has the full TypeScript source tree and a `compile_beepbox_editor.sh` build script.

---

## Credits

- **CoolTasDude** — Original JukeBox development
- **UnbihexiumFan** — EdoBox TypeScript source
- **slarmoo** — Slarmoo's Box
- **John Nesky** — BeepBox
- All the BeepBox mod community

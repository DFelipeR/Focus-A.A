# Focus

Focus is a desktop productivity app built with React, Vite, and Tauri. It includes quick links, folders, a Pomodoro timer, notes, a Kanban board, and selectable visual themes.

## Download for Windows

Download the latest installer from the [GitHub Releases page](https://github.com/DFelipeR/Focus-A.A/releases/latest).

## Development

Requirements: Node.js, pnpm, Rust, and the Windows build tools required by Tauri.

```powershell
pnpm install
pnpm exec tauri dev
```

Build the Windows NSIS installer:

```powershell
pnpm exec tauri build --bundles nsis
```

The installer is written to `src-tauri/target/release/bundle/nsis/`.

## License

No license has been specified yet.

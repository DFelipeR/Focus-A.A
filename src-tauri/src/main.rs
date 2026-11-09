use tauri::WindowEvent;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init()) // <--- Agrégalo aquí
    .on_window_event(|window, event| {
        if let WindowEvent::CloseRequested { api, .. } = event {
            // Oculta la ventana en la bandeja en lugar de cerrar la app
            window.hide().unwrap();
            api.prevent_close();
        }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
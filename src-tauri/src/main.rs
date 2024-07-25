use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent};

mod db_notes;

fn update_tray_time(app_handle: &tauri::AppHandle, time: &str) {
    app_handle.tray_handle().get_item("time").set_title(time).unwrap();
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("time".to_string(), "Start a session").disabled())
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray: SystemTray = SystemTray::new()
        .with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|_app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            db_notes::initialize_db_notes,
            db_notes::create_note,
            db_notes::remove_note,
            db_notes::get_notes,
            db_notes::update_note,
            db_notes::search_notes,
            update_tray_time_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn update_tray_time_command(app_handle: tauri::AppHandle, time: String) {
    update_tray_time(&app_handle, &time);
}
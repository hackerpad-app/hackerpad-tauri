use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent, Manager};
use chrono::Utc;
use std::sync::{Arc, Mutex};
use std::time::Duration;

mod db_notes;

fn main() {
    let time = Arc::new(Mutex::new(String::new()));
    let time_clone = Arc::clone(&time);

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("time".to_string(), "Loading...").disabled())
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray: SystemTray = SystemTray::new()
        .with_menu(tray_menu);

    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                loop {
                    let current_time = Utc::now().format("%Y-%m-%d %H:%M:%S UTC").to_string();
                    *time_clone.lock().unwrap() = current_time.clone();
                    
                    app_handle.tray_handle().get_item("time").set_title(&current_time).unwrap();
                    tokio::time::sleep(Duration::from_secs(1)).await;
                }
            });
            Ok(())
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
  
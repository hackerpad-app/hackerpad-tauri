mod database;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            database::initialize_db,
            database::create_note,
            database::remove_note,
            database::get_notes,
            database::update_note,
            database::search_notes,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
  
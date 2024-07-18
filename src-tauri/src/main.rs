mod db_notes;

fn main() {
    tauri::Builder::default()
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
  
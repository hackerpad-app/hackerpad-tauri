mod database;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            database::initialize_db,
            database::add_user,
            database::get_users
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

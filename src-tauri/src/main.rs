mod database;

// fn main() {
//     tauri::Builder::default()
//         .invoke_handler(tauri::generate_handler![
//             database::initialize_db,
//             database::add_user,
//             database::get_users,
//             database::remove_user
//         ])
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }
  


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            database::initialize_db,
            database::add_note,
            database::remove_note,
            database::get_notes,
            database::update_note,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
  
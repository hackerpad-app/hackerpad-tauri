use sqlite::{Connection, State};
use tauri::command;
use serde::{Serialize, Deserialize};
use chrono::prelude::*;
use tauri::api::path::data_dir; // Make sure to import data_dir
use std::path::PathBuf;


#[derive(Serialize, Deserialize, Debug)]
pub struct Note {
    id: i64,
    created_at: chrono::DateTime<chrono::Utc>,
    updated_at: chrono::DateTime<chrono::Utc>,
    headline: String,
    content: String,
}


#[command]
pub fn initialize_db() -> Result<String, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    connection
        .execute(
            "
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY,
                created_at DATE NOT NULL,
                updated_at DATE NOT NULL,
                headline TEXT NOT NULL,
                content TEXT NOT NULL
            );
            ",
        )
        .map_err(|e| e.to_string())?;
    Ok("Database initialized successfully".to_string())
}

#[command]
pub fn add_note(headline: String, content: String) -> Result<String, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let now: DateTime<Local> = Local::now();

    let mut statement = connection
        .prepare("INSERT INTO notes (created_at, updated_at, headline, content) VALUES (?, ?, ?, ?)")
        .map_err(|e| e.to_string())?;
    statement.bind(1, now.to_rfc3339().as_str()).map_err(|e| e.to_string())?;
    statement.bind(2, now.to_rfc3339().as_str()).map_err(|e| e.to_string())?;
    statement.bind(3, headline.as_str()).map_err(|e| e.to_string())?;
    statement.bind(4, content.as_str()).map_err(|e| e.to_string())?;

    statement.next().map_err(|e| e.to_string())?;
    Ok("Note added successfully".to_string())
}


#[command]
pub fn get_notes() -> Result<Vec<Note>, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut statement = connection
        .prepare("SELECT id, created_at, updated_at, headline, content FROM notes")
        .map_err(|e| e.to_string())?;
    
    let mut notes = Vec::new();
    while let State::Row = statement.next().map_err(|e| e.to_string())? {
        let id = statement.read::<i64>(0).map_err(|e| e.to_string())?;

        let created_at: DateTime<Utc> = statement.read::<String>(1).map_err(|e: sqlite::Error| e.to_string())?.parse().map_err(|e: chrono::ParseError| e.to_string())?;
        let updated_at: DateTime<Utc> = statement.read::<String>(2).map_err(|e: sqlite::Error| e.to_string())?.parse().map_err(|e: chrono::ParseError| e.to_string())?;

        let headline = statement.read::<String>(3).map_err(|e| e.to_string())?;
        let content = statement.read::<String>(4).map_err(|e| e.to_string())?;

        notes.push(Note { id, headline, content, created_at, updated_at });
    }
    Ok(notes)
}

#[command]
pub fn remove_note(id: i64) -> Result<String, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut statement = connection
        .prepare("DELETE FROM notes WHERE id = ?")
        .map_err(|e| e.to_string())?;
    statement.bind(1, id).map_err(|e| e.to_string())?;
    statement.next().map_err(|e| e.to_string())?;
    Ok("User removed successfully".to_string())
}


#[command]
pub fn update_note(id: i64, headline: String, content: String) -> Result<String, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let now: DateTime<Local> = Local::now();

    let mut statement = connection
        .prepare("UPDATE notes SET updated_at = ?, headline = ?, content = ? WHERE id = ?")
        .map_err(|e| e.to_string())?;
    statement.bind(1, now.to_rfc3339().as_str()).map_err(|e| e.to_string())?;
    statement.bind(2, headline.as_str()).map_err(|e| e.to_string())?;
    statement.bind(3, content.as_str()).map_err(|e| e.to_string())?;
    statement.bind(4, id).map_err(|e| e.to_string())?;

    statement.next().map_err(|e| e.to_string())?;
    Ok("Note changed successfully".to_string())
}



// #[derive(Serialize, Deserialize, Debug)]
// pub struct User {
//     id: i64,
//     name: String,
// }


// #[command]
// pub fn initialize_db() -> Result<String, String> {
//     let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
//     let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

//     connection
//         .execute(
//             "
//             CREATE TABLE IF NOT EXISTS users (
//                 id INTEGER PRIMARY KEY,
//                 name TEXT NOT NULL
//             );
//             ",
//         )
//         .map_err(|e| e.to_string())?;
//     Ok("Database initialized successfully".to_string())
// }

// #[command]
// pub fn add_user(name: String) -> Result<String, String> {
//     let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
//     let connection = Connection::open(db_path).map_err(|e| e.to_string())?;
    
//     let mut statement = connection
//         .prepare("INSERT INTO users (name) VALUES (?)")
//         .map_err(|e| e.to_string())?;
//     statement.bind(1, name.as_str()).map_err(|e| e.to_string())?;
//     statement.next().map_err(|e| e.to_string())?;
//     Ok("User added successfully".to_string())
// }

// #[command]
// pub fn remove_user(id: i64) -> Result<String, String> {
//     let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
//     let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

//     let mut statement = connection
//         .prepare("DELETE FROM users WHERE id = ?")
//         .map_err(|e| e.to_string())?;
//     statement.bind(1, id).map_err(|e| e.to_string())?;
//     statement.next().map_err(|e| e.to_string())?;
//     Ok("User removed successfully".to_string())
// }

// #[command]
// pub fn get_users() -> Result<Vec<User>, String> {
//     let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
//     let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

//     let mut statement = connection
//         .prepare("SELECT id, name FROM users")
//         .map_err(|e| e.to_string())?;
    
//     let mut users = Vec::new();
//     while let State::Row = statement.next().map_err(|e| e.to_string())? {
//         let id = statement.read::<i64>(0).map_err(|e| e.to_string())?;
//         let name = statement.read::<String>(1).map_err(|e| e.to_string())?;
//         users.push(User { id, name });
//     }
//     Ok(users)
// }

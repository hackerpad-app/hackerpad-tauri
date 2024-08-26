use sqlite::{Connection, State};
use tauri::command;
use serde::{Serialize, Deserialize};
use chrono::prelude::*;
use tauri::api::path::data_dir;
use std::path::PathBuf;


#[derive(Serialize, Deserialize, Debug)]
pub struct Note {
    id: i64,
    created_at: chrono::DateTime<chrono::Utc>,
    updated_at: chrono::DateTime<chrono::Utc>,
    headline: String,
    content: String,
    pad: String,
}


#[command]
pub fn initialize_db_notes() -> Result<String, String> {
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
                content TEXT NOT NULL,
                pad TEXT NOT NULL
            );
            ",
        )
        .map_err(|e| e.to_string())?;
    Ok("Database initialized successfully.".to_string())
}

#[command]
pub fn create_note(pad: Option<String>, headline: Option<String>, content: Option<String>) -> Result<String, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let now: DateTime<Local> = Local::now();

    let formatted_headline = if pad == Some("daybook".to_string()) {
        now.format("%d/%m/%Y").to_string()
    } else {
        headline.expect("Headline required when 'pad' is not 'daybook'.")
    };

    let content = content.unwrap_or_else(|| {
        if pad.as_deref() == Some("daybook") {
            "<h2>🧠 Keep in mind</h2><p><h2>✅ Today's tasks</h2><p><h2>🐥 Standup</h2><p>".to_string()
        } else if pad.as_deref() == Some("issues")  {
            "".to_string()
        }
        else {
            "".to_string()
        }
    });

    let pad = pad.unwrap_or_else(|| "daybook".to_string());
    
    let mut statement = connection
        .prepare("INSERT INTO notes (created_at, updated_at, headline, content, pad) VALUES (?, ?, ?, ?, ?)")
        .map_err(|e| e.to_string())?;
    statement.bind(1, now.to_rfc3339().as_str()).map_err(|e| e.to_string())?;
    statement.bind(2, now.to_rfc3339().as_str()).map_err(|e| e.to_string())?;
    statement.bind(3, formatted_headline.as_str()).map_err(|e| e.to_string())?;
    statement.bind(4, content.as_str()).map_err(|e| e.to_string())?;
    statement.bind(5, pad.as_str()).map_err(|e| e.to_string())?;

    statement.next().map_err(|e| e.to_string())?;
    Ok("Note added successfully.".to_string())
}


#[command]
pub fn get_notes(pad: Option<String>) -> Result<Vec<Note>, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    let sql_query = match pad {
        Some(ref _pad_value) => "SELECT id, created_at, updated_at, headline, content, pad FROM notes WHERE pad = ? ORDER BY created_at DESC",
        None => "SELECT id, created_at, updated_at, headline, content, pad FROM notes ORDER BY created_at DESC",
    };

    let mut statement = connection.prepare(sql_query).map_err(|e| e.to_string())?;

    if let Some(pad_value) = pad {
        statement.bind(1, &*pad_value).map_err(|e| e.to_string())?;    }

    let mut notes = Vec::new();
    while let State::Row = statement.next().map_err(|e| e.to_string())? {
        let id = statement.read::<i64>(0).map_err(|e| e.to_string())?;

        let created_at: DateTime<Utc> = statement.read::<String>(1).map_err(|e: sqlite::Error| e.to_string())?.parse().map_err(|e: chrono::ParseError| e.to_string())?;
        let updated_at: DateTime<Utc> = statement.read::<String>(2).map_err(|e: sqlite::Error| e.to_string())?.parse().map_err(|e: chrono::ParseError| e.to_string())?;

        let headline = statement.read::<String>(3).map_err(|e| e.to_string())?;
        let content = statement.read::<String>(4).map_err(|e| e.to_string())?;
        let pad = statement.read::<String>(5).map_err(|e| e.to_string())?;

        notes.push(Note { id, headline, content, created_at, updated_at, pad });   
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
    Ok("Note removed successfully.".to_string())
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
    Ok("Note changed successfully.".to_string())
}

#[command]
pub fn search_notes(search: String, pad: String, search_by_headline: Option<bool>) -> Result<Vec<Note>, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/notes.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    let pad_value = pad;

    let query = match search_by_headline {
        Some(true) => "SELECT id, created_at, updated_at, headline, content, pad FROM notes WHERE headline LIKE ? AND pad = ?",
        _ => "SELECT id, created_at, updated_at, headline, content, pad FROM notes WHERE (headline LIKE ? OR content LIKE ?) AND pad = ?",
    };

    let mut statement = connection.prepare(query).map_err(|e| e.to_string())?;

    let search_pattern = format!("%{}%", search);

    match search_by_headline {
        Some(true) => {
            statement.bind(1, search_pattern.as_str()).map_err(|e| e.to_string())?;
            statement.bind(2, pad_value.as_str()).map_err(|e| e.to_string())?;
        },
        _ => {
            statement.bind(1, search_pattern.as_str()).map_err(|e| e.to_string())?;
            statement.bind(2, search_pattern.as_str()).map_err(|e| e.to_string())?;
            statement.bind(3, pad_value.as_str()).map_err(|e| e.to_string())?;
        },
    }

    let mut notes = Vec::new();
    while let State::Row = statement.next().map_err(|e| e.to_string())? {
        let id = statement.read::<i64>(0).map_err(|e| e.to_string())?;
        
        let created_at: DateTime<Utc> = statement.read::<String>(1).map_err(|e: sqlite::Error| e.to_string())?.parse().map_err(|e: chrono::ParseError| e.to_string())?;
        let updated_at: DateTime<Utc> = statement.read::<String>(2).map_err(|e: sqlite::Error| e.to_string())?.parse().map_err(|e: chrono::ParseError| e.to_string())?;
        
        let headline = statement.read::<String>(3).map_err(|e| e.to_string())?;
        let content = statement.read::<String>(4).map_err(|e| e.to_string())?;
        let pad = statement.read::<String>(5).map_err(|e| e.to_string())?;

        notes.push(Note { id, headline, content, created_at, updated_at, pad });
    }
    Ok(notes)
}
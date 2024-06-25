import React, { useState, useEffect, ChangeEvent } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

// Define an interface for the user
interface User {
  id: string;
  name: string;
}

function App() {
  // Initialize the database
  useEffect(() => {
    invoke('initialize_db')
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  // State to hold users
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({ id: '', name: '' });

  // Function to add a user
  const addUser = async (name: string) => {
    try {
      const message = await invoke('add_user', { name });
      console.log("addUser", message);
      fetchUsers(); // Refresh users after adding
    } catch (error) {
      console.error(error);
    }
  };

  // Function to remove a user
  const removeUser = async (id: string) => {
    try {
      const message = await invoke('remove_user', { id });
      console.log("removeUser", message);
      fetchUsers(); // Refresh users after removing
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await invoke('get_users');
      console.log("fetchedUsers", fetchedUsers);
      const usersArray = fetchedUsers as User[]; // Assuming fetchedUsers is directly an array of User objects
      console.log("Parsed Users", usersArray); // Debugging: Verify the structure
      setUsers(usersArray);

    } catch (error) {
      console.error(error);
    }
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addUser(currentUser.name);
    setCurrentUser({ id: '', name: '' }); // Reset form
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h2>Users</h2>
        <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => removeUser(user.id)} style={{ marginLeft: '10px' }}>Remove</button>
          </li>
        ))}
      </ul>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Add a User</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={currentUser.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <button type="submit">Add User</button>
        </form>
      </div>
    </div>
  );
}

export default App;
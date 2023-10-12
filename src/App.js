import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim() === '') {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`https://api.github.com/search/users?q=${searchQuery}`);
        setUsers(response.data.items);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    // Use a debounce function to delay API requests while typing
    const debounceTimer = setTimeout(fetchUsers, 300);

    // Clear the timer if the search query changes
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="App">
      <h1>User Search</h1>
      <div className="container">
        <input
          type="text"
          className="search-input"
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={setUsers} disabled={isLoading}>
          Search
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Avatar</th>
            <th>Followers</th>
            <th>Repos</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4}>Loading...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={4}>No results found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.login}</td>
                <td>
                  <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="avatar" />
                </td>
                <td>{user.followers}</td>
                <td>{user.public_repos}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;

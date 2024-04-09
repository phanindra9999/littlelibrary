import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Account.css";

const Account = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/me', user);
      // Show a success message or redirect the user
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="account-container">
      <h1 className="account-header">Account Settings</h1>
      <form className="account-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <button type="submit" className="submit-button">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Account;
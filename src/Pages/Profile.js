import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:7000/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:7000/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Delete profile
  const handleDelete = async () => {
    if (window.confirm("⚠️ Are you sure you want to delete your account?")) {
      try {
        const res = await fetch(`http://localhost:7000/api/users/${userId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          localStorage.removeItem("userId");
          setMessage("❌ Account deleted successfully!");
          setUser({ name: "", email: "" });
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>

      {message && <div className="alert-box">{message}</div>}

      <form onSubmit={handleSubmit}>
        <label>
          <span>* Name</span>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </label>

        <label>
          <span>* Email</span>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </label>

        <div className="btn-group">
          <button type="submit" className="update-btn">Update Profile</button>
          <button type="button" className="delete-btn" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </form>

      <style>{`
        .profile-container {
          max-width: 450px;
          margin: 60px auto;
          padding: 25px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          text-align: center;
          font-family: 'Segoe UI', sans-serif;
        }

        h2 {
          margin-bottom: 20px;
          color: #111827;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        label {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 15px;
          color: #374151;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          margin-top: 6px;
          transition: all 0.2s;
        }

        input:focus {
          border-color: #2563eb;
          outline: none;
          box-shadow: 0 0 4px rgba(37, 99, 235, 0.4);
        }

        .btn-group {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease-in-out;
        }

        button:hover {
          transform: translateY(-2px);
        }

        .update-btn {
          background: #2563eb;
          color: white;
        }

        .update-btn:hover {
          background: #1d4ed8;
        }

        .delete-btn {
          background: #ef4444;
          color: white;
        }

        .delete-btn:hover {
          background: #dc2626;
        }

        .alert-box {
          background: #d1fae5;
          color: #065f46;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;

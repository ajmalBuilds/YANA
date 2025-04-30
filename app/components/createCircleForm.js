"use client";

import { useState } from "react";
import axios from "axios";

const CreateCircle = ({ userId }) => {
  const [circleName, setCircleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/circles/create", {
        name: circleName,
        createdBy: userId,
      });

      if (res.status !== 200)
        throw new Error(res.data.error || "Something went wrong");

      setSuccess(`Circle "${circleName}" created successfully!`);
      setCircleName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold text-center">Create a New Circle</h2>

      <input
        type="text"
        placeholder="Enter circle name"
        value={circleName}
        onChange={(e) => setCircleName(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {loading ? "Creating..." : "Create Circle"}
      </button>

      {success && <p className="text-green-600 text-sm">{success}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default CreateCircle;

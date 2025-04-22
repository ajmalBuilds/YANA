import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust the path as needed
import React, { useState } from "react";

const addMemberToCircle = async (circleId, userId) => {
  try {
    const circleRef = doc(db, "circles", circleId);
    const circleSnap = await getDoc(circleRef);

    if (!circleSnap.exists()) {
      throw new Error("Circle does not exist");
    }

    const data = circleSnap.data();
    const members = data.members || [];

    if (members.includes(userId)) {
      return { success: false, message: "User is already a member of this circle" };
    }

    await updateDoc(circleRef, {
      members: arrayUnion(userId),
      memberTimestamps: {
        [userId]: new Date().toISOString(),
      },
    });
    

    return { success: true, message: `User ${userId} added to circle ${circleId}` };
  } catch (error) {
    console.error("❌ Error adding member:", error.message);
  }
};

// function AddMemberForm({ circleId }) {
//   const [userId, setUserId] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");

//   const handleAddMember = async (e) => {
//     e.preventDefault();
//     if (!userId.trim()) {
//       setStatusMessage("❌ User ID cannot be empty.");
//       return;
//     }

//     const result = await addMemberToCircle(circleId, userId);

//     if (result?.success) {
//       setStatusMessage(`✅ ${result.message}`);
//     } else {
//       setStatusMessage(`❌ ${result?.message || "Failed to add member."}`);
//     }

//     setUserId(""); // Clear the input field
//   };

//   return (
//     <form onSubmit={handleAddMember} className="space-y-4">
//       <input
//         type="text"
//         value={userId}
//         onChange={(e) => setUserId(e.target.value)}
//         placeholder="Enter User ID"
//         className="w-full px-4 py-2 border rounded-lg"
//       />
//       <button
//         type="submit"
//         className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
//       >
//         Add Member
//       </button>
//       {statusMessage && <p className="text-sm mt-2">{statusMessage}</p>}
//     </form>
//   );
// }

export { addMemberToCircle };
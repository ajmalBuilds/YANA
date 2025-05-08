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
      return {
        success: false,
        message: "User is already a member of this circle",
      };
    }

    await updateDoc(circleRef, {
      members: arrayUnion(userId),
      memberTimestamps: {
        [userId]: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `User ${userId} added to circle ${circleId}`,
    };
  } catch (error) {
    console.error("❌ Error adding member:", error.message);
  }
};

export { addMemberToCircle };

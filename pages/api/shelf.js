import connectDB from "@/lib/connectDB";
import Shelf from "@/models/Shelf";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const items = await Shelf.find().sort({ createdAt: -1 });
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error Fetching Items" });
    }
  } else if (req.method === "POST") {
    const {
      itemName,
      itemPrice,
      category,
      circle,
      circleIdString,
      ownerId,
      imageBase64,
      description,
    } = req.body;
    if (
      !itemName ||
      !itemPrice ||
      !category ||
      !circle ||
      !circleIdString ||
      !ownerId ||
      !imageBase64
    ) {
      return res.status(404).json({ error: "All Fields are Required" });
    }
    try {
      const newItem = await Shelf.create({
        itemName,
        itemPrice,
        category,
        circle,
        circleIdString: req.body.circleIdString,
        ownerId,
        imageBase64,
        description: description || "",
      });
      res.status(200).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error Adding Items" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) {
      return res.status(404).json({ error: "Item ID is required" });
    }

    try {
      const deletedItem = await Shelf.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting item" });
    }
  } else if (req.method === "PUT") {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(404).json({ error: "Item ID and status are required" });
    }
    const updatedAt = new Date().toISOString();

    try {
      const updatedItem = await Shelf.findByIdAndUpdate(
        id,
        { status, updatedAt },
        { new: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating item" });
    }
  }
}

import connectDB from "@/lib/connectDB";
import Bulletin from "@/models/Bulletin";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET"){
        try{
            const bulletin = await Bulletin.find().sort({ createdAt: -1 });
            res.status(200).json(bulletin);
        }
        catch (error) {
            console.error(error)
            res.status(500).json({ error: "Error Fetching Bulletins "});
        }
    } else if (req.method === "POST") {
        const { title, timeOfEvent, venue, description } = req.body;

        if (!title || !timeOfEvent || !venue ) {
            return res.status(404).json({  error: "All Fields are Required" });
        }
        const createdAt = new Date().toISOString();
        try {  
            const newBulletin = await Bulletin.create({
                title,
                timeOfEvent,
                venue,
                description : description || "",
                createdAt,
            });
            console.log(newBulletin);
            
            res.status(201).json(newBulletin);
        } catch (error) {
            console.error(error);
            res.status(500).json({  error: "Error Creating a Bulletin" });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.body;
        console.log("id =", id);
        console.log("req.query =", req.query);
        console.log("req.body =", req.body);
        console.log("req.method =", req.method);
        console.log("Bulletin =", Bulletin);
        
        if (!id) {
            return res.status(404).json({ error: "Bulletin ID is required" });
        }

        try {
            const deletedBulletin = await Bulletin.findByIdAndDelete(id);
            if (!deletedBulletin) {
                return res.status(404).json({ error: "Bulletin not found" });
            }
            res.status(200).json({ message: "Bulletin deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error deleting bulletin" });
        }
    } else if (req.method === "PATCH") {
        const { id } = req.body;

        console.log("id =", id);
        console.log("req.query =", req.query);
        console.log("req.body =", req.body);
        console.log("req.method =", req.method);
        console.log("Bulletin =", Bulletin);

        if (!id) {
            return res.status(404).json({ error: "Bulletin ID is required" });
        }

        try {
            const updatedBulletin = await Bulletin.findByIdAndUpdate(
                id,
                { $inc: { attendingMembers: 1 } },
                { new: true }
            );
            if (!updatedBulletin) {
                return res.status(404).json({ error: "Bulletin not found" });
            }
            return res.status(200).json( { message: "Joined the event successfully!" } )
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error updating bulletin Attending Members" });
        }
        
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
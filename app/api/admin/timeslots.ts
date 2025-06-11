import { NextApiRequest, NextApiResponse } from "next";
import { addTimeSlot, deleteTimeSlot } from "../../actions/adminActions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { start, end } = req.body;
    try {
      const slot = await addTimeSlot(new Date(start), new Date(end));
      res.status(201).json(slot);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await deleteTimeSlot(Number(id));
      res.status(204).end();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else {
    res.status(405).end();
  }
} 
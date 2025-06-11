import { NextApiRequest, NextApiResponse } from "next";
import { getAllMessages, deleteMessage } from "../../actions/messageActions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const messages = await getAllMessages();
    res.status(200).json(messages);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await deleteMessage(Number(id));
      res.status(204).end();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else {
    res.status(405).end();
  }
} 
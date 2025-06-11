import { NextApiRequest, NextApiResponse } from "next";
import { addService, deleteService, updateService } from "../../actions/adminActions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, price } = req.body;
    try {
      const service = await addService(name, price);
      res.status(201).json(service);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await deleteService(Number(id));
      res.status(204).end();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else if (req.method === "PUT") {
    const { id, name, price } = req.body;
    try {
      const service = await updateService(Number(id), name, price);
      res.status(200).json(service);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else {
    res.status(405).end();
  }
} 
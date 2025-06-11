import { NextApiRequest, NextApiResponse } from "next";
import { listUsers, deleteUser, changeUserRole, banUser, unbanUser } from "../../actions/adminActions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const users = await listUsers();
    res.status(200).json(users);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await deleteUser(Number(id));
      res.status(204).end();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else if (req.method === "PATCH") {
    const { id, role, isBanned } = req.body;
    try {
      let user;
      if (typeof isBanned === "boolean") {
        user = isBanned ? await banUser(Number(id)) : await unbanUser(Number(id));
      } else if (role) {
        user = await changeUserRole(Number(id), role);
      }
      res.status(200).json(user);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else {
    res.status(405).end();
  }
} 
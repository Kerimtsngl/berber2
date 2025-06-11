import { NextApiRequest, NextApiResponse } from "next";
import { createAppointment, getUserAppointments } from "../../actions/appointmentActions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, serviceId, timeSlotId } = req.body;
    try {
      const appointment = await createAppointment(userId, serviceId, timeSlotId);
      res.status(201).json(appointment);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;
    const appointments = await getUserAppointments(Number(userId));
    res.status(200).json(appointments);
  } else {
    res.status(405).end();
  }
} 
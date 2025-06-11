import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Oturum sonlandırma işlemi (ör. cookie silme)
  res.status(200).json({ message: "Çıkış yapıldı" });
} 
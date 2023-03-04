/* eslint-disable prettier/prettier */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  newCode: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>): void {
  return res.status(200).json({ newCode: 'new code test' });
}


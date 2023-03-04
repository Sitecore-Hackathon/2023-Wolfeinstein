/* eslint-disable prettier/prettier */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';

import handlePrompts from 'lib/migrator';

type Data = {
  newCode?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  try {
    const newCode = await handlePrompts(req.body);
    res.status(200).json({ newCode });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error processing request' });
  }
}


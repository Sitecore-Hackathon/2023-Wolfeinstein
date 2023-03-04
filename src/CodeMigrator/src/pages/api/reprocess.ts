/* eslint-disable prettier/prettier */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';

import handlePrompts from 'lib/migrator';

type Data = {
  newCode: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  console.log('body', req.body);
  const newCode = await handlePrompts(req.body);
  return res.status(200).json({ newCode });
}


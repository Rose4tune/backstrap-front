import qs from "qs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state, id_token, user } = req.body;

  return res.redirect(
    302,
    `/oauth/apple?${qs.stringify({
      code,
      state,
      id_token,
      user,
    })}`
  );
}

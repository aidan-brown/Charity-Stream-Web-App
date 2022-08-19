import { Request, Response } from 'express'

export default function (req: Request, res: Response): void {
  const { type, image } = req.params
  return res.sendFile(`./${type.toLowerCase()}/${image.toLowerCase()}`, { root: __dirname })
}

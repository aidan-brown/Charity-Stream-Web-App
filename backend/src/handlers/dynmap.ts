import axios from 'axios'
import { Request, Response } from 'express'

export async function dynmapGetPlayerIcon (req: Request, res: Response): Promise<Response> {
  const { playerName } = req.params

  try {
    const response = await axios.get(`${process.env.MC_SERVER_DYNMAP ?? 'http://localhost'}/tiles/faces/32x32/${playerName}.png`, {
      responseType: 'arraybuffer'
    })
    const img = Buffer.from(response.data, 'base64')

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    })
    return res.end(img)
  } catch (err) {
    return res.status(500).send(err)
  }
}
export async function dynmapGetData (_: Request, res: Response): Promise<Response> {
  try {
    const { data } = await axios.get(`${process.env.MC_SERVER_DYNMAP ?? 'http://localhost'}/standalone/dynmap_lobbyWorld.json`)

    return res.status(200).send(data)
  } catch (err) {
    return res.status(500).send(err)
  }
}

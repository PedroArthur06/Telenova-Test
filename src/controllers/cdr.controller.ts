import { Request, Response } from 'express';
import { CdrService } from '../services/cdr.service';
import path from 'path';

const service = new CdrService();

export class CdrController {
  // Lista os extratos de chamadas
  async list(req: Request, res: Response) {
    try {
      const { start } = req.query;
      const domain = (req as any).requestDomain;

      const data = await service.getExtract(
        domain, 
        start as string, 
      );

      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Baixa o arquivo de gravação
  async download(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const domain = (req as any).requestDomain;

      if (!id) return res.status(400).json({ error: 'Missing id parameter' });

      const fileInfo = await service.getRecordingPath(id as string, domain);

      if (!fileInfo) {
        return res.status(404).json({ error: 'Recording not found' });
      }

      const mockPath = path.resolve(process.cwd(), 'mock_audio.wav');
      
      return res.download(mockPath, fileInfo.recordName);

    } catch (error) {
      return res.status(500).json({ error: 'Error downloading file' });
    }
  }
}
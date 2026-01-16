import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    const domain = req.headers['x-domain'];

    if (!apiKey || !domain) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    (req as any ).domain = domain;
    next();
}
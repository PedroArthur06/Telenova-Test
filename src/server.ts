import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middlewares/auth.middleware';
import { CdrController } from './controllers/cdr.controller';

const app = express();
app.use(cors());
app.use(express.json());

const cdrController = new CdrController();

app.get('/health', (req, res) => res.json({ status: 'UP', timestamp: new Date() }));

app.use(authMiddleware);

app.get('/cdr', cdrController.list);
app.get('/recording', cdrController.download);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
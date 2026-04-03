import express from 'express';
import itemsRouter from './routes/testr_router.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5005;

app.use('/items', itemsRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
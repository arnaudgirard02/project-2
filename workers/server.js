import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 8787;

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Middleware to check API key
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/', checkApiKey, (req, res) => {
  const secrets = {
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseUrl: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    stripe: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      premiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
      proPriceId: process.env.STRIPE_PRO_PRICE_ID,
    }
  };

  res.json(secrets);
});

app.listen(port, () => {
  console.log(`Mock Cloudflare worker running at http://localhost:${port}`);
});
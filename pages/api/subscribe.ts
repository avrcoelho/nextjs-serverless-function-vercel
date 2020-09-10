import { NowRequest, NowResponse } from "@vercel/node";
import { MongoClient, Db } from "mongodb";
import url from "url";
import axios from "axios";

let cachedDb: Db = null;

async function connectToDatabase(uri: string) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = url.parse(uri).pathname.substr(1);
  const db = client.db(dbName);

  cachedDb = db;

  return db;
}

export default async (request: NowRequest, response: NowResponse) => {
  const { email, recaptchaToken } = request.body;

  const { data } = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    {},
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    }
  );

  if (!data.success) {
    return response.status(400).json({ error: data });
  }

  const db = await connectToDatabase(process.env.MONGODB_URI);

  const collection = db.collection("subscribers");

  await collection.insertOne({
    email,
    suvscribedAt: new Date(),
  });

  return response.status(201).json({ ok: true });
};

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync(new URL('./firebase-service-account.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-water-meter-cccc5-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export const db = admin.database();
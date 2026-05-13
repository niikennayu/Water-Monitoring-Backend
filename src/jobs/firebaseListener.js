import { db } from '../config/firebase.js';
import { IotService } from '../services/IotService.js';
import Logger from '../utils/logger.js';

export const startFirebaseListener = () => {
  const sensorRef = db.ref('sensor_data');

  // Listen setiap kali ada data baru atau perubahan
  sensorRef.on('child_added', async (snapshot) => {
    const data = snapshot.val();
    const firebaseId = snapshot.key; // Contoh: -OsBJxsqznI2frgSwNd4

    try {
      // Mapping: Sesuaikan field Firebase (debitAir) ke schema kita (flowRate)
      await IotService.saveWaterUsage(process.env.IOT_API_KEY, {
        UID: "4898-9916-26", // Gunakan UID alat fisik yang sedang dites
        forward: data.forward || 0,
        backward: data.backward || 0,
        cumulative: data.accumulative || 0,
        flowRate: data.debitAir || 0
      });

      Logger.info(`Firebase data synced to Postgres for ID: ${firebaseId}`);
    } catch (error) {
      Logger.error(`Failed to sync Firebase data: ${error.message}`);
    }
  });
};
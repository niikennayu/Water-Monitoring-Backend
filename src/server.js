import app from './app.js';
import Logger from './utils/logger.js';
import { startFirebaseListener } from './jobs/firebaseListener.js';

const PORT = process.env.PORT || 5000;

// Jalankan Firebase Listener agar sinkronisasi berjalan di background
// try {
//   startFirebaseListener();
//   Logger.info('Firebase Realtime Listener has been started.');
// } catch (error) {
//   Logger.error('Failed to start Firebase Listener:', error);
// }

// Jalankan Server Express
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
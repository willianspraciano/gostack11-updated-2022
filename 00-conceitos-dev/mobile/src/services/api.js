import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.3:3333'
});

export default api;

/**
 * iOS com Emulador: localhost
 * iOS físico: IP da máquina
 * Android com Emulador: localhost (adb reverse tcp:3333 tcp:3333)
 * Android com Emulador: 10.0.2.2 (Android Strudio)
 * Android com Emulador: 10.0.3.2 (Genymotion)
 * Android Físico: IP da máquina
 */
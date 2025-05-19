const SerialPort = require('serialport').SerialPort;
const ReadlineParser = require('@serialport/parser-readline').ReadlineParser;
const axios = require('axios');
const readlineSync = require('readline-sync');


const SERIAL_PORT = readlineSync.question('Enter the COM port (e.g., COM3): ');

const BAUD_RATE = 9600;  
const API_URL = 'https://key-management-mz1o.onrender.com/api/logEvent';  


const port = new SerialPort({
  path: SERIAL_PORT,
  baudRate: BAUD_RATE,
});


const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log(`📡 Listening to Arduino on ${SERIAL_PORT}...`);
});

parser.on('data', async (line) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const data = JSON.parse(trimmed);
      console.log('📨 Received:', data);

      try {
        const response = await axios.post(API_URL, data);
        console.log('✅ API response:', response.data);
      } catch (apiErr) {
        console.error('❌ API error:', apiErr.response?.data || apiErr.message);
      }
    } catch (err) {
      console.warn('⚠️ Invalid JSON:', trimmed);
    }
  }
});

port.on('error', (err) => {
  console.error('❌ Serial port error:', err.message);
});


console.log("Press Ctrl+C to exit.");
setInterval(() => {}, 1 << 30);

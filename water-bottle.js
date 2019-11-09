var myCharacteristic;
const serviceUuid = '40fc0000-8a8d-4a32-a455-c1148e24a9f1';
const characteristicUuid = '40fc0001-8a8d-4a32-a455-c1148e24a9f1';
const log = console.log;
async function connect() {
  try {
    log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [serviceUuid] }]
    });

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Service...');
    const service = await server.getPrimaryService(serviceUuid);

    log('Getting Characteristic...');
    myCharacteristic = await service.getCharacteristic(characteristicUuid);

    await myCharacteristic.startNotifications();

    log('> Notifications started');
    myCharacteristic.addEventListener(
      'characteristicvaluechanged',
      handleNotifications
    );
  } catch (error) {
    log('Argh! ' + error);
  }
}

let prevVal;
function handleNotifications(event) {
  let value = event.target.value;
  let a = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  const newVal = a.join(' ');
  if (newVal !== prevVal) {
    window.dispatchEvent(new CustomEvent('sip'));
  } else {
    console.log('same value as before, aww');
  }
  prevVal = newVal;
}
export { connect };

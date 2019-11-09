import hotkeys from './web_modules/hotkeys-js.js';
import { connect } from './water-bottle.js';

let connected = false;
hotkeys('alt+shift+w', async () => {
  console.log('doing a thing');
  if (!connected) {
    await connect();
    connected = true;
  }
});

window.addEventListener('sip', () => {
  console.log('sipping');
  window.slideshow.gotoNextSlide();
});

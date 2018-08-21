let Browser = require('./Browser');
const browser = new Browser();
let platform=browser.device;
if(browser.device=="Mobile"){
  platform="H5"
}
export {platform,browser};

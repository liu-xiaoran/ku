let Browser = require('./Browser');
const browser = new Browser();
let platform=browser.device;
if(browser.device=="PC"){
  platform="PC"
}else{
  platform="H5"
}
export {platform,browser};

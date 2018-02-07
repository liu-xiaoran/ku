let Browser = require('./Browser');
const browser = new Browser.Browser();
let useragent = navigator.userAgent.toLowerCase();
let platform=browser.device.toLowerCase();
if(/micromessenger/.test(useragent)){
  platform="wx"
}else if(browser.device=="Mobile"){
  platform="h5"
}

export {platform,browser};

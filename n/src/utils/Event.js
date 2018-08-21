// const WxNotificationCenter = require('./WxNotificationCenter.js');

export default class Event {
  // 全局TOAST
  static GLOBAL_TOAST = 'GLOBAL_TOAST';
  
  static listen(eventName, callback, observer) {
    // WxNotificationCenter.addNotification(eventName, callback, observer);
  }

  static emit(eventName, params) {
    // WxNotificationCenter.postNotificationName(eventName, params);
  }

  static remove(eventName, observer) {
    // WxNotificationCenter.removeNotification(eventName, observer);
  }
}

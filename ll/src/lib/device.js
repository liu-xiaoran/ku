const UA = window.navigator.userAgent;

class Device {
  constructor () {

  }

  /**
   * 判断是否是iOs设备
   * @returns {boolean}
   */
  isIos() {
    return !!UA.match(/iPhone|iPad|iPod/);
  }

  /**
   * 判断iOs设备是否是9.0以上版本
   * @returns {boolean}
   */
  isIos9() {
    let exp = /iPhone\s?OS\s?(\d+)_(\d*)/;
    let matched = UA.match(exp);
    let version = matched ? new Number(matched[1]+'.'+matched[2]) : 0;

    return version >= 9;
  }

  /**
   * 判断是否是Android设备
   * @returns {boolean}
   */
  isAndroid() {
    return !!UA.match(/Android/);
  }

  /**
   * 判断App运行环境是否为微信
   * @member isWeixin
   * @method
   * @returns {boolean}
   */
  isWeixin() {
    return UA.match(/[Mm]icro[Mm]essenger/);
  }

}

export default new Device();

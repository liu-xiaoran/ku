import toast from './lib/toast'
import req from './lib/req'

import Ajax from './lib/ajax';

class ZYAjax {
    // 构造函数 初始化参数
    constructor(options = {}) {
        this.options = {
            "clientType": 5,
            "clientVer": "1.0.0",
            "dt": Date.parse(new Date()) / 1000, //请求时间
            toast(msg) {
                toast(msg)
            },
            ...options
        }
        // 深拷贝 如果都有 则右面的值 option.position会覆盖this.options.position
        // options.position = Object.assign({}, this.options.position, options.position)
        // Object.assign(this.options, options)
        this.init();
        this.bindEvent();
        this.contractId = this.options.contractId || URI.getParam("contractId") || Cookie.getCookie("contractId") || "999920170426200013"
    }


}
export {
    ZYAjax,
    toast,
    req
}
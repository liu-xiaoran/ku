/**
 * 提示与加载工具类
 */
import wepy from './wepy';
import Toast from '../components/Toast';
import Loading from '../components/Loading';
import router from '../router'
export default class Tips {
	static isLoading = false;
	/**
	 * 弹出提示框
	 */

	static success(title, duration = 2000) {
		// return await wepy.showToast({
		//   title: title,
		//   icon: 'success',
		//   mask: true,
		//   duration: duration
    // })
    if(title)
		Toast.show(title, "top", duration);
		// Event.emit(Event.GLOBAL_TOAST,{msg:title});
	}

	static toast(title, icon = 'success') {
    if(title)
		Toast.show(title, "top", 2000);
		// Event.emit(Event.GLOBAL_TOAST,{msg:title});
		// return await wepy.showToast({
		//   title: title,
		//   icon: icon,
		//   mask: true,
		//   duration: 2000
		// })
	}

	/**
	 * 警告框
	 */
	static alert(title) {
		// wx.showToast({
		//   title: title,
		//   image: '/images/icons/alert.png',
		//   mask: true,
		//   duration: 2000
    // })
    if(title)
		Toast.show(title, "top", 2000);
		// Event.emit(Event.GLOBAL_TOAST,{msg:title});
	}

	/**
	 * 错误框
	 */

	static error(title) {
		// return await wepy.showToast({
		//   title: title,
		//   image: '/images/icons/error.png',
		//   mask: true,
		//   duration: 2000
    // })
    if(title)
		Toast.show(title, "top", 2000);
		// Event.emit(Event.GLOBAL_TOAST,{msg:title});
	}

	static offline(title) {
		// return await wepy.showToast({
		//   title: title,
		//   image: '/images/icons/offline.png',
		//   mask: true,
		//   duration: 3000
    // })
    if(title)
		Toast.show(title, "top", 2000);
		// Event.emit(Event.GLOBAL_TOAST,{msg:title});
	}

	/**
	 * 弹出加载提示
	 */
	static loading(title = '加载中') {
		if(this.isLoading) {
			return;
		}
		this.isLoading = true;
		Loading.show(title)
	}

	/**
	 * 加载完毕
	 */
	static loaded() {
		if(this.isLoading) {
			this.isLoading = false
			Loading.hide()
		}
	}

	static setLoading() {
		this.isLoading = true;
	}
	static navigateBack(deltas = -1,times=2000) {
	    setTimeout(function () {
	      router.go(deltas)
	    }, times);
	  }
}

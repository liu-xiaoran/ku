import Http from './Http'
import Api from './Api'
export default class Pagination {
  constructor (url, that,processFunc, resFunc) {
    // 数据访问地址
    this.url = url;
    // 数据集合
    this.list = [];
    // 起始数据
    this.start = 1;
    // 加载数据条数
    this.count = 10;
    // 数据处理函数
    this.processFunc = processFunc;
    // 暴露api data
    this.resFunc = resFunc;
    // 正在加载中
    this.loading = false;
    // 参数
    this.params = [];
    // 是否底部
    this.reachBottom = false;
    // 是否为空
    this.empty = true;
    // 是否需要清除
    this.toClear = false;
    this.that=that
  }

  /**
   * 加载下一页数据
   */
  async next (args) {
    const param = {
      url:this.url,
      data:{
        pageInfo:{
          pageNo: this.start,
          pageSize: this.count
        },...args.data
      },
    };
    if(this.url==Api.getRegularProductList){
      param.localCache=1
    }
    if (this.loading) {
      console.warn('page loading!');
      return this;
    }
    // 附加参数
    this.loading = true;
    this.that.page.loading=this.loading
    // this.that.$apply()
    try {
      // Object.assign(param.data, args.data);
      console.log("datas__________________0");
      let datas = await Http.post(param);
      console.log("datas__________________00");
      if(datas.code!=10000){
        return
      }
      console.log("datas__________________01");
      if(this.resFunc)this.resFunc(datas)
      let data=datas.data&&datas.data.content?datas.data.content:null;
      if(!data)
        data=datas.data&&datas.data.list?datas.data.list:null;
      // 底部判断
      if (data === null || data.length < 1) {
        if (this.toClear) {
          this.clear();
        } else {
          this.reachBottom = true;
          this.that.page.reachBottom=this.reachBottom
        }

        return this;
      }
      this.empty = false;
      this.that.page.empty=this.empty
      // 处理数据
      this._processData(data)
      // 设置数据
      if (this.toClear) {
        this.list = data;
        this.toClear = false;
      } else {
        this.list = this.list.concat(data);
      }
      this.that.page.list=this.list;
      this.start += 1;
      if (data.length < this.count) {
        this.reachBottom = true;
        this.that.page.reachBottom=this.reachBottom
      }
      
      
      
      // this.that.$apply()
      return this;
    } finally {
      console.log("datas__________________02");
      this.loading = false;
      this.that.page.loading=this.loading
      // this.that.$apply()
    }
  }

  /**
   * 恢复到第一页
   */
  reset () {
    this.empty = true;
    this.that.page.empty=this.empty
    this.toClear = true;
    this.start = 1;
    this.reachBottom = false;
    this.that.page.reachBottom=this.reachBottom
  }
  clear () {
    this.toClear = false;
    this.start = 1;
    this.list = [];
    this.that.page.list=this.list;
  }
  /**
   * 处理数据（private）
   */
  _processData (data) {
    if (this.processFunc) {
      for (let i in data) {
        const result = this.processFunc(data[i]);
        if (result) {
          data[i] = result;
        }
      }
    }
  }
}

<template>
  <div>
  	<p>请求源参数:{{JSONStringify}}</p>
  	<p>输出参数:{{data}}</p>
  </div>
</template>

<script>
import Req from '../Req/lib/req'
export default {
  name: 'Req',
  data () {
    return {
      data: '',
      oData:{channelId:1,data:{userId:"xxx"}}
    }
  },
  created(){
  	this.data=JSON.stringify(Req(this.oData));
  	
  },
  computed:{
  	JSONStringify: function () {
      return JSON.stringify(this.oData);
    }
  }
}
</script>

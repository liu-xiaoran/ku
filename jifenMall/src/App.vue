<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{

    }
  },
  mounted () {
    // window.onload = function(){
    //   console.log("页面加载完毕")
    //   ZYLIB.ZYInteractive.postMessage( {"key":"header-right-button","text":"如何获得积分","target-data":"http://www.baidu.com"} ,"")
    // }
  }

}
</script>

<style lang="scss">
@import "./style/utils.scss";
@import "./style/com.scss";
html,body,div,header,section,footer,img,a,p,form,input,span,ul,li,h2 {
  margin: 0;
  padding: 0;
}
a,input,button{ outline:none;}
html,body {
	width: 100%;
  font-family: "微软雅黑";
  background: #ffffff;
}
header,section,footer,img {
  display: block;
}
a {
  text-decoration: none;
}
ul,li {
  list-style: none;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
color: #c5c5c5;
}
input:-moz-placeholder, textarea:-moz-placeholder {
color: #c5c5c5;
}
input::-moz-placeholder, textarea::-moz-placeholder {
color: #c5c5c5;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder {
color: #c5c5c5;
}
input {
  color: #000;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -moz-tap-highlight-color: rgba(0,0,0,0);
  -o-tap-highlight-color: rgba(0,0,0,0);
}
img {
  border: none;
}
#app {
	width: 100%;
	margin: 0 auto;
  font-family: '微软雅黑';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.ovfHiden {
  overflow-y: hidden;
  height: 100%;
}

</style>

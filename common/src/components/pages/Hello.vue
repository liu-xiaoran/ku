<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>utils</h2>
    <ul>
      <li><router-link to="/rem">移动端自适应方案</router-link></li>
      <li><router-link to="/req">新版api请求参数统一封装</router-link></li>
      
    </ul>
    <h2>常用组件</h2>
    <ul>
      <li><router-link to="/vericode">短信验证码</router-link></li>
      <li><router-link to="/other">其他组件</router-link></li>
    </ul>
    <div class="test">测试</div>
    
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: '掌悦前端公用代码'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.hello{
  text-align: center;
}
.test{
  height: 2600px;
  vertical-align: bottom;
  background: red;
}
</style>

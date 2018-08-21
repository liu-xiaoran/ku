<template>
</template>
<script>
import writeLog from '../utils/writeLog';
import mapPage from '../utils/mappedPage';
import router from '../router'
export default {
  data () {
    return {
      name:""
    }
  },
  mounted () {
    this.name = this.$route.name
    if(this.name){
      writeLog.write({
        evt : "in"+mapPage.evtPage[this.name]+"Page"
      })
    }
  },
  beforeDestroy () {
    if(this.name){
      writeLog.write({
        evt : "out"+mapPage.evtPage[this.name]+"Page"
      })
    }
  }
}
</script>



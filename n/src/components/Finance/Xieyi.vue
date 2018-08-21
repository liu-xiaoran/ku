<template>
  <div class="xieyi" v-html="html"></div>
</template>
<script>
import Api from "../../utils/Api";
import Http from "../../utils/Http";
export default {
  name: "Xieyi",
  data() {
    return {
      html: ''
    }
  },
  methods: {
    getMinutesTimestamp() {
      let d = new Date();
      d.setSeconds(0);
      return d.getTime();
    },
    async isData(oid, productType, type) {
      let res = await Http.get({
        url: productType == "CURRENT" ?
          type == "1" ?
          Api.productDetail.currentIncome :
          Api.productDetail.current : type == "1" ?
          Api.productDetail.regularIncome : Api.productDetail.regular,
        data: {
          productOid: oid,
          t: this.getMinutesTimestamp()
        }
      });
      let begin = res.data.indexOf("<style");
      let end = res.data.indexOf("</body>");
      this.html = res.data.substr(begin, end).split("<script>")[0].replace(new RegExp("data-url","gm"),"href");
    }
  },
  updated() {
    var goWebView = document.getElementsByClassName("goWebView")
    for (let i = 0; i < goWebView.length; i++) {
      goWebView[i].onclick = function() {
        location.href = location.origin + goWebView[i].getAttribute('data-url')
      }
    }
  },
  created() {
    this.isData(this.$route.query.productId, this.$route.query.productType, 0);
  }
};

</script>
<style scoped>


</style>

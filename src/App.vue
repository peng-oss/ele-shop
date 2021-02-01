<template>
  <div id="app">
    <keep-alive>
     <router-view/>
    </keep-alive>
  </div>
</template>
<script>
export default {
name:'app',
created() {
  this.getLocation()
},
methods: {
  getLocation(){
    const self=this
    AMap.plugin('AMap.Geolocation', function() {
  var geolocation = new AMap.Geolocation({
    // 是否使用高精度定位，默认：true
    enableHighAccuracy: true,
    // 设置定位超时时间，默认：无穷大
    timeout: 10000,

  })

  geolocation.getCurrentPosition()
  AMap.event.addListener(geolocation, 'complete', onComplete)
  AMap.event.addListener(geolocation, 'error', onError)

  function onComplete (data) {
    // data是具体的定位信息
    self.$store.dispatch('setLocation',data)
    self.$store.dispatch('setAddress',data.formattedAddress)
  }

  function onError (data) {
    // 定位出错
  }
})
  }
},
}
</script>
<style>
#app{
  width: 100%;
  height: 100%;
  font-size: 14px;
  background:#f1f1f1;
}
</style>

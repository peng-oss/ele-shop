<template>
  <div class="city">
    <div class="search_wrap">
      <div class="search">
        <i class="fa fa-search"></i>
        <input v-model="city_val" type="text" placeholder="输入城市名" />
      </div>
      <button @click="$router.push({name:'address',params:{city:city}})">取消</button>
    </div>
    <div style="height:100%" v-if="searchLists.length==0">
      <div class="location">
        <location :address="city"
        @click="selectcity({name:city})"
         />
      </div>
      <Alphabet
        :cityInfo="cityInfo"
        :keys="keys"
        ref="allcity"
        @selectcity="selectcity"
      />
    </div>
    <div class="search_list" v-else>
      <ul>
        <li v-for="(item,index) in searchLists" :key="index"  @click="selectcity(item)" >
       {{item.name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import location from '../components/Location'
import Alphabet from '../components/Alphabet'
export default {
  name: 'city',
  data() {
    return {
      city_val: '',
      cityInfo: null,
      keys: [],
      allcitys: [],
      searchLists: [],
    }
  },
  components: {
    location,
    Alphabet,
  },
   watch:{
city_val:'seachCities'
   },
  computed: {
    city() {
      return (
        this.$store.getters.location.addressComponent.province ||
        this.$store.getters.location.addressComponent.city
      )
    },
  },
  created() {
    this.getCityInfo()
  },
  methods: {
    async getCityInfo() {
      const { data: res } = await this.$http.get('/api/posts/cities')
      this.cityInfo = res
      this.keys = Object.keys(res)
      //将热门城市这个key从keys中删掉
      this.keys.pop()
      //key 进行排序
      this.keys.sort()
      //异步操作完成dom变化进行渲染
      this.$nextTick(() => {
        this.$refs.allcity.initScroll()
      })
    /*   存储所有的城市用来遍历 */
      this.keys.forEach(item=>{
        this.cityInfo[item].forEach(city=>{
        this.allcitys.push(city)
        })
      })
     
    },
    selectcity(item) {
      this.$router.push({
        name: 'address',
        params: {
          city: item.name,
        },
      })
      console.log(item);
    },
    seachCities(){
      if(!this.city_val.trim()){
        this.searchLists=[]
      }else{
     this.searchLists=this.allcitys.filter(item=>{
           return item.name.indexOf(this.city_val) !==-1
         })
      }
    }
  },
}
</script>
<style scoped>
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}
.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}
.search input {
  background: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}
.search_wrap button {
  outline: none;
  color: #009eef;
  border: none;
  background-color: #fff;
}

.location {
  background: #fff;
  padding: 8px 16px;
  height: 60px;
  box-sizing: border-box;
  color: black;
  font-size: 10px;
}

.search_list {
  background: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>

<template>
  <div class="Home">
    <div class="header">
      <div
        class="address_map"
        @click="
          $router.push({
            name: 'address',
            params: {
              city: city,
            },
          })
        "
      >
        <i class="fa fa-map-marker"></i>
        <span>{{ address }}</span>
        <i class="fa fa-sort-desc"></i>
      </div>
    </div>
    <div class="search_wrap" :class="{ fixedview: isshow }" @click="$router.push('./search')">
      <div class="shop_search">
        <i class="fa fa-search"></i>
        搜索商家 商家名称
      </div>
    </div>
    <div id="container">
      <!--  轮播图 -->
      <mt-swipe :auto="4000" class="swiper">
        <mt-swipe-item v-for="(item, index) in swiperImgs" :key="index">
          <img :src="item" alt="" />
        </mt-swipe-item>
      </mt-swipe>
      <!--   分类 -->
      <mt-swipe :auto="0" class="entries">
        <mt-swipe-item
          v-for="(entry, i) in entries"
          :key="i"
          class="entries_wrap"
        >
          <div class="foodentry" v-for="(item, index) in entry" :key="index">
            <div class="img_wrap">
              <img :src="item.image" alt="" />
            </div>
            <span>{{ item.name }}</span>
          </div>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!--  推荐商家 -->
    <div class="shoplist-title">推荐商家</div>
    <!--  导航 -->
    <FilterView
      :fifterData="fifterData"
      @searchFixed="searchFixed"
      @updata="updata"
    />
    <!--  商家信息 -->
    <mt-loadmore
      :top-method="loadData"
      :bottom-method="loadMore"
      :bottom-all-loaded="allLoaded"
      ref="loadmore"
      :autoFill="false"
      :bottomPullText="bottomPullText"
    >
      <div class="shoplist">
        <IndexShop
          v-for="(item, index) in restaurants"
          :key="index"
          :restaurant="item.restaurant"
        />
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
import IndexShop from '../components/IndexShop'
import FilterView from '../components/FilterView'
import { Swipe, SwipeItem, Loadmore } from 'mint-ui'
export default {
  name: 'Home',
  data() {
    return {
      swiperImgs: [],
      entries: [],
      fifterData: null,
      isshow: false,
      page: 1,
      size: 5,
      restaurants: [],
      allLoaded: false,
      bottomPullText: '上拉加载更多',
      data:null
    }
  },
  components: {
    FilterView,
    IndexShop,
  },
  computed: {
    address() {
      return this.$store.getters.address
    },
    city() {
      return (
        this.$store.getters.location.addressComponent.province ||
        this.$store.getters.location.addressComponent.city
      )
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const { data: res } = await this.$http('/api/profile/shopping')

      this.swiperImgs = res.swipeImgs
      this.entries = res.entries
      const { data: fifter } = await this.$http('/api/profile/filter')
     /*  console.log(fifter) */
      this.fifterData = fifter
      this.loadData()
    },
    searchFixed(bool) {
      this.isshow = bool
    },
    updata(condition) {
      this.data=condition
  /*     console.log(this.data) */

      this.loadData() 
       
    },
    async loadData() {
      this.page = 1
      this.allLoaded = false
      this.bottomPullText = '上拉加载更多'
  /*     console.log(this.data) */
      const { data: rests } = await this.$http.post(
        `/api/profile/restaurants/${this.page}/${this.size}`,
       this.data
      )
      this.$refs.loadmore.onTopLoaded()
      this.restaurants = rests
    /*      console.log(rests) */
    },
    async loadMore() {
      if (!this.allLoaded) {
        this.page++
        const { data: rests } = await this.$http.post(
          `/api/profile/restaurants/${this.page}/${this.size}`
        )
        this.$refs.loadmore.onBottomLoaded()
        if (rests.length > 0) {
          rests.forEach((item) => {
            this.restaurants.push(item)
          })
          if(this.size>rests){
            this.allLoaded = true
          this.bottomPullText="没有更多了哦"
          }
        }else{
          this.allLoaded = true
          this.bottomPullText="没有更多了哦"
        }
      }
    },
  },
}
</script>
<style scoped>
.Home {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.header,
.search_wrap {
  background-color: #009eef;
  padding: 16px 16px 10px 16px;
}
.header .address_map {
  color: #fff;
  font-weight: bold;
}
.address_map i {
  margin: 0 3px;
  font-size: 18px;
}
.address_map span {
  display: inline-block;
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.search_wrap .shop_search {
  /*   margin-top: 10px; */
  background-color: #fff;
  padding: 10px 0;
  border-radius: 4px;
  text-align: center;
  color: #aaa;
}
.search_wrap {
  position: sticky;
  top: 0;
  z-index: 999;
  box-sizing: border-box;
}
.swiper {
  height: 100px;
}
.swiper img {
  width: 100%;
  height: 100px;
}
.entries {
  background: #fff;
  height: 47.2vw;
  text-align: center;
  overflow: hidden;
}
.foodentry {
  width: 20%;
  float: left;
  position: relative;
  margin-top: 2.933333vw;
}
.foodentry .img_wrap {
  position: relative;
  display: inline-block;
  width: 12vw;
  height: 12vw;
}
.img_wrap img {
  width: 100%;
  height: 100%;
}
.foodentry span {
  display: block;
  color: #666;
  font-size: 0.32rem;
}
/* 推荐商家 */
.shoplist-title {
  display: flex;
  align-items: flex;
  justify-content: center;
  height: 9.6vw;
  line-height: 9.6vw;
  font-size: 16px;
  color: #333;
  background: #fff;
}
.shoplist-title:after,
.shoplist-title:before {
  display: block;
  content: '一';
  width: 5.333333vw;
  height: 0.266667vw;
  color: #999;
}
.shoplist-title:before {
  margin-right: 3.466667vw;
}
.shoplist-title:after {
  margin-left: 3.466667vw;
}

.fixedview {
  width: 100%;
  position: fixed;
  top: 0px;
  z-index: 999;
}

.mint-loadmore {
  height: calc(100% - 95px);
  overflow: auto;
}
</style>

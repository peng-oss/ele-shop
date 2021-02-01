<template>
  <div class="addAddress">
    <Hd :title="title" :isLeft="true" />
    <!-- 添加地址 -->
    <div class="viewbody">
      <div class="content">
        <FromBlock
          label="联系人"
          placeholder="姓名"
          :sexes="sexes"
          @checksex="checksex"
          :selectsex="addressInfo.sex"
          v-model="addressInfo.name"
        />
        <FromBlock
          label="电话"
          placeholder="手机号码"
          v-model="addressInfo.phone"
        />
        <FromBlock
          label="地址"
          placeholder="小区/写字楼/门牌号"
          icon="angle-right"
          @click="showSearch = true"
          v-model="addressInfo.address"
        />
        <FromBlock
          label="门牌号"
          placeholder="10号楼5单元404"
          icon="edit"
          textarea="textarea"
          v-model="addressInfo.bottom"
        />
        <div class="formblock">
          <div class="label-wrap">标签</div>
          <TabTag
            :tags="tags"
            @checkTag="checkTag"
            :selectTag="addressInfo.tag"
          />
        </div>
      </div>
      <!-- 确定按钮 -->
      <div class="form-button-wrap">
        <button @click="handleSave" class="form-button">确定</button>
      </div>
    </div>
    <!-- 搜索地址 -->
    <AddressSearch
      :showSearch="showSearch"
      @close="showSearch = false"
      :addressInfo="addressInfo"
    />
  </div>
</template>

<script>
import Hd from '../../components/Header'
import FromBlock from '../../components/Orders/FromBlock'
import TabTag from '../../components/Orders/TabTag'
import AddressSearch from '../../components/Orders/AddressSearch'
import { Toast } from 'mint-ui'
export default {
  name: 'addAddress',
  components: {
    Hd,
    FromBlock,
    TabTag,
    AddressSearch,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.addressInfo = to.params.addressInfo
      vm.title = to.params.title
    })
  },
  data() {
    return {
      title: '',
      tags: ['家', '学校', '公司'],
      sexes: ['先生', '女士'],
      addressInfo: {},
      showSearch: false,
    }
  },
  methods: {
    checkTag(checkone) {
      //  console.log(checkone);
      this.addressInfo.tag = checkone
    },
    checksex(item) {
      this.addressInfo.sex = item
    },
    handleSave() {
      /* console.log(this.addressInfo) */
      if (!this.addressInfo.name) {
        return this.showMsg('请输入用户名')
      }
      if (!this.addressInfo.phone) {
        return this.showMsg('请输入电话号码')
      }
      if (!this.addressInfo.address) {
        return this.showMsg('请输入地址')
      }
      //存储数据
      if (this.title === '添加地址') {
        this.addAddress()
      }else{
        this.editAddress()
      }
    },
    showMsg(msg) {
      Toast({
        message: msg,
        position: 'bottom',
        duration: 2000,
      })
    },
    addAddress() {
      this.$http
        .post(
          `/api/user/add_address/${localStorage.ele_login}`,
          this.addressInfo
        )
        .then((res) => {
          if(!this.$store.getters.userInfo){
            this.$store.dispatch('setUser',this.addressInfo)
          }
          this.$router.push('/myaddress')
        })
        .catch((err) => {
          return err
        })
    },
   async editAddress(){
     const {data:res} = this.$http.post(`/api/user/edit_address/${localStorage.ele_login}/${this.addressInfo._id}`,this.addressInfo)
   /*  console.log(res); */
    this.$router.push('/myaddress')
    }
  },
}
</script>
<style scoped>
.addAddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.viewbody {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.content {
  padding-left: 4vw;
  background: #fff;
  font-size: 0.94rem;
}

.formblock {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
}
.formblock .label-wrap {
  flex-basis: 17.333333vw;
  padding: 3.733333vw 0;
  line-height: 4.8vw;
  color: #333;
  font-weight: 700;
}

/* 确定按钮 */
.form-button-wrap {
  padding: 5.333333vw 4vw;
  display: flex;
}
.form-button-wrap .form-button {
  background: #00d762;
  text-align: center;
  border-radius: 0.533333vw;
  flex: 1;
  font-size: 1.1rem;
  line-height: 5.066667vw;
  color: #fff;
  padding: 3.333333vw 0;
  border: none;
  font-weight: 500;
}
</style>

<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/logo.jpg" alt="my login img" />
    </div>
    <!--   手机号 -->
    <inputGroup
      type="number"
      v-model="phone"
      placeholder="手机号"
      :btnTitle="btnTitle"
      :disabled="disabled"
      :error="errors.phone"
      @btnClick="getVerifyCode"
    />
    <!--   验证码 -->
    <inputGroup
      type="number"
      v-model="verifyCode"
      placeholder="验证码"
      :error="errors.code"
    />
    <!--  用户服务协议 -->
    <div class="login_des">
      <p>
        新用户登录即自动注册，表示已同意
        <span>《用户服务协议》</span>
      </p>
    </div>
    <!-- 登录按钮 -->
    <div class="login_btn">
      <button :disabled="isclick" @click="handellogin">登录</button>
    </div>
  </div>
</template>
<script>
import inputGroup from '../components/inputGroup'
export default {
  name: 'login',
  components: {
    inputGroup,
  },
  data() {
    return {
      phone: '',
      verifyCode: '',
      errors: {},
      btnTitle: '获取验证码',
      disabled: false,
    }
  },
  computed: {
    isclick() {
      if (!this.phone || !this.verifyCode) return true
      else return false
    },
  },

  methods: {
    getVerifyCode() {
      if (this.validatephone()) {
        //发送请求获取验证码
        this.$http
          .post('/api/posts/sms_send', { phone: this.phone })
          .then((res) => {
            console.log(res)
            this.validateBtn()
          })
      }
    },
    //表单对电话号的预验证
    validatephone() {
      if (!this.phone) {
        this.errors = {
          phone: '手机号码不能为空',
        }
        return false
      } else if (
        !/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
          this.phone
        )
      ) {
        this.errors = {
          phone: '请填写正确的手机号码',
        }
        return false
      } else {
        this.errors = {
          phone: '',
        }
        return true
      }
    },
    //点击后表单禁用开始倒计时
    validateBtn() {
      let time = 60
      let timer = setInterval(() => {
        if (time === 0) {
          clearInterval(timer)
          this.btnTitle = '获取验证码'
          this.disabled = false
        } else {
          this.btnTitle = `${time}后获取`
          ;(this.disabled = true), time--
        }
      }, 1000)
    },
    handellogin() {
      //取消错误提醒
      this.errors = {}
      //发送请求
      this.$http
        .post('/api/posts/sms_back', {
          phone: this.phone,
          code: this.verifyCode,
        })
        .then((res) => {
         /*  console.log(res) */
          //检验成功设置登录状态，跳转页面/
          localStorage.setItem('ele_login', res.data.user._id)
          this.$router.push('/')
        })
        .catch((err) => {
          this.errors = {
            code: err.response.data.msg,
          }
        })
    },
  },
}
</script>
<style scoped>
.login {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
}
.logo {
  text-align: center;
}
.logo img {
  width: 150px;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
}
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>

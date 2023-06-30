/* eslint-disable */
<template>
  <div class="login-container">
    <div class="form-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账号密码登录" name="first">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名/邮箱"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-form>
          <el-button :loading="loading" type="primary" style="width:45%;margin-bottom:10px;" @click.native.prevent="handleLogin">登录</el-button>
          <el-button :loading="loading" type="primary" style="float:right;width:45%;margin-bottom:10px;" @click.native.prevent="handleSignUp">注册</el-button>
        </el-tab-pane>
        <el-tab-pane label="邮箱验证码登录" name="second">
          <el-form ref="emailLoginForm" :model="emailLoginForm" class="login-form" auto-complete="on" label-position="left">
            <el-form-item prop="email" :rules="emailRules">
              <span class="svg-container">
                <svg-icon icon-class="email" />
              </span>
              <el-input
                ref="email"
                v-model="emailLoginForm.email"
                placeholder="邮箱"
                name="email"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="emailCode" :inline="true" :rules="emailRules">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    ref="emailCode"
                    v-model="emailLoginForm.emailCode"
                    placeholder="邮箱验证码"
                    name="emailCode"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">&nbsp;</el-col>
              <el-col :span="6">
                <el-button type="primary" :disabled="codeDisabled" style="height: 54px;" @click.native.prevent="getEmailCode">{{ buttonText }}</el-button>
              </el-col>
              <el-col :span="1">&nbsp;</el-col>
            </el-row>
          </el-form>
          <el-button :loading="loading" type="primary" :rules="emailRules" style="width:45%;margin-bottom:10px;" @click.native.prevent="handleEmailLogin">登录</el-button>
          <el-button :loading="loading" type="primary" style="float:right;width:45%;margin-bottom:10px;" @click.native.prevent="handleSignUp">注册</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getLoginCode } from '@/api/user'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8 || value.length > 16) {
        callback(new Error('请输入8~16位数字、大写字母、小写字母或者特殊符号的组合'))
      } else {
        callback()
      }
    }
    const validateEmailCode = (rule, value, callback) => {
      const regEmail = /^\d{6}$/
      if (!regEmail.test(value)) {
        callback(new Error('请输入正确的6位验证码'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!regEmail.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      emailLoginForm: {
        email: '',
        emailCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      emailRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        emailCode: [{ required: true, trigger: 'blur', validator: validateEmailCode }]
      },
      activeName: 'first',
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      buttonText: '获取邮箱验证码',
      codeDisabled: false,
      duration: 60,
      timer: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // Vuex的状态管理模式方法调用
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$message({
              type: 'success',
              message: '登录成功!',
              duration: 2 * 1000
            })
            this.$router.push({ path: this.redirect || '/index' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleSignUp() {
      this.$router.push('/signup')
      this.loading = false
    },
    handleEmailLogin() {
      this.$refs.emailLoginForm.validate(valid => {
        if (valid) {
          // Vuex的状态管理模式方法调用
          this.loading = true
          this.$store.dispatch('user/emailLogin', this.emailLoginForm).then(() => {
            this.$message({
              type: 'success',
              message: '登录成功!',
              duration: 2 * 1000
            })
            this.$router.push({ path: this.redirect || '/index' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getEmailCode() {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(this.emailLoginForm.email)) {
        this.timer = setInterval(() => {
          this.codeDisabled = true
          const tmp = this.duration--
          this.buttonText = `${tmp}秒后重新获取`
          if (tmp <= 0) {
            clearInterval(this.timer)
            this.duration = 60
            this.buttonText = '重新获取验证码'
            this.codeDisabled = false
          }
        }, 1000)
        getLoginCode(this.emailLoginForm.email).then(
          response => {
            this.$message({
              message: '发送验证码成功',
              type: 'success'
            })
          }
        ).catch(() => {
        })
      } else {
        this.$message({
          message: '请输入正确的邮箱格式',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background:url("https://cdn.staticaly.com/gh/sail-Yang/myImage@main/img/loginBackground .12r1yszcw4gw.png") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #505458;
      height: 47px;
      caret-color: #505458;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #e5e5e5 inset !important;
        -webkit-text-fill-color: #505458 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#a9b3be;
$dark_gray:#8aa3b1;
$light_gray:#eee;

.login-container {

  .form-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 200px auto;
    width: 600px;
    padding: 35px 35px 35px 35px;
    background: #ffffff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.el-col {
  min-height: 1px
}
</style>

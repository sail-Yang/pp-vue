
<template>
  <el-container>
    <el-header>
      <div class="sidebar-logo-container">
        <transition name="sidebarLogoFade">
          <router-link v-if="true" key="true" class="sidebar-logo-link" to="/ogin">
            <img :src="logo" class="sidebar-logo">
            <h1 class="sidebar-title">{{ title }} </h1>
          </router-link>
        </transition>
      </div>
    </el-header>
    <el-main>
      <div class="signup-container">
        <el-form
          ref="signUpForm"
          :model="signUpForm"
          :rules="signupRoles"
          class="login-form"
          label-position="left"
        >
          <div class="title-container">
            <img
              src="https://cdn.staticaly.com/gh/sail-Yang/myImage@main/img/logo_transparent.517gc42ii8k0.webp"
              class="title-logo"
              height="150"
              width="200"
            >
          </div>
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="signUpForm.username"
              placeholder="设置用户名"
              name="username"
              type="text"
              tabindex="1"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="signUpForm.password"
              :type="passwordType"
              placeholder="设置密码"
              name="password"
              tabindex="2"
              @keyup.enter.native="handleSignUp"
            />
            <span
              class="show-pwd"
              @click="showPwd"
            >
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-button
            :loading="loading"
            :disabled="buttonDisable"
            type="primary"
            class="el-button"
            style="width:45%;margin-bottom:10px;"
            @click.native.prevent="handleSignUp"
          >立即注册</el-button>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8 || value.length > 16) {
        this.buttonDisable = true
        callback(new Error('请输入8~16位数字、大写字母、小写字母或者特殊符号的组合'))
      } else {
        this.buttonDisable = false
        callback()
      }
    }
    return {
      title: '功率先知',
      logo: 'https://cdn.staticaly.com/gh/sail-Yang/myImage@main/img/logo_transparent.444truy0g380.png',
      signUpForm: {
        username: '',
        password: ''
      },
      signupRoles: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      buttonDisable: false,
      passwordType: 'password',
      redirect: undefined
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
    handleSignUp() {
      this.loading = true
      this.$store.dispatch('user/signup', this.signUpForm).then(() => {
        this.$message({
          type: 'success',
          message: '注册成功!',
          duration: 2 * 1000
        })
        this.$router.push({ path: this.redirect || '/login' })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.el-header {
  background-color: #37334a;
  color: #E9EEF3;
  text-align: left;
  line-height: 60px;
}

body>.el-container {
  margin-bottom: 40px;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

}
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .signup-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.signup-container {
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;

  .el-button{
    display: block;
    margin: 0 auto;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
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
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.signup-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 200px auto;
    width: 600px;
    padding: 35px 35px 35px 35px;
    background: #fff;
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

  .title-container {
    position: relative;
    text-align: center;
    .title {
      font-size: 26px;
      color: #505458;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
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
</style>

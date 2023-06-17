<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="账户" name="first">
        <el-form ref="accountForm" :model="accountForm" label-position="left">
          <el-row>
            <el-col :span="12">
              <el-form-item :rules="AccountRules">
                <el-input
                  ref="username"
                  v-model="accountForm.username"
                  prefix-icon="el-icon-s-custom"
                  placeholder="用户名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :rules="AccountRules">
                <el-input
                  ref="password"
                  v-model="accountForm.password"
                  :type="passwordType"
                  prefix-icon="el-icon-s-finance"
                  placeholder="密码"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :rules="AccountRules">
                <el-input
                  ref="email"
                  v-model="accountForm.email"
                  prefix-icon="el-icon-message-solid"
                  placeholder="邮箱"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :inline="true">
                <el-input
                  ref="emailCode"
                  v-model="accountForm.emailCode"
                  placeholder="邮箱验证码"
                  prefix-icon="el-icon-info"
                  name="emailCode"
                  tabindex="2"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="5">
              <el-button type="primary" :disabled="codeDisabled" @click.native.prevent="getEmailCode">{{ buttonText }}</el-button>
            </el-col>
            <el-col :span="9">&nbsp;</el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="onSubmitAccount">更新账户</el-button>
            <el-button type="danger" @click="onResetAccount">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="模型" name="second">
        <el-form ref="modelForm" :model="modelForm">
          <el-form-item label="模型选择">
            <el-radio-group ref="model" v-model="modelForm.model">
              <el-radio label="multi">多模型</el-radio>
              <el-radio label="single">单模型(lstm)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitModel">更新模型选择</el-button>
            <el-button type="danger" @click="onResetModel">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getLoginCode } from '@/api/user'
export default {
  name: 'Settings',
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
      accountForm: {
        username: this.$store.getters.username,
        email: this.$store.getters.email,
        password: this.$store.getters.password,
        emailCode: ''
      },
      modelForm: {
        model: this.$store.getters.model
      },
      AccountRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        emailCode: [{ required: true, trigger: 'blur', validator: validateEmailCode }]
      },
      activeName: 'first',
      loading: false,
      passwordType: 'password',
      codeDisabled: false,
      duration: 60,
      timer: null,
      buttonText: '获取邮箱验证码'
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
    onSubmitAccount() {
      this.$refs.accountForm.validate(valid => {
        if (valid) {
          // Vuex的状态管理模式方法调用
          this.loading = true
          this.$store.dispatch('user/updateAccount', this.accountForm).then(() => {
            this.$message({
              type: 'success',
              message: '修改账户成功!'
            })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    onResetAccount() {
      this.accountForm.username = this.$store.getters.username
      this.accountForm.email = this.$store.getters.email
      this.accountForm.password = this.$store.getters.password
      this.accountForm.emailCode = ''
      this.$message({
        message: '重置成功',
        type: 'success'
      })
    },
    onSubmitModel() {
      this.loading = true
      this.$store.dispatch('user/updateModel', { username: this.$store.getters.username, model: this.modelForm.model }).then(() => {
        this.$message({
          type: 'success',
          message: '修改模型成功!'
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onResetModel() {
      this.modelForm.model = this.$store.getters.model
      this.$message({
        message: '重置成功',
        type: 'success'
      })
    },
    getEmailCode() {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(this.accountForm.email)) {
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
        getLoginCode(this.accountForm.email).then(
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

<style scoped>
.line{
  text-align: center;
}
.el-col {
  min-height: 1px
}
.show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
</style>


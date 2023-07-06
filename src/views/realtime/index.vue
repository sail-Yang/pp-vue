<template>
  <div>
    <el-row>
      <el-form v-loading="loading" element-loading-text="拼命加载中" :model="form" label-width="80px" :inline="true">
        <el-row :gutter="3" type="flex" align="middle">
          <el-form-item label="开始时间">
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                placeholder="起始日期"
                :picker-options="pickerOptions"
              />
            </el-col>
            <el-col :xs="{span: 12}" :sm="{span: 12}" :lg="{span: 12}">
              <el-time-select
                v-model="form.startTime"
                placeholder="起始时间"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:45'
                }"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                placeholder="结束日期"
                :picker-options="pickerOptions"
              />
            </el-col>
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-time-select
                v-model="form.endTime"
                :picker-options="{
                  start: '00:30',
                  step: '00:15',
                  end: '23:45',
                  minTime: startTime
                }"
                placeholder="结束时间"
              />
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :xs="{span: 14}" :sm="{span: 12}" :lg="{span: 11}" :xl="{span: 11}">
            <el-form-item label="选择风机">
              <el-select v-model="form.fan" placeholder="请选择风机的编号">
                <el-option label="1号风机" value="1" />
                <el-option label="2号风机" value="2" />
                <el-option label="3号风机" value="3" />
                <el-option label="4号风机" value="4" />
                <el-option label="5号风机" value="5" />
                <el-option label="6号风机" value="6" />
                <el-option label="7号风机" value="7" />
                <el-option label="8号风机" value="8" />
                <el-option label="9号风机" value="9" />
                <el-option label="10号风机" value="10" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 13}">
            <el-form-item>
              <el-button type="primary" @click="onFind">查询功率</el-button>
              <el-button type="danger" @click="onReal">实时预测</el-button>
              <el-button type="info" @click="setDialogWidth();dialogVisible = true">导出预测数据</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <div class="chart-container">
        <chart height="100%" width="100%" :xdata="xdata" :fanid="form.fan" />
      </div>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      :before-close="handleClose"
    >
      <el-form :model="exportform">
        <el-form-item>
          <label class="radio-label">文件名: </label>
          <el-input v-model="exportform.filename" placeholder="默认为realdata" prefix-icon="el-icon-document" />
        </el-form-item>
        <el-form-item>
          <label class="radio-label">自动宽度: </label>
          <el-radio-group v-model="exportform.autoWidth">
            <el-radio :label="true" border>
              True
            </el-radio>
            <el-radio :label="false" border>
              False
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <label class="radio-label">输出种类: </label>
          <el-select v-model="exportform.type">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Chart from '@/views/realtime/RealTimeLineChart'
import { getFanDataByPeriod, predictByRealTime } from '@/api/fandata'
import { formDateFormat } from '@/utils'
export default {
  name: 'Realtime',
  components: { Chart },
  data() {
    return {
      form: {
        startDate: '2021-1-2',
        startTime: '00:00',
        endDate: '2021-1-2',
        endTime: '23:45',
        fan: '1'
      },
      exportform: {
        filename: '',
        autoWidth: true,
        type: 'xlsx'
      },
      dialogVisible: false,
      downloadLoading: false,
      options: ['xlsx', 'csv', 'txt'],
      xdata: {},
      dialogWidth: 0,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      loading: false
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
    if (sessionStorage.getItem('realLoading') !== null) {
      this.loading = (sessionStorage.getItem('realLoading').toLowerCase() === 'true')
    }
    this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
    if (sessionStorage.getItem('realFan') === null) {
      this.form.fan = '1'
    } else {
      this.form.fan = sessionStorage.getItem('realFan')
    }
  },
  methods: {
    onFind() {
      sessionStorage.setItem('realFan', this.form.fan)
      this.loading = true
      sessionStorage.setItem('realLoading', this.loading)
      var beginTime = formDateFormat(this.form.startDate, this.form.startTime)
      var endTime = formDateFormat(this.form.endDate, this.form.endTime)
      getFanDataByPeriod(beginTime, endTime, this.form.fan).then(
        response => {
          sessionStorage.setItem('realXdata', JSON.stringify(response.data))
          this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
          this.$message({
            message: '查询成功',
            type: 'success'
          })
          this.loading = false
          sessionStorage.setItem('realLoading', this.loading)
        }
      ).catch(() => {
        this.loading = false
        sessionStorage.setItem('realLoading', this.loading)
      })
    },
    onReal() {
      this.loading = true
      sessionStorage.setItem('realLoading', this.loading)
      sessionStorage.setItem('realFan', this.form.fan)
      predictByRealTime(this.$store.getters.username, this.form.fan, this.$store.getters.model).then(
        response => {
          sessionStorage.setItem('realXdata', JSON.stringify(response.data))
          this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
          this.$message({
            message: '获取实时成功',
            type: 'success'
          })
          this.loading = false
          sessionStorage.setItem('realLoading', this.loading)
        }
      ).catch(() => {
        this.$message({
          message: '服务器错误',
          type: 'failure'
        })
        this.loading = false
        sessionStorage.setItem('realLoading', this.loading)
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleDownload() {
      this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['datatime', 'yd15', 'power', 'prePower']
        const filterVal = ['datatime', 'yd15', 'power', 'prePower']
        const list = this.xdata.fanDataList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportform.filename || 'realdata',
          autoWidth: this.exportform.autoWidth,
          bookType: this.exportform.type
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    setDialogWidth() {
      console.log(document.body.clientWidth)
      var val = document.body.clientWidth
      const def = 600 // 默认宽度
      if (val < def) {
        this.dialogWidth = '80%'
      } else {
        this.dialogWidth = def + 'px'
      }
    }
  }
}

</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}

.line {
  text-align: center;
}
.el-col {
  min-height: 1px
}
</style>

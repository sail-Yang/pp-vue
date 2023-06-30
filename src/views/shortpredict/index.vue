<template>
  <div>
    <el-row>
      <el-form :model="form" label-width="90px" :inline="true">
        <el-row>
          <el-form-item label="过去时间段">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="起始日期"
              :picker-options="pickerOptions"
            />
            <el-time-select
              v-model="form.startTime"
              placeholder="起始时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:30'
              }"
            />
            --
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="结束日期"
              :picker-options="pickerOptions"
            />
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
          </el-form-item>
          <el-form-item label="预测时长">
            <el-select v-model="form.hours" placeholder="请选择时长">
              <el-option label="12" value="12" />
              <el-option label="24" value="24" />
              <el-option label="36" value="36" />
            </el-select>
          </el-form-item>
          <el-form-item v-loading="loading">
            <el-button type="primary" @click="onSubmit">开始预测</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="预测时间段">
            <el-date-picker
              v-model="form.predStartDate"
              type="date"
              placeholder="起始日期"
              :picker-options="pickerOptions"
            />
            <el-time-select
              v-model="form.predStartTime"
              placeholder="起始时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:30'
              }"
            />
            --
            <el-date-picker
              v-model="form.predEndDate"
              type="date"
              placeholder="结束日期"
              :picker-options="pickerOptions"
            />
            <el-time-select
              v-model="form.predEndTime"
              :picker-options="{
                start: '00:30',
                step: '00:15',
                end: '23:45',
                minTime: predStartTime
              }"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="风机">
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
          <el-form-item>
            <el-button type="danger" @click="onCancel">取消预测</el-button>
            <el-button type="info" @click="dialogVisible = true">导出数据</el-button>
          </el-form-item>
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
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="exportform">
        <el-form-item>
          <label class="radio-label">文件名: </label>
          <el-input v-model="exportform.filename" placeholder="默认为predictData" prefix-icon="el-icon-document" />
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
        <el-button type="primary" icon="el-icon-document" @click="handleDownload">Export Excel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Chart from '@/views/shortpredict/ShortLineChart'
import { predictByPeriod } from '@/api/fandata'
import { formDateFormat } from '@/utils'
export default {
  name: 'Short',
  components: { Chart },
  data() {
    return {
      form: {
        startDate: '2021-3-1',
        startTime: '04:45',
        endDate: '2021-9-30',
        endTime: '04:45',
        predStartDate: '2021-10-1',
        predStartTime: '00:00',
        hours: '24',
        predEndDate: '2021-10-1',
        predEndTime: '23:45',
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
      loading: false,
      abortController: new AbortController()
    }
  },
  mounted() {
    if (sessionStorage.getItem('periodLoading') !== null) {
      this.loading = (sessionStorage.getItem('periodLoading').toLowerCase() === 'true')
    }
    this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
    if (sessionStorage.getItem('periodFan') === null) {
      this.form.fan = '1'
    } else {
      this.form.fan = sessionStorage.getItem('periodFan')
    }
  },
  methods: {
    onSubmit() {
      sessionStorage.setItem('periodFan', this.form.fan)
      this.loading = true
      sessionStorage.setItem('periodLoading', this.loading)
      var beginTime = formDateFormat(this.form.startDate, this.form.startTime)
      var endTime = formDateFormat(this.form.endDate, this.form.endTime)
      predictByPeriod(beginTime, endTime, this.form.hours, this.form.fan, this.abortController.signal, this.$store.getters.model).then(
        response => {
          sessionStorage.setItem('periodXdata', JSON.stringify(response.data))
          this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
          this.$message({
            message: '预测成功',
            type: 'success'
          })
          this.loading = false
          sessionStorage.setItem('periodLoading', this.loading)
        }
      ).catch(() => {
        this.loading = false
        sessionStorage.setItem('periodLoading', this.loading)
      })
    },
    onCancel() {
      debugger
      this.abortController.abort()
      sessionStorage.setItem('periodFan', this.form.fan)
      this.loading = false
      sessionStorage.setItem('periodLoading', this.loading)
      this.$message({
        message: '成功取消预测请求',
        type: 'warning'
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
      this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['datatime', 'yd15', 'power', 'prePower']
        const filterVal = ['datatime', 'yd15', 'power', 'prePower']
        const list = this.xdata.fanDataList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportform.filename || 'predictData',
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
</style>

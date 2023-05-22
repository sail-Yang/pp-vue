<template>
  <div>
    <el-row>
      <el-form :model="form" label-width="90px" :inline="true">
        <el-form-item label="过去时间段">
          <el-col :span="11">
            <el-date-picker v-model="form.pastdate1" type="date" placeholder="选择开始时间" style="width: 100%" />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">--</span>
          </el-col>
          <el-col :span="11">
            <el-date-picker v-model="form.pastdate2" type="date" placeholder="选择结束时间" style="width: 100%" />
          </el-col>
        </el-form-item>
        <el-form-item label="预测时间段">
          <el-col :span="11">
            <el-date-picker v-model="form.predate1" type="date" placeholder="选择开始时间" style="width: 100%" />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">--</span>
          </el-col>
          <el-col :span="11">
            <el-date-picker v-model="form.predate2" type="date" placeholder="选择结束时间" style="width: 100%" />
          </el-col>
        </el-form-item>
        <el-form-item label="风机">
          <el-select v-model="form.fan" placeholder="请选择风机的编号">
            <el-option label="1号风机" value="1" />
            <el-option label="2号风机" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onCancel">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div class="chart-container">
        <chart height="100%" width="100%" />
      </div>
    </el-row>
  </div>
</template>

<script>
import Chart from '@/components/Charts/LineChart'

export default {
  name: 'SuprtShort',
  components: { Chart },
  data() {
    return {
      form: {
        pastdate1: '',
        pastdata2: '',
        predate1: '',
        predata2: '',
        fan: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
.line {
  text-align: center;
}
</style>

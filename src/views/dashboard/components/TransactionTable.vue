<template>
  <el-table :data="list" fit style="width: 100%;height: 100%;padding-top: 15px;">
    <el-table-column label="风机编号" align="center">
      <template slot-scope="scope">
        {{ scope.row.id }}
      </template>
    </el-table-column>
    <el-table-column label="风机总预测次数" align="center">
      <template slot-scope="scope">
        <el-tag type="success">
          {{ scope.row.nums }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="近5日预警" align="center">
      <template slot-scope="scope">
        <el-button v-if="scope.row.outliers > 0" type="warning" size="mini">
          有异常值
        </el-button>
        <el-button v-else type="info" size="mini" disabled="true">
          无异常值
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchFanList } from '@/api/fandata'

export default {
  filters: {
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchFanList(this.$store.getters.username).then(response => {
        this.list = response.data.fanlist
      })
    }
  }
}
</script>

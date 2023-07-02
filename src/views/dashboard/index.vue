<template>
  <div class="dashboard-container">
    <panel-group />
    <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <bar-chart :fanlist="fanlist" />
    </el-col>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import TransactionTable from './components/TransactionTable'
import BarChart from './components/BarChart'
import { fetchFanList } from '@/api/fandata'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    TransactionTable,
    BarChart
  },
  data() {
    return {
      fanlist: {}
    }
  },
  mounted() {
    this.fetchData()
    console.log(this.fanlist)
  },
  methods: {
    fetchData() {
      fetchFanList(this.$store.getters.username).then(response => {
        this.fanlist = response.data.fanlist
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>

<template>
  <div class="dashboard-container">
    <panel-group />
  </div>
  <el-row :gutter="8">
    <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
      <transaction-table />
    </el-col>
  </el-row>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import TransactionTable from './components/TransactionTable'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    TransactionTable
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

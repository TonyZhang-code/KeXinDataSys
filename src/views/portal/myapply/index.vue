<template>
  <div class="apply-page">
    <!-- 查询区 -->
    <n-card class="apply-search" :bordered="false">
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #888;">申请类型：</span>
          <n-select v-model:value="searchForm.type" :options="typeOptions" placeholder="请选择申请类型" style="width: 160px" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #888;">申请状态：</span>
          <n-select v-model:value="searchForm.status" :options="statusOptions" placeholder="请选择申请状态" style="width: 160px" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #888;">数据名称：</span>
          <n-input v-model:value="searchForm.name" placeholder="请输入数据名称" style="width: 180px" />
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <n-button type="primary" @click="handleSearch">查询</n-button>
          <n-button @click="handleReset">重置</n-button>
          <n-button type="info">反馈数据缺失</n-button>
        </div>
      </div>
    </n-card>

    <!-- 表格区 -->
    <n-card class="apply-table" :bordered="false" style="margin-top: 16px;">
      <n-data-table :columns="columns" :data="tableData" :bordered="false" style="margin-bottom: 16px;" />
      <div style="display: flex; justify-content: flex-end;">
        <n-pagination v-model:page="page" :page-count="pageCount" style="margin-top: 8px;" />
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchForm = ref({
  type: null,
  status: null,
  name: ''
})

const typeOptions = [
  { label: '数据验证', value: '数据验证' },
  { label: '接口数据', value: '接口数据' },
  { label: '数据查看', value: '数据查看' }
]
const statusOptions = [
  { label: '进行中', value: '进行中' },
  { label: '已通过', value: '已通过' },
  { label: '已撤回', value: '已撤回' }
]

const tableData = ref([
  {
    name: '申请数据：检查_检查报告',
    time: '2025-08-08 09:22:54',
    valid: '2025-12-31',
    status: '进行中',
    type: '数据验证',
    remark: '等待审批',
    actions: ['详情', '编辑', '缺失申报', '撤回']
  },
  {
    name: '申请数据：医疗文书互认',
    time: '2025-04-11 11:38:14',
    valid: '2025-09-30',
    status: '已通过',
    type: '接口数据',
    remark: '已归档',
    actions: ['详情', '编辑', '缺失申报']
  },
  {
    name: '申请数据：公用_病人基本信息',
    time: '2025-01-07 12:28:07',
    valid: '2025-08-01',
    status: '已通过',
    type: '数据验证',
    remark: '已归档',
    actions: ['详情', '编辑', '缺失申报']
  },
  {
    name: '申请数据：公用_病人基本信息',
    time: '2025-01-02 14:30:44',
    valid: '2025-07-01',
    status: '已撤回',
    type: '数据验证',
    remark: '用户主动撤回',
    actions: ['详情', '编辑', '缺失申报']
  },
  {
    name: '申请数据：手麻_手术信息',
    time: '2024-12-18 09:56:30',
    valid: '2025-06-30',
    status: '已撤回',
    type: '数据查看',
    remark: '数据不全',
    actions: ['详情', '编辑', '缺失申报']
  },
  {
    name: '申请数据：检验_检验报告',
    time: '2024-12-18 09:55:42',
    valid: '2025-05-31',
    status: '已撤回',
    type: '数据查看',
    remark: '已撤回',
    actions: ['详情', '编辑', '缺失申报']
  },
  {
    name: '申请数据：检验_检验报告',
    time: '2024-12-18 09:55:20',
    valid: '2025-05-31',
    status: '已撤回',
    type: '数据查看',
    remark: '已撤回',
    actions: ['详情', '编辑', '缺失申报']
  },
  {
    name: '申请数据：检验_检验报告',
    time: '2024-12-18 09:55:02',
    valid: '2025-05-31',
    status: '已撤回',
    type: '数据查看',
    remark: '已撤回',
    actions: ['详情', '编辑', '缺失申报']
  }
])

const page = ref(1)
const pageCount = ref(2)

const columns = [
  {
    title: '数据名称',
    key: 'name',
    align: 'left',
    ellipsis: true
  },
  {
    title: '申请时间',
    key: 'time',
    align: 'center',
    width: 160
  },
  {
    title: '有效期',
    key: 'valid',
    align: 'center',
    width: 100
  },
  {
    title: '申请状态',
    key: 'status',
    align: 'center',
    width: 100,
    render(row) {
      const color = row.status === '进行中' ? 'primary' : row.status === '已通过' ? 'success' : 'warning'
      return <n-tag type={color}>{row.status}</n-tag>
    }
  },
  {
    title: '申请类型',
    key: 'type',
    align: 'center',
    width: 100,
    render(row) {
      const color = row.type === '数据验证' ? 'warning' : row.type === '接口数据' ? 'success' : 'info'
      return <n-tag type={color}>{row.type}</n-tag>
    }
  },
  {
    title: '备注',
    key: 'remark',
    align: 'center',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 180,
    render(row) {
      return row.actions.map((action, idx) => (
        <span style={{ color: '#1976d2', cursor: 'pointer', marginRight: idx < row.actions.length - 1 ? '12px' : '0', textDecoration: 'underline' }}>{action}</span>
      ))
    }
  }
]

function handleSearch() {
  // 查询逻辑
}
function handleReset() {
  searchForm.value.type = null
  searchForm.value.status = null
  searchForm.value.name = ''
}
</script>

<style scoped>
.apply-page {
  padding: 24px;
}
</style>

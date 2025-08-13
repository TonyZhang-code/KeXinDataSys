<template>
  <div class="catalog-page">
    <!-- 顶部购物车 -->
    <div class="catalog-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <div style="font-size: 22px; font-weight: 700; color: #1976d2; letter-spacing: 1px;">
        国新健康保障服务有限公司
      </div>
  <n-badge :value="cartCount" type="error" style="margin-right: 0;">
        <n-button icon-placement="left" @click="openCart" style="background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%); color: #fff; font-weight: 700; font-size: 18px; box-shadow: 0 2px 8px rgba(25,118,210,0.12); border: none;">
          <template #icon>
            <n-icon><ShoppingCartOutlined /></n-icon>
          </template>
          购物车
        </n-button>
      </n-badge>
    </div>

    <!-- 查询区 -->
    <n-card class="catalog-search" :bordered="false">
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #888;">所属分类：</span>
          <n-select v-model:value="searchForm.category" :options="categoryOptions" placeholder="请选择分类" style="width: 180px" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #888;">数据名称：</span>
          <n-input v-model:value="searchForm.name" placeholder="请输入数据名称" style="width: 180px" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #888;">数源单位：</span>
          <n-input v-model:value="searchForm.unit" placeholder="请输入数源单位" style="width: 180px" />
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <n-button type="primary" @click="handleSearch">查询</n-button>
          <n-button @click="handleReset">重置</n-button>
        </div>
      </div>
    </n-card>

    <!-- 查询结果区 -->
    <n-card class="catalog-result" :bordered="false" style="margin-top: 16px;">
      <div>
        <div v-for="item in catalogList" :key="item.id" class="catalog-row" style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid #f0f0f0;">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
              <span style="font-size: 18px; font-weight: 500; color: #222;">{{ item.name }}</span>
              <span style="color: #888;">所属分类：</span>
              <n-tag type="info">{{ item.category }}</n-tag>
            </div>
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #888;">英文名称：</span>
                <n-tag>{{ item.englishName }}</n-tag>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #888;">数据描述：</span>
                <span style="color: #888;">{{ item.description }}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #888;">数据量：</span>
                <n-badge :value="item.dataCount" type="success" style="margin-right: 8px;" />
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #888;">数据申请次数：</span>
                <n-badge :value="item.applyCount" type="info" />
              </div>
            </div>
            <div style="margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #888; min-width: 70px;">数源单位：</span>
                <div style="display: flex; gap: 6px; flex-wrap: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  <n-tag v-for="unit in (Array.isArray(item.unit) ? item.unit.slice(0, 4) : [item.unit])" :key="unit">{{ unit }}</n-tag>
                </div>
                <span v-if="Array.isArray(item.unit) && item.unit.length > 4 && !item._showAllUnits" @click="item._showAllUnits = true" style="color: #1976d2; cursor: pointer; user-select: none; font-size: 14px; margin-left: 8px;">展开</span>
              </div>
              <div v-if="item._showAllUnits && Array.isArray(item.unit) && item.unit.length > 4" style="display: flex; flex-wrap: wrap; gap: 6px; margin-left: 70px; margin-top: 6px;">
                <n-tag v-for="unit in item.unit" :key="unit">{{ unit }}</n-tag>
                <span @click="item._showAllUnits = false" style="color: #1976d2; cursor: pointer; user-select: none; font-size: 14px; margin-left: 8px; align-self: flex-start;">收起</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 12px; margin-top: 12px; align-items: flex-end; margin-left: 70px;">
            <n-button size="small" style="min-width: 80px; height: 33px;" @click="viewDetail(item)">查看详情</n-button>
            <n-button type="primary" size="small" style="min-width: 100px; height: 33px;" @click="addToCart(item)">添加购物车</n-button>
          </div>
        </div>
      </div>
      <n-pagination v-model:page="page" v-model:page-size="pageSize" :item-count="total" style="margin-top: 16px;" />
      </n-card>
    </div>
  </template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartCount = ref(0)
import { ShoppingCartOutlined } from '@vicons/antd'

const categoryOptions = [
  { label: '患者信息', value: '患者信息' },
  { label: '健康体检', value: '健康体检' },
  { label: '门诊业务', value: '门诊业务' },
  { label: '住院业务', value: '住院业务' },
  { label: '三目录', value: '三目录' },
]

const unitOptions = [
  { label: '国新健康保障服务有限公司', value: '国新健康保障服务有限公司' },
  { label: '杭州市第一人民医院', value: '杭州市第一人民医院' },
  { label: '杭州市卫健委', value: '杭州市卫健委' },
  { label: '杭州市中医院', value: '杭州市中医院' },
  { label: '浙江省人民医院', value: '浙江省人民医院' },
  { label: '浙江大学医学院附属医院', value: '浙江大学医学院附属医院' },
]

const searchForm = reactive({
  category: null,
  name: '',
  unit: ''
})

const catalogList = ref([
  {
    id: 1,
    name: '精神病_随访用药',
    category: '患者信息',
    englishName: 'JSB_SUIFANGYONGYAO',
    description: '精神病随访用药数据',
    unit: [
      '国新健康保障服务有限公司',
      '杭州市第一人民医院',
      '杭州市卫健委',
      '杭州市中医院',
      '浙江省人民医院',
      '浙江大学医学院附属医院',
      '杭州市第三人民医院',
      '杭州市妇幼保健院'
    ],
    dataCount: 475029,
    applyCount: 0,
    _showAllUnits: false
  },
  {
    id: 2,
    name: '健康体检_报告',
    category: '健康体检',
    englishName: 'JKTJ_BAOGAO',
    description: '健康体检报告数据',
    unit: [
      '国新健康保障服务有限公司',
      '杭州市第一人民医院',
      '杭州市卫健委',
      '杭州市中医院',
      '浙江省人民医院',
      '浙江大学医学院附属医院',
      '杭州市第三人民医院',
      '杭州市妇幼保健院'
    ],
    dataCount: 120000,
    applyCount: 3,
    _showAllUnits: false
  }
])

const page = ref(1)
const pageSize = ref(10)
const total = ref(2)

function handleSearch() {
  // TODO: 实现查询逻辑
}
function handleReset() {
  searchForm.category = null
  searchForm.name = ''
  searchForm.unit = ''
}
function openCart() {
  // TODO: 打开购物车弹窗或跳转购物车页面
}
function viewDetail(item) {
  // 跳转到详情页面
  router.push({
    name: 'portal_catalog_detail',
    params: { id: item.id }
  })
}
function addToCart(item) {
  cartCount.value++
}
</script>

<style scoped>
.catalog-page {
  padding: 24px;
}
</style>

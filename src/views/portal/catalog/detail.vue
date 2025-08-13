<template>
  <div class="catalog-detail-page">
    <!-- 返回按钮 -->
    <div style="margin-bottom: 16px;">
      <n-button @click="goBack" style="margin-right: 8px;">
        <template #icon>
          <n-icon><ArrowLeftOutlined /></n-icon>
        </template>
        返回列表
      </n-button>
    </div>

    <!-- 基本信息 -->
    <n-card :bordered="false" style="margin-bottom: 16px;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <n-icon size="20"><DatabaseOutlined /></n-icon>
          <span>{{ detailInfo.name }}</span>
        </div>
      </template>
      
      <div class="detail-info">
        <div class="info-row">
          <span class="info-label">英文名称：</span>
          <span class="info-value">{{ detailInfo.englishName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">所属分类：</span>
          <n-tag type="info">{{ detailInfo.category }}</n-tag>
        </div>
        <div class="info-row">
          <span class="info-label">数据描述：</span>
          <span class="info-value">{{ detailInfo.description }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">数据量：</span>
          <span class="info-value">{{ detailInfo.dataCount.toLocaleString() }} 条</span>
        </div>
        <div class="info-row">
          <span class="info-label">数源单位：</span>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <n-tag v-for="unit in detailInfo.unit" :key="unit" size="small">{{ unit }}</n-tag>
          </div>
        </div>
      </div>
    </n-card>

    <!-- 数据清单 -->
    <n-card :bordered="false" style="margin-bottom: 16px;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <n-icon size="18"><TableOutlined /></n-icon>
          <span>数据清单</span>
        </div>
      </template>
      
      <n-data-table 
        :columns="catalogColumns" 
        :data="catalogData" 
        :bordered="false"
        :pagination="false"
      />
    </n-card>

    <!-- 数据表 -->
    <n-card :bordered="false">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <n-icon size="18"><FileTextOutlined /></n-icon>
          <span>数据表</span>
        </div>
      </template>
      
      <n-data-table 
        :columns="tableColumns" 
        :data="tableData" 
        :bordered="false"
        :pagination="{ pageSize: 10 }"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftOutlined, DatabaseOutlined, TableOutlined, FileTextOutlined } from '@vicons/antd'

const route = useRoute()
const router = useRouter()

const detailInfo = ref({
  id: 1,
  name: '精神病_评估记录',
  category: '患者信息',
  englishName: 'JSB_PGJL',
  description: '严重精神障碍患者管理信息',
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
  dataCount: 475029
})

// 数据清单表格列配置
const catalogColumns = [
  { title: '数据对象', key: 'dataObject', align: 'left' },
  { title: '数据类型', key: 'dataType', align: 'center', width: 120 },
  { title: '字段历史', key: 'fieldHistory', align: 'center', width: 120 },
  { title: '配置主键', key: 'primaryKey', align: 'center', width: 100 }
]

// 数据清单数据
const catalogData = ref([
  {
    dataObject: 'ID',
    dataType: 'VARCHAR2(20)',
    fieldHistory: '中工程',
    primaryKey: '是'
  },
  {
    dataObject: 'JIANKANGDANH',
    dataType: 'VARCHAR2(20)', 
    fieldHistory: '信息管理项目健康档案',
    primaryKey: '否'
  },
  {
    dataObject: 'YILIAOJGDM',
    dataType: 'VARCHAR2(20)',
    fieldHistory: '往来管理项目中机构代码',
    primaryKey: '否'
  },
  {
    dataObject: 'YILIAOJGMC',
    dataType: 'VARCHAR2(20)',
    fieldHistory: '往来管理项目中机构名称',
    primaryKey: '否'
  },
  {
    dataObject: 'JZXINJBH',
    dataType: 'VARCHAR2(20)',
    fieldHistory: '居民信息',
    primaryKey: '否'
  }
])

// 数据表表格列配置  
const tableColumns = [
  { title: 'ID', key: 'id', align: 'left', width: 150 },
  { title: 'JIANKANGDANH', key: 'jiankangdanh', align: 'left', width: 200 },
  { title: 'YILIAOJGDM', key: 'yiliaojgdm', align: 'left', width: 180 },
  { title: 'YILIAOJGMC', key: 'yiliaojgmc', align: 'left' },
  { title: 'JZXINJBH', key: 'jzxinjbh', align: 'left', width: 150 }
]

// 数据表数据
const tableData = ref([
  {
    id: 'JIANKANGDANH',
    jiankangdanh: 'YILIAOJGDM',
    yiliaojgdm: 'YILIAOJGMC',
    yiliaojgmc: 'JZXINJBH',
    jzxinjbh: 'JZXINJBH'
  },
  {
    id: 'YIDO',
    jiankangdanh: '536380364',
    yiliaojgdm: '直接市立金山区东街社区卫生服务中心',
    yiliaojgmc: 'gzuJHAdcAqhz5TcnY6YyHmc',
    jzxinjbh: 'BOJ3m9TUhBLdajAvj0AQf9zz'
  },
  {
    id: '104268',
    jiankangdanh: '536380364',
    yiliaojgdm: '横沥市立金山区东街社区卫生服务中心',
    yiliaojgmc: 'BOJ3m9TUhBLdajAvj0AQf9zz',
    jzxinjbh: 'BOJ3m9TUhBLdajAvj0AQf9zz'
  },
  {
    id: '104269',
    jiankangdanh: '233380364',
    yiliaojgdm: '横沥市立金山区东街社区卫生服务中心',
    yiliaojgmc: 'BOJ3m9TUhBLdajAvj0AQf9zz',
    jzxinjbh: 'BOJ3m9TUhBLdajAvj0AQf9zz'
  },
  {
    id: '104260',
    jiankangdanh: '536380364',
    yiliaojgdm: '横沥市立金山区东街社区卫生服务中心',
    yiliaojgmc: 'BOJ3m9TUhBLdajAvj0AQf9zz',
    jzxinjbh: 'BOJ3m9TUhBLdajAvj0AQf9zz'
  },
  {
    id: '104261',
    jiankangdanh: '233380364',
    yiliaojgdm: '横沥市立金山区东街社区卫生服务中心',
    yiliaojgmc: 'BOJ3m9TUhBLdajAvj0AQf9zz',
    jzxinjbh: 'BOJ3m9TUhBLdajAvj0AQf9zz'
  },
  {
    id: '104262',
    jiankangdanh: '536380364',
    yiliaojgdm: '横沥市立金山区东街社区卫生服务中心',
    yiliaojgmc: 'BOJ3m9TUhBLdajAvj0AQf9zz',
    jzxinjbh: 'BOJ3m9TUhBLdajAvj0AQf9zz'
  },
  {
    id: '104263',
    jiankangdanh: '536380364',
    yiliaojgdm: '横沥市立金山区东街社区卫生服务中心',
    yiliaojgmc: 'BOJ3m9TUhBLdajAvj0AQf9zz',
    jzxinjbh: 'BOJ3m9TUhBLdajAvj0AQf9zz'
  }
])

onMounted(() => {
  // 根据路由参数获取详情数据
  const itemId = route.params.id
  if (itemId) {
    // 这里可以根据ID获取具体的详情数据
    console.log('获取详情数据，ID:', itemId)
  }
})

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.catalog-detail-page {
  padding: 24px;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  flex: 1;
}
</style>

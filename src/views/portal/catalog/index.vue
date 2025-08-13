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

    <!-- 购物车弹窗 -->
    <n-modal v-model:show="showCartModal" :mask-closable="false" preset="card" title="申请数据" style="width: 800px;">
      <div class="cart-modal">
        <!-- 数据列表 -->
        <div class="cart-items" style="margin-bottom: 24px;">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <span style="font-size: 16px; font-weight: 500;">已选择的数据</span>
            <n-badge :value="cartItems.length" type="info" style="margin-left: 8px;" />
          </div>
          
          <n-data-table 
            :columns="cartColumns" 
            :data="cartItems" 
            :bordered="false"
            :pagination="false"
            size="small"
            style="margin-bottom: 16px;"
          />
        </div>

        <!-- 申请表单 -->
        <n-form :model="applyForm" label-placement="left" label-width="120px">
          <n-form-item label="申请项目名称" required>
            <n-input 
              v-model:value="applyForm.projectName" 
              placeholder="请输入申请项目名称"
            />
          </n-form-item>
          
          <n-form-item label="申请用途" required>
            <n-input 
              v-model:value="applyForm.purpose" 
              placeholder="请输入申请用途" 
              type="textarea" 
              :rows="3"
            />
          </n-form-item>
          
          <n-form-item label="上传附件">
            <div style="width: 100%;">
              <n-upload
                v-model:file-list="applyForm.attachments"
                :max="5"
                multiple
                :show-file-list="true"
                @change="handleFileChange"
              >
                <n-button>选择文件</n-button>
              </n-upload>
              <div style="margin-top: 8px; color: #666; font-size: 12px;">
                支持上传相关申请材料，最多5个文件，每个文件不超过10MB
              </div>
              <div style="margin-top: 8px;">
                <n-button text @click="downloadTemplate">
                  <template #icon>
                    <n-icon><DownloadOutlined /></n-icon>
                  </template>
                  下载申请模板
                </n-button>
              </div>
            </div>
          </n-form-item>
          
          <n-form-item label="使用期限" required>
            <n-date-picker 
              v-model:value="applyForm.validDate" 
              type="date" 
              placeholder="请选择使用期限"
              style="width: 100%;"
            />
          </n-form-item>
          
          <n-form-item label="联系方式" required>
            <n-input 
              v-model:value="applyForm.contact" 
              placeholder="请输入联系电话或邮箱"
            />
          </n-form-item>
          
          <n-form-item label="备注">
            <n-input 
              v-model:value="applyForm.remark" 
              placeholder="请输入备注信息（可选）" 
              type="textarea" 
              :rows="2"
            />
          </n-form-item>
        </n-form>
      </div>
      
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <n-button @click="closeCartModal">取消</n-button>
          <n-button type="primary" @click="submitApply" :loading="applyLoading">提交申请</n-button>
        </div>
      </template>
    </n-modal>
  </template>

<script setup>
import { ref, reactive, h } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartCount = ref(0)

// 购物车弹窗相关
const showCartModal = ref(false)
const applyLoading = ref(false)
const cartItems = ref([])

// 申请表单
const applyForm = ref({
  projectName: '',
  purpose: '',
  validDate: null,
  contact: '',
  remark: '',
  attachments: []
})

// 购物车表格列配置
const cartColumns = [
  {
    title: '数据名称',
    key: 'name',
    align: 'left',
    ellipsis: true
  },
  {
    title: '所属分类',
    key: 'category',
    align: 'center',
    width: 120,
    render(row) {
      return h('n-tag', { type: 'info', size: 'small' }, { default: () => row.category })
    }
  },
  {
    title: '数据量',
    key: 'dataCount',
    align: 'center',
    width: 120,
    render(row) {
      return row.dataCount.toLocaleString() + ' 条'
    }
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 80,
    render(row) {
      return h('n-button', {
        size: 'small',
        type: 'error',
        text: true,
        onClick: () => removeFromCart(row.id)
      }, { default: () => '移除' })
    }
  }
]
import { ShoppingCartOutlined, DownloadOutlined } from '@vicons/antd'

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
  showCartModal.value = true
}

function closeCartModal() {
  showCartModal.value = false
}

function addToCart(item) {
  // 检查是否已经在购物车中
  const existingItem = cartItems.value.find(cartItem => cartItem.id === item.id)
  if (existingItem) {
    window.$message?.warning('该数据已在购物车中')
    return
  }
  
  cartItems.value.push({
    id: item.id,
    name: item.name,
    category: item.category,
    dataCount: item.dataCount
  })
  cartCount.value = cartItems.value.length
  window.$message?.success('已添加到购物车')
}

function removeFromCart(itemId) {
  const index = cartItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
    cartCount.value = cartItems.value.length
    window.$message?.success('已从购物车移除')
  }
}

function submitApply() {
  // 验证表单
  if (!applyForm.value.projectName) {
    window.$message?.error('请填写申请项目名称')
    return
  }
  if (!applyForm.value.purpose) {
    window.$message?.error('请填写申请用途')
    return
  }
  if (!applyForm.value.validDate) {
    window.$message?.error('请选择使用期限')
    return
  }
  if (!applyForm.value.contact) {
    window.$message?.error('请填写联系方式')
    return
  }
  if (cartItems.value.length === 0) {
    window.$message?.error('购物车为空，请先添加数据')
    return
  }

  applyLoading.value = true
  
  // 模拟提交申请
  setTimeout(() => {
    applyLoading.value = false
    window.$message?.success('申请提交成功！')
    
    // 清空购物车和表单
    cartItems.value = []
    cartCount.value = 0
    applyForm.value = {
      projectName: '',
      purpose: '',
      validDate: null,
      contact: '',
      remark: '',
      attachments: []
    }
    
    showCartModal.value = false
  }, 2000)
}

// 文件上传处理
function handleFileChange({ fileList }) {
  // 验证文件大小
  const maxSize = 10 * 1024 * 1024 // 10MB
  const validFiles = fileList.filter(file => {
    if (file.file && file.file.size > maxSize) {
      window.$message?.error(`文件 ${file.name} 大小超过10MB限制`)
      return false
    }
    return true
  })
  
  applyForm.value.attachments = validFiles
  if (validFiles.length !== fileList.length) {
    // 有文件被过滤掉了，更新UI
    setTimeout(() => {
      applyForm.value.attachments = validFiles
    }, 100)
  }
}

// 下载申请模板
function downloadTemplate() {
  // 创建模板内容
  const templateContent = `数据申请模板

申请人信息：
姓名：
所在机构：
联系电话：
电子邮箱：

申请项目信息：
项目名称：
项目背景：
数据用途：
使用期限：

数据需求：
1. 所需数据类型：
2. 数据时间范围：
3. 数据量预估：
4. 数据使用方式：

其他说明：


申请人签名：                    日期：
`

  // 创建并下载文件
  const blob = new Blob([templateContent], { type: 'text/plain;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = '数据申请模板.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  
  window.$message?.success('模板下载成功')
}

function viewDetail(item) {
  console.log('点击查看详情，item:', item)
  // 跳转到详情页面
  router.push({
    path: `/portal/catalog/detail/${item.id}`
  }).then(() => {
    console.log('路由跳转成功')
  }).catch(err => {
    console.error('路由跳转失败:', err)
  })
}
</script>

<style scoped>
.catalog-page {
  padding: 24px;
}
</style>

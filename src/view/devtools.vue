<template>
  <el-config-provider :locale="locale">
    <el-container class="container">
      <el-main class="main">
        <el-tabs v-model="tabName" @tab-click="handleTabChange">
          <el-tab-pane label="百度网盘" name="baidu">
            <BaiduNetDisk></BaiduNetDisk>
          </el-tab-pane>
<!--          <el-tab-pane label="蓝奏云" name="lanzou">-->
<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="Michael" name="michael">-->
<!--          </el-tab-pane>-->
        </el-tabs>
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<script>
export default {
  name: 'devtoolsView'
}
</script>

<script setup>
import { ref } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import BaiduNetDisk from '@/devtools/components/BaiduNetDisk.vue'

const locale = ref(zhCn)
const tabName = ref('baidu')

const handleTabChange = () => {}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  --color-primary: #4608ad;
  --color-primary-darken: #32067c;
}

.main {
  --el-main-padding: 0 10px !important;
}

.el-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__content) {
  flex: 1;
}

:deep(.el-tab-pane) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-input
          v-model="input"
          :rows="3"
          type="textarea"
          placeholder="请输入百度分享网址"
        />
      </el-col>
      <el-col :span="12">
        <el-input
          v-model="output"
          :rows="3"
          type="textarea"
          placeholder=""
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="handleExecute">开始转存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Baidu'
}
</script>

<script setup>
import { ref } from 'vue'

const input = ref('')
let output = ref('')
</script>

<style lang="scss" scoped>
</style>

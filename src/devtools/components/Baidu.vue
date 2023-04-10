<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-input
        v-model="input"
        :rows="2"
        type="textarea"
        placeholder="Please input"
      />
    </el-col>
    <el-col :span="12">
      <el-input
        v-model="output"
        :rows="2"
        type="textarea"
        placeholder="Please input"
      />
    </el-col>
  </el-row>
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

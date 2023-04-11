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
    <el-row class="m-t-10px">
      <el-col :span="24">
        <el-button type="primary" @click="handleExecute">开始转存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'BaiduNetDisk'
}
</script>

<script setup>
import { ref } from 'vue'
import { runScript, sleep } from '@/utils'

const input = ref('')
let output = ref('')

const handleExecute = async () => {
  runScript(`location.href = '${input.value}'`)
  await sleep(4000)
  // chrome.runtime.sendMessage(
  //   "bfhcdpbamfjnmgjjljfdddmilafoeakc", // PUT YOUR EXTENSION ID HERE
  //   "foo",
  //   function (response) {
  //     console.log(response);
  //   }
  // );
  runScript('document.querySelector(\'[node-type="shareSave"]\').click()')
  await sleep(2000)
  runScript('document.querySelector(\'[node-path="/MAC"]\').click()')
  await sleep(2000)
  runScript('document.querySelector(\'[node-path="/MAC/app"]\').click()')
  await sleep(2000)
  runScript('document.querySelector(\'[node-type="confirm"]\').click()')
  await sleep(2000)
  let file_list = []
  runScript('locals.get(\'file_list\')', (result) => {
    file_list = result
  })
  runScript(`
const path_node = document.querySelector('.fx-info-section-path-blue');
const path_node_data = path_node.getAttribute('target-path');
location.href = 'https://pan.baidu.com/disk/main?from=homeSave#/index?category=all&path='+ path_node_data
`)
  await sleep(3000)
  file_list.forEach(item => {
    runScript(`document.querySelector('[title="${item.server_filename}"]').click()`)
  })
  runScript(`document.querySelector('[title="分享"]').click()`)
  await sleep(2000)
  runScript(`document.querySelector('.wp-s-share-to-link__create-form-radiu label:last-child').click()`)
  await sleep(2000)
  runScript(`document.querySelector('.wp-s-share-to-link__create-form-submit--button').click()`)
  await sleep(2000)
  runScript(`document.querySelector('.wp-s-share-to-link__link-info-url-wrapper input').value`, (result) => {
    output.value += result
  })
}
</script>

<style lang="scss" scoped>
.m-t-10px {
  margin-top: 10px;
}
</style>

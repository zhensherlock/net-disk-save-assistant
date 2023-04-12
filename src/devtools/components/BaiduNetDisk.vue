<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-input v-model="input" :rows="3" type="textarea" placeholder="请输入百度分享网址" />
      </el-col>
      <el-col :span="12">
        <el-input v-model="output" :rows="3" type="textarea" placeholder="" readonly />
      </el-col>
    </el-row>
    <el-row class="m-t-10px">
      <el-col :span="24">
        <el-button type="primary" plain @click="handleExecute" :loading="executeLoading">开始转存</el-button>
        <el-button plain @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
    <el-collapse class="m-t-10px">
      <el-collapse-item title="高级配置">
        <el-form :model="advancedForm" label-width="100px">
          <el-form-item label="回调地址">
            <el-input v-model="advancedForm.callback_url" />
          </el-form-item>
          <el-form-item label="回调URL参数">
            <el-input v-model="advancedForm.callback_url_param_key" />
          </el-form-item>
          <el-form-item label="重复次数">
            <el-input-number v-model="advancedForm.repeat_count" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'BaiduNetDisk'
}
</script>

<script setup>
import { ref, reactive } from 'vue'
import { runScript, sleep } from '@/utils'
import { ElMessage } from 'element-plus'

const input = ref('http://127.0.0.1:5000/redirect_link')
let output = ref('')
const executeLoading = ref(false)
const advancedForm = reactive({
  repeat_count: 1,
  callback_url: 'http://127.0.0.1:5000/set_transfer_link',
  callback_url_param_key: 'url'
})

const handleExecute = async () => {
  for (const item of new Array(advancedForm.repeat_count).fill(0)) {
    await handleTransfer()
  }
}

const handleTransfer = async () => {
  if (!input.value) {
    ElMessage.error('请输入百度分享网址！')
    return
  }
  executeLoading.value = true
  runScript(`location.href = '${input.value}'`)
  await sleep(5000)
  // chrome.runtime.sendMessage(
  //   "bfhcdpbamfjnmgjjljfdddmilafoeakc", // PUT YOUR EXTENSION ID HERE
  //   "foo",
  //   function (response) {
  //     console.log(response);
  //   }
  // );
  runScript('document.querySelector(\'[node-type="shareSave"]\').click()')
  await sleep(3000)
  runScript('document.querySelector(\'[node-path="/MAC"]\').click()')
  await sleep(3000)
  runScript('document.querySelector(\'[node-path="/MAC/app"]\').click()')
  await sleep(3000)
  runScript('document.querySelector(\'[node-type="confirm"]\').click()')
  await sleep(3000)
  let file_list = []
  runScript('locals.get(\'file_list\')', (result) => {
    file_list = result
  })
  runScript(`
const path_node = document.querySelector('.fx-info-section-path-blue')
const path_node_data = path_node ? path_node.getAttribute('target-path') : '/MAC/app'
location.href = 'https://pan.baidu.com/disk/main?from=homeSave#/index?category=all&path='+ path_node_data
`)
  await sleep(3000)
  file_list.forEach(item => {
    runScript(`document.querySelector('[title="${item.server_filename}"]').parentElement.parentElement.
    parentElement.parentElement.previousSibling.click()`)
  })
  runScript(`document.querySelector('[title="分享"]').click()`)
  await sleep(3000)
  runScript(`document.querySelector('.wp-s-share-to-link__create-form-radiu label:last-child').click()`)
  await sleep(3000)
  runScript(`document.querySelector('.wp-s-share-to-link__create-form-submit--button').click()`)
  await sleep(3000)
  runScript(`document.querySelector('.wp-s-share-to-link__link-info-url-wrapper input').value`, (result) => {
    output.value = result
    executeLoading.value = false
    handleResultCallback(result)
  })
  await sleep(3000)
}

const handleResultCallback = async (url) => {
  if (!advancedForm.callback_url || !advancedForm.callback_url_param_key) {
    return
  }
  await fetch(`${advancedForm.callback_url}?${advancedForm.callback_url_param_key}=${url}`, {
    method: 'GET',
    mode: 'cors'
  })
}

const handleReset = () => {
  input.value = ''
  output.value = ''
}
</script>

<style lang="scss" scoped>
.m-t-10px {
  margin-top: 10px;
}
</style>

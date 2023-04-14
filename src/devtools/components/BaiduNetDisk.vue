<template>
  <div class="baidu-net-disk">
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
        <el-button plain type="danger" @click="handleStop">暂停</el-button>
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
      <el-collapse-item title="执行日志" class="collapse-item--activities">
        <el-timeline>
          <el-timeline-item
            ref="timelineItems"
            v-for="(activity, index) in activities"
            :key="index"
            :type="activity.type"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
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
import { ref, reactive, nextTick } from 'vue'
import { runScript, sleep, scrollIntoView } from '@/utils'
import { ElMessage, dayjs } from 'element-plus'

const input = ref('http://127.0.0.1:5000/redirect_link')
let output = ref('')
const executeLoading = ref(false)
const status = ref('stop')
const advancedForm = reactive({
  repeat_count: 1,
  callback_url: 'http://127.0.0.1:5000/set_transfer_link',
  callback_url_param_key: 'url'
})
const timelineItems = ref([])

const activities = reactive([])

const handleExecute = async () => {
  handleAddActivity('开始执行任务', 'info')
  status.value = 'start'
  for (const [index] of new Array(advancedForm.repeat_count).fill(0).entries()) {
    handleAddActivity(`开始第${index + 1}次任务`, 'primary')
    await handleTransfer()
    handleAddActivity(`结束第${index + 1}次任务`, 'primary')
    if (status.value === 'stop') {
      break
    }
  }
}

const handleStop = () => {
  status.value = 'stop'
  handleAddActivity('已暂停轮询任务，不再继续执行', 'warning')
}

const handleTransfer = async () => {
  if (!input.value) {
    ElMessage.error('请输入百度分享网址！')
    return
  }
  executeLoading.value = true
  runScript(`location.href = '${input.value}'`)
  handleAddActivity(`网盘地址跳转，${input.value}`, 'success')
  await sleep(5000)
  // chrome.runtime.sendMessage(
  //   "bfhcdpbamfjnmgjjljfdddmilafoeakc", // PUT YOUR EXTENSION ID HERE
  //   "foo",
  //   function (response) {
  //     console.log(response);
  //   }
  // );
  let enterPageSuccess = false
  runScript('document.querySelector(\'[node-type="shareSave"]\')', (result) => {
    if (result) {
      enterPageSuccess = true
    }
  })
  await sleep(3000)
  if (!enterPageSuccess) {
    executeLoading.value = false
    handleAddActivity('进入页面失败', 'danger')
    await handleResultCallback('error url')
    handleAddActivity('回调任务执行结束', 'success')
    await sleep(3000)
    return
  }
  handleAddActivity('成功进入页面', 'success')
  runScript('document.querySelector(\'[node-type="shareSave"]\').click()')
  handleAddActivity('点击保存到网盘按钮', 'success')
  await sleep(3000)
  runScript('document.querySelector(\'[node-path="/MAC"]\').click()')
  handleAddActivity('选择文件夹/MAC', 'success')
  await sleep(3000)
  runScript('document.querySelector(\'[node-path="/MAC/app"]\').click()')
  handleAddActivity('选择文件夹/MAC/app', 'success')
  await sleep(3000)
  runScript('document.querySelector(\'[node-type="confirm"]\').click()')
  handleAddActivity('点击确定按钮', 'success')
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
  handleAddActivity('进入自己的网盘地址', 'success')
  await sleep(3000)
  file_list.forEach(item => {
    runScript(`document.querySelector('[title="${item.server_filename}"]').parentElement.parentElement.
    parentElement.parentElement.previousSibling.click()`)
  })
  handleAddActivity('选中保存的文件', 'success')
  await sleep(3000)
  runScript(`document.querySelector('[title="分享"]').click()`)
  handleAddActivity('点击分享按钮', 'success')
  await sleep(3000)
  runScript(`document.querySelector('.wp-s-share-to-link__create-form-radiu label:last-child').click()`)
  handleAddActivity('选择永久有效', 'success')
  await sleep(3000)
  runScript(`document.querySelector('.wp-s-share-to-link__create-form-submit--button').click()`)
  handleAddActivity('点击创建链接', 'success')
  await sleep(3000)
  runScript(`document.querySelector('.wp-s-share-to-link__link-info-url-wrapper input').value`, async (result) => {
    output.value = result
    executeLoading.value = false
    handleAddActivity('转存文件结束', 'success')
    await handleResultCallback(result)
    handleAddActivity('回调任务执行结束', 'success')
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

const handleAddActivity = (content, type) => {
  activities.push({
    content,
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type
  })
  nextTick(() => {
    scrollIntoView(timelineItems.value[activities.length - 1].$el)
  })
}
</script>

<style lang="scss" scoped>
.baidu-net-disk {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.m-t-10px {
  margin-top: 10px;
}

.el-collapse {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.el-collapse-item {
  display: flex;
  flex-direction: column;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

.collapse-item--activities {
  flex: 1;
  overflow: hidden;

  :deep(.el-collapse-item__wrap) {
    flex: 1;
    overflow: auto;
  }
}
</style>

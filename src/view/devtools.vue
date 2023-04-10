<template>
  <el-config-provider :locale="locale">
    <el-container class="container">
      <el-main class="main">
        <el-tabs v-model="tabName" @tab-click="handleTabChange">
          <el-tab-pane label="百度网盘" name="baidu">
          </el-tab-pane>
          <el-tab-pane label="蓝凑云" name="second">
          </el-tab-pane>
          <el-tab-pane label="SZX" name="second">
          </el-tab-pane>
        </el-tabs>
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
import {ref} from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { sleep } from '@/utils'

const locale = ref(zhCn)
const tabName = ref('baidu')
const input = ref('')
let output = ref('')

const handleTabChange = () => {}

const handleExecute = async () => {
  handleRunScript(`location.href = '${input.value}'`)
  await sleep(4000)
  // chrome.runtime.sendMessage(
  //   "bfhcdpbamfjnmgjjljfdddmilafoeakc", // PUT YOUR EXTENSION ID HERE
  //   "foo",
  //   function (response) {
  //     console.log(response);
  //   }
  // );
  handleRunScript('document.querySelector(\'[node-type="shareSave"]\').click()')
  await sleep(2000)
  handleRunScript('document.querySelector(\'[node-path="/MAC"]\').click()')
  await sleep(2000)
  handleRunScript('document.querySelector(\'[node-path="/MAC/app"]\').click()')
  await sleep(2000)
  handleRunScript('document.querySelector(\'[node-type="confirm"]\').click()')
  await sleep(2000)
  let file_list = []
  handleRunScript('locals.get(\'file_list\')', (result) => {
    file_list = result
  })
  handleRunScript(`
const path_node = document.querySelector('.fx-info-section-path-blue');
const path_node_data = path_node.getAttribute('target-path');
location.href = 'https://pan.baidu.com/disk/main?from=homeSave#/index?category=all&path='+ path_node_data
`)
  await sleep(3000)
  file_list.forEach(item => {
    handleRunScript(`document.querySelector('[title="${item.server_filename}"]').click()`)
  })
  handleRunScript(`document.querySelector('[title="分享"]').click()`)
  await sleep(2000)
  handleRunScript(`document.querySelector('.wp-s-share-to-link__create-form-radiu label:last-child').click()`)
  await sleep(2000)
  handleRunScript(`document.querySelector('.wp-s-share-to-link__create-form-submit--button').click()`)
  await sleep(2000)
  handleRunScript(`document.querySelector('.wp-s-share-to-link__link-info-url-wrapper input').value`, (result) => {
    output.value += result
  })
}

const handleRunScript = (code, cb) => {
  chrome.devtools.inspectedWindow.eval(
    code, cb || ((result, isException) => {
      // console.log(result)
      // if (isException) {
      //   console.log("the page is not using jQuery");
      // } else {
      //   console.log("The page is using jQuery v" + result);
      // }
    })
  );
}
</script>

<style>
.container {
  width: 100%;
  --color-primary: #4608ad;
  --color-primary-darken: #32067c;
}

.main {
  --el-main-padding: 5px 10px !important;
}
</style>

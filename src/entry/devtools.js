import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from '../view/devtools.vue'
import 'element-plus/dist/index.css'
import '../assets/style/common.scss'
import router from '../devtools/router'
import store from '../devtools/store'

chrome.devtools.panels.create('NetDiskSaveAssistant', '', 'devtools.html')
createApp(App).use(ElementPlus).use(router).use(store).mount('#app')

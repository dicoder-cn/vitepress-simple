import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import RecentArticles from './components/RecentArticles.vue'

// 使用ES模块语法导出主题配置
export default {
  extends: DefaultTheme,
  Layout: MyLayout, //使用注入插槽的包装组件覆盖 Layout
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('RecentArticles', RecentArticles)
  }
}
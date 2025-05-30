<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress';
import { ref } from 'vue';
const { Layout } = DefaultTheme
const { frontmatter } = useData();
const test=ref(1)
</script>

<template>
  <Layout>
  <!-- doc-top：在文档顶部位置可注入自定义内容。例如可以在此处添加文档的一些特殊标识或提示信息。
doc-bottom：在文档底部位置可注入自定义内容。比如添加版权声明等相关信息。
doc-footer-before：在文档页脚之前的位置可注入自定义内容。
doc-before：在文档主体内容之前的位置可注入自定义内容。比如添加一段通用的引言。
doc-after：在文档主体内容之后的位置可注入自定义内容。例如添加一些相关阅读推荐。
sidebar-nav-before：在侧边栏导航之前的位置可注入自定义内容。可以是侧边栏导航的补充说明等。
sidebar-nav-after：在侧边栏导航之后的位置可注入自定义内容。比如添加侧边栏导航的相关提示。
aside-top：在侧边栏顶部位置可注入自定义内容。例如添加侧边栏的一些头部信息。
aside-bottom：在侧边栏底部位置可注入自定义内容。像添加侧边栏的版权或其他说明。
aside-outline-before：在侧边栏大纲（目录）之前的位置可注入自定义内容。例如添加与目录相关的说明文字。
aside-outline-after：在侧边栏大纲（目录）之后的位置可注入自定义内容。比如添加与目录相关的补充信息。
aside-ads-before：在侧边栏广告位之前的位置可注入自定义内容。
aside-ads-after：在侧边栏广告位之后的位置可注入自定义内容。 -->
    <!-- <template #aside-outline-before>
      aside-outline-before
    </template>
    <template #aside-outline-after>
      aside-outline-after
    </template>
    <template #aside-ads-before>
      aside-ads-before
    </template>
    <template #aside-ads-after>
      aside-ads-after
    </template>
    <template #sidebar-nav-before>
      sidebar-nav-before
    </template>
    <template #sidebar-nav-after>
      sidebar-nav-after
    </template>
    <template #aside-top>
      aside-top
    </template>
    <template #aside-bottom>
      aside-bottom
    </template> -->

    <!-- 标题上方 -->
    <template #doc-top>
      <template v-if="(frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length) || (frontmatter.createAt) || (frontmatter.updateAt)">
        <div style="padding: 0 280px 0 12px; margin-top: -22px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <template v-if="frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length">
              <div style="display: flex; align-items: center; gap: 8px; margin-left: 16px;">
                <span style="font-weight: bold;">Tags:</span>
                <template v-for="tag in frontmatter.tags" :key="tag">
                  <a :href="`/vpsimple/tags/${encodeURIComponent(tag)}`" style="color: #42b983; text-decoration: none; margin-right: 8px; background: #f4f4f5; border-radius: 4px; padding: 2px 10px; font-size: 14px; transition: background 0.2s;">
                    #{{ tag }}
                  </a>
                </template>
              </div>
            </template>
            <div style="color: #888; font-size: 14px;">
              <template v-if="frontmatter.createAt && frontmatter.updateAt && frontmatter.createAt !== frontmatter.updateAt">
                创建时间: {{ frontmatter.createAt }}<span style='margin: 0 8px;'>|</span>最后更新: {{ frontmatter.updateAt }}
              </template>
              <template v-else-if="frontmatter.createAt">
                创建时间: {{ frontmatter.createAt }}
              </template>
              <template v-else-if="frontmatter.updateAt">
                最后更新: {{ frontmatter.updateAt }}
              </template>
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 10px 0 24px 0;" />
        </div>
      </template>
    </template>
  </Layout>
</template>
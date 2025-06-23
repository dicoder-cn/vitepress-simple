<!-- .vitepress/theme/components/MyGlobalComponent.vue -->
<template>
  <div class="recent-posts">
    <h2>Recent Articles</h2>
    <div v-if="recentPosts.length">
      <ul class="post-list">
        <li v-for="post in recentPosts" :key="post.url" class="post-item">
          <a :href="post.url" class="post-link">
            <div class="post-title">
              <span class="post-date">[{{ formatDate(post.createdAt) }}]</span> 
              {{ post.title }}
            </div>
            <div v-if="post.tags?.length" class="post-tags">
              <span 
                v-for="tag in post.tags" 
                :key="tag"
                class="post-tag"
                @click.prevent="navigateToTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div v-else class="no-posts">
      No articles yet
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { data as postsData } from '../posts.data.mjs'
import { useRouter } from 'vitepress'

const router = useRouter()
const recentPosts = ref([])

function navigateToTag(tag) {
  router.go(`/vpsimple/tags/${tag}`)
}

onMounted(() => {
  // 过滤掉没有创建时间的文章
  const filteredPosts = postsData.filter(post => post.createdAt)
  console.log(filteredPosts)
  // 按创建时间排序
  recentPosts.value = filteredPosts
    .sort((a, b) => {
      if (!a.createdAt) return 1
      if (!b.createdAt) return -1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    .slice(0, 10)
})

function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date)) return dateString
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  } catch (e) {
    return dateString
  }
}
</script>

<style scoped>
.recent-posts {
  margin: 2rem 0;
}

.post-list {
  list-style-type: none;
  padding: 0;
}

.post-item {
  margin-bottom: 0.8rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.post-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  flex-wrap: wrap;
}

.post-title {
  font-weight: 500;
  font-size: 0.9rem;
  margin-right: 1rem;
  flex: 1;
}

.post-date {
  color: var(--vp-c-text-3);
  font-size: 0.8em;
  white-space: nowrap;
  margin-right: 8px;
}

.no-posts {
  color: var(--vp-c-text-3);
  font-style: italic;
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.post-tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-dark);
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-tag:hover {
  background-color: var(--vp-c-brand);
  color: white;
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .post-item {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .post-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}
</style>
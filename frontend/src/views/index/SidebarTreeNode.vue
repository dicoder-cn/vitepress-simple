<template>
  <div class="sidebar-tree-node">
    <div class="node-content" :class="{ clickable: hasChildren }" @click="toggleCollapse">
      <div v-if="hasChildren" class="folder-node">
        <el-icon class="folder-icon">
          <component :is="collapsed ? 'Folder' : 'Folder'" />
        </el-icon>
        <span class="folder-title">{{ nodeData.text }}</span>
        <span class="arrow" :class="{ collapsed }">
          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M8 10l4 4 4-4" stroke="#999" stroke-width="2" fill="none"/></svg>
        </span>
        <div class="add-btn-wrapper">
          <el-button type="primary" size="small" class="add-btn" @click.stop="addSidebarItem">
            <svg viewBox="0 0 1024 1024" width="14" height="14"><path d="M480 480V224a32 32 0 1 1 64 0v256h256a32 32 0 1 1 0 64H544v256a32 32 0 1 1-64 0V544H224a32 32 0 1 1 0-64h256z" fill="#409eff"/></svg>
            新增侧栏项
          </el-button>
        </div>
      </div>
      <div v-else class="file-node">
        <el-icon class="file-icon"><Document /></el-icon>
        <label class="input-label">标题：</label>
        <el-input v-model="nodeData.text" placeholder="文档标题" class="text-input" @change.stop="updateNode"/>
        <label class="input-label">链接：</label>
        <el-input v-model="nodeData.link" placeholder="链接路径" class="link-input" @change.stop="updateNode"/>
        <el-button type="danger" size="small" class="delete-btn" @click.stop="deleteSelf" circle>
          <svg viewBox="0 0 1024 1024" width="14" height="14"><path d="M360 820a40 40 0 0 0 40 40h224a40 40 0 0 0 40-40V384H360v436z m464-532h-112l-34-56a48 48 0 0 0-41-24H387a48 48 0 0 0-41 24l-34 56H200a24 24 0 0 0 0 48h16v520a88 88 0 0 0 88 88h416a88 88 0 0 0 88-88V336h16a24 24 0 0 0 0-48z m-352-40h208l24 40H408l24-40z" fill="#f56c6c"/></svg>
        </el-button>
      </div>
    </div>
    <div v-if="hasChildren && !collapsed" class="node-children">
      <sidebar-tree-node 
        v-for="child in sortedChildren" 
        :key="child.path" 
        :node="child"
        @update:node="handleChildUpdate"
        @delete:node="handleChildDelete"
        @add:node="handleAddChild"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
import { ElInput, ElIcon, ElButton } from 'element-plus';
import { Folder, Document } from '@element-plus/icons-vue';

// 定义节点类型
interface TreeNode {
  title: string;
  path: string;
  children?: TreeNode[];
  text: string;
  link: string;
  collapsed?: boolean;
  MdFileFrontMatter?: Record<string, any>;
  IsMdFile?: boolean;
}

const props = defineProps<{
  node: TreeNode
}>();

const emit = defineEmits<{
  (e: 'update:node', node: TreeNode): void
  (e: 'delete:node', path: string): void
  (e: 'add:node', parentPath: string): void
}>();

// 创建本地节点数据的副本，以便于编辑
const nodeData = ref({
  text: props.node.text,
  link: props.node.link
});

const collapsed = ref(props.node.collapsed !== false); // 默认收起

const hasChildren = computed(() => Array.isArray(props.node.children) && props.node.children.length > 0);

// 排序：目录在前，md文件在后，md文件按weight升序
const sortedChildren = computed(() => {
  if (!props.node.children) return [];
  const dirs = props.node.children.filter(child => !child.IsMdFile);
  const mds = props.node.children.filter(child => child.IsMdFile);
  mds.sort((a, b) => {
    const wa = (a.MdFileFrontMatter && typeof a.MdFileFrontMatter.weight === 'number') ? a.MdFileFrontMatter.weight : 0;
    const wb = (b.MdFileFrontMatter && typeof b.MdFileFrontMatter.weight === 'number') ? b.MdFileFrontMatter.weight : 0;
    return wa - wb;
  });
  return [...dirs, ...mds];
});

watch(() => props.node.text, val => { nodeData.value.text = val; });
watch(() => props.node.link, val => { nodeData.value.link = val; });

function toggleCollapse() {
  if (!hasChildren.value) return;
  collapsed.value = !collapsed.value;
}

function updateNode() {
  const updatedNode = {
    ...props.node,
    text: nodeData.value.text,
    link: nodeData.value.link,
    collapsed: collapsed.value
  };
  emit('update:node', updatedNode);
}

function deleteSelf() {
  emit('delete:node', props.node.path);
}

function handleChildUpdate(childNode: TreeNode) {
  if (props.node.children) {
    const updatedChildren = [...props.node.children];
    const childIndex = updatedChildren.findIndex(child => child.path === childNode.path);
    if (childIndex !== -1) {
      updatedChildren[childIndex] = childNode;
      const updatedNode = {
        ...props.node,
        children: updatedChildren,
        collapsed: collapsed.value
      };
      emit('update:node', updatedNode);
    }
  }
}

function handleChildDelete(childPath: string) {
  if (props.node.children) {
    const updatedChildren = props.node.children.filter(child => child.path !== childPath);
    const updatedNode = {
      ...props.node,
      children: updatedChildren,
      collapsed: collapsed.value
    };
    emit('update:node', updatedNode);
  }
}

function addSidebarItem() {
  // 生成唯一path
  const newPath = `${props.node.path}/new-${Date.now()}.md`;
  const newNode: TreeNode = {
    title: '新建文档',
    path: newPath,
    text: '新建文档',
    link: newPath.replace(/\.md$/, ''),
    collapsed: false,
    IsMdFile: true,
    MdFileFrontMatter: { weight: 0 }
  };
  const updatedChildren = props.node.children ? [...props.node.children, newNode] : [newNode];
  const updatedNode = {
    ...props.node,
    children: updatedChildren,
    collapsed: collapsed.value
  };
  emit('update:node', updatedNode);
}

function handleAddChild(parentPath: string) {
  // 递归冒泡，不需要实现内容
}
</script>

<style scoped>
.sidebar-tree-node {
  margin-bottom: 8px;
}

.node-content {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.node-content.clickable:hover {
  background: #f5f7fa;
}

.folder-node, .file-node {
  display: flex;
  align-items: center;
  width: 100%;
}

.folder-icon, .file-icon {
  margin-right: 8px;
  color: #909399;
}

.folder-title {
  flex: 1;
  margin-right: 8px;
  font-weight: 500;
  color: #333;
  user-select: text;
}

.input-label {
  margin: 0 4px 0 0;
  color: #666;
  font-size: 13px;
  align-self: center;
}

.text-input {
  flex: 1;
  margin-right: 8px;
}

.link-input {
  flex: 1;
}

.delete-btn {
  margin-left: 8px;
  align-self: center;
  padding: 0 4px;
}

.add-btn-wrapper {
  position: absolute;
  right: 8px;
  top: 8px;
  margin: 0;
}

.add-btn {
  padding: 0 8px;
  font-size: 13px;
  height: 24px;
  line-height: 22px;
}

.arrow {
  display: flex;
  align-items: center;
  margin-left: 4px;
  transition: transform 0.2s;
}
.arrow.collapsed {
  transform: rotate(-90deg);
}

.node-children {
  margin-left: 24px;
  padding-left: 8px;
  border-left: 1px dashed #ebeef5;
}
</style> 
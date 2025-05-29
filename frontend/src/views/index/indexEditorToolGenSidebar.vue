<template>
    <div class="sidebar-generator">
        <div class="tree-container">
            <div class="tree-header">
                <h3>侧栏目录树</h3>
                <div class="button-group">
                    <el-button type="primary" @click="saveTreeData">保存</el-button>
                    <el-button type="default" @click="refreshTreeData" style="margin-left: 8px;">刷新</el-button>
                </div>
            </div>
            <div v-if="treeData" class="tree-content">
                <SidebarTreeNode 
                    v-for="node in processedTreeData" 
                    :key="node.path" 
                    :node="node" 
                    @update:node="updateNode"
                />
            </div>
            <div v-else class="tree-loading">
                <el-empty description="等待目录数据加载..."></el-empty>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useVpconfigStore } from '@/store/vpconfig';
import { onMounted, ref, computed } from 'vue';
import { ParseToTree } from 'wailsjs/go/docparse/ParseService';
import { docparse } from 'wailsjs/go/models';
import { ElButton, ElEmpty, ElMessage } from 'element-plus';
import SidebarTreeNode from './SidebarTreeNode.vue';

// 定义侧边栏项目接口
interface SidebarItem {
    text: string;
    link?: string;
    items?: SidebarItem[];
    collapsible?: boolean;
    collapsed?: boolean;
}

// 定义处理后的树节点
interface ProcessedTreeNode {
    title: string;
    path: string;
    children?: ProcessedTreeNode[];
    text: string;
    link: string;
}

const storeVpconfig = useVpconfigStore();
const treeData = ref<docparse.DocsTreeNode | null>(null);
const processedTreeData = ref<ProcessedTreeNode[]>([]);

// 将文档树转换为侧边栏数据
const convertTreeToSidebar = (node: docparse.DocsTreeNode, isRoot = false): SidebarItem[] => {
    const result: SidebarItem[] = [];
    (node.Children || []).forEach(child => {
        // 跳过隐藏/特殊文件夹
        if (!child.IsMdFile && (child.Name.startsWith('.') || child.Name === 'public' || child.Name === 'vpsimple')) return;

        if (isRoot) {
            // 根目录：只显示文件夹
            if (!child.IsMdFile) {
                result.push({
                    text: child.Name,
                    collapsible: true,
                    collapsed: false,
                    items: convertTreeToSidebar(child, false)
                });
            }
        } else {
            // 子目录：显示文件夹和md文件
            if (child.IsMdFile && child.Path.endsWith('.md')) {
                result.push({
                    text: child.Name.replace(/\.md$/, ''),
                    link: child.Path.replace(/\.md$/, '')
                });
            } else if (!child.IsMdFile) {
                result.push({
                    text: child.Name,
                    collapsible: true,
                    collapsed: false,
                    items: convertTreeToSidebar(child, false)
                });
            }
        }
    });
    return result;
};

// 将文档树转换为UI显示的树
const convertTreeToDisplayTree = (node: docparse.DocsTreeNode, isRoot: boolean = false): ProcessedTreeNode[] => {
    const result: ProcessedTreeNode[] = [];
    (node.Children || []).forEach(child => {
        // 跳过隐藏/特殊文件夹
        if (!child.IsMdFile && (child.Name.startsWith('.') || child.Name === 'public' || child.Name === 'vpsimple')) return;

        if (isRoot) {
            if (!child.IsMdFile) {
                const children = convertTreeToDisplayTree(child, false);
                if (children.length > 0) { // 只保留有内容的文件夹
                    result.push({
                        title: child.Name,
                        path: child.Path,
                        text: child.Name,
                        link: '',
                        children
                    });
                }
            }
        } else {
            if (child.IsMdFile && child.Path.endsWith('.md')) {
                result.push({
                    title: child.Name.replace(/\.md$/, ''),
                    path: child.Path,
                    text: child.Name.replace(/\.md$/, ''),
                    link: child.Path.replace(/\.md$/, '')
                });
            } else if (!child.IsMdFile) {
                const children = convertTreeToDisplayTree(child, false);
                if (children.length > 0) { // 只保留有内容的文件夹
                    result.push({
                        title: child.Name,
                        path: child.Path,
                        text: child.Name,
                        link: '',
                        children
                    });
                }
            }
        }
    });
    return result;
};

// 更新节点数据
const updateNode = (node: ProcessedTreeNode) => {
    // 在实际数据中更新节点信息
    updateNodeInTree(processedTreeData.value, node);
};

// 在树中递归查找并更新节点
const updateNodeInTree = (nodes: ProcessedTreeNode[], updatedNode: ProcessedTreeNode): boolean => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].path === updatedNode.path) {
            nodes[i] = { ...nodes[i], ...updatedNode };
            return true;
        }
        if (nodes[i].children) {
            if (updateNodeInTree(nodes[i].children!, updatedNode)) {
                return true;
            }
        }
    }
    return false;
};

// 将UI显示树转换回侧边栏数据
const convertDisplayTreeToSidebar = (nodes: ProcessedTreeNode[], isLanguageLevel: boolean = false): Record<string, any> => {
    if (isLanguageLevel) {
        // 处理语言级别的节点
        const result: Record<string, any> = {};
        nodes.forEach(langNode => {
            const langKey = langNode.text;
            const sidebarItems = convertDisplayTreeToSidebar(langNode.children || []);
            result[langKey] = sidebarItems;
        });
        return result;
    } else {
        // 处理常规侧边栏项
        return nodes.map(node => {
            if (node.children && node.children.length > 0) {
                // 目录节点
                return {
                    text: node.text,
                    collapsible: true,
                    collapsed: false,
                    items: convertDisplayTreeToSidebar(node.children)
                };
            } else {
                // 文件节点
                return {
                    text: node.text,
                    link: node.link
                };
            }
        });
    }
};

// 生成符合vitepress多侧边栏的sidebar结构
function buildSidebarByRouteKey(docDirs: ProcessedTreeNode[]) {
    const sidebarObj: Record<string, any> = {};
    docDirs.forEach(routeNode => {
        if (!routeNode.children) return;
        const routeKey = routeNode.text;
        const sidebarKey = `/${routeKey}/`;
        const items: any[] = [];
        // 只处理一级子目录和md文件
        const subDirs = (routeNode.children || []).filter(child => child.children && child.children.length > 0);
        const mdFiles = (routeNode.children || []).filter(child => !child.children || child.children.length === 0);
        // 先处理子目录
        subDirs.forEach(subDir => {
            // 只处理子目录下的md文件，忽略更深层目录
            const subMdFiles = (subDir.children || []).filter(child => !child.children || child.children.length === 0);
            items.push({
                text: subDir.text,
                collapsed: false,
                items: subMdFiles.map(md => ({
                    text: md.text,
                    link: ensureSlash(md.link)
                }))
            });
        });
        // 再处理当前目录下的md文件
        mdFiles.forEach(md => {
            items.push({
                text: md.text,
                link: ensureSlash(md.link)
            });
        });
        sidebarObj[sidebarKey] = items;
    });
    return sidebarObj;
}

function ensureSlash(link: string) {
    if (!link.startsWith('/')) return '/' + link;
    return link;
}

const saveTreeData = () => {
    if (storeVpconfig.IsUseManyLang) {
        // 多语言模式
        processedTreeData.value.forEach(langNode => {
            const langKey = langNode.text;
            const docDirs = langNode.children || [];
            const sidebar = buildSidebarByRouteKey(docDirs);
            if (storeVpconfig.vpConfig?.locales && storeVpconfig.vpConfig.locales[langKey]) {
                if (!storeVpconfig.vpConfig.locales[langKey].themeConfig) {
                    storeVpconfig.vpConfig.locales[langKey].themeConfig = {};
                }
                storeVpconfig.vpConfig.locales[langKey].themeConfig.sidebar = sidebar;
            }
        });
    } else {
        // 单语言模式，使用root语言键
        const rootKey = 'root';
        const docDirs = processedTreeData.value;
        const sidebar = buildSidebarByRouteKey(docDirs);
        if (storeVpconfig.vpConfig?.locales && storeVpconfig.vpConfig.locales[rootKey]) {
            if (!storeVpconfig.vpConfig.locales[rootKey].themeConfig) {
                storeVpconfig.vpConfig.locales[rootKey].themeConfig = {};
            }
            storeVpconfig.vpConfig.locales[rootKey].themeConfig.sidebar = sidebar;
        }
    }
    // 保存配置到文件
    storeVpconfig.saveConfig().then(() => {
        ElMessage.success('侧边栏配置已保存');
    }).catch(err => {
        ElMessage.error('保存失败: ' + err);
    });
};

// 提取初始化逻辑为独立函数
const refreshTreeData = () => {
    ParseToTree(storeVpconfig.FullSrcLangDir).then((data: docparse.DocsTreeNode) => {
        treeData.value = data;
        processedTreeData.value = convertTreeToDisplayTree(data, true);
        // 初始化sidebar数据
        const sidebar = convertTreeToSidebar(data, true);
        // 如果没有使用多语言，直接设置root的sidebar
        if (!storeVpconfig.IsUseManyLang) {
            const rootKey = 'root';
            if (storeVpconfig.vpConfig?.locales && storeVpconfig.vpConfig.locales[rootKey]) {
                if (!storeVpconfig.vpConfig.locales[rootKey].themeConfig) {
                    storeVpconfig.vpConfig.locales[rootKey].themeConfig = {};
                }
                storeVpconfig.vpConfig.locales[rootKey].themeConfig.sidebar = sidebar;
            }
        }
    }).catch(err => {
        console.error('解析文档树失败:', err);
        ElMessage.error('解析文档树失败');
    });
};

onMounted(() => {
    refreshTreeData();
});
</script>

<style scoped>
.sidebar-generator {
    padding: 15px;
}

.tree-container {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    padding: 15px;
}

.tree-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
}

.tree-content {
    margin-top: 10px;
}

.tree-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
}

.button-group {
    display: flex;
    align-items: center;
}
</style>
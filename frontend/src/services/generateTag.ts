import { useVpconfigStore } from "@/store/vpconfig";
import { WriteContentToFile } from "wailsjs/go/system/SystemService";
// @ts-ignore
import yaml from "js-yaml";
import { ParseDocsFontMatter } from "wailsjs/go/docparse/ParseService";
import { getFileNameFromPath } from "@/utils/utils";

interface ArticleItem {
  link: string;
  title: string;
  createAt: string;
  updateAt: string;
}

/**
 * 转义 HTML 字符，防止 XSS 注入
 */
function escapeHtml(str: string): string {
  return str.replace(
    /[&<>"']/g,
    (match) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[match]!
  );
}

/**
 * 格式化日期字符串
 */
function formatDateString(dateStr?: string): string {
  if (!dateStr) return "未设置日期";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "格式错误" : date.toISOString().split("T")[0];
}

/**
 * 构建标签页面的 HTML 内容
 */
function generateTagPageContent(tagName: string, articles: ArticleItem[]): string {
  const itemsHtml = articles
    .map(
      (item) => `<li class="article-item"><a href="${item.link}">
  <div class="article-row">
    <div class="article-meta">${formatDateString(item.updateAt)}</div>
    <div class="article-title">${escapeHtml(item.title)}</div>
  </div>
</a></li>`
    )
    .join("");

  return `
<ClientOnly>
  <div class="article-container">
    <div>
      <h1 class="page-title">tag:${escapeHtml(tagName)}</h1>
    </div>
    <ul class="article-list">
      ${itemsHtml}
    </ul>
  </div>
</ClientOnly>`;
}

export const generateTagService = {
  /**
   * 从 Wails 获取所有 Markdown 的 frontMatter 并生成 tag 页面
   */
  genTagPage: async () => {
    const storeVpConfig = useVpconfigStore();
    // 假设 ParseDocsFontMatter 是 Wails 提供的方法
    const mapData: Record<string, any> = await ParseDocsFontMatter(storeVpConfig.fullSrcDir);
    const tagData: Record<string, ArticleItem[]> = {};
    console.log(mapData, "mapData -- console.log");

    for (const path in mapData) {
      const frontMatter = mapData[path];
      let title = frontMatter.title ?? "未设置标题";
      if (title === "") {
        title = getFileNameFromPath(path);
      }
      const link = path.replace(storeVpConfig.fullSrcDir, "").replace(".md", "");
      const createAt = frontMatter.createAt ?? "未设置日期";
      const updateAt = frontMatter.updateAt ?? "未设置日期";

      const article: ArticleItem = {
        link,
        title,
        createAt,
        updateAt
      };

      const tags = frontMatter.tags;

      if (tags && Array.isArray(tags)) {
        tags.forEach((tag: string) => {
          if (!tagData[tag]) {
            tagData[tag] = [article];
          } else {
            tagData[tag].push(article);
          }
        });
      }
    }

    for (const tag in tagData) {
      try {
        const content = generateTagPageContent(tag, tagData[tag]);
        const fontMatter = {
          layout: "page",
          sidebar: false
        };
        const finalContent = `---\n${yaml.dump(fontMatter)}\n---\n${content}`;
        const filePath = `${storeVpConfig.fullSrcDir}/vpsimple/tags/${tag}.md`;
        console.log("filePath", filePath);
        console.log("finalContent", finalContent);
        WriteContentToFile(filePath, finalContent);
      } catch (err) {
        console.error(`Failed to generate tag page for "${tag}":`, err);
      }
    }
  }
};
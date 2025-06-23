import { createContentLoader } from 'vitepress'

// 使用createContentLoader API获取所有文章数据
const postsLoader = createContentLoader('**/*.md', {
  includeSrc: false,
  transform(rawData) {
    // 过滤掉可能不是文章的页面（如index.md, 404.md等）
    const articles = rawData.filter(page => {
      // 过滤掉首页和特殊页面
      const isSpecialPage = page.url === '/' || 
        page.url.includes('/index.html') || 
        page.url.includes('404');
      
      // 过滤掉vpsimple文件夹中的文件
      const isVpsimpleFile = page.url.includes('/vpsimple/');
      
      return !isSpecialPage && !isVpsimpleFile;
    });

    return articles.map(page => {
      // 提取frontmatter中的信息
      const { frontmatter, url } = page;
      
      return {
        title: frontmatter.title || getTitle(url),
        url: url,
        createdAt: frontmatter.createAt || frontmatter.updateAt || '',
        // 添加其他可能有用的数据
        description: frontmatter.description || '',
        tags: frontmatter.tags || []
      };
    });
  }
});

// 从URL中提取标题
function getTitle(url) {
  const segments = url.split('/');
  const lastSegment = segments[segments.length - 1].replace('.html', '');
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

// 导出默认的loader配置
export default postsLoader;

// 声明数据变量以便在组件中导入
// 注意：这个data将由VitePress在构建时填充
export const data = []; 
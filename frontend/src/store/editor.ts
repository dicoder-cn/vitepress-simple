import { defaultFrontMatter } from "@/configs/defaultFrontMatter";
import { ConfigKeyFrontMatterSaveType } from "@/constant/keys/config";
import { parseTagContent, regexScript, regexStyle } from "@/utils/parse";
import { replaceImageUrlToLocalStatic, replaceLocalStaticToImageUrl } from "@/utils/repalceStatic";
import { ToastError, ToastInfo } from "@/utils/Toast";
import { IsEmptyValue } from "@/utils/utils";
import matter from "gray-matter";
import { before } from "node:test";
import { defineStore } from "pinia";
import { ReadFileContent, WriteFileContent } from "wailsjs/go/services/ArticleTreeData";
import { ConfigGet } from "wailsjs/go/system/SystemService";
// @ts-ignore
import yaml from "js-yaml";
//这是一个简单的推荐store案例，可以在这里定义你的状态
//新建pinia时把editor全局替换成你的store名字

//文章内容=frontMatter+mdContent+vueContent
interface ArticleContent {
  isSave: boolean;
  frontMatter: any;
  scriptContent: string;//占位
  styleContent: string;//占位
  vueContent: string;//= scriptContent + styleContent
  path: string;//文章路径
  mdContent: string;//=frontMatter+mdContent
}

export interface editorStore {
  currArticleIndex: number;
  // currArticleContent: string;
  currArticle: ArticleContent;
  articleLists: ArticleContent[];
}

export const useEditorStore = defineStore("editor", {
  state: (): editorStore => ({
      currArticleIndex: -1,  // 初始化为 -1 表示没有选中任何文章
      // currArticleContent: "",
      // currArticlePath: "",
      currArticle: {} as ArticleContent,
      articleLists: [] as ArticleContent[]
  }),
  actions: {
    //切换当前打开的文章
    changeCurrArticleIndex(index: number) {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
        return;
      }
      // 确保索引有效
      if (index < 0 || index >= this.articleLists.length) {
        return;
      }
      // 更新当前文章索引和内容
      this.currArticleIndex = index;
      this.currArticle = this.articleLists[index];
    },
    //打开文章
    openArticle(path: string) {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
      }
      
      let articleIndex = this.articleLists.findIndex(item => item?.path === path);
      if (articleIndex !== -1) {//存在
        this.changeCurrArticleIndex(articleIndex);
      } else {
        //最大不能打开超过6个文章
        if (this.articleLists.length >= 6) {
          ToastError("最多只能打开6篇文章");
          return;
        } 
        const newArticle: ArticleContent = {
          path, 
          mdContent: "", 
          isSave: false,
          frontMatter: undefined,
          scriptContent: "",
          styleContent: "",
          vueContent: ""
        };
        this.articleLists.push(newArticle);
        articleIndex = this.articleLists.length - 1;
      }
      this.preHandlerOpenArticle(path,articleIndex);//预处理打开文章
      this.changeCurrArticleIndex(articleIndex);
    },
    initCurrArticle(){
      this.currArticle = {
        isSave: false,
        frontMatter: {},
        scriptContent: '',
        styleContent: '',
        vueContent: '',
        path: '',
        mdContent: ''
      };
    },
    //打开文章前处理
    async preHandlerOpenArticle(path: string,articleIndex:number) {
      const content = await ReadFileContent(path);
      let matterData = matter(content);
      let matchScriptArray = parseTagContent(matterData.content ?? "", regexScript);
      let matchStyleArray = parseTagContent(matterData.content ?? "", regexStyle);
      let scriptContent = matchScriptArray[0] ?? "";
      let styleContent = matchStyleArray[0] ?? "";
      let vueContent = (scriptContent + "\n" + styleContent).trim();
      //matter字符串
      this.articleLists[articleIndex].scriptContent = scriptContent;
      this.articleLists[articleIndex].styleContent = styleContent;
      this.articleLists[articleIndex].frontMatter = matterData.data;
      this.articleLists[articleIndex].vueContent = vueContent;
      let mdContent = (matterData.content ?? "")
      .replace(scriptContent, "")
      .replace(styleContent, "");
      mdContent = mdContent ? mdContent : "# hello vitePress client"
      //初始化文章的front matter
      this.initArticleFrontMatter(articleIndex);
      //相对路径转换成 域名替换
      let replaceMdContent = replaceLocalStaticToImageUrl(mdContent);
      this.articleLists[articleIndex].mdContent = replaceMdContent;
      //设置当前上下文
      this.changeCurrArticleIndex(articleIndex);
      console.log(this.currArticle, "currArticle -- console.log");
    },
    //设置当前文章front matter
    initArticleFrontMatter(articleIndex:number) {
      //当前文章的front matter
      const articleFrontMatter = this.articleLists[articleIndex].frontMatter;
      
      //设置默认的front matter
      for (const key in defaultFrontMatter) {
        if (IsEmptyValue(articleFrontMatter[key])) {
          articleFrontMatter[key] = defaultFrontMatter[key];
        }
      }
    
      //默认标题
      if (articleFrontMatter["title"] == ""){
        articleFrontMatter["title"]="test title";
      }
      //大纲需要是一个数组
      if (!Array.isArray(articleFrontMatter["outline"])) {
        articleFrontMatter["outline"] = [1, 3];
      }
      
    },
    //关闭文章
    closeArticle(path: string) {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
        return;
      }
      const articleIndex = this.articleLists.findIndex(item => item?.path === path);
      if (articleIndex !== -1) {
        this.articleLists.splice(articleIndex, 1);
        
        // 如果关闭的是当前文章，需要更新当前文章索引
        if (this.currArticleIndex === articleIndex) {
          // 如果还有其他文章，选择最后一篇
          if (this.articleLists.length > 0) {
            this.changeCurrArticleIndex(this.articleLists.length - 1);
          } else {
            // 如果没有文章了，重置状态
            this.currArticleIndex = -1;
            this.currArticle = {} as ArticleContent;
          }
        } else if (this.currArticleIndex > articleIndex) {
          // 如果关闭的文章在当前文章之前，需要更新索引
          this.currArticleIndex--;
        }
      }
    },
    //保存文章
    async saveArticle(articleIndex: number,showToast = true) {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
        return;
      }
      const articleItem = this.articleLists[articleIndex];
      
            const saveType = await ConfigGet(ConfigKeyFrontMatterSaveType);
            let fontMatterString = "";
            if (saveType == "yaml") { //默认
              fontMatterString = yaml.dump(articleItem.frontMatter);
            } else {
              fontMatterString = JSON.stringify(
               articleItem.frontMatter,
                null,
                4,
              );
            }
            let fullContent = `---\n${fontMatterString}\n---\n${articleItem.mdContent}\n${articleItem.vueContent}`;
           
            //替换域名为本地路径
            fullContent = replaceImageUrlToLocalStatic(fullContent);
            
            //获取动态新增的数据
            WriteFileContent(articleItem.path, fullContent).then(() => {
              if (showToast) ToastInfo("已保存");
            });



    },
    
    //保存所有文章
    saveAllArticle() {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
        return;
      }
      this.articleLists.forEach((item,index) => {
        if (item && !item.isSave) {
          this.saveArticle(index,false);
        }
      });
    },
    
  },
  getters: {
    isOpenArticle: (state): boolean => state.articleLists.length > 0 && state.currArticleIndex >= 0,
    getCurrArticleIndex: (state): number => state.currArticleIndex,
    getCurrArticle: (state): ArticleContent => state.currArticle,
    getArticleContents: (state): ArticleContent[] => 
      Array.isArray(state.articleLists) ? state.articleLists : [],
  },
});

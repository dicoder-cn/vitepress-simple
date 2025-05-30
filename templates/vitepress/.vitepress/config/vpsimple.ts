export const VpSimpleConfig = {
  "locales": {
    "root": {
      "lang": "root",
      "themeConfig": {
        "i18nRouting": true,
        "logo": "/images/logo.png",
        "sidebar": {
          "/sidebars/": [
            {
              "text": "sidebar-sub1",
              "collapsed": false,
              "items": [
                {
                  "text": "sidebar-sub1-article1",
                  "link": "/sidebars/sidebar-sub1/sidebar-sub1-article1"
                },
                {
                  "text": "sidebar-sub1-article2",
                  "link": "/sidebars/sidebar-sub1/sidebar-sub1-article2"
                }
              ]
            },
            {
              "text": "sidebar-sub2",
              "collapsed": false,
              "items": [
                {
                  "text": "sidebar-sub2-article3",
                  "link": "/sidebars/sidebar-sub2/sidebar-sub2-article3"
                },
                {
                  "text": "sidebar-sub2-article1",
                  "link": "/sidebars/sidebar-sub2/sidebar-sub2-article1"
                },
                {
                  "text": "sidebar-sub2-article2",
                  "link": "/sidebars/sidebar-sub2/sidebar-sub2-article2"
                }
              ]
            }
          ]
        },
        "nav": [
          {
            "text": "vpsimple",
            "link": "https://github.com/dicoder-cn/vitepress-simple"
          },
          {
            "text": "32",
            "items": [
              {
                "text": "323",
                "link": "/sidebar/1"
              },
              {
                "text": "212",
                "link": "/sidebar/1"
              }
            ]
          },
          {
            "text": "321",
            "items": [
              {
                "text": "212",
                "link": "2121"
              }
            ]
          }
        ],
        "socialLinks": [
          {
            "icon": "github",
            "link": "https://github.com/dicoder-cn"
          }
        ],
        "search": {
          "provider": "local",
          "options": {
            "appId": "",
            "apiKey": "",
            "indexName": "",
            "locales": {
              "zh": {
                "placeholder": "搜索文档",
                "translations": {
                  "button": {
                    "buttonText": "搜索文档",
                    "buttonAriaLabel": "搜索文档"
                  },
                  "modal": {
                    "searchBox": {
                      "resetButtonTitle": "清除查询条件",
                      "resetButtonAriaLabel": "清除查询条件",
                      "cancelButtonText": "取消",
                      "cancelButtonAriaLabel": "取消"
                    },
                    "startScreen": {
                      "recentSearchesTitle": "搜索历史",
                      "noRecentSearchesText": "没有搜索历史",
                      "saveRecentSearchButtonTitle": "保存至搜索历史",
                      "removeRecentSearchButtonTitle": "从搜索历史中移除",
                      "favoriteSearchesTitle": "收藏",
                      "removeFavoriteSearchButtonTitle": "从收藏中移除"
                    },
                    "errorScreen": {
                      "titleText": "无法获取结果",
                      "helpText": "你可能需要检查你的网络连接"
                    },
                    "footer": {
                      "selectText": "选择",
                      "navigateText": "切换",
                      "closeText": "关闭",
                      "searchByText": "搜索提供者"
                    },
                    "noResultsScreen": {
                      "noResultsText": "无法找到相关结果",
                      "suggestedQueryText": "你可以尝试查询",
                      "reportMissingResultsText": "你认为该查询应该有结果？",
                      "reportMissingResultsLinkText": "点击反馈"
                    }
                  }
                }
              },
              "en": {
                "placeholder": "Search docs",
                "translations": {
                  "button": {
                    "buttonText": "Search docs",
                    "buttonAriaLabel": "Search docs"
                  },
                  "modal": {
                    "searchBox": {
                      "resetButtonTitle": "Clear query",
                      "resetButtonAriaLabel": "Clear query",
                      "cancelButtonText": "Cancel",
                      "cancelButtonAriaLabel": "Cancel"
                    },
                    "startScreen": {
                      "recentSearchesTitle": "Recent searches",
                      "noRecentSearchesText": "No recent searches",
                      "saveRecentSearchButtonTitle": "Save search",
                      "removeRecentSearchButtonTitle": "Remove search",
                      "favoriteSearchesTitle": "Favorites",
                      "removeFavoriteSearchButtonTitle": "Remove from favorites"
                    },
                    "errorScreen": {
                      "titleText": "Unable to fetch results",
                      "helpText": "You may want to check your network connection"
                    },
                    "footer": {
                      "selectText": "select",
                      "navigateText": "navigate",
                      "closeText": "close",
                      "searchByText": "Search by"
                    },
                    "noResultsScreen": {
                      "noResultsText": "No results for",
                      "suggestedQueryText": "You can try searching for",
                      "reportMissingResultsText": "You think it should have results?",
                      "reportMissingResultsLinkText": "Click here to report it"
                    }
                  }
                }
              }
            }
          }
        },
        "outline": {
          "level": 3
        },
        "externalLinkIcon": true,
        "sidebarMenuLabel": "侧边栏",
        "editLink": {
          "text": "Edit on github",
          "pattern": "https://github.com/dicoder-cn"
        },
        "darkModeSwitchLabel": "Dark mode",
        "langMenuLabel": "Switch languages",
        "returnToTopLabel": "top",
        "lightModeSwitchTitle": "Light color mode",
        "darkModeSwitchTitle": "Dark mode",
        "docFooter": {
          "prev": "上一篇",
          "next": "下一篇"
        }
      },
      "label": "简体中文",
      "titleTemplate": "",
      "description": "快速搭建自己的知识库",
      "title": ""
    }
  },
  "description": "",
  "title": "Demo1",
  "srcDir": "./docs",
  "lang": "zh",
  "base": "/",
  "outDir": "./build",
  "cleanUrls": true,
  "sitemap": {
    "hostname": "Dicoder.cn"
  }
};

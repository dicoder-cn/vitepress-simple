export const VpSimpleConfig = {
  "locales": {
    "root": {
      "themeConfig": {
        "i18nRouting": true,
        "logo": "/images/logo.png",
        "sidebar": {
          "/sidebar/": [
            {
              "text": "demo1",
              "link": "/sidebar/demo1"
            },
            {
              "text": "demo2",
              "link": "/sidebar/demo2"
            },
            {
              "text": "demo3",
              "link": "/sidebar/demo3"
            },
            {
              "text": "demo4",
              "link": "/sidebar/demo4"
            },
            {
              "text": "demo5",
              "link": "/sidebar/demo5"
            },
            {
              "text": "demo6",
              "link": "/sidebar/demo6"
            },
            {
              "text": "tag-demo",
              "link": "/sidebar/tag-demo"
            },
            {
              "text": "big-image-demo",
              "link": "/sidebar/big-image-demo"
            }
          ],
          "/sidebar-many/": [
            {
              "text": "sidebar-sub1",
              "collapsed": false,
              "items": [
                {
                  "text": "demo1",
                  "link": "/sidebar-many/sidebar-sub1/demo1"
                },
                {
                  "text": "demo2",
                  "link": "/sidebar-many/sidebar-sub1/demo2"
                },
                {
                  "text": "demo3",
                  "link": "/sidebar-many/sidebar-sub1/demo3"
                }
              ]
            },
            {
              "text": "sidebar-sub2",
              "collapsed": false,
              "items": [
                {
                  "text": "demo1",
                  "link": "/sidebar-many/sidebar-sub2/demo1"
                },
                {
                  "text": "demo2",
                  "link": "/sidebar-many/sidebar-sub2/demo2"
                },
                {
                  "text": "demo3",
                  "link": "/sidebar-many/sidebar-sub2/demo3"
                }
              ]
            }
          ]
        },
        "nav": [
          {
            "text": "sidebar",
            "link": "/sidebar/demo1"
          },
          {
            "text": "sidebars",
            "link": "/sidebar-many/sidebar-sub1/demo1"
          },
          {
            "text": "friendship",
            "items": [
              {
                "text": "vpsimple",
                "link": "https://github.com/dicoder-cn/vitepress-simple"
              },
              {
                "text": "dicoder",
                "link": "http://dicoder.cn"
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
        "sidebarMenuLabel": "Sidebar",
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
          "prev": "Previous",
          "next": "Next"
        }
      },
      "lang": "root",
      "label": "简体中文",
      "titleTemplate": "",
      "description": "快速搭建自己的知识库",
      "title": ""
    }
  },
  "description": "",
  "title": "Demo2",
  "srcDir": "./docs",
  "lang": "zh",
  "base": "/",
  "outDir": "./build",
  "cleanUrls": true,
  "sitemap": {
    "hostname": "Dicoder.cn"
  }
};

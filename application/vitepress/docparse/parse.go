package docparse

import (
	"bufio"
	"encoding/json"
	"fmt"
	"gopkg.in/yaml.v3"
	"os"
	"path/filepath"
	"strings"
)

type DocsTreeNode struct {
	Name              string      //如:test 不带后缀
	IsMdFile          bool        //是否是文件
	MdFileFrontMatter FrontMatter //如果是文件，这里存放的是FrontMatter
	Path              string      //如:test/test.md 带后缀(如果是文件)相对路径
	FullPath          string      // 如:/user/data/test/test.md 带后缀绝对路径
	Children          []*DocsTreeNode
}

// FrontMatter  第一层key是绝对路径，第二个是FrontMatter对应的key
// 读取格式如[/user/data/test/test.md]["title"]="Docs with VitePress"
type FrontMatter map[string]any

type ParseService struct {
}

func NewParseService() *ParseService {
	return &ParseService{}
}

// ParseToTree 解析 root 文件夹下的文件为目录树
func (s *ParseService) ParseToTree(root string) (*DocsTreeNode, error) {
	absRoot, err := filepath.Abs(root)
	if err != nil {
		return nil, err
	}

	rootNode := &DocsTreeNode{
		Name:     filepath.Base(absRoot),
		IsMdFile: false,
		Path:     "",
		FullPath: absRoot,
	}

	err = filepath.Walk(absRoot, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// 排除以 . 开头的文件和文件夹
		if strings.HasPrefix(info.Name(), ".") {
			if info.IsDir() {
				return filepath.SkipDir // 跳过整个目录
			}
			return nil // 跳过单个文件
		}

		relPath, err := filepath.Rel(absRoot, path)
		if err != nil {
			return err
		}

		parts := strings.Split(relPath, string(os.PathSeparator))
		currentNode := rootNode

		for _, part := range parts {
			if part == "" {
				continue
			}
			var found bool
			for _, child := range currentNode.Children {
				if child.Name == part {
					currentNode = child
					found = true
					break
				}
			}
			if !found {
				newNode := &DocsTreeNode{
					Name:     part,
					IsMdFile: !info.IsDir() && strings.HasSuffix(info.Name(), ".md"),
					Path:     filepath.Join(currentNode.Path, part),
					FullPath: filepath.Join(currentNode.FullPath, part),
				}
				if newNode.IsMdFile {
					frontMatter, err := parseFrontMatter(newNode.FullPath)
					if err != nil {
						return err
					}
					// 尝试将 map[string]interface{} 转换为 docparse.FrontMatter
					var fm FrontMatter
					data, err := json.Marshal(frontMatter)
					if err != nil {
						return err
					}
					err = json.Unmarshal(data, &fm)
					if err != nil {
						return err
					}
					newNode.MdFileFrontMatter = fm
				}
				currentNode.Children = append(currentNode.Children, newNode)
				currentNode = newNode
			}
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return rootNode, nil
}

func (s *ParseService) ParseDocsFontMatter(root string) (FrontMatter, error) {
	result := make(FrontMatter)
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// 仅处理 .md 文件
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".md") {
			absPath, err := filepath.Abs(path)
			if err != nil {
				return err
			}
			frontMatter, err := parseFrontMatter(absPath)
			if err != nil {
				return err
			}
			if frontMatter != nil {
				result[absPath] = frontMatter
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return result, nil
}

// parseFrontMatter 解析单个文件的 front matter
func parseFrontMatter(filePath string) (any, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	// 跳过起始的 ---
	if !scanner.Scan() || scanner.Text() != "---" {
		return nil, nil
	}

	var frontMatterContent strings.Builder
	for scanner.Scan() {
		line := scanner.Text()
		if line == "---" {
			break
		}
		frontMatterContent.WriteString(line + "\n")
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("读取文件 %s 时出错: %w", filePath, err)
	}

	var frontMatter any
	err = yaml.Unmarshal([]byte(frontMatterContent.String()), &frontMatter)
	if err != nil {
		return nil, fmt.Errorf("解析文件 %s 的 front matter 时出错: %w", filePath, err)
	}

	return frontMatter, nil
}

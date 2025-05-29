package vpsimpler

import (
	"embed"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"wailstemplate/application/constant/cnts"
	"wailstemplate/application/constant/keys"
	"wailstemplate/application/pkg/cfg"
	"wailstemplate/application/pkg/filehelper"
	"wailstemplate/application/pkg/utils"
)

type VpManager struct {
	//fs
	fs embed.FS
}

func NewVpManager(fs_ embed.FS) *VpManager {
	return &VpManager{fs: fs_}
}

func (s *VpManager) CreateProject(dir string, replaceData map[string]map[string]string) string {
	//1.检查node环境
	//if !NodejsIsInstall() {
	//	return "环境监测不通过：nodejs is not install"
	//}
	//if !NpmIsInstall() {
	//	return "环境监测不通过：npm is not install"
	//}

	//2.获取node版本
	//if !strings.Contains(GetNodeVersion(), "v18") {
	//	return "环境监测不通过：nodejs 版本必须是v18及以上版本"
	//}

	//3.检查目录
	if !filehelper.FileExists(dir) {
		return "目录检查不通过,目录不存在：" + dir
	}

	//4.复制模板文件到目标目录
	//replaceData := map[string]map[string]string{
	//	"package.json": { //替换版本号
	//		"{version}": vpVersion,
	//	},
	//}
	s.CopyTemplateFile(dir, filepath.Join(cnts.TemplateRootDir), replaceData)

	//5.设置当前项目目录为新建的目录
	cfg.Set(keys.ConfigKeyProjectDir, dir)

	//6.检查是否复制成功：看看配置文件是否存在
	vpConfig := NewVpConfig()
	_, err := vpConfig.GetConfigPath()
	if err != nil {
		return err.Error()
	}

	//7.获取默认的配置文件内容替换标题描述
	//defaultConfigContent := vpConfig.ReplaceDefaultConfigContent(title, description)

	//8.保存配置文件
	//vpConfig.SaveConfig(defaultConfigContent)

	return ""
}

// CopyTemplateFile 复制模板文件到新建项目
// replaceData ,要替换的路径和数据，key是文件路径，value是一个映射，键为要替换的数据，值为替换后的内容
func (s *VpManager) CopyTemplateFile(targetDir string, templateDir string, replaceData map[string]map[string]string) {

	fmt.Println("替换内容：", utils.DataToJsonStr(replaceData))
	err := fs.WalkDir(s.fs, templateDir, func(path string, d fs.DirEntry, err error) error {

		//<当前文件鞋带完整路径> templates/vitepress/package.json
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil // 跳过目录，仅处理文件
		}

		// 打开嵌入的文件
		fileData, err := s.fs.ReadFile(path)
		if err != nil {
			return err
		}

		// 检查当前文件路径是否在 replaceData 中
		pathKey := strings.ReplaceAll(path, templateDir, "")
		//如果pathKey首个字符是/，则去掉
		if strings.HasPrefix(pathKey, "/") {
			pathKey = pathKey[1:]
		}
		//fmt.Println("<当前文件>", pathKey)
		if replacements, ok := replaceData[pathKey]; ok {

			content := string(fileData)
			for oldStr, newStr := range replacements {
				// 替换文件内容
				content = strings.ReplaceAll(content, oldStr, newStr)
				//fmt.Println("开始替换内容：", pathKey, oldStr, newStr)
			}
			fileData = []byte(content)
		}

		// 计算目标路径（假设目标目录为 "./output"）
		targetPath := filepath.Join(targetDir + path[len(templateDir):])
		// 创建包含所有上级目录的本地文件
		err = os.MkdirAll(filepath.Dir(targetPath), 0755)
		if err != nil {
			return err
		}

		// 创建本地文件用于写入嵌入的文件内容
		localFile, err := os.Create(targetPath)
		if err != nil {
			return err
		}
		defer localFile.Close()

		// 将嵌入的文件内容写入到本地文件
		_, err = localFile.Write(fileData)
		if err != nil {
			return err
		}

		// 确保所有数据已刷新到磁盘
		err = localFile.Sync()
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		panic(err)
	}
}

// GetNodeVersion 获取nodejs版本，如 v18.14.2
func (s *VpManager) GetNodeVersion() string {
	return GetNodeVersion()
}

// GetNpmVersion 获取npm版本，如 8.19.2
func (s *VpManager) GetNpmVersion() string {
	return GetNpmVersion()
}

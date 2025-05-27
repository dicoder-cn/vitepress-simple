package mytest

import (
	"fmt"
	"testing"
	"wailstemplate/application/services/system"
	"wailstemplate/application/vitepress/docparse"
)

func TestCopy(t *testing.T) {
	sys1 := system.NewSystemService()
	sys1.CopyPath(`E:\cach\my1\package.json`, `E:\cach\myBak\package.json`, true)
}

func TestParseDir(t *testing.T) {
	parser := docparse.NewParseService()
	rootPath := "/Users/ddd-mac/SyncData/Blog/docs" // 替换为你的目标目录路
	treeData, err := parser.ParseToTree(rootPath)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(treeData)
}

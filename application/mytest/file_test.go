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
	rootPath := "/Volumes/DK512/Home/dicoder/projects/test/VPSimpleProject/docs" // 替换为你的目标目录路径
	matter, err := parser.ParseDocsFontMatter(rootPath)
	if err != nil {
		return
	}

	for path, fm := range matter {
		fmt.Printf("File: %v\n", path)
		fmt.Printf("Data: %v\n", fm)
	}
}

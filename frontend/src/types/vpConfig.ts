

//vitepress-客户端的自定义配置
export interface VpSimpleConfig{
    shellBaseDir: string; 
    gitBaseDir: string;
    cmdDocsDev: string;
    cmdDocsBuild: string;
    cmdNpmInstall: string;
    cmdGitInit: string;
    cmdGitPull: string;
    cmdGitAdd: string;
    cmdGitCommit: string;
    cmdGitPush: string;
}

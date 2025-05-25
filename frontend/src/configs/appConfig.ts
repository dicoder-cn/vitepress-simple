import { 
    ConfigKeyProjectDir,
    ConfigKeyIsStartup,
    ConfigKeySysUpdateSource,
    ConfigKeyHistoryProject,
    ConfigKeyLayoutNavBgColor,
    ConfigKeyChangeAutoSave,
    ConfigKeyFrontMatterSaveType,
    ConfigKeySysStaticServerPort,
    ConfigKeySysProjectStaticDirName,
    ConfigKeyVditorCdn,
    ConfigKeyLang,
    ConfigKeySysProgramIsOpen
} from "@/configs/appConfigKey";
import { useAppConfigStore } from "@/store/appconfig";
import { ConfigGetAll, ConfigSetDefault } from "wailsjs/go/system/SystemService";


//初始化配置
export const InitAppConfig = ()=>{
    const storeAppConfig = useAppConfigStore();

    ConfigGetAll().then((res:Record<string, any>)=>{
        storeAppConfig.data = res;
        console.log("all config",res);
        storeAppConfig.defaultData = appConfigDefault;
    })
    //检查和设置配置初始值
    ConfigSetDefault(appConfigDefault);
}

//默认配置
export const appConfigDefault: Record<string, any> = {
    ConfigKeyIsStartup:"no",//是否开机启动
    ConfigKeyProjectDir:"",//项目目录
    ConfigKeySysUpdateSource:"github",//自动更新源
    ConfigKeyHistoryProject:"[]",//历史项目
    ConfigKeyLayoutNavBgColor:"#ebebeb",//左侧导航栏背景颜色
    ConfigKeyChangeAutoSave:"no",//切换文件时自动保存
    ConfigKeyFrontMatterSaveType:"json",//frontMatter保存格式
    ConfigKeySysStaticServerPort:"9874",//项目的静态资源（图片）服务器端口
    ConfigKeySysProjectStaticDirName:"static",//项目静态资源目录名
    ConfigKeyVditorCdn:"zstatic",//Vditor CDN
    ConfigKeyLang:"zh",//语言
    ConfigKeySysProgramIsOpen:"no",//程序是否打开
}
    
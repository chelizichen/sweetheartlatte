import { ChildProcess } from "node:child_process";
import { T_Yaml } from "./yaml"

export namespace T_ConnPool{
    interface MainProcess{
        // 初始化链接池
        startConnect(config:T_Yaml.Config):void;
        // 自动检测上报
        autoMoniter():void;
        // 处理信息
        onSendData(invokePkg:invokePkg):void;
        // 优雅升级
        onUpdate(updateConfig:T_Yaml.Servant_Config):boolean;
        // 优雅关闭
        onClose(closeConfig:T_Yaml.Servant_Config):boolean;
        // 监听端口
        onListen(main:T_Yaml.Config['main']):void;
        onData(data:any):void;
    }

    interface ServerProcess{
        // create(servant:T_Yaml.Servant_Config):ChildProcess;
        onRcvReq(request:rcvPkg):void;
        // onSendReq(request:rcvPkg):void;
        getInterface(methodName:string):Function;
        registerInterface(methodName:string,fn:Function):void;
    }

    type invokePkg = {
        head:{
            reqId:string;
            servantName:string;
            url:string;
            method:string;
        },
        message:any
    }

    type rcvPkg = {message:any;reqId:string;method:string}

}
import { ChildProcess, fork } from "child_process";
import { ConnectionError, RespError } from "../repo_errors";
import { T_ConnPool } from "../repo_types/conn";
import { T_Yaml } from "../repo_types/yaml";
import path from "path";
import L_YAML from "../config_yaml";
import LATTE from '../conn_proto';
import { EventEmitter } from "stream";
import { cwd } from "process";
import L_ServerProcess from "./server";

export default class L_MainProcess implements T_ConnPool.MainProcess{
    servantContainers:Map<T_Yaml.serverName,ChildProcess> = new Map();
    events = new EventEmitter();
    config:T_Yaml.Config;
    constructor(){
        process.env.SERVICE_RELATION = "main";
        const config = new L_YAML();
        this.config = config.Config;
        this.startConnect(this.config);
        const main = config.Config.main;
        this.onListen(main)
    }


    async onListen(main: Omit<T_Yaml.Servant_Config, "serverName" | "path">) {
      if(main.protocol == "http"){
        const svr = LATTE.createHttpServer(main)
        svr.post<{
            Body:{
                servantName:string;
                message:any;
                method:string;
            }
        }>('/api',(request, reply) => {
            const body  = request.body;
            const reqId = request.id;
            const url = request.url;
            const servantName = body.servantName;
            const message = body.message;
            const method = body.method;
            this.events.on(reqId,function(data){
                reply.send(data)
            })
            const invokePkg = {
                head:{
                    reqId,
                    servantName,
                    url,
                    method
                },
                message
            }
            this.onSendData(invokePkg);
        })
        await svr.listen({
            port:main.port,
        });  
    }
      if(main.protocol == "latte"){
        LATTE.createLatteServer(main)
      }
    }
    
    startConnect(config: T_Yaml.Config): void {
        for(const k in config.servants){
            try{
                const v: T_Yaml.Servant_Config = config.servants[k];
                const server = L_ServerProcess.FORK(k,v);
                server.on('message',this.onData.bind(this))
                this.servantContainers.set(k,server);
            }catch(e){
                throw ConnectionError();
            }
        }
    }
    onSendData(invokePkg: T_ConnPool.invokePkg): void {
        const servant = this.servantContainers.get(invokePkg.head.servantName);
        servant?.send({
            message :   invokePkg.message,
            reqId   :   invokePkg.head.reqId,
            method  :   invokePkg.head.method,
        })
    }

    onData(data:any){
            console.log('data',data);
            const {reqId,resp} = data.message;
            this.events.emit(reqId,resp);
    }
    autoMoniter(): void {
        throw new Error("Method not implemented.");
    }
    onUpdate(updateConfig: T_Yaml.Servant_Config): boolean {
        throw new Error("Method not implemented.");
    }
    onClose(closeConfig: T_Yaml.Servant_Config): boolean {
        throw new Error("Method not implemented.");
    }

}
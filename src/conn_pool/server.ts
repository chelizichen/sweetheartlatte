import { ChildProcess, fork } from "child_process";
import { ConnectionError, RespError } from "../repo_errors";
import { T_ConnPool } from "../repo_types/conn";
import { T_Yaml } from "../repo_types/yaml";
import path from "path";
import { cwd } from "process";

export default  class L_ServerProcess implements T_ConnPool.ServerProcess{
    public Servant : T_Yaml.Servant_Config
    public ServiceName:string;
    public FnMaps = new Map();

    constructor(serviceName:string,servant: T_Yaml.Servant_Config){
        process.env.SERVICE_RELATION = "child";
        this.Servant = servant;
        this.ServiceName = serviceName;
        process.on('message',this.onRcvReq.bind(this))
        process.on('error', (err) => {
            console.error(`Child process ${servant.path} encountered an error:`, err);
        });
        process.on('uncaughtException',(err)=>{
            console.error(`Child process ${servant.path} encountered an error:`, err);
        })
        process.on('unhandledRejection',(err)=>{
            console.error(`Child process ${servant.path} encountered an error:`, err);
        })
    }

    static FORK(SERVICE_NAME:string,servant: T_Yaml.Servant_Config){
        const TARGET_PATH = process.env.TARGET_PATH as string;
        const serverRealPath = path.resolve(cwd(),TARGET_PATH,servant.path);
        // start child process
        const childService = fork(serverRealPath,[],{
            env:{
                SERVICE_NAME:SERVICE_NAME,
                SERVICE_CONFIG:JSON.stringify(servant),
                SERVICE_RELATION:'child',
                ...process.env
            },
            execArgv:['-r', 'ts-node/register/transpile-only']
        });
        console.log(childService.connected);
        
        return childService;
    }

    getInterface(methodName: string): Function {
        return this.FnMaps.get(methodName);
    }
    registerInterface(methodName: string, fn: Function): void {
        this.FnMaps.set(methodName,fn);
    }
 
    // child process recieve data
    onRcvReq(request: T_ConnPool.rcvPkg): void {
        const vm = this;
        const { message,method,reqId } = request;
        const fn = vm.getInterface(method);
        const resp = fn(message)
        try{
            console.log(process.send);
            process.send!({
                message:{
                    resp,
                    reqId
                }
            })
        }catch(e){
            throw RespError()
        }

        // fn(message).then(resp=>{
        //     vm.ServerProcess.send!({
        //         message:{
        //             resp,
        //             reqId
        //         }
        //     })
        // })
    }
}
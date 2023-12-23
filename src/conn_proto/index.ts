import { T_Yaml } from "../repo_types/yaml";
import Fastify, { RequestParamsDefault } from "fastify";

class LATTE{
    static createHttpServer(main: Omit<T_Yaml.Servant_Config, "serverName" | "path">){
        const svr = Fastify({logger:true});
        return svr
    }
    static createLatteServer(main:Omit<T_Yaml.Servant_Config, "serverName" | "path">){

    }
}

export default LATTE
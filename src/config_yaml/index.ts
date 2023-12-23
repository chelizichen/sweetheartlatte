import { T_Yaml } from "../repo_types/yaml";
import yaml from 'yaml'
import fs from 'fs'
import path from 'path';
import { cwd } from "process";

class L_YAML implements T_Yaml.Base{
    Config:T_Yaml.Config;
    constructor(){
        const mode = process.env.LATTE_MODE;
        this.Config = this.parseConfig(mode as any);
    }
    parseConfig(mode: "prod" | "dev"): T_Yaml.Config {
        // 读取 YAML 配置文件
        const latteConfig = path.resolve(cwd(),"test_v2", `latte.${mode}.yaml`)
        const configFile = fs.readFileSync(latteConfig, 'utf8');
        const config = yaml.parse(configFile);
        return config as T_Yaml.Config;
    }
}

export default L_YAML
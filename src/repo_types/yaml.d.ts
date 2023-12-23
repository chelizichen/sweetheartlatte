export namespace T_Yaml{
    type serverName = string;
    type Config = {
        main:Omit<Servant_Config,"serverName"|"path">,
        servants:Record<serverName,Servant_Config>
    }
    type Servant_Config = {
        protocol:string;
        port:number;
        host:string;
        path:string;
        url:string;
    }

    interface Base{
        parseConfig(mode:"prod"|"dev"):Config;
    }
}
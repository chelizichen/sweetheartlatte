import L_ServerProcess from "../../src/conn_pool/server";

function hello(){
  return {
    msg:"ok"
  }
}
function greet(){
  return {
    msg:"resp success!"
  }
}

function initLatteServer(){
  const serviceName = process.env.SERVICE_NAME as string;
  const  servant = JSON.parse(process.env.SERVICE_CONFIG as string);
  const svr = new L_ServerProcess(serviceName,servant);
  svr.registerInterface('hello',hello);
  svr.registerInterface('greet',greet);
  console.log('cacheServer init Success');
}

initLatteServer()
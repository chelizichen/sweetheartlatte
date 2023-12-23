// @ts-nocheck
const { fork } = require("child_process")
const path = require("path")
const fs = require('fs')
const yaml = require('yaml')
// 读取 YAML 配置文件
const latteConfig = path.resolve(__dirname, 'latte.dev.yaml')
const configFile = fs.readFileSync(latteConfig, 'utf8');
const config = yaml.parse(configFile);

// 主进程
console.log('Main process started.');
console.log('config.servants', config.servants);
// 启动子进程
const servants = [];
for (const [serviceName, serviceConfig] of Object.entries(config.servants)) {
    const servicePath = path.resolve(__dirname, serviceConfig.path);
    const child = fork(servicePath, [], {
        env: {
            SERVICE_NAME: serviceName,
            SERVICE_CONFIG: JSON.stringify(serviceConfig),
            ...process.env
        },
        execArgv: ['-r', 'ts-node/register/transpile-only'],
    });
    // 将配置发送给子进程
    child.send({ message:serviceConfig });

    servants.push(child);
}

// 监听子进程消息
servants.forEach((child) => {
    child.on('message', (msg) => {
        console.log(`Message from  process:`, msg);
    });
    child.on('error', (err) => {
        console.error(`Child process ${child.env.SERVICE_NAME} encountered an error:`, err);
    });
});
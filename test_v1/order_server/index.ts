// @ts-nocheck

// child_process.js

// 接收主进程发送的配置
console.log('process.env.SERVICE_CONFIG', process.env.SERVICE_CONFIG);
const serviceConfig = JSON.parse(process.env.SERVICE_CONFIG);
console.log('serviceConfig', serviceConfig);
// 向主进程发送消息
let index = 0
process.send({ message: `Child process ${serviceConfig.path} started. ${index ++ }` });

// Check for errors
process.on('error', (err) => {
  console.error(`Child process ${serviceConfig.path} encountered an error:`, err);
});

process.on('message', (msg) => {
  console.log('Message from main process:', msg);
});
const {parentPort}  = require('worker_threads');

// 监听父进程发送的消息
parentPort?.on('message', (message) => {
  console.log('Message from parent:', message);

  // 向父进程发送消息
  parentPort?.postMessage({ response: 'Hello from worker!' });
});
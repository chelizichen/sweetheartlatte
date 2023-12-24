const { isMainThread, Worker } = require('worker_threads');
const path = require('path');


function createWorker(index) {
  return new Promise((resolve) => {
    const REAL_PATH = path.resolve(__dirname, `./worker.js`);
    console.log('REAL_PATH', REAL_PATH);

    const worker = new Worker(REAL_PATH, { workerData: { workerId: index } });

    // 向子线程发送数据
    const dataToSend = { message: `Hello from parent to Worker ${index}!` };
    worker.postMessage(dataToSend);

    // 监听子线程发送的消息
    worker.on('message', (message) => {
      console.log(`Message from Worker ${index}:`, message);

      // 结束子线程
      worker.terminate();
      resolve();
    });
  });
}

async function main() {
  if (isMainThread) {
    // 在主线程中

    const numWorkers = 3; // 设置子线程数量

    // 创建多个子线程
    const workerPromises = [];
    for (let i = 0; i < numWorkers; i++) {
      workerPromises.push(createWorker(i));
    }

    // 等待所有子线程完成
    await Promise.all(workerPromises);

    // 主线程结束
    console.log('All workers completed.');
  }
}

main();

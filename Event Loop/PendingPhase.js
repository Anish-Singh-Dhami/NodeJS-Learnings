const fs = require('fs');

fs.readFile('ThreadPool.js', (err, data) => {
  console.log('I/O callback:');
//   console.log("data : ", data);
});

setTimeout(() => {
  console.log('Timer callback');
}, 0);
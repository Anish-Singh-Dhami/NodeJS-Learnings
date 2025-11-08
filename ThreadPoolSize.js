const crypto = require("node:crypto");

// Increasing libuv thread pool size, default size is 4 threads.
process.env.UV_THREADPOOL_SIZE = 8; // Should be around the size of total CPU cores, greater than that impacts the average time (increases).
const MAX_CALLS = 32; // Default thread pool size : 4  

let start = Date.now();
for(let i = 0; i < MAX_CALLS; i++) {
    crypto.pbkdf2("test_password", "test_salt", 100000, 512, "sha512", (err, key) => {
        console.log(`Time take to hash password ${i+1} asynchronously: `, Date.now() - start);
    });
}

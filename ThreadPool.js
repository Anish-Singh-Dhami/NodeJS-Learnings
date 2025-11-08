const crypto = require("node:crypto");
const fs = require("node:fs")

console.log("First");

// JS main thread will offload the blocking task to `libuv`.
// libuv has a pool of threads, which can run these time consuming tasks separately to unblock main thread.

// I/O Task

// Async read file
fs.readFile(__filename, "utf-8", (err, data) => {
    console.log("File Read complete...")
})


// CPU Intensive Task
const MAX_CALLS = 4; // Default thread pool size : 4  

// Sync task, will execute sequentailly 
let start = Date.now();
for(let i = 0; i < MAX_CALLS; i++) {
    crypto.pbkdf2Sync("test_password", "test_salt", 100000, 512, "sha512");
    console.log(`Time take to hash password ${i+1} synchronously : `, Date.now() - start);
}

// Async version: 
start = Date.now();
for(let i = 0; i < MAX_CALLS; i++) {
    crypto.pbkdf2("test_password", "test_salt", 100000, 512, "sha512", (err, key) => {
        console.log(`Time take to hash password ${i+1} asynchronously: `, Date.now() - start);
    });
}

console.log("Last");

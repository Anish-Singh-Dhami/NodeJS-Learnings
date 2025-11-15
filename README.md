## NodeJS Runtime
Components required to run js outside browser (on machines like other programming langs), these components are :
1. __V8 JS engine__ -> (Written in C++) To parse, executes, and garbage collect JS code.
2. __libuv library__ -> (Written in C) Handles async I/O, provide Event-Loop (Event-Driven architecture) & Thread Pool for concurrent operations (File sys access, Networking).
3. __JS libraries__ -> {fs, http, os, streams, timers, paths, events} these JS libraries / modules to tap into above C/C++ features from JS code 

> JS is synchronous, blocking, single-threaded language. 

### Thread Pool
In order to perform **some** heavy, blocking operations JS main thread can delegate those task to the pool of Worker Threads provided by libuv (default size: 4).   
It perform non-blocking I/O operations that lacks native asynchronous **OS** level APIs. 

Not all I/O is natively asynchronous at the OS level.

1. **Network I/O (like sockets)**: OS already provides async mechanisms [`epoll`(linux), `kqueue`(macos), `IOCP`(windows)].  
    * libuv can just register callbacks directly — no threads needed.
2. **File system I/O** → Many OSes (especially Linux/macOS) don’t have async file APIs.  
    * libuv must offload file reads/writes to a worker thread to avoid blocking the main event loop.  

Whenever possible, libuv will use native async mechanisms in the OS to avoid blocking the main thread.

<hr>

#### Example Code Snippet

```JS
console.log("First")
fs.readFile(__filename, "utf-8", ()=>{
    console.log("Second")
})
console.log("Third")
```
```cmd
# Output :
First
Third
Second
```

Since `fs.readfile()` is an async function, js main thread will offload it to `libuv` where a worker thread finish the job (like read a file in this example).

### 🙋🏼‍♂️ Questions
1. After completing the async task how will libuv hand over the callback to NodeJS to put it inside the call stack for its execution? 
    - Will it wait for the call stack to become empty and then push that callback to execute it?
    - OR will it interrupts the normal flow of code execution to run the callback? 
2. If 2 or more async task such as `setTimeout()`, `readfile()`, `crypto.pkdf2()` etc completes at the same time, how does Node decide which callback function to execute first on the call stack?
    - Will it follows FIFO principle?
    - Or is there any priority given to one over the other?

### 🧠 Solution (Event Loop)
- A C program, which is up and running till our NodeJs code is under execution.
- It enbales NodeJS to perform **Non-Blocking I/O** operations (despite JS runs in Single thread)
- It Operates in phases, each with its own **queue** of **callbacks** to process on completion.
### Phases Of Event Loop
#### 1. Timer Phase: 
- Handles callbacks from `setTimeout()` and `setInterval()` whose delay has expired.
- These callbacks are placed inside **Timers Queue**.
``` JS
setTimeout(cb, timeOut);

setInterval(cb, timeInterval);
```
##### 2. Pending Phase:
- During the [polling phase](#4-poll-phase "Polling phase of event loop"), the event loop polls for events such as file and network I/O operations.
- Loop processes some of the polled events within the poll phase and defers specific events to the pending phase in the next iteration of the event loop.

    >In short, the pending phase executes I/O callbacks that were postponed from a previous cycle, before the event loop starts polling for new events.

##### 3. Idle/Prepared Phase:
- This phase is used internally by NodeJS, we can’t use it directly.

##### 4. Poll Phase:
- Responsible for retrieving new I/O events (like network requests, file system operations, etc.) and executing their corresponding callbacks.
- It's the only phase that interacts directly with OS I/O events.

    > When the event loop enters the Poll phase and there are **no pending timers** or `setImmediate()` callbacks, it will block and wait for new I/O events to arrive. This blocking is done using underlying system calls (like `select()`, `epoll()`, or `kqueue()` depending on the OS), which efficiently wait for I/O readiness without consuming CPU cycles.

##### 5. Check Phase:
- Execute callbacks immediately after the poll phase has completed
    > Generally, as the code is executed, the event loop will eventually hit the poll phase where it will wait for an incoming connection, request, etc. However, if a callback has been scheduled with `setImmediate()` and the poll phase becomes idle, it will end and continue to the check phase rather than waiting for poll events.

##### 6. Close Phase: 
> If a socket or handle is closed abruptly (e.g. `socket.destroy()`), the `close` event will be emitted in this phase. Otherwise it will be emitted via `process.nextTick()`.

### Microtask Queue

#### 1. Next Tick Queue: `process.nextTick()`
> `process.nextTick()` is not technically part of the event loop. Instead, the nextTickQueue will be processed after the current operation is completed, regardless of the current phase of the event loop.

#### 2. Promise Queue: `Promise`
- It execute their callbacks immediately after the current JavaScript job, but before the event loop continues.
- It ensures, a promise continuation (e.g., .then) must run as soon as possible
but never during the synchronous execution context.
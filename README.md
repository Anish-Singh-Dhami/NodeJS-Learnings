## NodeJS Runtime
Components required to run js outside browser (on machines like other programming langs), these components are :
1. __V8 JS engine__ -> (Written in C++) To parse, executes, and garbage collect JS code.
2. __libuv library__ -> (Written in C) Handles async I/O, provide Event-Loop (Event-Driven architecture) & Thread Pool for concurrent operations (File sys access, Networking).
3. __JS libraries__ -> {fs, http, os, streams, timers, paths, events} these JS libraries / modules to tap into above C/C++ features from JS code 

JS is synchronous, blocking, single-threaded language. 

### Thread Pool
In order to perform **some** heavy, blocking operations JS main thread can delegate those task to the pool of Worker Threads provided by libuv (default size: 4).   
It perform non-blocking I/O operations that lacks native asynchronous **OS** level APIs. 

Not all I/O is natively asynchronous at the OS level.

1. **Network I/O (like sockets)**: OS already provides async mechanisms [epoll(linux), kqueue(macos), IOCP(windows)].  
    * libuv can just register callbacks directly — no threads needed.
2. **File system I/O** → Many OSes (especially Linux/macOS) don’t have async file APIs.  
    * libuv must offload file reads/writes to a worker thread to avoid blocking the main event loop.  

Whenever possible, libuv will use native async mechanisms in the OS to avoid blocking the main thread.

### Event Loop

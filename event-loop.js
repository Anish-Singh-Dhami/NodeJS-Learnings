/**
 * Runtime : Components required to run js outside browser (on machine like other programming langs)
 * These components are :
 * 1. V8 JS engine -> To parse, executes, and garbage collect JS code (written in C++)
 * 2. libuv library -> Provide async I/O (Written in C) and Event-Loop (Event-Driven architecture) for concurrent operations (File sys access, Networking).
 * 3. JS libraries -> {fs, http, os, streams, timers, paths, events} these JS libraries / modules to tap into above C/C++ features from JS code 
 */
(() => {
    console.log("Hello World!");
})()

// JS is synchronous, blocking, single-threaded language.
// To make it async, it uses libuv(library for async I/O)
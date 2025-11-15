// The timers api will only be executed (after their timers gets over) 
// once the event loop is idle / call stack is empty
// i.e, Apis will runs only after the timer is expires, not exectly when it expires.
const first = () => console.log("First");
const second = () => console.log("\nFinally Second");
const third = () => console.log("Third (Event Loop Blocking operation)");

setTimeout(second, 0);
first();
third();

let count = 0;
const cb = () => {
    count++;
    console.log("Interval method!");
    if(count >= 5) {
        clearInterval(interval);
    }
}
const interval = setInterval(cb, 0);

const startTime = new Date();
const delay = 2000;
const endTime = new Date(startTime.getTime() + delay);

// Block the event loop, and setTimeout() won't gets execute till event loop is free.
while(new Date() <= endTime) {
    third();
}

// Follow FIFO (no race condition)
setTimeout(() => console.log("1st"), 600);
setTimeout(() => console.log("2nd"), 600);
setTimeout(() => console.log("3rd"), 600);
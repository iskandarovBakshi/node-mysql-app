const socket = io();

socket.on("connect", (s) => {
    console.log("Connected!");
});
// handle the event sent with socket.send()
socket.on("message", data => {
    console.log(data);
  });
socket.on("data", (data) => {
    console.log(data);

    document.body.innerHTML = (`<pre>${JSON.stringify(data, undefined, 2)}</pre>`)

});
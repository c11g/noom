const socket = new WebSocket(`ws://${location.host}`);
const chatList = document.querySelector("#chatList");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const nicknameSpan = document.querySelector("#nickname");
const nicknameInput = document.querySelector("#nicknameInput");
const nicknameButton = document.querySelector("#nicknameButton");
let nickname = "Anonymous";

socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

socket.addEventListener("message", (event) => {
  const p = document.createElement("p");
  p.innerText = event.data;
  chatList.appendChild(p);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value;

  socket.send(
    JSON.stringify({
      nickname,
      message,
    })
  );
  input.value = "";
});

nicknameButton.addEventListener("click", () => {
  if (!nicknameInput.value) return;
  nickname = nicknameInput.value;
  nicknameSpan.innerHTML = nickname;
  nicknameInput.value = "";
});

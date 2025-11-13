"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io({
  path: "/api/socket_io",
});

type Message = {
  userName: string;
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("mensagensAnteriores", (msgs: Message[]) => setMessages(msgs));
    socket.on("chegouMensagemNova", (msg: Message) =>
      setMessages((prev) => [...prev, msg])
    );
    return () => {
      socket.off("mensagensAnteriores");
      socket.off("chegouMensagemNova");
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !text.trim()) return;
    const msg = { userName, text };
    socket.emit("novaMensagem", msg);
    setMessages((prev) => [...prev, { ...msg, userName: "eu" }]);
    setText("");
  };

  return (
    <main>
      <ul id="messages">
        {messages.map((m, i) => (
          <li key={i}>
            {m.userName}: {m.text}
          </li>
        ))}
      </ul>

      <form id="message-form" onSubmit={sendMessage}>
        <input
          id="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Seu nome"
        />
        <input
          id="message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite a mensagem"
        />
        <input type="submit" value="Enviar" />
      </form>
    </main>
  );
}

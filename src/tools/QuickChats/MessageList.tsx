import { For } from "solid-js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = (props: MessageListProps) => {
  return (
    <div class="message-list" style={{ "overflow-y": "auto", flex: 1, padding: "10px" }}>
      <For each={props.messages}>
        {(message) => (
          <div
            class={`message ${message.role}`}
            style={{
              "margin-bottom": "10px",
              padding: "10px",
              "border-radius": "5px",
              "background-color": message.role === "user" ? "#e1f5fe" : "#f0f4c3",
            }}
          >
            <p style={{ margin: 0 }}>{message.content}</p>
          </div>
        )}
      </For>
    </div>
  );
};

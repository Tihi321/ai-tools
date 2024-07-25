import { styled } from "solid-styled-components";
import { createSignal, For, Show } from "solid-js";
import { IconButton, Typography, TextField, Box } from "@suid/material";
import ChevronLeftIcon from "@suid/icons-material/ChevronLeft";
import ChevronRightIcon from "@suid/icons-material/ChevronRight";

import SendIcon from "@suid/icons-material/Send";
import { Modal } from "../../components/containers/Modal";
import { NewChat } from "./NewChat";
import { Accordion } from "../../components/containers/Accordion";

const Container = styled("div")`
  position: fixed;
  display: flex;
  height: 100vh;
  background-color: #2b2a27;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 50px 16px;
`;

const ChatArea = styled("div")`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  color: #f5f4ef;
`;

const Content = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Sidebar = styled("div")`
  position: absolute;
  padding: 42px 0;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #21201c;
`;

const SidebarContent = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 16px;
  gap: 8px;
  color: #f5f4ef;

  .accordion {
    font-size: 16px;
    .accordion-header {
      border-radius: 8px;
      border: 1px solid #f5f4ef;
      padding: 0 8px;
    }
    svg {
      color: #f5f4ef;
    }
  }
`;

const ToggleSidebar = styled("button")`
  position: absolute;
  top: 54px;
  right: 0;
  background-color: #21201c;
  color: #f5f4ef;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  z-index: 10;
  border-radius: 0 8px 0 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(100%);
`;

const SidebarButton = styled("button")`
  width: 100%;
  background-color: #21201c;
  border: 1px solid #f5f4ef;
  padding: 8px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  color: #f5f4ef;
  transition: background-color 0.3s ease-out;
  margin-bottom: 8px;

  &:hover {
    background-color: #f5f4ef;
    color: #21201c;
  }
`;

const SidebarLink = styled("button")`
  border: none;
  background-color: #21201c;
  color: #f5f4ef;
  transition: color 0.3s ease-out;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #2b2a27;
  }
`;

const InputArea = styled("div")`
  padding: 16px;
  background-color: #393937;
  border-top: 1px solid #2b2a27;
  border-radius: 8px;
  color: #f5f4ef;
  display: flex;

  .MuiOutlinedInput-root {
    background-color: #393937;
    border: none;
    border-radius: 8px;
  }

  input {
    color: #f5f4ef;
    border: none;
  }

  svg {
    color: #f5f4ef;
  }
`;

const exampleChatList: {
  title: string;
  id: string;
  chats: Array<{
    title: string;
    id: string;
    parent: string;
  }>;
}[] = [
  {
    title: "Expert",
    id: "ollama-expert",
    chats: [
      {
        title: "What is symptom of",
        id: "ollama-expert-chat-1",
        parent: "ollama-expert",
      },
      {
        title: "How can we treat",
        id: "ollama-expert-chat-2",
        parent: "ollama-expert",
      },
    ],
  },
  {
    title: "Doctor",
    id: "perplexity-doctor",
    chats: [
      {
        title: "What is symptom of",
        id: "perplexity-doctor-chat-1",
        parent: "perplexity-doctor",
      },
      {
        title: "How can we treat",
        id: "perplexity-doctor-chat-2",
        parent: "perplexity-doctor",
      },
    ],
  },
  {
    title: "Assistant",
    id: "openai-assistant",
    chats: [
      {
        title: "What is biggest tower",
        id: "openai-assistant-chat-1",
        parent: "openai-assistant",
      },
      {
        title: "What can you tell me about",
        id: "openai-assistant-chat-2",
        parent: "openai-assistant",
      },
    ],
  },
];

const sidebarWidth = "250px";

export const QuickChat = () => {
  const [settingViews, setSettingViews] = createSignal<"" | "new-chat">("");
  const [showChats, setShowChats] = createSignal(true);
  const [messages, setMessages] = createSignal<{ text: string; sender: string }[]>([]);
  const [inputValue, setInputValue] = createSignal<string>("");

  const handleSendMessage = () => {
    if (inputValue().trim()) {
      setMessages([...messages(), { text: inputValue(), sender: "user" }]);
      setInputValue("");
    }
  };

  return (
    <Container>
      <Content
        style={{
          "padding-left": showChats() ? sidebarWidth : "0px",
        }}
      >
        <Sidebar
          style={{
            width: showChats() ? sidebarWidth : "0px",
          }}
        >
          <Show when={showChats()}>
            <SidebarContent>
              <SidebarButton onClick={() => setSettingViews("new-chat")}>New Type</SidebarButton>
              <For each={exampleChatList}>
                {(chat) => (
                  <Accordion title={chat.title}>
                    <SidebarButton onClick={() => setSettingViews("new-chat")}>
                      New Chat
                    </SidebarButton>
                    <For each={chat.chats}>
                      {(chat) => (
                        <SidebarLink
                          onClick={() => {
                            console.log("chat", chat);
                          }}
                        >
                          {chat.title}
                        </SidebarLink>
                      )}
                    </For>
                  </Accordion>
                )}
              </For>
            </SidebarContent>
          </Show>
          <ToggleSidebar onClick={() => setShowChats(!showChats())}>
            {showChats() ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </ToggleSidebar>
        </Sidebar>
        <ChatArea>
          <For each={messages()}>
            {(message: { sender: string; text: string }) => (
              <Box sx={{ mb: 2, textAlign: message?.sender === "user" ? "right" : "left" }}>
                <Typography>{message?.text}</Typography>
              </Box>
            )}
          </For>
        </ChatArea>
        <InputArea>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={inputValue()}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </InputArea>
      </Content>
      {settingViews() === "new-chat" && (
        <Modal onClose={() => setSettingViews("")}>
          <NewChat />
        </Modal>
      )}
    </Container>
  );
};

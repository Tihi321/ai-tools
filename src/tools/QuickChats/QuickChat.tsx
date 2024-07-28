import { styled } from "solid-styled-components";
import { createEffect, createSignal, For, Show } from "solid-js";
import { IconButton, Typography, TextField, Box } from "@suid/material";
import ChevronLeftIcon from "@suid/icons-material/ChevronLeft";
import ChevronRightIcon from "@suid/icons-material/ChevronRight";
import SendIcon from "@suid/icons-material/Send";
import EditIcon from "@suid/icons-material/Edit";
import DeleteIcon from "@suid/icons-material/Delete";
import { Modal } from "../../components/containers/Modal";
import { NewChat } from "./NewChat";
import { Accordion } from "../../components/containers/Accordion";
import { getStringValue, saveStringValue } from "../../hooks/local";

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
  transition: padding-left 0.3s ease-out;
`;

const Sidebar = styled("div")`
  position: absolute;
  padding: 42px 0;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #21201c;
  transition: width 0.3s ease-out;
  overflow: hidden;
`;

const SidebarContent = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 16px;
  gap: 8px;
  color: #f5f4ef;
  width: 250px;

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
  left: 250px; /* Aligns with the edge of the expanded sidebar */
  background-color: #21201c;
  color: #f5f4ef;
  border: none;
  padding: 8px;
  cursor: pointer;
  z-index: 10;
  border-radius: 0 8px 8px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.3s ease-out;
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

const ActionButton = styled(IconButton)`
  color: #f5f4ef;
  padding: 4px;
  &:hover {
    background-color: rgba(245, 244, 239, 0.1);
  }
`;

interface ChatType {
  id: string;
  title: string;
  systemPrompt: string;
  modelType: string;
  model: string;
}

interface Chat {
  id: string;
  title: string;
  parentId: string;
}

export const QuickChat = () => {
  const [settingViews, setSettingViews] = createSignal<"" | "new-chat" | "edit-chat">("");
  const [showChats, setShowChats] = createSignal(true);
  const [messages, setMessages] = createSignal<{ text: string; sender: string }[]>([]);
  const [inputValue, setInputValue] = createSignal<string>("");
  const [chatPersonas, setChatPersonas] = createSignal<ChatType[]>([]);
  const [chats, setChats] = createSignal<Chat[]>([]);
  const [activeChatType, setActiveChatType] = createSignal<ChatType | null>(null);
  const [activeChat, setActiveChat] = createSignal<Chat | null>(null);
  const [editingPersona, setEditingPersona] = createSignal<ChatType | undefined>(undefined);

  createEffect(() => {
    const savedChatPersonas = JSON.parse(getStringValue("ai-tools/chatPersonas") || "[]");
    setChatPersonas(savedChatPersonas);
    const savedChats = JSON.parse(getStringValue("ai-tools/chats") || "[]");
    setChats(savedChats);
  });

  const handleSendMessage = () => {
    if (inputValue().trim() && activeChatType()) {
      // Here you would typically send the message to your LLM API
      // along with the system prompt and model information
      const newMessage = { text: inputValue(), sender: "user" };
      setMessages([...messages(), newMessage]);

      // Simulating an AI response
      setTimeout(() => {
        const aiResponse = {
          text: `AI response using ${activeChatType()?.model} model`,
          sender: "ai",
        };
        setMessages([...messages(), aiResponse]);
      }, 1000);

      setInputValue("");
    }
  };

  const addNewChat = (parentId: string) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `New Chat ${chats().length + 1}`,
      parentId: parentId,
    };
    const updatedChats = [...chats(), newChat];
    setChats(updatedChats);
    setActiveChat(newChat);
    const parentChatType = chatPersonas().find((persona) => persona.id === parentId);
    if (parentChatType) {
      setActiveChatType(parentChatType);
    }
    // Save to local storage
    saveStringValue("ai-tools/chats", JSON.stringify(updatedChats));
  };

  const removePersona = (personaId: string) => {
    const updatedPersonas = chatPersonas().filter((persona) => persona.id !== personaId);
    setChatPersonas(updatedPersonas);
    saveStringValue("ai-tools/chatPersonas", JSON.stringify(updatedPersonas));

    // Remove all chats associated with this persona
    const updatedChats = chats().filter((chat) => chat.parentId !== personaId);
    setChats(updatedChats);
    saveStringValue("ai-tools/chats", JSON.stringify(updatedChats));

    if (activeChatType()?.id === personaId) {
      setActiveChatType(null);
      setActiveChat(null);
    }
  };

  const removeChat = (chatId: string) => {
    const updatedChats = chats().filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    saveStringValue("ai-tools/chats", JSON.stringify(updatedChats));

    if (activeChat()?.id === chatId) {
      setActiveChat(null);
    }
  };

  const editPersona = (persona: ChatType) => {
    setEditingPersona(persona);
    setSettingViews("edit-chat");
  };

  const handleEditPersona = (updatedPersona: ChatType) => {
    const updatedPersonas = chatPersonas().map((p) =>
      p.id === updatedPersona.id ? updatedPersona : p
    );
    setChatPersonas(updatedPersonas);
    saveStringValue("ai-tools/chatPersonas", JSON.stringify(updatedPersonas));
    setSettingViews("");
    setEditingPersona(undefined);
  };

  return (
    <Container>
      <Content style={{ "padding-left": showChats() ? "250px" : "0px" }}>
        <Sidebar style={{ width: showChats() ? "250px" : "0px" }}>
          <Show when={showChats()}>
            <SidebarContent>
              <SidebarButton onClick={() => setSettingViews("new-chat")}>New Persona</SidebarButton>
              <For each={chatPersonas()}>
                {(chatType) => (
                  <Accordion title={chatType.title}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <SidebarButton onClick={() => addNewChat(chatType.id)}>
                        New Chat
                      </SidebarButton>
                      <Box>
                        <ActionButton onClick={() => editPersona(chatType)}>
                          <EditIcon fontSize="small" />
                        </ActionButton>
                        <ActionButton onClick={() => removePersona(chatType.id)}>
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Box>
                    </Box>
                    <For each={chats().filter((chat) => chat.parentId === chatType.id)}>
                      {(chat) => (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <SidebarLink
                            onClick={() => {
                              setActiveChat(chat);
                              setActiveChatType(chatType);
                            }}
                          >
                            {chat.title}
                          </SidebarLink>
                          <ActionButton onClick={() => removeChat(chat.id)}>
                            <DeleteIcon fontSize="small" />
                          </ActionButton>
                        </Box>
                      )}
                    </For>
                  </Accordion>
                )}
              </For>
            </SidebarContent>
          </Show>
        </Sidebar>
        <ToggleSidebar
          onClick={() => setShowChats(!showChats())}
          style={{ left: showChats() ? "250px" : "0px" }}
        >
          {showChats() ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </ToggleSidebar>
        <ChatArea>
          <For each={messages()}>
            {(message) => (
              <Box sx={{ mb: 2, textAlign: message.sender === "user" ? "right" : "left" }}>
                <Typography>{message.text}</Typography>
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
          <NewChat
            onClose={() => {
              const savedChatPersonas = JSON.parse(getStringValue("ai-tools/chatPersonas") || "[]");
              setChatPersonas(savedChatPersonas);
              setSettingViews("");
            }}
          />
        </Modal>
      )}
      {settingViews() === "edit-chat" && editingPersona() && (
        <Modal onClose={() => setSettingViews("")}>
          <NewChat
            editMode={true}
            initialData={editingPersona()}
            onClose={(updatedPersona: any) => {
              if (updatedPersona) {
                handleEditPersona(updatedPersona);
              }
              setSettingViews("");
            }}
          />
        </Modal>
      )}
    </Container>
  );
};

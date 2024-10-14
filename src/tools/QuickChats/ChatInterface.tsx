import { createSignal, createEffect, Show } from "solid-js";
import { MessageList, InputArea, AgentManager, apiService, Agent } from "./components";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [currentAgent, setCurrentAgent] = createSignal<Agent | null>(null);
  const [apiKeys, setApiKeys] = createSignal<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  createEffect(() => {
    const storedApiKeys = localStorage.getItem("apiKeys");
    if (storedApiKeys) {
      setApiKeys(JSON.parse(storedApiKeys));
    }
  });

  const loadAgentMessages = (agentId: string) => {
    const storedMessages = localStorage.getItem(`chatMessages_${agentId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages([]);
    }
  };

  const saveAgentMessages = (agentId: string, messages: Message[]) => {
    localStorage.setItem(`chatMessages_${agentId}`, JSON.stringify(messages));
  };

  const sendMessage = async (message: string) => {
    if (!currentAgent()) {
      setErrorMessage("Please select an agent first");
      return;
    }

    const newMessage: Message = { role: "user", content: message };
    const updatedMessages = [...messages(), newMessage];
    setMessages(updatedMessages);
    saveAgentMessages(currentAgent()!.id, updatedMessages);

    try {
      const response = await apiService.sendMessage(
        currentAgent()!,
        messages(),
        apiKeys()[currentAgent()!.llmType]
      );
      const assistantMessage: Message = { role: "assistant", content: response };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveAgentMessages(currentAgent()!.id, finalMessages);
      setErrorMessage(null);
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      if (error instanceof Error) {
        setErrorMessage(`Failed to send message: ${error.message}`);
      } else {
        setErrorMessage("An unknown error occurred while sending the message");
      }
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    loadAgentMessages(agent.id);
    setErrorMessage(null);
  };

  const handleApiKeyChange = (llmType: string, apiKey: string) => {
    const updatedApiKeys = { ...apiKeys(), [llmType]: apiKey };
    setApiKeys(updatedApiKeys);
    localStorage.setItem("apiKeys", JSON.stringify(updatedApiKeys));
    apiService.setApiKey(llmType as "openRouter" | "anthropic", apiKey);
  };

  return (
    <div
      class="chat-interface"
      style={{ display: "flex", height: "100vh", "background-color": "#f0f0f0" }}
    >
      <div
        style={{ width: "300px", padding: "20px", "background-color": "#e0e0e0", overflow: "auto" }}
      >
        <AgentManager onSelectAgent={handleSelectAgent} />
      </div>
      <div style={{ flex: 1, display: "flex", "flex-direction": "column", padding: "20px" }}>
        <div style={{ "margin-bottom": "20px" }}>
          <h3>API Key Management</h3>
          <div>
            <label>
              OpenRouter API Key:
              <input
                type="password"
                value={apiKeys()["openRouter"] || ""}
                onInput={(e) => handleApiKeyChange("openRouter", e.currentTarget.value)}
                style={{ width: "200px", "margin-left": "10px" }}
              />
            </label>
          </div>
          <div style={{ "margin-top": "10px" }}>
            <label>
              Anthropic API Key:
              <input
                type="password"
                value={apiKeys()["anthropic"] || ""}
                onInput={(e) => handleApiKeyChange("anthropic", e.currentTarget.value)}
                style={{ width: "200px", "margin-left": "10px" }}
              />
            </label>
          </div>
        </div>
        <Show when={errorMessage()}>
          <div
            style={{
              "background-color": "#f8d7da",
              color: "#721c24",
              padding: "10px",
              "border-radius": "5px",
              "margin-bottom": "10px",
            }}
          >
            <p>{errorMessage()}</p>
          </div>
        </Show>
        <Show when={currentAgent()}>
          <h3>
            Current Agent: {currentAgent()?.name} (LLM: {currentAgent()?.llmType})
          </h3>
        </Show>
        <MessageList messages={messages()} />
        <InputArea onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

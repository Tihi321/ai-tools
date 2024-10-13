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
  const [corsWarning, setCorsWarning] = createSignal(false);

  createEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    const storedApiKeys = localStorage.getItem("apiKeys");
    if (storedApiKeys) {
      setApiKeys(JSON.parse(storedApiKeys));
    }
  });

  const sendMessage = async (message: string) => {
    if (!currentAgent()) {
      alert("Please select an agent first");
      return;
    }

    const newMessage: Message = { role: "user", content: message };
    const updatedMessages = [...messages(), newMessage];
    setMessages(updatedMessages);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

    try {
      const response = await apiService.sendMessage(
        currentAgent()!,
        message,
        currentAgent()!.llmType,
        apiKeys()[currentAgent()!.llmType]
      );
      const assistantMessage: Message = { role: "assistant", content: response };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      localStorage.setItem("chatMessages", JSON.stringify(finalMessages));
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      if (error instanceof Error && error.message.includes("CORS")) {
        setCorsWarning(true);
      } else {
        alert("Failed to send message. Please check your API configuration and try again.");
      }
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setMessages([]);
    localStorage.removeItem("chatMessages");
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
        <Show when={corsWarning()}>
          <div
            style={{
              "background-color": "#fff3cd",
              color: "#856404",
              padding: "10px",
              "border-radius": "5px",
              "margin-bottom": "10px",
            }}
          >
            <p>
              CORS Error: For testing purposes, please use a CORS browser extension to bypass this
              issue.
            </p>
            <p>In a production environment, this should be handled by a backend proxy.</p>
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

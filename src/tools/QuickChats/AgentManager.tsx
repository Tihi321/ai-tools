import { createSignal, createEffect, For } from "solid-js";
import { Agent } from "./ApiService";

interface AgentManagerProps {
  onSelectAgent: (agent: Agent) => void;
}

export const AgentManager = (props: AgentManagerProps) => {
  const [agents, setAgents] = createSignal<Agent[]>([]);
  const [newAgentName, setNewAgentName] = createSignal("");
  const [newAgentPrompt, setNewAgentPrompt] = createSignal("");
  const [newAgentLLM, setNewAgentLLM] = createSignal<"ollama" | "openRouter" | "anthropic">(
    "ollama"
  );

  createEffect(() => {
    const storedAgents = localStorage.getItem("agents");
    if (storedAgents) {
      setAgents(JSON.parse(storedAgents));
    }
  });

  const addAgent = () => {
    if (newAgentName() && newAgentPrompt()) {
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: newAgentName(),
        systemPrompt: newAgentPrompt(),
        llmType: newAgentLLM(),
      };
      const updatedAgents = [...agents(), newAgent];
      setAgents(updatedAgents);
      localStorage.setItem("agents", JSON.stringify(updatedAgents));
      setNewAgentName("");
      setNewAgentPrompt("");
      setNewAgentLLM("ollama");
    }
  };

  const removeAgent = (id: string) => {
    const updatedAgents = agents().filter((agent) => agent.id !== id);
    setAgents(updatedAgents);
    localStorage.setItem("agents", JSON.stringify(updatedAgents));
  };

  const selectAgent = (agent: Agent) => {
    props.onSelectAgent(agent);
  };

  return (
    <div class="agent-manager">
      <h2>Agents</h2>
      <For each={agents()}>
        {(agent) => (
          <div
            class="agent"
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              cursor: "pointer",
              padding: "10px",
              margin: "5px 0",
              "background-color": "#f0f0f0",
              "border-radius": "5px",
            }}
          >
            <div onClick={() => selectAgent(agent)}>
              <h3 style={{ margin: "0 0 5px 0" }}>{agent.name}</h3>
              <p style={{ margin: "0 0 5px 0", "font-size": "0.8em" }}>LLM: {agent.llmType}</p>
              <p style={{ margin: 0, "font-size": "0.8em" }}>
                {agent.systemPrompt.substring(0, 50)}...
              </p>
            </div>
            <button
              onClick={() => removeAgent(agent.id)}
              style={{
                "background-color": "#ff4d4d",
                color: "white",
                border: "none",
                padding: "5px 10px",
                "border-radius": "3px",
              }}
            >
              Remove
            </button>
          </div>
        )}
      </For>
      <div class="new-agent-form" style={{ "margin-top": "20px" }}>
        <input
          type="text"
          placeholder="Agent Name"
          value={newAgentName()}
          onInput={(e) => setNewAgentName(e.currentTarget.value)}
          style={{ display: "block", width: "100%", "margin-bottom": "10px", padding: "5px" }}
        />
        <textarea
          placeholder="System Prompt"
          value={newAgentPrompt()}
          onInput={(e) => setNewAgentPrompt(e.currentTarget.value)}
          style={{
            display: "block",
            width: "100%",
            "margin-bottom": "10px",
            padding: "5px",
            height: "100px",
          }}
        />
        <select
          value={newAgentLLM()}
          onChange={(e) =>
            setNewAgentLLM(e.currentTarget.value as "ollama" | "openRouter" | "anthropic")
          }
          style={{ display: "block", width: "100%", "margin-bottom": "10px", padding: "5px" }}
        >
          <option value="ollama">Ollama</option>
          <option value="openRouter">OpenRouter</option>
          <option value="anthropic">Anthropic</option>
        </select>
        <button onClick={addAgent} style={{ width: "100%", padding: "5px" }}>
          Add Agent
        </button>
      </div>
    </div>
  );
};

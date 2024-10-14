interface ApiConfig {
  endpoint: string;
  apiKey?: string;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface Agent {
  id: string;
  name: string;
  systemPrompt: string;
  llmType: "ollama" | "openRouter" | "anthropic";
}

class ApiService {
  private config: Record<string, ApiConfig> = {
    ollama: { endpoint: "http://localhost:11434/api/chat" },
    openRouter: { endpoint: "https://openrouter.ai/api/v1/chat/completions" },
    anthropic: { endpoint: "https://api.anthropic.com/v1/messages" },
  };

  async sendMessage(
    agent: Agent,
    message: string,
    apiType: "ollama" | "openRouter" | "anthropic",
    apiKey?: string
  ): Promise<string> {
    const config = this.config[apiType];
    if (!config) {
      throw new Error(`Unsupported API type: ${apiType}`);
    }

    const messages: Message[] = [
      { role: "system", content: agent.systemPrompt },
      { role: "user", content: message },
    ];

    let body: any;
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    switch (apiType) {
      case "ollama":
        body = {
          model: "llama2",
          messages,
        };
        break;
      case "openRouter":
        body = {
          model: "openai/gpt-3.5-turbo",
          messages,
        };
        headers["Authorization"] = `Bearer ${apiKey}`;
        break;
      case "anthropic":
        body = {
          model: "claude-3-sonnet-20240229",
          messages,
          max_tokens: 1024,
        };
        headers["x-api-key"] = apiKey!;
        headers["anthropic-version"] = "2023-06-01";
        headers["content-type"] = "application/json";
        headers["anthropic-dangerous-direct-browser-access"] = "true";
        break;
    }

    try {
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return apiType === "anthropic" ? data.content[0].text : data.choices[0].message.content;
    } catch (error) {
      console.error("Error in API request:", error);
      throw error;
    }
  }

  setApiKey(apiType: "openRouter" | "anthropic", apiKey: string) {
    if (this.config[apiType]) {
      this.config[apiType].apiKey = apiKey;
    }
  }

  getApiKey(apiType: "openRouter" | "anthropic"): string | undefined {
    return this.config[apiType]?.apiKey;
  }
}

export const apiService = new ApiService();

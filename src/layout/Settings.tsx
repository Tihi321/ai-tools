import { createSignal, onMount, Show } from "solid-js";
import { FormControlLabel, Checkbox } from "@suid/material";
import { getBooleanValue, getStringValue, saveBooleanValue, saveStringValue } from "../hooks/local";
import { LocalTextInput } from "../components/inputs/LocalTextInput";
import { LocalSelectVoice } from "../components/inputs/LocalSelectVoice";
import { Container } from "../components/containers/Container";

export const Settings = () => {
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [openAIAPI, setOpenAIAPI] = createSignal("");
  const [ollamaURL, setOllamaUrl] = createSignal("");
  const [autoStartVoice, setAutoStartVoice] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    const perplexityApi = getStringValue("ai-tools/perplexityApi");
    setPerplexityApi(perplexityApi);
    const openAIAPI = getStringValue("ai-tools/openAIAPI");
    setOpenAIAPI(openAIAPI);
    const ollamaUrl = getStringValue("ai-tools/ollamaURL");
    setOllamaUrl(ollamaUrl || "http://127.0.0.1:11434");
    const autoStartVoice = getBooleanValue("ai-tools/autostartvoice");
    setAutoStartVoice(autoStartVoice);
    setMounted(true);
  });
  return (
    <Container>
      <Show when={mounted()}>
        <LocalTextInput
          type="password"
          label="Perplexity API"
          value={perplexityApi()}
          onSave={(value: string) => {
            saveStringValue("ai-tools/perplexityApi", value);
            setPerplexityApi(value);
          }}
          onRemove={() => {
            setPerplexityApi("");
            saveStringValue("ai-tools/perplexityApi", "");
          }}
        />
        <LocalTextInput
          type="password"
          label="OpenAI API"
          value={openAIAPI()}
          onSave={(value: string) => {
            saveStringValue("ai-tools/openAIAPI", value);
            setOpenAIAPI(value);
          }}
          onRemove={() => {
            setOpenAIAPI("");
            saveStringValue("ai-tools/openAIAPI", "");
          }}
        />
        <LocalTextInput
          type="text"
          label="Ollama url"
          value={ollamaURL()}
          onSave={(value: string) => {
            saveStringValue("ai-tools/ollamaURL", value);
            setOllamaUrl(value);
          }}
          onRemove={() => {
            setOllamaUrl("");
            saveStringValue("ai-tools/ollamaURL", "");
          }}
        />
        <LocalSelectVoice />
        <FormControlLabel
          control={
            <Checkbox
              checked={autoStartVoice()}
              onChange={(event: any) => {
                const checked = !event.target.checked;
                setAutoStartVoice(checked);
                saveBooleanValue("ai-tools/autostartvoice", checked);
              }}
            />
          }
          label={"Auto start voice"}
        />
      </Show>
    </Container>
  );
};

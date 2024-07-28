import { createSignal, onMount, Show, For } from "solid-js";
import { FormControlLabel, Checkbox, Button, TextField, Box } from "@suid/material";
import { getBooleanValue, getStringValue, saveBooleanValue, saveStringValue } from "../hooks/local";
import { LocalTextInput } from "../components/inputs/LocalTextInput";
import { LocalSelectVoice } from "../components/inputs/LocalSelectVoice";
import { Container } from "../components/containers/Container";
import { styled } from "solid-styled-components";

const OllamaModelInput = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const Settings = () => {
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [openAIAPI, setOpenAIAPI] = createSignal("");
  const [ollamaURL, setOllamaUrl] = createSignal("");
  const [autoStartVoice, setAutoStartVoice] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [ollamaModels, setOllamaModels] = createSignal<string[]>([]);
  const [newOllamaModel, setNewOllamaModel] = createSignal("");

  onMount(() => {
    const perplexityApi = getStringValue("ai-tools/perplexityApi");
    setPerplexityApi(perplexityApi);
    const openAIAPI = getStringValue("ai-tools/openAIAPI");
    setOpenAIAPI(openAIAPI);
    const ollamaUrl = getStringValue("ai-tools/ollamaURL");
    setOllamaUrl(ollamaUrl || "http://127.0.0.1:11434");
    const autoStartVoice = getBooleanValue("ai-tools/autostartvoice");
    setAutoStartVoice(autoStartVoice);
    const savedOllamaModels = JSON.parse(getStringValue("ai-tools/ollamaModels") || "[]");
    setOllamaModels(savedOllamaModels);
    setMounted(true);
  });

  const addOllamaModel = () => {
    if (newOllamaModel()) {
      const updatedModels = [...ollamaModels(), newOllamaModel()];
      setOllamaModels(updatedModels);
      saveStringValue("ai-tools/ollamaModels", JSON.stringify(updatedModels));
      setNewOllamaModel("");
    }
  };

  const removeOllamaModel = (model: string) => {
    const updatedModels = ollamaModels().filter((m) => m !== model);
    setOllamaModels(updatedModels);
    saveStringValue("ai-tools/ollamaModels", JSON.stringify(updatedModels));
  };

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
        <Box>
          <h3>Ollama Models</h3>
          <For each={ollamaModels()}>
            {(model) => (
              <OllamaModelInput>
                <TextField value={model} disabled />
                <Button onClick={() => removeOllamaModel(model)}>Remove</Button>
              </OllamaModelInput>
            )}
          </For>
          <OllamaModelInput>
            <TextField
              value={newOllamaModel()}
              onChange={(e) => setNewOllamaModel(e.target.value)}
              placeholder="Enter new Ollama model"
            />
            <Button onClick={addOllamaModel}>Add Model</Button>
          </OllamaModelInput>
        </Box>
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

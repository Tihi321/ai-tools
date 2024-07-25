import { createSignal, onMount, Show } from "solid-js";
import { FormControl, InputLabel, Select, MenuItem, TextField } from "@suid/material";
import { getStringValue } from "../../hooks/local";
import { LocalTextInput } from "../../components/inputs/LocalTextInput";
import { Container } from "../../components/containers/Container";
import { isEmpty } from "lodash";

export const NewChat = () => {
  const [modelType, setModelType] = createSignal("");
  const [systemPrompt, setSystemPrompt] = createSignal("");
  const [localModel, setLocalModel] = createSignal("qwen2:7b");
  const [openAIModel, setOpenAIModel] = createSignal("gpt-4o-mini");
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [openAIAPI, setOpenAIAPI] = createSignal("");
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    const perplexityApi = getStringValue("ai-tools/perplexityApi");
    setPerplexityApi(perplexityApi);
    const openAIAPI = getStringValue("ai-tools/openAIAPI");
    setOpenAIAPI(openAIAPI);
    setMounted(true);
  });
  return (
    <Container>
      <Show when={mounted()}>
        <TextField
          multiline
          fullWidth
          minRows={2}
          value={systemPrompt()}
          onChange={(e) => setSystemPrompt(e.target.value)}
          sx={{ maxHeight: 300, overflowY: "auto" }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Model Type</InputLabel>
          <Select value={modelType()} onChange={(e) => setModelType(e.target.value)}>
            <MenuItem value="ollama">Ollama</MenuItem>
            <MenuItem disabled={isEmpty(perplexityApi())} value="perplexity">
              Perplexity
            </MenuItem>
            <MenuItem disabled={isEmpty(openAIAPI())} value="openai">
              OpenAI
            </MenuItem>
          </Select>
          {modelType() === "ollama" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Model</InputLabel>
              <LocalTextInput
                type="text"
                label="Ollama model"
                value={localModel()}
                onSave={(value: string) => {
                  setLocalModel(value);
                }}
                onRemove={() => {
                  setLocalModel("");
                }}
              />
            </FormControl>
          )}
          {modelType() === "chatgpt" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Model</InputLabel>
              <Select value={openAIModel()} onChange={(e) => setOpenAIModel(e.target.value)}>
                <MenuItem value="gpt-4o-mini">Gpt-4o-mini</MenuItem>
                <MenuItem value="gpt-4o">Gpt-4o</MenuItem>
                <MenuItem value="gpt-4-turbo">Gpt-4-turbo</MenuItem>
                <MenuItem value="gpt-3.5-turbo">Gpt-3.5-turbo</MenuItem>
              </Select>
            </FormControl>
          )}
        </FormControl>
      </Show>
    </Container>
  );
};

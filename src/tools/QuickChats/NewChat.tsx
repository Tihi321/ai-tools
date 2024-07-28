import { createSignal, For, onMount, Show } from "solid-js";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box } from "@suid/material";
import { styled } from "solid-styled-components";
import { getStringValue, saveStringValue } from "../../hooks/local";
import { isEmpty } from "lodash";

const Container = styled("div")`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
  gap: 20px;
  padding: 24px;
  background-color: #2b2a27;
  color: #f5f4ef;
  border-radius: 8px;

  .MuiFormControl-root {
    width: 100%;
  }

  .MuiInputLabel-root,
  .MuiSelect-select,
  .MuiMenuItem-root,
  .MuiSelect-icon,
  .local-text-input input {
    color: #f5f4ef;
  }

  .MuiOutlinedInput-notchedOutline,
  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #f5f4ef;
  }
`;

const Content = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
  width: 100%;
  gap: 20px;
`;

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    color: #f5f4ef;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: #f5f4ef;
  }

  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: #f5f4ef;
  }

  .MuiInputLabel-root {
    color: #f5f4ef;
  }
`;

const StyledButton = styled(Button)`
  background-color: #393937;
  color: #f5f4ef;
  &:hover {
    background-color: #4a4a47;
  }
`;

interface ChatType {
  id: string;
  title: string;
  systemPrompt: string;
  modelType: string;
  model: string;
}

interface NewChatProps {
  onClose: (updatedPersona?: ChatType) => void;
  editMode?: boolean;
  initialData?: ChatType;
}

export const NewChat = (props: NewChatProps) => {
  const [title, setTitle] = createSignal("");
  const [modelType, setModelType] = createSignal("");
  const [systemPrompt, setSystemPrompt] = createSignal("");
  const [ollamaModel, setOllamaModel] = createSignal("");
  const [openAIModel, setOpenAIModel] = createSignal("gpt-4o-mini");
  const [perplexityApi, setPerplexityApi] = createSignal("");
  const [openAIAPI, setOpenAIAPI] = createSignal("");
  const [ollamaModels, setOllamaModels] = createSignal<string[]>([]);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    const perplexityApi = getStringValue("ai-tools/perplexityApi");
    setPerplexityApi(perplexityApi);
    const openAIAPI = getStringValue("ai-tools/openAIAPI");
    setOpenAIAPI(openAIAPI);
    const savedOllamaModels = JSON.parse(getStringValue("ai-tools/ollamaModels") || "[]");
    setOllamaModels(savedOllamaModels);

    if (props.editMode && props.initialData) {
      setTitle(props.initialData.title);
      setModelType(props.initialData.modelType);
      setSystemPrompt(props.initialData.systemPrompt);
      if (props.initialData.modelType === "ollama") {
        setOllamaModel(props.initialData.model);
      } else if (props.initialData.modelType === "openai") {
        setOpenAIModel(props.initialData.model);
      }
    }

    setMounted(true);
  });

  const saveOrUpdateChatPersona = () => {
    const chatPersona: ChatType = {
      id: props.editMode && props.initialData ? props.initialData.id : Date.now().toString(),
      title: title(),
      systemPrompt: systemPrompt(),
      modelType: modelType(),
      model: modelType() === "ollama" ? ollamaModel() : openAIModel(),
    };

    if (props.editMode) {
      props.onClose(chatPersona);
    } else {
      const existingPersonas = JSON.parse(getStringValue("ai-tools/chatPersonas") || "[]");
      const updatedPersonas = [...existingPersonas, chatPersona];
      saveStringValue("ai-tools/chatPersonas", JSON.stringify(updatedPersonas));
      props.onClose();
    }
  };

  return (
    <Container>
      <Content>
        <Show when={mounted()}>
          <StyledTextField
            fullWidth
            value={title()}
            onChange={(e) => setTitle(e.target.value)}
            label="Chat Type Title"
          />
          <StyledTextField
            multiline
            fullWidth
            minRows={4}
            value={systemPrompt()}
            onChange={(e) => setSystemPrompt(e.target.value)}
            label="System Prompt"
          />
          <FormControl fullWidth>
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
          </FormControl>
          {modelType() === "ollama" && (
            <FormControl fullWidth>
              <InputLabel>Ollama Model</InputLabel>
              <Select value={ollamaModel()} onChange={(e) => setOllamaModel(e.target.value)}>
                <For each={ollamaModels()}>
                  {(model: any) => <MenuItem value={model}>{model}</MenuItem>}
                </For>
              </Select>
            </FormControl>
          )}
          {modelType() === "openai" && (
            <FormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <Select value={openAIModel()} onChange={(e) => setOpenAIModel(e.target.value)}>
                <MenuItem value="gpt-4o-mini">Gpt-4o-mini</MenuItem>
                <MenuItem value="gpt-4o">Gpt-4o</MenuItem>
                <MenuItem value="gpt-4-turbo">Gpt-4-turbo</MenuItem>
                <MenuItem value="gpt-3.5-turbo">Gpt-3.5-turbo</MenuItem>
              </Select>
            </FormControl>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <StyledButton variant="contained" onClick={saveOrUpdateChatPersona}>
              {props.editMode ? "Update Chat Type" : "Create New Chat Type"}
            </StyledButton>
          </Box>
        </Show>
      </Content>
    </Container>
  );
};

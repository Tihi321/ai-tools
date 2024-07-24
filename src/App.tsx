import { createSignal, Show, onMount } from "solid-js";
import { Box } from "@suid/material";
import replace from "lodash/replace";
import startCase from "lodash/startCase";
import { styled } from "solid-styled-components";
import { LLMApiPrompter } from "./tools/LLMApiPrompter";
import { getURLParams } from "./utils/url";
import { Frame } from "./components/layout/Frame";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const tools: string[] = ["llm-api-prompter"];

export const App = () => {
  const [selectedTool, setSelectedTool] = createSignal<string>();

  onMount(() => {
    const initialTool = getURLParams("tool");
    setSelectedTool(initialTool || "llm-api-prompter");
    document.title = `Web Tools - ${startCase(
      replace(initialTool || "llm-api-prompter", "-", " ")
    )}`;
  });

  return (
    <Container>
      <Frame
        tools={tools}
        onToolChange={(toolName: string) => {
          history.pushState({}, "", `?tool=${toolName}`);
          document.title = `AI Tools - ${startCase(replace(toolName, "-", " "))}`;
          setSelectedTool(toolName);
        }}
      >
        <Box component="main" sx={{ p: 3 }}>
          <Show when={selectedTool()}>
            {selectedTool() === "llm-api-prompter" && <LLMApiPrompter />}
          </Show>
        </Box>
      </Frame>
    </Container>
  );
};

import { createSignal, Show, onMount } from "solid-js";
import { Box } from "@suid/material";
import replace from "lodash/replace";
import startCase from "lodash/startCase";
import { styled } from "solid-styled-components";
import { ApiPrompter } from "./tools/ApiPrompter";
import { getURLParams } from "./utils/url";
import { Frame } from "./layout/Frame";
import { QuickChat } from "./tools/QuickChats";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const tools: string[] = ["api-prompter", "quick-chat"];

export const App = () => {
  const [selectedTool, setSelectedTool] = createSignal<string>();

  onMount(() => {
    const initialTool = getURLParams("tool");
    setSelectedTool(initialTool || "api-prompter");
    document.title = `AI Tools - ${startCase(replace(initialTool || "api-prompter", "-", " "))}`;
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
        <Box component="main">
          <Show when={selectedTool()}>
            {selectedTool() === "api-prompter" && <ApiPrompter />}
            {selectedTool() === "quick-chat" && <QuickChat />}
          </Show>
        </Box>
      </Frame>
    </Container>
  );
};

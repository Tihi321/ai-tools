// @ts-ignore
import { CodeInput } from "@srsholmes/solid-code-input";
import { createSignal, Show, onMount } from "solid-js";
import Prism from "prismjs";
import { styled } from "solid-styled-components";

const Container = styled.div`
  background-color: ${(props) => props?.theme?.colors.codeBackground};

  & > div {
    width: 100% !important;
    height: 300px !important;

    & > div {
      height: 100% !important;
      width: 100% !important;
    }
  }

  textarea {
    height: 100% !important;

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-track {
      background: ${(props) => props?.theme?.colors.codeBackground};
    }

    &::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #888;
    }
  }
`;

// @ts-ignore
const libs = [import("prismjs/components/prism-typescript")];

export const CodeEditor = (props: { value: string; onChange: (value: string) => void }) => {
  const [loadedPrism, setLoadedPrism] = createSignal(false);

  onMount(async () => {
    await Promise.all(libs);
    setLoadedPrism(true);
  });

  return (
    <Show when={loadedPrism()}>
      <Container>
        <CodeInput
          autoHeight={false}
          resize="none"
          placeholder="Input your code here..."
          prismJS={Prism}
          onChange={props.onChange}
          value={props.value}
          language={"typescript"}
        />
      </Container>
    </Show>
  );
};

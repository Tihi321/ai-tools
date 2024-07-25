import { onMount, createSignal, createEffect } from "solid-js";
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from "@suid/material";
import { isEmpty, map } from "lodash";
import { styled } from "solid-styled-components";
import { getStringValue, saveStringValue } from "../../hooks/local";
import { getVoices } from "../../utils";
import { Save } from "../icons/Save";
import { Refresh } from "../icons/Refresh";

const MenuItemStyled = styled(MenuItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const MenuTitle = styled("div")`
  font-size: 14px;
  margin: 10px;
  flex: 1;
  word-break: break-all;

  @media (min-width: 700px) {
    font-size: 18px;
  }
`;

export const LocalSelectVoice = () => {
  const [selectedVoice, setSelectedVoice] = createSignal("");
  const [mounted, setMounted] = createSignal(false);
  const [availableVoices, setAvailableVoices] = createSignal<SpeechSynthesisVoice[]>([]);

  onMount(() => {
    const voice = getStringValue("ai-tools/selectedVoice");
    setSelectedVoice(voice || "");
    setMounted(true);
  });

  createEffect(() => {
    if (mounted()) {
      const voices = getVoices();
      setAvailableVoices(voices);
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        gap: 2,
        flex: 1,
      }}
    >
      <FormControl fullWidth margin="normal">
        <InputLabel>Voices</InputLabel>
        <Select
          value={selectedVoice()}
          onChange={(event) => {
            saveStringValue("kvizolamma/selectedVoice", event.target.value);
            setSelectedVoice(event.target.value);
          }}
        >
          {map(availableVoices(), (values: SpeechSynthesisVoice) => (
            <MenuItemStyled value={values.name}>
              <MenuTitle>{values.name}</MenuTitle>
            </MenuItemStyled>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          gap: 2,
          flex: 1,
        }}
      >
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            const voices = getVoices();
            setAvailableVoices(voices);
          }}
        >
          <Refresh />
        </Button>
        <Button
          disabled={isEmpty(availableVoices())}
          variant="contained"
          color="primary"
          onClick={() => {
            saveStringValue("selectedVoice", selectedVoice());
          }}
        >
          <Save />
        </Button>
      </Box>
    </Box>
  );
};

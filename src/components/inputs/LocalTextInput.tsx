import { Component, createEffect, createSignal } from "solid-js";
import { Button, TextField, Box } from "@suid/material";
import { isEmpty } from "lodash";
import { Save } from "../icons/Save";
import { Trashcan } from "../icons/Trashcan";

interface LocalTextInputProps {
  type: "text" | "password" | "number";
  label: string;
  value: string;
  onRemove: () => void;
  onSave: (text: string) => void;
}

export const LocalTextInput: Component<LocalTextInputProps> = ({
  type,
  label,
  value,
  onSave,
  onRemove,
}) => {
  const [text, setText] = createSignal("");

  createEffect(() => {
    setText(value);
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        gap: 2,
      }}
      class="local-text-input"
    >
      <TextField
        fullWidth
        label={label}
        value={text()}
        onChange={(e) => setText(e.target.value)}
        margin="normal"
        type={type}
      />
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
          disabled={isEmpty(text())}
          variant="contained"
          color="primary"
          onClick={() => onSave(text())}
        >
          <Save />
        </Button>
        <Button variant="contained" color="error" onClick={onRemove}>
          <Trashcan />
        </Button>
      </Box>
    </Box>
  );
};

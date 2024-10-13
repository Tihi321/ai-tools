import { createSignal } from "solid-js";

interface InputAreaProps {
  onSendMessage: (message: string) => void;
}

export const InputArea = (props: InputAreaProps) => {
  const [input, setInput] = createSignal("");
  const [isListening, setIsListening] = createSignal(false);

  const sendMessage = () => {
    if (input().trim()) {
      props.onSendMessage(input());
      setInput("");
    }
  };

  const startListening = () => {
    setIsListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.start();
  };

  return (
    <div class="input-area" style={{ display: "flex", "align-items": "center", padding: "10px" }}>
      <input
        type="text"
        value={input()}
        onInput={(e) => setInput(e.currentTarget.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        style={{ flex: 1, "margin-right": "10px", padding: "5px" }}
      />
      <button onClick={sendMessage} style={{ "margin-right": "10px" }}>
        Send
      </button>
      <button onClick={startListening} disabled={isListening()}>
        {isListening() ? "Listening..." : "Start Voice Input"}
      </button>
    </div>
  );
};

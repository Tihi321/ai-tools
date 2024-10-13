import { ChatInterface } from "./components";

export const QuickChat = () => {
  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        height: "100vh",
        "background-color": "#f0f0f0",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        padding: "0",
      }}
    >
      <ChatInterface />
    </div>
  );
};

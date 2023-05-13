import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import { HMSRoomProvider } from "@100mslive/react-sdk";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ChakraProvider>
    <BrowserRouter>
      <ChatProvider>
        <HMSRoomProvider>
          <App />
        </HMSRoomProvider>
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
);
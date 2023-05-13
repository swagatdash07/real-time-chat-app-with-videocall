import { useRef, useEffect, useState } from 'react'
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import { Box, Button, Image, useBreakpointValue } from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { Prism } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ScrollableChat = ({ messages }) => {
  const { user, chatAction } = ChatState();
  // console.log(selectedChat)
  const isMobile = useBreakpointValue({ base: true, md: false });
  const downloadFiles = (file) => {
    let url = `http://192.168.101.6:8001${file}`
    let fileName = file.split("/")[2]
    saveAs(url, fileName);
  }
  const scrollableFeedRef = useRef();
  const scrollToBottom = () => {
    scrollableFeedRef.current.scrollToBottom();
  };

  return (
    <ScrollableFeed ref={scrollableFeedRef}>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${m.contentType === "code" ? "transparent" : m.sender._id === user._id && m.file ? "#28272445" : m.sender._id !== user._id && m.file ? "#fff" : m.sender._id === user._id ? "#B9F5D0" : "#fff"}`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: m.file?.split(".")[1] !== "pdf" ? "5px 15px" : "0px",
                maxWidth: "75%",
              }}
            >
              {m.file && m.file?.split(".")[1] !== "pdf" && <Box display="flex" justifyContent="end"  >
                <DownloadIcon boxSize={5} border='1px' borderColor='#B9F5D0' borderRadius="50" cursor="pointer" onClick={() => downloadFiles(m.file)} />
              </Box>}
              {m.file?.split(".")[1] !== "pdf" && !m?.content && m.contentType !== "code" ? <Image w='200px' src={`http://192.168.101.6:8001${m?.file}`} alt="chat-img" /> : m.file?.split(".")[1] === "pdf" && !m?.content ? <iframe
                src={`http://192.168.101.6:8001${m?.file}`}
                title="PDF Preview"
                width="100%"
                height="400px"
                style={{ border: "none" }}
              ></iframe> : m.contentType === "code" && m?.content ? <Prism language="javascript" style={darcula}>{m?.content}</Prism> : m?.content}
            </span>
          </div>
        ))
      }
      <Box display="flex" pos="fixed" bottom="13%" right="37%" justifyContent="center">
        <Button display={isMobile ? "none" : "block"} onClick={scrollToBottom} size='md' height='48px' border='2px' borderColor='green.500' borderRadius="35px" opacity={0.5}>
          <ChevronDownIcon mt="2px" />
        </Button>
      </Box>

    </ScrollableFeed>
  );
};

export default ScrollableChat;

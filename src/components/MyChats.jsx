import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Divider } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { ApiConfig } from "../config/ApiConfig";
const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats, chatAction, setChatAction } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      const { data } = await axios.get(ApiConfig.getAllChat, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // console.log(selectedChat)
  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Divider color="#38B2AC" size="2px" orientation="horizontal" />
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="scroll"
      >
        {chats ? (
          <Stack overflowY="scroll" >
            {chats.map((chat) => {
              // console.log(chat.latestMessage.file?.split(".")[1])
              // console.log(chat)
              return (
                <Box
                  key={chat._id}
                  onClick={() => { setSelectedChat(chat); setChatAction(true) }}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : `${chat.chatName} (Group)`}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage?.sender?.email === user?.email ? "me" : chat.latestMessage?.sender?.name} : </b>
                      {chat.latestMessage.file?.split(".")[1] !== "pdf" && chat.latestMessage.content === undefined ? "Image" : chat.latestMessage.file?.split(".")[1] === "pdf" && chat.latestMessage.content === undefined ? "PDF" : chat.latestMessage.content?.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              )
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box >
  );
};

export default MyChats;

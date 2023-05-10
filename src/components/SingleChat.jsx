import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { Button, IconButton, Spinner, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Textarea } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowBackIcon, AttachmentIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { BsCodeSlash } from "react-icons/bs"
const ENDPOINT = "http://localhost:4001";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isCodeOpen, onCode, onCodeClose } = useDisclosure();
  const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
  const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification, setChatAction } = ChatState();
  // console.log(selectedChat)
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const [file, setFile] = useState(null);

  // Set the worker URL for PDF.js
  const handleFile = async (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile)
    if (selectedFile.type.split("/")[0] === "image") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const maxWidth = 800;
          const maxHeight = 800;
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0, width, height);
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], selectedFile.name, {
              type: selectedFile.type,
              lastModified: selectedFile.lastModified,
            });
            setFile(compressedFile);
          }, selectedFile.type, 0.7);
        };
        image.src = event.target.result;
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const sendMessage = async (event) => {
    setChatAction(true);
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
            contentType: "text"
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);
  const [uploadLoading, setUploadLoading] = useState(false)
  const sendFile = async () => {
    setUploadLoading(true)
    console.log("file", file);
    const formData = new FormData();
    formData.append("chatId", JSON.stringify(selectedChat));
    formData.append("file", file);
    formData.append("fileType", file.type);
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post("/api/message", formData, config);
      socket.emit("new message", data);
      setMessages([...messages, data]);
      setUploadLoading();
      onClose();
    } catch (error) {
      setUploadLoading();
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  const name = useRef(null);
  useEffect(() => {
    let numNewMessages = 0;
    socket.on("message recieved", (newMessageRecieved) => {
      // console.log(newMessageRecieved);
      name.current = newMessageRecieved?.sender?.name;
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          numNewMessages++;
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
    return () => {
      if (numNewMessages > 0) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(`You got a new messages from ${name?.current}`);
          }
        });
      }
    };
  });
  const [codeLoading, setCodeLoading] = useState(false);
  const sendCode = async (event) => {
    setChatAction(true);
    setCodeLoading(true)
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "/api/message",
        {
          content: newMessage,
          chatId: selectedChat,
          contentType: "code"
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
      setCodeLoading();
    } catch (error) {
      setCodeLoading();
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
            <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </>
              ))}
          </Text>

          <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3} display="flex" alignItems="center">
              {istyping ? (
                <div>
                  <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
                </div>
              ) : (
                <></>
              )}
              <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={typingHandler} flex="1" marginRight="2" borderColor="#38B2AC" />
              <Button onClick={onOpenModal1} backgroundColor="#38B2AC">
                <AttachmentIcon />
              </Button>
              <Button mx="2" onClick={onOpenModal2} backgroundColor="#38B2AC">
                <BsCodeSlash />
              </Button>
            </FormControl>
          </Box>
          <Modal blockScrollOnMount={true} isOpen={isOpenModal1} onClose={onCloseModal1} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Send Files</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <Input type="file" size="md" onChange={handleFile} h={8} pl={3} pt={3} pb={10} cursor="pointer" />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onCloseModal1} mr={3}>
                  Cancel
                </Button>
                <Button onClick={sendFile} colorScheme="blue" isDisabled={uploadLoading ? true : false}>
                  {uploadLoading ? "Uploading..." : "Send"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Code Format */}
          <Modal blockScrollOnMount={true} isOpen={isOpenModal2} onClose={onCloseModal2} isCentered >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Codes Template</ModalHeader>
              <ModalCloseButton />
              <ModalBody >
                <FormControl >
                  <Textarea placeholder=' Please Write or Paste Your <> Codes </>' size='lg' height="300px" borderColor="blue" value={newMessage} onChange={typingHandler} />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onCloseModal2} mr={3}>
                  Cancel
                </Button>
                <Button onClick={sendCode} colorScheme="blue" isDisabled={uploadLoading ? true : false}>
                  {uploadLoading ? "Uploading..." : "Send"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

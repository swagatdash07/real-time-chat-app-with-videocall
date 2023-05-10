import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

import { BsFillCameraVideoFill } from "react-icons/bs"
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ProfileModal = ({ user, children }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const hmsActions = useHMSActions();
  const handleRoom = async () => {  
    await axios.post("https://api.100ms.live/v2/rooms", {
      // name: user?.name
      name: user?.email
    }, {
      headers: {
        Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODM2MTY1MjAsImV4cCI6MTY4MzcwMjkyMCwianRpIjoiand0X25vbmNlIiwidHlwZSI6Im1hbmFnZW1lbnQiLCJ2ZXJzaW9uIjoyLCJuYmYiOjE2ODM2MTY1MjAsImFjY2Vzc19rZXkiOiI2NDU1ZWE4Mjk1ZjE5NGQ1ZTUwOTczYTAifQ.iMTTI5WFmV1TrE3MMWiwsE-C2b4y36WqBYp0hYLp864"
      }
    }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        navigate(`/meet/${res?.data?.id}`)
      }
    })
  }

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span>
          <IconButton icon={<BsFillCameraVideoFill />} onClick={handleRoom} />
          <IconButton icon={<ViewIcon />} onClick={onOpen} mx="4" />
        </span>
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user[0]?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user[0]?.pic}
              alt={user[0]?.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user[0]?.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

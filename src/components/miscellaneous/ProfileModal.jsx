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
  useToast
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { BsFillCameraVideoFill } from "react-icons/bs"
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ProfileModal = ({ users, children }) => {
  // console.log(users)
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const hmsActions = useHMSActions();
  const { user } = ChatState();
  // console.log(user)
  const toast = useToast()
  const handleRoom = async () => {
    await axios.post("https://api.100ms.live/v2/rooms", {
      name: users?.email
    }, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_MANAGEMENT_TOKEN}`
      }
    }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        navigate(`/meet/${res?.data?.id}`, { state: true })
      }
    }).catch((err) => {
      toast({
        title: err.response.data.message,
        description: err.response.data.details,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })
  }
  // console.log(users)
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span>
          {/* <IconButton icon={<BsFillCameraVideoFill />} onClick={handleRoom} /> */}
          <IconButton icon={<ViewIcon />} onClick={onOpen} mx="4" />
        </span>
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="30px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {users.length === undefined ? users?.name : user?._id === users[0]?._id ? users[1]?.name : users[0]?.name}
            {/* {user?._id === users[0]?._id ? users[1]?.name : users[0]?.name} */}
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
              src={users.length === undefined ? users?.pic : user?._id === users[0]?._id ? users[1]?.pic : users[0]?.pic}
              alt={users.length === undefined ? users?.name : user?._id === users[0]?._id ? users[1]?.name : users[0]?.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              width="100%"
            >
              Email: {users.length === undefined ? users?.email : user?._id === users[0]?._id ? users[1]?.email : users[0]?.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

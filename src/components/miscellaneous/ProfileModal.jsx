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
import { BsFillCameraVideoFill } from "react-icons/bs"
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ProfileModal = ({ user, children }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const hmsActions = useHMSActions();
  console.log(user)
  const toast = useToast()
  const handleRoom = async () => {
    await axios.post("https://api.100ms.live/v2/rooms", {
      name: user?.email
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
            {user[0] ? user[0].name : user?.name}
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
              src={user[0] ? user[0].pic : user?.pic}
              alt={user[0] ? user[0].name : user?.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user[0] ? user[0].email : user?.email}
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

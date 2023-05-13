import React from "react";
import {
    useHMSActions,
    useHMSStore,
    selectPeers,
    selectLocalPeer,
    selectIsLocalAudioEnabled,
    selectIsLocalVideoEnabled,
    selectPermissions,
    selectIsLocalScreenShared,
} from "@100mslive/react-sdk";
import { AiOutlineAudio, AiOutlineAudioMuted } from 'react-icons/ai'
import { FiVideo, FiVideoOff } from 'react-icons/fi'
import { useNavigate } from "react-router-dom";
import {
    useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from "@chakra-ui/react";

function Controls({ switches }) {
    const hmsActions = useHMSActions();
    const localPeer = useHMSStore(selectLocalPeer);
    const peers = useHMSStore(selectPeers);
    const host = localPeer.roleName === "host";
    const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
    const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
    const isLocalScreenShared = useHMSStore(selectIsLocalScreenShared);
    const { isOpen: isOpenEndRoom, onOpen: onOpenEndRoom, onClose: onCloseEndRoom } = useDisclosure();
    const { isOpen: isOpenExitRoom, onOpen: onOpenExitRoom, onClose: onCloseExitRoom } = useDisclosure();
    const SwitchAudio = async () => {
        //toggle audio enabled
        await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
    };
    const ScreenShare = async () => {
        //toggle screenshare enabled
        await hmsActions.setScreenShareEnabled(!isLocalScreenShared);
    };
    const SwitchVideo = async () => {
        //toggle video enabled
        await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
    };

    const ExitRoom = () => {
        hmsActions.leave();
        //exit a room
        navigate("/chats", { replace: true })
    };

    const permissions = useHMSStore(selectPermissions);
    const navigate = useNavigate();
    const endRoom = async () => {
        const lock = false; // A value of true disallow rejoins
        const reason = "Meeting is over";
        await hmsActions.endRoom(lock, reason);
        navigate("/chats", { replace: true })
    };

    return (
        <div className=" w-full h-full flex flex-row gap-2 justify-center items-center text-white font-semibold">
            <span
                className=" uppercase px-5 py-2 hover:bg-blue-600"
                onClick={SwitchVideo}
            >
                {isLocalVideoEnabled ? <FiVideo /> : <FiVideoOff />}
            </span>
            <span
                className=" uppercase px-5 py-2 hover:bg-blue-600"
                onClick={SwitchAudio}
            >
                {isLocalAudioEnabled ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
            </span>

            {host ? (
                <>
                    <button
                        className=" uppercase px-5 py-2 hover:bg-blue-600"
                        onClick={ScreenShare}
                    >
                        Screen Share
                    </button>
                    {permissions.endRoom ? (
                        <button
                            className=" uppercase px-5 py-2 hover:bg-blue-600"
                            onClick={onOpenEndRoom}
                        >
                            Exit Meeting
                        </button>
                    ) : null}
                </>
            ) : (
                <>
                    <button
                        className=" uppercase px-5 py-2 hover:bg-blue-600"
                        onClick={onOpenExitRoom}
                    >
                        Exit Meeting
                    </button>
                </>
            )}
            <Modal isOpen={isOpenEndRoom} onClose={onCloseEndRoom}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Leave Meeting ?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Leave ?
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onCloseEndRoom}>
                            No
                        </Button>
                        <Button colorScheme='blue' onClick={endRoom}>Yes</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenExitRoom} onClose={onCloseExitRoom}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Leave Meeting ?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are You Sure To Leave ?
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onCloseExitRoom}>
                            No
                        </Button>
                        <Button colorScheme='blue' onClick={ExitRoom}>Yes</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default Controls;

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


function Controls({ switches }) {
    const hmsActions = useHMSActions();
    const localPeer = useHMSStore(selectLocalPeer);
    const peers = useHMSStore(selectPeers);
    const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
    const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
    const isLocalScreenShared = useHMSStore(selectIsLocalScreenShared);
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
    console.log("permissions", permissions)
    const navigate = useNavigate();
    const endRoom = async () => {
        //end the meeting
        // try {
        const lock = false; // A value of true disallow rejoins
        const reason = "Meeting is over";
        await hmsActions.endRoom(lock, reason);
        // } catch (error) {
        //     // Permission denied or not connected to room
        //     console.error(error);
        // }
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

            <>
                {permissions.endRoom ? (
                    <button
                        className=" uppercase px-5 py-2 hover:bg-blue-600"
                        onClick={endRoom}
                    >
                        Exit Meeting
                    </button>
                ) : <button
                    className=" uppercase px-5 py-2 hover:bg-blue-600"
                    onClick={ExitRoom}
                >
                    Exit Meeting
                </button>}
            </>

        </div>
    );
}

export default Controls;

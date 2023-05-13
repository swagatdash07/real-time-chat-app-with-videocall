import { useEffect, useState } from 'react'
import { ChatState } from "../Context/ChatProvider";
import axios from 'axios';
import {
    selectIsConnectedToRoom,
    useHMSActions,
    selectLocalPeer,
    useHMSStore,
} from "@100mslive/react-sdk";
import Room from "./Room";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Button, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
export default function Meet() {
    const { user } = ChatState();
    // console.log(user)
    const { state } = useLocation();
    const navigate = useNavigate();

    const localPeer = useHMSStore(selectLocalPeer);
    const { room_id } = useParams();
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const endPoint = "https://prod-in2.100ms.live/hmsapi/swagat-videoconf-1945.app.100ms.live/";
    const [token, setToken] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const getToken = async () => {
        // console.log("token hit")
        await axios.post(`${endPoint}api/token`, {
            "user_id": user?.email,
            type: "app",
            role: state ? "host" : "guest",
            room_id: room_id
        }).then((res) => {
            // console.log("room", res)
            if (res.status === 200) {
                setToken(res?.data?.token);
                hmsActions.join({
                    userName: user?.name || 'Fetching',
                    authToken: res.data.token,
                    settings: {
                        isAudioMuted: true,
                    },
                })
            }
        }).catch((err) => {
            throw new Error(err)
        })
    }

    useEffect(() => {
        // console.log('Running', user)
        if (user?.name) getToken();
    }, [user, showConfirmation]);
    return (
        <div>
            {
                !isConnected ?
                    <div className="h-screen flex justify-center items-center bg-slate-800">
                        <div className="flex flex-col gap-6 mt-8">
                            {/* <input type="text" placeholder="John Doe" className="focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600" value={user?.name} readOnly />
                            <button className="flex-1 text-white bg-blue-600 py-3 px-10 rounded-md">Join</button> */}
                            <h1 className="text-white">Loading...</h1>
                            <Button onClick={() => navigate("/chats")}>Back to Chat</Button>
                        </div>
                    </div> : <Room user={user} roomID={room_id} token={token} state={state} showConfirmation={showConfirmation} setShowConfirmation={setShowConfirmation} />
            }

        </div>

    )
}

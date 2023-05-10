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
import { useParams } from 'react-router-dom';
export default function Meet() {
    const { user } = ChatState();
    // console.log(user)
    const localPeer = useHMSStore(selectLocalPeer);
    const { room_id } = useParams();
    console.log(room_id)
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const endPoint = "https://prod-in2.100ms.live/hmsapi/swagat-videoconf-1945.app.100ms.live/";

    const getToken = async () => {
        await axios.post(`${endPoint}api/token`, {
            "user_id": user?.email,
            type: "app",
            role: "host",
            room_id: room_id
        }).then((res) => {
            console.log("room", res)
            if (res.status === 200) {
                hmsActions.join({
                    userName: user?.name || "Fetching",
                    // userName: "Asd",
                    authToken: res?.data?.token,
                    // name: user?.name,
                    settings: {
                        isAudioMuted: true,
                    },
                    // role: localPeer.isLocal ? "host" : guestRole
                });
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => {
        // console.log('Running', user)
        if (user?.name)
            getToken();
    }, [user]);
    
    return (
        <div>
            {
                !isConnected ?
                    <div className="h-screen flex justify-center items-center bg-slate-800">
                        <div className="flex flex-col gap-6 mt-8">
                            {/* <input type="text" placeholder="John Doe" className="focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600" value={user?.name} readOnly />
                            <button className="flex-1 text-white bg-blue-600 py-3 px-10 rounded-md">Join</button> */}
                            <h1 className="text-white">Loading...</h1>
                        </div>
                    </div> : <Room user={user} />
            }
        </div>

    )
}

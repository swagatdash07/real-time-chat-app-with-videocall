import { React, useEffect, useRef } from "react";
import {
    useHMSActions,
    useHMSStore,
    selectLocalPeer,
    selectCameraStreamByPeerID,
} from "@100mslive/react-sdk";

function VideoSpaces({ peer, islocal, user }) {
    const hmsActions = useHMSActions();
    const videoRef = useRef(null);
    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
    useEffect(() => {
        (async () => {
            if (videoRef.current && videoTrack) {
                if (videoTrack.enabled) {
                    await hmsActions.attachVideo(videoTrack.id, videoRef.current);
                } else {
                    await hmsActions.detachVideo(videoTrack.id, videoRef.current);
                }
            }
        })();
    }, [videoTrack]);
   
    return (
        <span>
            <span>
                <video
                    ref={videoRef}
                    autoPlay={true}
                    playsInline
                    muted={true}
                    className={`object-cover h-40 w-40 rounded-lg mt-12 shadow-lg" ${islocal ? "mirror" : ""
                        }`}
                ></video>
                <span className=" text-white font-medium text-lg uppercase">
                    <h3>{!peer?.name ? user : peer?.name}</h3>
                </span>
            </span>
        </span>
    );
}

export default VideoSpaces;

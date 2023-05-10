import { Box } from "@chakra-ui/layout";
import { useState, useEffect } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        // get the video track
        const videoTrack = stream.getVideoTracks()[0];

        // stop the track to turn off the camera
        videoTrack.stop();
      })
      .catch(function (error) {
        console.log('Error accessing camera:', error);
      })
  }, [])
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}

        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;

import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route, Routes } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import Meet from "./Pages/Meet";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} exact />
        <Route path="/chats" element={<Chatpage />} />
        <Route path="/meet/:room_id" element={<Meet />} />
      </Routes>
    </div>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { InviteCode } from "./pages/InviteCode";
import { Scan } from "./pages/Scan";
import { InviteComplete } from "./pages/InviteComplete";
import { Home } from "./pages/Home";
import { Chat } from "./pages/Chat";
import { Gallery } from "./pages/Gallery";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/invite-code" element={<InviteCode />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/invite-complete" element={<InviteComplete />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;

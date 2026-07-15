import { Route, Routes } from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { InviteCode } from "./pages/InviteCode";
import { Scan } from "./pages/Scan";
import { VoiceRecord } from "./pages/VoiceRecord";
import { GenerationComplete } from "./pages/GenerationComplete";
import { InviteComplete } from "./pages/InviteComplete";
import { Home } from "./pages/Home";
import { MemberDetail } from "./pages/MemberDetail";
import { Chat } from "./pages/Chat";
import { Gallery } from "./pages/Gallery";
import { Profile } from "./pages/Profile";
import { RequireSession } from "./components/RequireSession";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/invite-code" element={<InviteCode />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/voice-record" element={<VoiceRecord />} />
      <Route path="/generation-complete" element={<GenerationComplete />} />
      <Route path="/invite-complete" element={<InviteComplete />} />
      <Route
        path="/home"
        element={
          <RequireSession>
            <Home />
          </RequireSession>
        }
      />
      <Route
        path="/member/:memberId"
        element={
          <RequireSession>
            <MemberDetail />
          </RequireSession>
        }
      />
      <Route
        path="/chat"
        element={
          <RequireSession>
            <Chat />
          </RequireSession>
        }
      />
      <Route
        path="/gallery"
        element={
          <RequireSession>
            <Gallery />
          </RequireSession>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireSession>
            <Profile />
          </RequireSession>
        }
      />
    </Routes>
  );
}

export default App;

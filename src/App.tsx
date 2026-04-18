import { BrowserRouter, Route, Routes } from "react-router-dom";
import WaitingRoomPage from "./pages/waiting-room";
import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WaitingRoomPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

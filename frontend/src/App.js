import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { Toaster } from "react-hot-toast";
import Chat from "./pages/Chat";
import AuthRoute from "./components/protected_routes/AuthRoute";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Authentication />}></Route>
        <Route path="/user" element={<AuthRoute />}>
          <Route path="chat" element={<Chat />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;

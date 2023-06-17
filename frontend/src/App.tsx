import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { PlayingNow } from "./components/PlayingNow";
import AuthService from "./api/auth.service";

function App() {
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    AuthService.getCurrentUser().then((user) => {
      setLogged(!!user);
      setLoading(false);
    });
  }, []);

  if (loading || !logged) {
    return <></>;
  }

  return (
    <>
      <PlayingNow></PlayingNow>
    </>
  );
}

export default App;

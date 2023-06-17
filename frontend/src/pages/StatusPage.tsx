import { useEffect, useState } from "react";
import AuthService from "../api/auth.service";
import { PlayingNow } from "../components/PlayingNow";

export default function StatusPage() {
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

import { useEffect, useState } from "react";
import css from "../css/PlayingNow.module.css";
import UsersService from "../api/users.service";
import {
  selectPlayer,
  usePlayerReducers,
} from "../features/player/playerSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import store, { RootState } from "../store";

export function PlayingNow() {
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);

  const [hidden, setHidden] = useState(true);
  const [lastPlayer, setLastPlayer] = useState<RootState["player"] | null>(
    null
  );
  const player = useSelector(selectPlayer);

  const { setStatus } = usePlayerReducers();

  const dispatch = useAppDispatch();

  const toggleVisibility = () => {
    setHidden((state) => !state);
  };

  const showAndHide = () => {
    setHidden(false);

    setTimeout(() => {
      setHidden(true);
    }, 10000);
  };

  const checkState = async () => {
    let playerStat = await UsersService.getCurrentPlayerStatus();

    if (playerStat == "not_available" || !playerStat) {
      setAvailable(false);
      setLoading(false);
      return;
    }

    dispatch(setStatus(playerStat));
    setLoading(false);

    return;
  };

  const checkLoop = async () => {
    await checkState();
    setTimeout(checkLoop, 2000);
  };

  useEffect(() => {
    checkLoop();
  }, []);

  useEffect(() => {
    if (loading || !available) return;

    if (!lastPlayer && player.status) {
      showAndHide();
      setLastPlayer(player);
      return;
    }

    if (
      lastPlayer &&
      player.status.is_playing == lastPlayer.status.is_playing &&
      player.status.item.id == lastPlayer.status.item.id
    )
      return;

    showAndHide();
    setLastPlayer(player);
  }, [player]);

  if (loading || !available) {
    return <></>;
  }
  return (
    <>
      <div
        className={
          css["playing-now-container"] + (hidden ? " " + css["hidden"] : "")
        }
      >
        <div className={css["playing-now"]}>
          <div className={css["album-image"]}>
            <img src={player.status.item.album.images[0].url} alt="" />
          </div>
          <div className={css["playing-content"]}>
            <div className={css["song-name"]}>{player.status.item.name}</div>
            <div className={css["song-author"]}>
              {(player.status.item.artists as any[])
                .map((artist) => artist.name)
                .join(", ")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

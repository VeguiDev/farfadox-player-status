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

  const [hidden, setHidden] = useState(false);
  const [lastPlayer, setLastPlayer] = useState<RootState["player"] | null>(
    null
  );
  const player = useSelector(selectPlayer);

  const { setStatus } = usePlayerReducers();

  const dispatch = useAppDispatch();

  const showAndHide = () => {
    setHidden(false);

    setTimeout(() => {
      setHidden(true);
    }, 10000);
  };

  const checkState = async () => {
    let playerStat = await UsersService.getCurrentPlayerStatus();

    if (
      playerStat == "not_available" ||
      !playerStat ||
      playerStat.currently_playing_type == "ad"
    ) {
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

  useEffect(() => {
    let interval = setInterval(() => {
      if (!player.isPaused && player.isPlaying && hidden) {
        showAndHide();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [lastPlayer, hidden]);

  if (loading || !available || player.status == null) {
    return <></>;
  }

  const shortString = (text: string, max_length: number) => {
    if (text.length < max_length) return text;

    return text.slice(0, max_length) + "...";
  };

  let authors: any[] = player.status.item.artists;

  let songName = shortString(player.status.item.name, 25),
    songAuthors = shortString(
      authors.map((artist) => artist.name).join(", "),
      45
    );

  return (
    <>
      <div
        className={
          css["playing-now-container"] + (hidden ? " " + css["hidden"] : "")
        }
      >
        <div
          className={
            css["playing-now"] + (player.isPaused ? " " + css["paused"] : "")
          }
        >
          <div className={css["album-image"]}>
            <img src={player.status.item.album.images[0].url} alt="" />
            <i className={css["pause-stat"] + " fa-solid fa-pause"}></i>
          </div>
          <div className={css["playing-content"]}>
            <div className={css["song-name"]}>{songName}</div>
            <div className={css["song-author"]}>{songAuthors}</div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import css from "../css/PlayingNow.module.css";

export function PlayingNow() {
  const [hidden, setHidden] = useState(true);

  const toggleVisibility = () => {
    setHidden((state) => !state);
  };

  return (
    <>
      <button onClick={toggleVisibility}>Toggle Visibility</button>
      <div
        className={
          css["playing-now-container"] + (hidden ? " " + css["hidden"] : "")
        }
      >
        <div className={css["playing-now"]}>
          <div className={css["album-image"]}>
            <img
              src="https://i.pinimg.com/474x/e2/e8/9e/e2e89eb6dd581f7f0a8a05a13675f4d4.jpg"
              alt=""
            />
          </div>
          <div className={css["playing-content"]}>
            <div className={css["song-name"]}>Canción mistica</div>
            <div className={css["song-author"]}>Artista</div>
          </div>
        </div>
      </div>
    </>
  );
}

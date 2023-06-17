import css from "../css/MessageBox.module.css";

export function SuccessLoginPage() {
  return (
    <div className={css["message-box"]}>
      <h1 className={css["success"]}>
        <i className="fa-solid fa-check-circle"></i>
      </h1>
      <h4>Inicio de sesión completo</h4>
    </div>
  );
}

export function LoginFailPage() {
  return (
    <div className={css["message-box"]}>
      <h1 className={css["danger"]}>
        <i className="fa-solid fa-xmark-circle"></i>
      </h1>
      <h4>Inicio de sesión fallido</h4>
    </div>
  );
}

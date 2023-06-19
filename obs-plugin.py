import subprocess
import threading
import os
import obspython as S
import webbrowser

process = []
path = ""
thread = None


class Controller:
    def create_browser_source(self):
        current_scene = S.obs_frontend_get_current_scene()
        scene = S.obs_scene_from_source(current_scene)
        settings = S.obs_data_create()

        S.obs_data_set_string(settings, "url", "http://localhost:8000")
        S.obs_data_set_int(settings, "width", 580)
        S.obs_data_set_int(settings, "height", 180)

        source = S.obs_source_create_private("browser_source", "test_py", settings)

        S.obs_scene_add(scene, source)

        S.obs_scene_release(scene)
        S.obs_data_release(settings)
        S.obs_source_release(source)


def busy_thread(path):
    pro = subprocess.Popen([path + "run_backend.bat"], cwd=path, shell=True)

    process.append(pro)

    pro.wait()


conf = Controller()


def script_load(conf):
    print("Plugin loaded")

    global path
    global thread

    path = script_path()

    if not thread or not thread.is_alive():
        thread = threading.Thread(target=busy_thread, args=(path,))
        thread.start()


def script_unload():
    print("Plugin unloaded")

    for p in process:
        print("KILLING")
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(p.pid)])


def add_pressed(props, prop):
    conf.create_browser_source()


def open_spotify_pressed(props, prop):
    webbrowser.open("http://localhost:8000/api/auth/oauth", 1)


def script_description():
    return "Plugin que añade un componente para mostrar la canción que se esta reproduciendo en Spotify."


def script_properties():
    props = S.obs_properties_create()
    S.obs_properties_add_button(
        props, "add_to_scene", "Añadir a la escena", add_pressed
    )
    S.obs_properties_add_button(
        props, "link_spotify", "Vincular Spotify", open_spotify_pressed
    )
    return props

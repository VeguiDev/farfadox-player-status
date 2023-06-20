import subprocess
import threading
import os
import obspython as S
import webbrowser
import json
import queue
import time

message_queue = queue.Queue()

process = []
path = ""
thread = None
props = None

status = {
    "isLogged": False,
    "ready": False,
    "controllers": {"link_spotify": False, "add_to_scene": False},
}

add_button = None
link_spotify_button = None


class Controller:
    def create_browser_source(self):
        current_scene = S.obs_frontend_get_current_scene()
        scene = S.obs_scene_from_source(current_scene)
        settings = S.obs_data_create()

        S.obs_data_set_string(settings, "url", "http://localhost:8000")
        S.obs_data_set_int(settings, "width", 590)
        S.obs_data_set_int(settings, "height", 190)

        source = S.obs_source_create_private("browser_source", "test_py", settings)

        S.obs_scene_add(scene, source)

        S.obs_scene_release(scene)
        S.obs_data_release(settings)
        S.obs_source_release(source)


def refershAllBrowsers():
    print("refresh")
    sources = S.obs_enum_sources()

    if not sources == None:
        for source in sources:
            source_id = obspython.obs_source_get_unversioned_id(source)
            if source_id == "browser_source":
                print("refreshing")
                properties = S.obs_source_properties(source)
                property = S.obs_properties_get(properties, "refreshnocache")
                S.obs_property_button_clicked(property, source)
                S.obs_properties_destroy(properties)
        S.source_list_release(sources)


def setIsLogged(isLogged):
    global status

    status["isLogged"] = isLogged

    if isLogged:
        status["controllers"]["link_spotify"] = False
        status["controllers"]["add_to_scene"] = True
    else:
        status["controllers"]["link_spotify"] = True
        status["controllers"]["add_to_scene"] = False


def process_message(message):
    msgKeys = message.keys()

    if "type" in msgKeys:
        type = message["type"]

        if type == "READY":
            print("Backend ready!")
            # setIsLogged(message["type"]["data"]["isLogged"])
            refershAllBrowsers()
        elif type == "SUCCESS_LOGIN":
            # setIsLogged(True)
            refershAllBrowsers()


def process_line(line: str):
    if line.startswith("[[MSG_LINE]]"):
        lineparts = line.split(":")

        if not len(lineparts) > 1:
            return

        del lineparts[0]

        rawMsg = ":".join(lineparts)

        try:
            msg = json.loads(rawMsg)

            message_queue.put(msg)

        except Exception as ex:
            print("Can't parse backend message", ex)
            print(line)

    else:
        print(line)


def busy_thread(path):
    global process

    pro = subprocess.Popen(
        [path + "run_backend.bat"],
        cwd=path,
        stdout=subprocess.PIPE,
        shell=True,
        universal_newlines=True,
    )
    process.append(pro)

    for line in pro.stdout:
        process_line(line.strip())

    pro.wait()


conf = Controller()


def handle_message():
    if not message_queue.empty():
        message = message_queue.get()
        process_message(message)


def script_load(conf):
    print("Plugin loaded")

    global path
    global thread

    path = script_path()

    if not thread or not thread.is_alive():
        thread = threading.Thread(target=busy_thread, args=(path,))
        thread.start()

    S.timer_add(handle_message, 250)


def script_unload():
    global process
    print("Plugin unloaded")

    for p in process:
        print("KILLING")
        print(str(p.pid))
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(p.pid)])
    thread.join()


def add_pressed(props, prop):
    conf.create_browser_source()


def open_spotify_pressed(props, prop):
    webbrowser.open("http://localhost:8000/api/auth/oauth", 1)


def script_description():
    return "Plugin que añade un componente para mostrar la canción que se esta reproduciendo en Spotify."


def script_properties():
    global add_button
    global link_spotify_button
    global props

    props = S.obs_properties_create()

    add_button = S.obs_properties_add_button(
        props, "add_to_scene", "Añadir a la escena", add_pressed
    )

    link_spotify_button = S.obs_properties_add_button(
        props, "link_spotify", "Vincular Spotify", open_spotify_pressed
    )

    return props

import obspython as OBS

class Example:
    def crete_text_source(self):
        current_scene = OBS.obs_frontend_get_current_scene()
        scene = OBS.obs_scene_from_source(current_scene)
        settings = OBS.obs_data_create()

        OBS.obs_data_set_string(
            settings, "text", "The quick brown fox jumps over the lazy dog"
        )
        source = OBS.obs_source_create_private("text_gdiplus", "test_py", settings)
        OBS.obs_scene_add(scene, source)

        OBS.obs_scene_release(scene)
        OBS.obs_data_release(settings)
        OBS.obs_source_release(source)


eg = Example()


def script_description():
    
    return "Esta extesión añade un elemento que muestra el estado del reproductor de Spotify"

def script_load(settings):
    print("loading")


def script_unload():
    print("unloading")

def add_pressed(props, prop):
    eg.crete_text_source()

# def script_update(settings):
    

def script_properties():
    props = OBS.obs_properties_create()    
    OBS.obs_properties_add_button(props, "button", "Add text source", add_pressed)
    return props

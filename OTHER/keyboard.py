from pynput import keyboard

st = ""

def on_press(key):
    global st

    try:
        k = "{0}".format(key.char)
        st += k
        print(st + ':')
    except AttributeError:

        if key == keyboard.Key.space:
            st += " "
            print(st + ':')
        elif key == keyboard.Key.tab:
            st += "\t"
            print(st + ':')

        elif key == keyboard.Key.backspace:
            st = st[0:-1]
            print(st + ':')

        elif key == keyboard.Key.enter:
            st = ''
            print('>>> REINITIALIZED <<<\n:')

        else:
            print('special key {0} pressed'.format(
            key))

def on_release(key):
    if key == keyboard.Key.esc:
        # Stop listener
        return False

# Collect events until released
with keyboard.Listener(
        on_press=on_press,
        on_release=on_release) as listener:
    listener.join()

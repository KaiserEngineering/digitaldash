import time
import subprocess

def get_cpu_temperature():
    temp = subprocess.check_output(["vcgencmd", "measure_temp"]).decode()
    temp = temp.replace("temp=", "").replace("'C\n", "")
    return temp

while True:
    temp = get_cpu_temperature()
    with open("frontend/static/cpu_temp.json", "w") as f:
        f.write(f'{{"temperature": "{temp}"}}')
    time.sleep(5)
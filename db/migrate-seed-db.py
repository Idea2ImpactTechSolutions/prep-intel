import subprocess

def run_command(command):
    # Run the command
    print(f"Running [{command}]")
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    # Check if the command was successful
    if result.returncode == 0:
        print("Command executed successfully:")
        print(result.stdout)
    else:
        print("Command failed with error:")
        print(result.stderr)

    print()


run_command("npx sequelize db:migrate")
run_command("npx sequelize db:seed:all")



#tail -f /dev/null
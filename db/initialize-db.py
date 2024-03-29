import sys
import argparse
import subprocess
from docker.nces import nces_tools
from dotenv import load_dotenv

env_file = './.env.localdb'

# Create an ArgumentParser object
parser = argparse.ArgumentParser(
    description='Apply PREP-INTEL changes to a new database.')

# Add arguments to the parser
parser.add_argument('--ipeds', '-i', action='store_true',
                    help='Download and import ipeds.HD data')
parser.add_argument('--migrations', '-m', action='store_true',
                    help='Run migrations and seeders')
parser.add_argument('--all', '-a', action='store_true',
                    help='Run all setup tasks')
parser.add_argument(
    '--env-file', help='Env file override (default: .env.localdb)')

# Parse the arguments
args = parser.parse_args()

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

if args.env_file:
    env_file = args.env_file

# Load environment variables from .env file
load_dotenv(dotenv_path=env_file)

if args.all:
    nces_tools.build_hd_table(env_file)
    run_command("npx sequelize db:migrate")
    run_command("npx sequelize db:seed:all")
else:
    if args.ipeds:
        nces_tools.build_hd_table(env_file)
    elif args.migrations:
        run_command("npx sequelize db:migrate")
        run_command("npx sequelize db:seed:all")

# Check if no arguments were provided and print the help message
if len(sys.argv) == 1:
    parser.print_help(sys.stderr)
    sys.exit(1)

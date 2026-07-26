import os
import sys
from ftplib import FTP, error_perm

# Load environment variables from .env if present
def load_env():
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    env_vars = {}
    if os.path.exists(env_file):
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env_vars[k.strip()] = v.strip().strip("'\"")
    return env_vars

def ensure_remote_dir(ftp, remote_path):
    dirs = remote_path.strip('/').split('/')
    current = ""
    for d in dirs:
        if not d:
            continue
        current += "/" + d
        try:
            ftp.cwd(current)
        except error_perm:
            try:
                ftp.mkd(current)
                ftp.cwd(current)
            except Exception as e:
                print(f"Error creating directory {current}: {e}")

def deploy():
    env = load_env()
    
    host = env.get('FTP_HOST', os.environ.get('FTP_HOST', 'caremedbill.com'))
    user = env.get('FTP_USER', os.environ.get('FTP_USER', ''))
    passwd = env.get('FTP_PASS', os.environ.get('FTP_PASS', ''))
    remote_root = env.get('FTP_REMOTE_DIR', os.environ.get('FTP_REMOTE_DIR', '/public_html'))

    if not user or not passwd:
        print("❌ Error: Missing FTP credentials!")
        print("Please edit the '.env' file inside 'caremedbill' subfolder with your FTP_USER and FTP_PASS.")
        sys.exit(1)

    print(f"🚀 Connecting to FTP server {host}...")
    try:
        ftp = FTP(host)
        ftp.login(user=user, passwd=passwd)
        print("✅ Successfully logged in!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)

    local_root = os.path.abspath(os.path.dirname(__file__))
    ignore_files = {'.env', '.env.example', 'deploy.py', '.gitignore', '.DS_Store'}
    ignore_dirs = {'.git', '__pycache__', 'node_modules'}

    uploaded_count = 0

    print(f"📤 Uploading files to {remote_root}...")

    for root, dirs, files in os.walk(local_root):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        rel_dir = os.path.relpath(root, local_root)
        if rel_dir == '.':
            target_remote_dir = remote_root
        else:
            target_remote_dir = os.path.join(remote_root, rel_dir).replace('\\', '/')

        ensure_remote_dir(ftp, target_remote_dir)

        for file in files:
            if file in ignore_files or file.startswith('.'):
                continue

            local_file_path = os.path.join(root, file)
            remote_file_path = os.path.join(target_remote_dir, file).replace('\\', '/')

            print(f"   Uploading: {os.path.relpath(local_file_path, local_root)} -> {remote_file_path}")
            try:
                with open(local_file_path, 'rb') as f:
                    ftp.storbinary(f'STOR {remote_file_path}', f)
                uploaded_count += 1
            except Exception as e:
                print(f"   ⚠️ Failed to upload {file}: {e}")

    ftp.quit()
    print(f"\n🎉 Deployment completed successfully! {uploaded_count} files updated live on https://{host}")

if __name__ == '__main__':
    deploy()

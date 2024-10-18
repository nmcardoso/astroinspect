```bash
sudo apt update
sudo apt install python3-venv python3-pip 
python3 -m venv aml
source aml/bin/activate
```

# Install nginx

```bash
sudo apt install nginx
cd /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/aml
```
# Thoramon
Thoramon is a sophisthicated Linux server monitoriong tool that <ins>**doesn't require any installation**</ins> on target machine. Capable of tracking system resource metrics with Docker integration with more features to come. It is recommended to use authentication provided by your reverse proxy or 3rd party auth to prevent unauthorized access

## Why it's better than other alternatives
- Doesn't require any installation on the machine you want to monitor
- Responsive UI on mobile
- Start, stop or restart docker containers from the web app directly
- Support public key based authentication
- Very easy to audit. Files are organized tidily according to each functionalities with straightforward code
- Very little backend external dependencies, only expressjs and better-sqlite3
- easy to install, only `docker compose up -d`
- Very easy to connect to remote machine, no complicated setup at all

## How it works
The app establishes connections to remote machines via SSH that reads system metrics by accessing Linux VFS e.g `/proc` or via utilities e.g `top`. This data is then visualized in a web dashboard and persisted in a database for historical trend analysis. Since it only uses SSH, it doesn't require any installation on the machine you want to monitor.

## Install without docker
1. `git clone` this repo
2. `npm install`
3. `cd svelte`
4. `npm install`
5. `npm run build`
6. `cd ..`
7. `npm run start` -> server will be listening on port 80

## Install with docker
1. `git clone` this repo
2. `docker compose up -d`

## Support
<ins>**Please star this repo to increase it's visibility, contributions are also appreciated!**</ins>

## Screenshots
### Statistics
<img width="1763" height="844" alt="image" src="https://github.com/user-attachments/assets/be9ce2c3-a180-479a-9bbb-d17e376aa6c5" />

### Overview
<img width="1763" height="844" alt="image" src="https://github.com/user-attachments/assets/317afd7e-252f-4e43-8f5a-0443ee6c0b07" />

### Docker
<img width="1763" height="844" alt="image" src="https://github.com/user-attachments/assets/68588e8b-060d-43a2-8cf2-16dac7393285" />





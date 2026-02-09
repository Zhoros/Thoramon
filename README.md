# Thoramon
Thoramon is a sophisthicated Linux server monitoriong tool that <ins>**doesn't require any installation**</ins> on target machine. Capable of tracking system resource metrics with Docker integration with more features to come.

<ins>**Please star this repo if you like it, thank you!**</ins>

## Why it's better than other alternatives
- Doesn't require any installation on the machine you want to monitor
- Responsive UI on mobile
- Start, stop or restart docker containers from the web app directly
- Very easy to audit. Files are organized tidily according to each functionalities with straightforward code
- Very little backend external dependencies, only expressjs and better-sqlite3
- easy to install, only `docker compose up -d`
- Very easy to connect to remote machine, no complicated setup at all

## How it works
The app establishes connections to remote machines via SSH that reads system metrics by accessing Linux VFS e.g `/proc` or via utilities e.g `top`. This data is then visualized in a web dashboard and persisted in a database for historical trend analysis.

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
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/d1f24fb5-f053-40b3-890c-2300947309d1" />

### Overview
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/b0254f29-165b-4502-88b6-d1ac8317cc0d" />

### Docker
<img width="1755" height="840" alt="image" src="https://github.com/user-attachments/assets/2d158398-7487-45aa-868c-0d8cafa53300" />




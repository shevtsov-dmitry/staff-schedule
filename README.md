## launch on ubuntu/debian
### install software
1. install git \
`sudo apt install git`
2. clone repo anywhere you want \
`git clone https://github.com/shevtsov-dmitry/staff-schedule.git`
3. install posgtreSQL\
`sudo apt install postgresql`
4. install curl \
   `sudo apt install curl`
5. install npm and node js
  * `sudo apt-get update`
  * `sudo apt-get install -y ca-certificates curl gnupg`
  * `sudo mkdir -p /etc/apt/keyrings`
  * `curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg`
  * `NODE_MAJOR=20`
  * `echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list`
  * `sudo apt-get update`
  * `sudo apt-get install nodejs -y`

### change database user password
1. make sure database is running (should be active) \
 `systemctl status postgresql`
2. enter database with sudo rules \
   `sudo -u postgres psql`
3. change postgres user password. Initially it set to 123123. \
If you **want to change** user credentials you should modify database autoconfig bash script _(look at the next step in this guide)_ \
 `ALTER USER postgres WITH PASSWORD '123123';` \
 on success you will see ALTER USER
4. exit postgreSQL CLI with __CTRL + Z__

### execute database autoconfig
It will create database, fill it with schema, views, stored procedures and exemplary insert values.
1. go to SQL folder \
   `cd server/SQL`
2. execute script \
   `./launch-database-autoconfig.sh`

### download node.js dependencies
1. open repo with terminal.
2. go to server folder \
   `cd /server`
3. install execution environment _(if some problems will occur in a future with launching try this command again **with sudo**)_ \
   `npm install -g nodemon`
4. install dependencies \
   `npm install`
5. move one folder back and into web \
   `cd ../web`
6. install execution environment \
   `npm install -g vite` 
7. install dependencies \
   `npm install`

### run project
1. go to server folder. \
`cd /server`
2. run command \
`nodemon server.js` \
you should see: server started on port 3000.
3. __open new terminal__ _(you can press + button on top-left corner to open new tab or pres **CTRL + SHIFT + T**)._
4. go to web folder \
   `cd /web`
5. run command \
`npm start`
6. you will see that app successfully started.

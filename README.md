## launch on ubuntu
### install software
1. install git \
`sudo apt install git` 
2. clone repo anywhere you want \
`git clone https://github.com/shevtsov-dmitry/staff_schedule.git`
3. install posgtreSQL\
`sudo apt install postgresql`
4. install npm and node js
   - `sudo apt update`
   - `sudo apt install npm`
   - `sudo apt install node`
5. install pgadmin4
    - `sudo apt install curl`
    - `sudo curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add`
    - `sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && sudo apt update'`
    - `sudo apt install pgadmin4 -y`

### change database user password
1. make sure database is running (should be active) \
 `systemctl status postgresql`
2. enter database with administrator rules \
   `sudo -u postgres psql`
3. change main user (postgres) password. Contain your password into braces __' '__  In my case it is __123123__ \
 `ALTER USER postgres WITH PASSWORD '123123';` \
 on access you will see <u>ALTER USER</u>.
4. exit posgteSQL CLI with __CTRL + Z__

### execute schema scripts in pgadmin4
1. open pgadmin.
2. click servers -> register -> server... \
enter name: staff_schedule 
3. click connection 
   - enter host name/address: localhost
   - enter password: 123123
   - click: save password
   - click save
4. click  databases -> create database \
   enter: staff_schedule \
   click save
5. click on database name and open query tool with mouse click or with __CTRL + SHIFT + Q__
6. open downloaded repo.
7. go to staff_schedule -> server -> SQL
8. Simply drag file __schema.sql__ into query tool into pgadmin or copy text from it there. Press execute with F5.\
Make the same with __prepared_test_insertion_statement.sql__, __views.sql__ files.
9. You can close pgadmin. 

### download node.js dependencies
1. open repo with terminal.
2. go to server folder \
`cd /staff_schedule/server`
3. run commands
   - `sudo npm install -g nodemon`
   - `npm install @json2csv/plainjs body-parser cors express pg`
4. move one folder back and into web
5. run commands
   - `sudo npm install -g vite`
   - `npm install handsontable`

### run project
1. go to server folder. \
`cd /staff_schedule/server`
2. run command \
`nodemon server.js` \
you should see: server started on port 3000.
3. __open new terminal__ (you can press + button on top-left corner).
4. go to web folder \
   `cd /staff_schedule/web`
5. run command \
`npm start`
6. you will see that app successfully started.

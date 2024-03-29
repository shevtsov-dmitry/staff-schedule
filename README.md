## Штатное расписание
Проект, сделанный для курсовой работы по дисциплине "Управление данными".

### Цель проекта
Цель данного проекта заключается в разработке информационной системы, которая будет использоваться для целей автоматизированного хранения, обработки и редактировании информации о штатном расписании с целью эффективного управления персоналом.

### Используемые технологии
+ REST API как основной архитектруный стиль
+ SMTP, IMAP, POP3
+ Javascript
+ Handsontable API - библиотека, позволяющая сделать удобную интерактивную таблицу как Excel.
+ Vite - сборщик проекта
+ Node.js
+ Express.js
+ Библиотеки для парсинга XML, CSV и отчётов с Email
+ PostreSQL

### Основные функциональности
После прохождения авторизации, пользователь попадает на главную страницу веб-приложения, где ему предоставляются возможности:
+ Выбор таблицы, редактирование имеющихся записей из базы данных и их сохранение.
+ Добавление новых, удаление старых записей.
+ Использование заготовленных автоматизированных хранимых процедур и триггеров PostreSQL для сложных операций.
+ Формирование отчётов, их отправка или выгрузка на Email.
+ Скачивание отчёта на свой компьютер мгновенно или по таймеру.

![main-page.png](README%20images%2Fmain-page.png)

### Схема базы данных
Краткое описание:
+ В отделах есть сотрудники и связанные с ними рабочие места.
+ Сотрудники работают в определенных отделах и занимают определенные должности.
+ Рабочие места относятся к конкретным отделам и связанны с должностями.
+ У сотрудников есть записи о зарплате, и каждая запись о зарплате связана с сотрудником.
+ Отделы связаны с местоположениями.
+ Сотрудники могут входить в графики расписания смен, а них может быть несколько сотрудников.

![db.png](README%20images%2Fdb.png)

## запуск на ubuntu/debian
### установить программное обеспечение
1. установите git \
   `sudo apt install git`
2. клонируем репозиторий куда угодно \
   `git clone https://github.com/shevtsov-dmitry/staff-schedule.git`
3. установить posgtreSQL\
   `sudo apt install postgresql`
4. установите curl \
   `sudo apt install curl`. 
5. установите npm и node js \
`sudo apt-get update` \
`curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - &&\` \
``sudo apt-get install -y nodejs`` \

### изменение пароля пользователя базы данных
1. убедитесь, что база данных запущена (должна быть активной)\
   `systemctl status postgresql`.
2. войдите в базу данных с правилами sudo \
   `sudo -u postgres psql`
3. измените пароль пользователя postgres. Изначально он был установлен на 123123. \
   Если вы **хотите изменить** учетные данные пользователя, вам следует изменить скрипт автоконфигурации базы данных на bash _(смотрите следующий шаг в этом руководстве)_ \
   `ALTER USER postgres WITH PASSWORD '123123';` \
   в случае успеха вы увидите ALTER USER
4. выйдите из PostgreSQL CLI с помощью __CTRL + Z__.

### выполнить автоконфигурацию базы данных
Она создаст базу данных, заполнит ее схемой, представлениями, хранимыми процедурами и тестовыми данными.
1. перейдите в папку SQL \
   `cd server/SQL`
2. выполните скрипт \
   `./launch-database-autoconfig.sh`

### скачать зависимости node.js
1. откройте корневую папку проекта с помощью терминала.
2. перейдите в папку сервера \
   `cd /server`
3. установите зависимости \
   `npm install`
4. переместите одну папку назад и в web \
   `cd ../web`
5. устанавливаем сборщик проекта \
   `npm install -g vite`
6. устанавливаем зависимости \
   `npm install`

### запустить проект
1. перейдите в папку сервера. \
   `cd /server`
2. выполните команду \
   `node server.js` \
   вы должны увидеть: server started on port 3000.
3. Откройте новый терминал__ _(вы можете нажать кнопку + в левом верхнем углу, чтобы открыть новую вкладку или **CTRL + SHIFT + T**)._
4. перейдите в папку web \
   `cd /web`
5. выполните команду \
   `npm start`
6. Вы увидите, что приложение успешно запущено.

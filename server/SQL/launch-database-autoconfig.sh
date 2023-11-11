#!/bin/bash

# PostgreSQL connection parameters
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="123123"
DB_NAME="staff_schedule"

# export variable to avoid input password popup
export PGPASSWORD="$DB_PASSWORD"

# Create database
# Execute SQL scripts in the created database in determined order
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
SQL_FILE="schema.sql"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SQL_FILE
SQL_FILE="stored_procedures.sql"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SQL_FILE
SQL_FILE="views.sql"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SQL_FILE
SQL_FILE="prepared_test_insertion_statement.sql"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SQL_FILE

# forget password after script completed execution
unset PGPASSWORD

echo "Executed successfully 🮱";
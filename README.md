# extract-sql-from-script

This extension is built to make it easier for data engineers to prepare SQL queries to be included Python scripts (eg Airflow DAGs), and extract SQL queries from scripts.


## Features

* Extract queries from a python script into a new document. 
* Replace variable names with test values, maintaining the original text in commented line.
* Toggle between variable names and test values.
* Test variable values are defined in a block comment within the query


![Snippet](images/extract-query.gif)

## Commands (Cmd+P or Ctrl+P)

* `SQL Extractor: extract query from script`
* `SQL Extractor: sub variable names into query`
* `SQL Extractor: sub test variable values into query`

## Test variable substitution

Insert a comment block for substituting test variables into a query when extracting from a python script. Start typing 

```
      /* test variables for substitution
         {variables.source_project_id}:
         {processing_date}: 2020-01-01
         end test variables */
 ```

**Start typing** `test variables for substitution` into a `python` or `sql` document to insert a template snippet. 

## Required document structure

The query extractor will look at all text contained between a line ending in `f"""` and a line of `"""`.

```
dim_employee = f"""
    SELECT
      first_name
    FROM
      employee_table
"""
 ```
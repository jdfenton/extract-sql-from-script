# Extract SQL Queries from Python Scripts

This extension is built to make it easier for data engineers to extract SQL queries from python scripts (eg Airflow DAGs), and toggle python variables in/out of SQL queries.


## Features

* Extract queries from a python script into a new document. 
* Replace variable names with test values, maintaining the original text in an adjacent comment.
* Toggle between variable names and test values.
* Test variable values are defined in a block comment within the query


![demo-gif](images/extract-query.gif)

## Commands (Cmd+Shift+P or Ctrl+Shift+P)

* `SQL Extractor: extract query from script`
* `SQL Extractor: sub variable names into query`
* `SQL Extractor: sub test variable values into query`

<br/>

## Extracting SQL from a python script
Initiate using `SQL Extractor: extract query from script` from the command palate.

Queries must be contained in a multi-line string between `"""` and `"""`.

For example:
```
  dim_employee = f"""
    SELECT
      first_name
    FROM
      employee_table
  """
 ```

> For documents with more than one query, a dropdown selection will list all queries by variable name (ie "dim_employee" in the example above)

<br/>

## Variable substitution

Variable names and test values need to be in a comment block within the multi-line SQL string

* Variable comment block must start with `/* test variables for substitution` and end with `end test variables */` (on new lines).
* Variable names and values need to be separated with a colon, with one variable + value per line.
* Names and values should not be enclosed in quotations, nor be separated with a comma.

eg
```
      /* test variables for substitution
         {variables.source_project_id}: project
         {processing_date}: 2020-01-01
         end test variables */
 ```

> Insert a snippet for this comment block, start typing `test variables for substitution` into a `python` or `sql` document.

<br/>

### Substituting test values into a query

Test variables will be substituted into queries when it is first extracted from a Python script. The command `SQL Extractor: sub test variable values into query` can also be run on any SQL document.

eg
```
FROM {variables.source_project_id}
```
will become
```
FROM project  --Substituted from: FROM {variables.source_project_id}
```

Query lines that already contain `--Substituted from:` will not be changed.

<br/>

### Substituting variable names back into a query

The command `SQL Extractor: sub variable names into query` will revert query lines to whatever follows `--Substituted from:` in the same line.

# Change Log

## 0.0.6 - 2020-07-27

-Changed: allow any query contained between `"""` and `"""`, including single line queries.
-Changed: use `Unnamed query` where a query name cannot be discerned (eg `dim_employee = """...` )
-Fixed: issues with cleaning up query list (queries must contain the word `select`).


## 0.0.5 - 2020-06-12

-Changed: removed white space from the search string `--Substituted from:`.


## 0.0.4 - 2020-06-10

-Changed: query read function to consider all multi line strings inside tripple quotes `"""`, previously only f-strings were considered.
-Fixed: only the first instance of a variable was replaced where the same variable existed twice on the same line.


## 0.0.2 - 2020-06-09

-Fixed: to correctly read files where new lines are denoted with `\r\n` or `\r`. Previously only `\n` was considered.


## 0.0.1 - 2020-06-07

- Initial release


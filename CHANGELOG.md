# Change Log

All notable changes to the "extract-sql-from-script" extension will be documented in this file.


## 0.0.4 - 2020-06-10

-Changed: query read function to consider all multi line strings inside tripple quotes `"""`, previously only f-strings were considered.
-Fixed: only the first instance of a variable was replaced where the same variable existed twice on the same line.


## 0.0.2 - 2020-06-09

-Fixed: to correctly read files where new lines are denoted with `\r\n` or `\r`. Previously only `\n` was considered.


## 0.0.1 - 2020-06-07

- Initial release


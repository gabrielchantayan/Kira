# Commit #3
Added ability to set helper role

Added "Added `syntaxError` to locale" to changelog for Commit #2

Added `error` to locale

Changed `bot settings` to `bot settings.js` in changelog for consistency

Changed `utils.read()` to parse JSON

Removed JSON parsing from anywhere that used `utils.read()`, as the function now does it on its own


# Commit #2
Added changelog

Added `syntaxError` to locale

Added `bot settings.js` to default-enabled modules

Changed `setguildroles` to `permissions`

Changed `load`, `unload`, and `reload` to handle modules with spaces in their names

Changed `permissions` from `admin.js` to `bot settings.js`

Removed `config copy.json`

Removed tracking from `token.json`

# Commit #1
Initial commit
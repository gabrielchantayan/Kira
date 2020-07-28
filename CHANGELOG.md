# Commit #11
**28 July 2020**

Added message when using `shutdown` command

Cleaned up `profiles.js` code

Removed `economy.js` and `moderation.js` from config auto-load

Removed redundant code from `general.js`

# Commit #10
**28 July 2020**

Added `social` alias for `socials`

More Linux fix stuff

# Commit #10
**28 July 2020**

Hotfix where on Linux systems for *whatever* reason files wouldn't save

# Commit #9
**27 July 2020**

Fix bug where `profileset` is case-sensitive

# Commit #9
**27 July 2020**

Added *"Information about {BOT}* section to the `bot` command, linking to the Github.

Added `socials` command to add social media to profiles

Fixed formatting in changelog for Commit #8

Disabled module version checking code for now


# Commit #8
**27 July 2020**

Added `removefromprofile` command

Added `profileremove` alias for `removefromprofile`

Added *occupation*, *languages*, *likes*, *dislikes*, *favshow*, and *favmovie* fields to profiles

Cleaned up profile field setting code

# Commit #7
**27 July 2020**

Added `authors` field to modules

Added `profile` module

Added `profile` command

Added `profileset` command

Moved birthdays to `profile`

Removed `birthday` module folder

Removed `birthday.js` from auto-load

# Commit #6
**27 July, 2020**

Added dates to changelog

Added module update checking

Changed old `checkVersion` to `checkKiraVersion`

Changed Kira version checking to use `version.json` instead of `config.json`

Removed `version` field from `config.json`, as `version.json` already provides the version number

Fix bug caused by Commit #3 where Kira would attempt to parse already-parsed JSON

# Commit #5
**25 July, 2020**

Added `version` field to `config.json`

Added `node-fetch` dependency

Added update checking for Kira

Added `source` field to modules for update checking

# Commit #4
**25 July, 2020**

Added `version.json`

Added link to `CHANGELOG.md` in `README.md`

Removed version number from `README.md`

# Commit #3
**25 July, 2020**

Added ability to set helper role

Added "Added `syntaxError` to locale" to changelog for Commit #2

Added `error` to locale

Changed `bot settings` to `bot settings.js` in changelog for consistency

Changed `utils.read()` to parse JSON

Removed JSON parsing from anywhere that used `utils.read()`, as the function now does it on its own


# Commit #2
**25 July, 2020**

Added changelog

Added `syntaxError` to locale

Added `bot settings.js` to default-enabled modules

Changed `setguildroles` to `permissions`

Changed `load`, `unload`, and `reload` to handle modules with spaces in their names

Changed `permissions` from `admin.js` to `bot settings.js`

Removed `config copy.json`

Removed tracking from `token.json`

# Commit #1
**23 July, 2020**

Initial commit
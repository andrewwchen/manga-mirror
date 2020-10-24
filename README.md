# Manga-Mirror Discord Bot
A Discord bot for sharing manga recommendations and manga pages from the manga fan-translation website https://mangadex.org/. Manga-Mirror is made using the Discord API with DiscordJS and the unofficial Mangadex API by md-y: https://github.com/md-y/mangadex-full-api.

*For the DALI Lab API challenge*

------------
# Usage
![Image](https://i.imgur.com/50Kggas.png)



------------
# Testing
Try the bot out and see examples at this discord server: https://discord.gg/CpdDrNy.

If you would to add this bot onto your own server, use the following Discord bot invite link: https://discord.com/oauth2/authorize?&client_id=754003102817845299&scope=bot&permissions=11*6736.

**Should the bot not currently be running, and if you would like a demo of the bot, DM me on my Discord: Darude#8096.**

If you would like to host the bot yourself, download the code in this repository and modify "config.json" with your own MangaDex and Discord bot credentials. You will have to create your own MangaDex account and your own Discord bot at the Discord developer portal: https://discord.com/developers/applications.

------------
# Full Command List

#### help, search, id, read, ping, cred

------------
**Name:** help

**Aliases:** commands

**Description:** List all of my commands or info about a specific command.

**Usage:** `!help [command name]`

**Cooldown:** 5 second(s)

------------
**Name:** search

**Aliases:** look, lookup, find, query

**Description:** returns a manga, chapter, or group's information on MangaDex based on its name

**Usage:** `!search <manga/chapter/group> <manga name> [chapter #]`

**Cooldown:** 5 second(s)

------------
**Name:** id

**Aliases:** ids, identify, searchid, lookid, lookupid, findid, queryid, idsearch, idlookup, idquery

**Description:** returns a manga, chapter, or group's information on MangaDex based on its MangaDex ID

**Usage:** `!id <manga/chapter/group> <MD ID #>`

**Cooldown:** 5 second(s)

------------
**Name:** read

**Aliases:** open

**Description:** displays a whole chapter or just a page of a manga based on its MangaDex ID and an optional page number

**Usage:** `!read <chapter MD ID #> [page #]`

**Cooldown:** 15 second(s)

------------
**Name:** ping

**Aliases:** bing

**Description:** ping command

**Cooldown:** 1 second(s)

------------
**Name:** cred

**Aliases:** credits, author

**Description:** shows the author's information

**Cooldown:** 1 second(s)

------------

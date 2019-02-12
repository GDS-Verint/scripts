# scripts (sheffield edit)
Scripts used to update VOF

After a commit, it takes a while for the cache to clear. To get around this go to the purge URL of the resource and do a hard refresh of the page with Ctrl+f5.

Example URL for resource tab:

https://cdn.jsdelivr.net/gh/GDS-Verint/scripts@scripts-sheffield/style-4.css

https://cdn.jsdelivr.net/gh/GDS-Verint/scripts@scripts-sheffield/style-4.js

https://cdn.jsdelivr.net/gh/GDS-Verint/scripts@scripts-sheffield/map.js


Purge URL to clear cache: https://purge.jsdelivr.net/gh/GDS-Verint/scripts@scripts-sheffield/style-4.css

Purge URL to clear cache: https://purge.jsdelivr.net/gh/GDS-Verint/scripts@scripts-sheffield/style-4.js

Purge URL to clear cache: https://purge.jsdelivr.net/gh/GDS-Verint/scripts@scripts-sheffield/map.js

Why are we using jsdelivr.net rather than using the raw?
Because the raw view has a MIME of (text/plain) which prevents the scripts from being used

# sheffield note
jsdelivr doesn't seem to support @latest and @branch at the same time, so might be slower to update than the master.
I recommend editing in a local copy then updating the these files once you know it works, just because there is a limit on the amount of purges you can do per day.

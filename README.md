if chromium is not in the /usr/bin/ then create a symbolic link to it in /usr/bin

```bash
sudo ln -s /nix/store/<chromium-directory>/bin/chromium /usr/bin/chromium-browser
```

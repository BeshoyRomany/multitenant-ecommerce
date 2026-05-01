# Switching to Zsh on WSL (Ubuntu)

This guide explains how to switch from **Bash to Zsh** on Ubuntu running inside WSL and make it the default shell.

---

## 1. Check Current Shell

```bash
echo $SHELL
echo $0
```

---

## 2. Install Zsh (if not installed)

```bash
sudo apt update
sudo apt install zsh -y
```

Verify installation:

```bash
which zsh
```

---

## 3. Temporary Switch to Zsh

This switches only for the current terminal session:

```bash
zsh
```

To go back to bash:

```bash
bash
```

---

## 4. Set Zsh as Default Shell (Recommended)

```bash
chsh -s $(which zsh)
```

Or explicitly:

```bash
chsh -s /usr/bin/zsh
```

Verify change:

```bash
getent passwd $USER
```

Expected output ends with:

```
:/usr/bin/zsh
```

---

## 5. Apply Changes

Close the terminal completely and reopen Ubuntu (WSL).

---

## 6. Force Zsh in WSL (If Needed)

If WSL still opens Bash, force Zsh manually:

Edit bash config:

```bash
nano ~/.bashrc
```

Add at the end:

```bash
exec zsh
```

---

## 7. Confirm Active Shell

```bash
echo $0
```

Expected:

```
-zsh
```

---

## Summary

| Action                | Command                |
| --------------------- | ---------------------- |
| Start Zsh temporarily | `zsh`                  |
| Return to Bash        | `bash`                 |
| Set default shell     | `chsh -s $(which zsh)` |
| Force Zsh (WSL fix)   | `exec zsh`             |

---

## Result

After setup:

- Ubuntu terminal opens with **Zsh by default**
- Works seamlessly with Node, NVM, Bun
- Better development environment for modern tooling

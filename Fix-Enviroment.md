# WSL 2 Professional Environment Setup Guide

**Author:** Beshoy Romany  
**Purpose:** Eliminate EPERM errors and prevent Windows/Linux path conflicts during Full-Stack development.

---

## 1. Environment Isolation (The Interop Split)

By default, WSL inherits the Windows `PATH`. This often causes Linux tools to accidentally call Windows binaries (like `npm.exe`), leading to `EPERM` and `UNC Path` errors. We will disable this behavior to ensure a 100% Linux-pure environment.

### Steps to Disable Interop:

sudo nano /etc/wsl.conf

## 1- Add

[interop]
appendWindowsPath = false

then:
1- Ctrl + Shift + V -> to paste
2- Ctrl + O -> to save
3- Enter key -> to confirm
4- Ctrl + X -> to close

## 2.Add the following configuration (Ini, TOML): to fix code . vscode

sudo sh -c 'echo "[interop]\nappendWindowsPath = false" > /etc/wsl.conf'

then -> open powershell and type "wsl --shutdown"

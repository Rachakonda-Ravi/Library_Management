# Library Management — School & College Edition

A lightweight, modular Library Management System designed for school and college libraries.

The application is a completely client-side web application. It does not require a database server, backend, Node.js, npm, or any external service.

It can be used in two ways:

- **Local/Downloaded Mode** — served through the included `run_local.sh`
- **GitHub Pages** — deployed directly as a static website

Library data is stored in the browser's **LocalStorage**.

---

## Features

### Administrator

The administrator can manage:

- Books
- Students/Members
- Book issuing and returns
- Reservations
- Fines
- Member information
- Library settings
- Themes
- Database backup and restore
- CSV exports
- Notifications and activity information

---

## Book Management

Adding a book requires only:

- **Book Name**
- **Author Name**
- **Number of Copies**

The following information is optional:

- ISBN
- Publisher
- Publication Year
- Genre
- Tags
- Price
- Rating
- Cover URL

Optional information can be added or edited later.

---

## Student Registration

Registering a student requires:

- **Student Name**
- **Roll Number**
- **Email**
- **Phone Number**

The student's login username and password are optional.

This allows a student to exist as a library member without necessarily having access to the member portal.

Roll numbers are used as an important identifier for members.

---

## Member Portal

Members have a separate interface from the administrator dashboard.

A member can view:

- Personal profile
- Roll number
- Currently borrowed books
- Due dates
- Overdue information
- Outstanding fines
- Reservations
- Complete book catalogue
- Number of available copies
- Whether a particular book is:
  - **Borrowed**
  - **Not Borrowed**

Members can also change their own interface theme.

---

## Themes

The application includes multiple themes:

- System
- Light
- Dark
- Ocean
- Forest
- Rose
- Slate
- Violet
- Sunset
- Midnight

The theme control is located at the **top-left** of the interface.

Clicking the theme control opens a popup containing the available themes.

Each theme has its own visual icon, and the currently selected theme is represented by its icon in the top-left control.

Theme selection is also available to members.

Theme preferences are stored locally in the browser.

---

# Local / Downloaded Mode

The downloaded version should normally be run through:

```bash
bash run_local.sh
```

Do not normally open `index.html` directly using `file:///`.

The application contains multiple HTML/CSS/JavaScript files and is designed to be served through HTTP.

---

## Requirements

The local launcher requires:

- Python 3
- Bash-compatible shell

No Python packages are required.

The application uses only Python's built-in HTTP server:

```text
python -m http.server
```

There is no Flask, Django, Node.js, npm, pip package, or database server required.

---

# Installing Python

## Windows

Using `winget`:

```powershell
winget install Python.Python.3.13
```

Then check:

```powershell
python --version
```

or:

```powershell
py --version
```

Git Bash can be used if Python is available through PATH:

```bash
python --version
```

or:

```bash
python3 --version
```

## Ubuntu / Debian / WSL

```bash
sudo apt update
sudo apt install python3
```

Check:

```bash
python3 --version
```

## Fedora

```bash
sudo dnf install python3
```

## Arch Linux

```bash
sudo pacman -S python
```

## macOS

With Homebrew:

```bash
brew install python
```

Check:

```bash
python3 --version
```

---

# Python Dependencies

There are **no external Python dependencies**.

You do **not** need to run:

```bash
pip install ...
```

The local server uses Python's built-in modules only.

---

# Starting Local Mode

Open a Bash-compatible terminal inside the project folder:

```bash
bash run_local.sh
```

The launcher starts a local HTTP server and produces a URL similar to:

```text
http://localhost:10821/index.html
```

It also attempts to:

1. Start the server.
2. Check that the server is ready.
3. Copy the URL to the clipboard.
4. Open the default browser automatically.
5. Keep the server running until it is stopped.

---

# Local Port

The project uses:

```text
.library_port
```

This file contains the preferred local port.

The current default value is:

```text
10821
```

Therefore:

```text
.library_port
```

should contain:

```text
10821
```

The file should contain only the port number.

---

## Changing the Local Port

Open:

```text
.library_port
```

and replace:

```text
10821
```

with another unused port.

For example:

```text
12000
```

Then run:

```bash
bash run_local.sh
```

The application will attempt to use:

```text
http://localhost:12000/index.html
```

### Important: LocalStorage and Port Changes

Browser LocalStorage is associated with the website's origin.

For example:

```text
http://localhost:10821
```

and:

```text
http://localhost:12000
```

are different origins.

Changing the port can therefore make the browser show a different LocalStorage database.

Before deliberately changing the port on an existing installation, create a full JSON backup.

The backup can then be restored on the new port.

---

# Automatic Port Handling

If the port stored in `.library_port` is already being used by another application, `run_local.sh` automatically finds another available port.

The newly selected port is written back to:

```text
.library_port
```

This allows the launcher to reuse that port on the next run whenever it is available.

---

# Local Launcher Controls

After the server starts:

```text
c
```

Copy the current URL to the clipboard.

```text
o
```

Open the current URL in the default browser.

```text
q
```

Stop the local server.

Pressing Enter without a command displays the current URL again.

---

# GitHub Pages

The project is designed to work as a static GitHub Pages website.

The repository contains:

```text
.github/workflows/deploy-pages.yml
```

The main entry point is:

```text
index.html
```

No backend server is required for GitHub Pages.

---

# LocalStorage

All application data is stored in the browser using LocalStorage.

This includes:

- Books
- Members
- Loans
- Reservations
- Fines
- Settings
- Notifications
- Activity information
- Theme preferences
- Other application state

The data remains available after closing and reopening the browser as long as the same browser origin and site data are retained.

---

# Local Mode vs GitHub Pages Data

LocalStorage belongs to a specific browser origin.

Therefore:

```text
http://localhost:10821
```

and a GitHub Pages address such as:

```text
https://username.github.io/repository/
```

have separate LocalStorage databases.

Data entered on localhost does not automatically appear on GitHub Pages.

Likewise, data entered on GitHub Pages does not automatically appear on localhost.

This is normal browser security behavior.

---

# Database Backup

The application provides a complete JSON database backup.

Use the database backup option in the application settings to download a full JSON backup.

The backup can later be restored using the application's restore option.

This allows the library database to be moved between:

- Different local ports
- Different browsers
- Localhost
- GitHub Pages

provided the backup is manually restored.

---

# CSV Export

CSV exports are available for useful library records such as:

- Books
- Members
- Loans
- Fines

CSV files are useful for viewing or processing records in spreadsheet applications.

The JSON backup should be used when a complete database restoration is required.

---

# Important Data Safety Note

LocalStorage is browser-local storage.

It is not a replacement for a server-side database.

Clearing browser/site data can remove the library database.

Changing browser profiles or using a different browser can also result in a different LocalStorage database.

Regular JSON backups are recommended.

---

# Project Structure

The project is intentionally modular.

```text
Library-Management/
│
├── index.html
├── favicon.svg
├── manifest.webmanifest
├── run_local.sh
├── .library_port
├── .gitignore
├── README.md
│
├── css/
│   ├── base.css
│   ├── components.css
│   └── themes.css
│
├── js/
│   ├── app.js
│   ├── config.js
│   ├── forms.js
│   ├── pages.js
│   ├── render.js
│   ├── state.js
│   ├── storage.js
│   ├── ui.js
│   └── utils.js
│
└── .github/
    └── workflows/
        └── deploy-pages.yml
```

The modular structure separates:

- Application logic
- Storage
- Forms
- Rendering
- UI behavior
- Configuration
- Styling
- Themes

---

# Running the Project

After installing Python:

```bash
bash run_local.sh
```

The launcher will display a URL similar to:

```text
============================================================
 Library Management - local mode
 URL: http://localhost:10821/index.html
 Data: browser LocalStorage for this localhost origin
============================================================
```

The browser should open automatically.

If it does not, copy the displayed URL and open it manually.

---

# Stopping the Application

Press:

```text
q
```

followed by Enter.

Alternatively:

```text
Ctrl+C
```

can be used to stop the local server.

Stopping the server does **not** delete the LocalStorage database.

---

# Browser Compatibility

The application uses standard browser technologies:

- HTML5
- CSS3
- JavaScript
- LocalStorage

A modern browser such as:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

is recommended.

---

# No Backend Required

This project is intentionally designed without a backend.

The complete application runs in the browser.

Local mode only provides a simple HTTP server so that the browser can load the modular project correctly.

The Python server does not process or store library records.

Library data remains inside the browser's LocalStorage.

---

# License

This project is intended for educational and small school/college library management use.

#!/usr/bin/env bash
set -Eeuo pipefail

# Library Management local launcher
# - Uses the same saved localhost port when it is free, preserving LocalStorage.
# - Chooses a new free port automatically if the saved one is busy.
# - Copies the URL and opens the default browser when possible.
# - No external packages are required; Python's built-in HTTP server is used.

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

find_python() {
  local candidate
  for candidate in python3 python py; do
    if command -v "$candidate" >/dev/null 2>&1; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 1
}

PY="$(find_python || true)"
if [[ -z "$PY" ]]; then
  echo "ERROR: Python 3 is required for local mode."
  echo "Install Python 3 and make sure python/python3 is available in PATH."
  exit 1
fi

PORT_FILE=".library_port"
PORT=""

port_is_free() {
  "$PY" - "$1" <<'PY'
import socket, sys
p = int(sys.argv[1])
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
try:
    s.bind(("127.0.0.1", p))
except OSError:
    raise SystemExit(1)
finally:
    s.close()
raise SystemExit(0)
PY
}

find_free_port() {
  "$PY" - <<'PY'
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(("127.0.0.1", 0))
print(s.getsockname()[1])
s.close()
PY
}

if [[ -s "$PORT_FILE" ]]; then
  PORT="$(tr -cd '0-9' < "$PORT_FILE")"
fi

if [[ -z "$PORT" ]] || ! port_is_free "$PORT"; then
  PORT="$(find_free_port)"
  printf '%s\n' "$PORT" > "$PORT_FILE"
fi

URL="http://localhost:${PORT}/index.html"
SERVER_PID=""
SERVER_LOG="$(mktemp 2>/dev/null || printf '%s' "${TMPDIR:-/tmp}/library-management-server.log")"

copy_url() {
  [[ "${LM_NO_CLIPBOARD:-0}" == "1" ]] && return 1
  if command -v powershell.exe >/dev/null 2>&1; then
    printf '%s' "$URL" | powershell.exe -NoProfile -Command '$input | Set-Clipboard' >/dev/null 2>&1 && return 0
  fi
  if command -v clip.exe >/dev/null 2>&1; then
    printf '%s' "$URL" | clip.exe >/dev/null 2>&1 && return 0
  fi
  if command -v wl-copy >/dev/null 2>&1; then
    printf '%s' "$URL" | wl-copy >/dev/null 2>&1 && return 0
  fi
  if command -v xclip >/dev/null 2>&1; then
    printf '%s' "$URL" | xclip -selection clipboard >/dev/null 2>&1 && return 0
  fi
  if command -v xsel >/dev/null 2>&1; then
    printf '%s' "$URL" | xsel --clipboard --input >/dev/null 2>&1 && return 0
  fi
  if command -v pbcopy >/dev/null 2>&1; then
    printf '%s' "$URL" | pbcopy >/dev/null 2>&1 && return 0
  fi
  return 1
}

open_browser() {
  [[ "${LM_NO_BROWSER:-0}" == "1" ]] && return 1
  if command -v cmd.exe >/dev/null 2>&1; then
    cmd.exe /c start "" "$URL" >/dev/null 2>&1 && return 0
  fi
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1 && return 0
  fi
  if command -v open >/dev/null 2>&1; then
    open "$URL" >/dev/null 2>&1 && return 0
  fi
  return 1
}

server_ready() {
  "$PY" - "$URL" <<'PY'
import sys, urllib.request
try:
    with urllib.request.urlopen(sys.argv[1], timeout=0.5) as r:
        raise SystemExit(0 if r.status < 500 else 1)
except Exception:
    raise SystemExit(1)
PY
}

cleanup() {
  if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -f "$SERVER_LOG" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

printf '%s\n' '============================================================'
printf '%s\n' ' Library Management - local mode'
printf '%s\n' " URL: $URL"
printf '%s\n' ' Data: browser LocalStorage for this localhost origin'
printf '%s\n' '============================================================'
printf '\nStarting local server...\n'

"$PY" -m http.server "$PORT" --bind 127.0.0.1 >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!

for _ in {1..20}; do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "ERROR: Local server stopped unexpectedly."
    cat "$SERVER_LOG" 2>/dev/null || true
    exit 1
  fi
  if server_ready; then break; fi
  sleep 0.15
done

if ! server_ready; then
  echo "ERROR: Server did not become ready at $URL"
  cat "$SERVER_LOG" 2>/dev/null || true
  exit 1
fi

if copy_url; then
  echo "[ok] Link copied to clipboard."
else
  echo "[info] Clipboard copy unavailable."
fi

if open_browser; then
  echo "[ok] Default browser opened."
else
  echo "[info] Could not open the browser automatically."
fi

echo
echo "Open manually: $URL"
echo
echo "Commands:"
echo "  c + Enter  Copy the URL"
echo "  o + Enter  Open the URL"
echo "  q + Enter  Stop the server"
echo "  Enter       Show the URL again"
echo

while kill -0 "$SERVER_PID" 2>/dev/null; do
  if IFS= read -r command; then
    case "${command:-}" in
      c|C)
        if copy_url; then echo "[ok] Link copied: $URL"; else echo "[info] Clipboard unavailable: $URL"; fi
        ;;
      o|O)
        if open_browser; then echo "[ok] Browser open requested."; else echo "[info] Browser could not be opened automatically."; fi
        ;;
      q|Q|quit|exit)
        echo "Stopping Library Management..."
        break
        ;;
      *)
        echo "Running at $URL"
        ;;
    esac
  else
    break
  fi
done

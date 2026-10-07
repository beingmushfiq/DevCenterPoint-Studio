#!/usr/bin/env bash
# ==============================================================================
# DevCenterPoint Studio — Inertia SSR server lifecycle
# ==============================================================================
# cPanel shared hosting has no systemd/PM2, so the Node SSR server is started by
# the deploy script and kept alive by a cPanel cron job. Both call this script.
#
#   bash deploy/ssr-server.sh ensure    # start only if not already healthy
#   bash deploy/ssr-server.sh restart   # stop, then start
#   bash deploy/ssr-server.sh stop
#   bash deploy/ssr-server.sh status
#
# Recommended cron entry (every 5 minutes), on the server:
#   */5 * * * * /bin/bash $HOME/repositories/DevCenterPoint-Studio/deploy/ssr-server.sh ensure >> $HOME/dcp_core/storage/logs/ssr-cron.log 2>&1
#
# Why `ensure` is the cron verb: it is a no-op when the server is already
# answering /health, so a healthy server is never bounced, and a crashed one is
# restarted within one cron interval. If SSR is down Laravel quietly falls back
# to client-side rendering — no errors, but no server-rendered markup either,
# which is the whole point of this work.
# ==============================================================================

# NOTE: no `set -e`. A failed health probe is an expected branch here, not a
# reason to abort; every failure path is handled explicitly.
set -uo pipefail

CORE="${CORE:-$HOME/dcp_core}"
ENV_FILE="$CORE/.env"
BUNDLE="$CORE/bootstrap/ssr/ssr.mjs"
PIDFILE="$CORE/storage/ssr.pid"
LOG="$CORE/storage/logs/ssr.log"

C_RESET=""; C_INFO=""; C_OK=""; C_WARN=""; C_ERR=""
if [ -t 1 ]; then
  C_RESET="\033[0m"; C_INFO="\033[36m"; C_OK="\033[32m"; C_WARN="\033[33m"; C_ERR="\033[31m"
fi

step() { printf "${C_INFO}>>> %s${C_RESET}\n" "$1"; }
ok()   { printf "${C_OK}    + %s${C_RESET}\n" "$1"; }
warn() { printf "${C_WARN}    ! %s${C_RESET}\n" "$1"; }
fail() { printf "${C_ERR}    x %s${C_RESET}\n" "$1" >&2; }

# ------------------------------------------------------------------------------
# Resolve host/port from the same INERTIA_SSR_URL the application uses, so the
# server that PHP posts to is always the server this script manages.
# ------------------------------------------------------------------------------
SSR_URL="$(sed -n 's|^INERTIA_SSR_URL=||p' "$ENV_FILE" 2>/dev/null | tail -n 1 | tr -d '"\r')"
[ -n "$SSR_URL" ] || SSR_URL="http://127.0.0.1:13714"

HOST="${SSR_URL#*://}"; HOST="${HOST%%:*}"
PORT="${SSR_URL##*:}"
[ -n "$HOST" ] || HOST="127.0.0.1"
case "$PORT" in
  ''|*[!0-9]*) PORT=13714 ;;
esac

# ------------------------------------------------------------------------------
# Locate a Node binary. cPanel installs Node per-account (nodevenv) or via
# EasyApache (ea-nodejs), and the cron PATH is minimal, so every common location
# is probed rather than trusting `node` to be on PATH.
# ------------------------------------------------------------------------------
detect_node() {
  local candidate
  for candidate in \
    node \
    /usr/local/bin/node \
    /usr/bin/node \
    /opt/cpanel/ea-nodejs*/bin/node \
    /opt/alt/alt-nodejs*/root/usr/bin/node \
    "$HOME"/nodevenv/*/bin/node \
    "$HOME"/.nvm/versions/node/*/bin/node
  do
    if command -v "$candidate" >/dev/null 2>&1 || [ -x "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  return 1
}

# ------------------------------------------------------------------------------
# Health probe. curl, then wget, then a raw bash /dev/tcp request as a last
# resort (some hardened cPanel accounts ship neither curl nor wget).
# ------------------------------------------------------------------------------
is_healthy() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsS --max-time 5 "http://$HOST:$PORT/health" >/dev/null 2>&1
    return $?
  fi
  if command -v wget >/dev/null 2>&1; then
    wget -q -T 5 -O /dev/null "http://$HOST:$PORT/health" >/dev/null 2>&1
    return $?
  fi
  ( exec 3<>"/dev/tcp/$HOST/$PORT" ) >/dev/null 2>&1 || return 1
  printf 'GET /health HTTP/1.0\r\nHost: %s\r\n\r\n' "$HOST" >&3 2>/dev/null || return 1
  head -c 256 <&3 2>/dev/null | grep -q 'OK'
}

# Kill a process only if it is still alive; never fail the script over it.
kill_pid() {
  local pid="$1"
  [ -n "$pid" ] || return 0
  kill -0 "$pid" 2>/dev/null || return 0
  kill "$pid" 2>/dev/null || true
  local i
  for i in 1 2 3 4 5 6 7 8 9 10; do
    kill -0 "$pid" 2>/dev/null || return 0
    sleep 0.3
  done
  kill -9 "$pid" 2>/dev/null || true
}

stop() {
  if [ -f "$PIDFILE" ]; then
    local pid
    pid="$(tr -d ' \r\n' < "$PIDFILE" 2>/dev/null || true)"
    if [ -n "$pid" ]; then
      kill_pid "$pid"
      ok "stopped SSR server (pid $pid)"
    fi
    rm -f "$PIDFILE"
  else
    warn "no pid file at $PIDFILE"
  fi

  # A pid file can go stale (manual start, host reboot), so also drop whatever
  # is still holding the port before a restart would bind it.
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "$PORT/tcp" >/dev/null 2>&1 || true
  fi
}

start() {
  local node_bin
  if ! node_bin="$(detect_node)"; then
    fail "Node.js was not found. Install it from cPanel > 'Setup Node.js App',"
    fail "or set the binary path in nodevenv, then re-run."
    return 1
  fi

  if [ ! -f "$BUNDLE" ]; then
    fail "SSR bundle missing: $BUNDLE"
    fail "Upload ssr.zip to ~/cpanel_uploads and re-run the packager/deploy."
    return 1
  fi

  mkdir -p "$(dirname "$LOG")"

  # setsid detaches the process into its own session so it survives the cron
  # shell (and the cPanel process reaper) exiting. Fall back to a plain
  # background job where setsid is unavailable.
  if command -v setsid >/dev/null 2>&1; then
    setsid nohup "$node_bin" "$BUNDLE" >> "$LOG" 2>&1 < /dev/null &
  else
    nohup "$node_bin" "$BUNDLE" >> "$LOG" 2>&1 < /dev/null &
  fi
  printf '%s\n' "$!" > "$PIDFILE"

  # The server binds the port within a second or two; poll so callers can rely
  # on `ensure` having left a working server behind.
  local i
  for i in $(seq 1 30); do
    sleep 0.5
    if is_healthy; then
      ok "SSR server started (pid $(cat "$PIDFILE"), $node_bin, port $PORT)"
      return 0
    fi
  done

  fail "SSR server did not become healthy on port $PORT; see $LOG"
  return 1
}

ensure() {
  if is_healthy; then
    ok "SSR server already healthy on port $PORT"
    return 0
  fi
  warn "SSR server is not responding on port $PORT - starting it"
  stop
  start
}

case "${1:-ensure}" in
  ensure)  ensure ;;
  start)   is_healthy && { ok "already running"; exit 0; }; start ;;
  stop)    stop ;;
  restart) stop; start ;;
  status)
    if is_healthy; then
      ok "healthy on $HOST:$PORT"
    else
      fail "not responding on $HOST:$PORT"
      exit 1
    fi
    ;;
  *)
    fail "unknown action: $1"
    printf 'usage: %s {ensure|start|stop|restart|status}\n' "$0" >&2
    exit 2
    ;;
esac

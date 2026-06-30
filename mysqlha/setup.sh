#!/usr/bin/env bash

set -ex

. /etc/profile

if ! bun update -g @3-/mysqlha; then
  bun install -g @3-/mysqlha
fi

mkdir -p /usr/local/bin/

cat <<'EOF' >/usr/local/bin/mysqlha.sh
#!/usr/bin/env bash
eval $(/usr/local/bin/mise env)
cd /root/i18n/conf

set -o allexport
. env/alive.sh
set +o allexport

exec /opt/bun/bin/bun -b /opt/bun/bin/mysqlha -c ./mysqlha.yml
EOF

chmod +x /usr/local/bin/mysqlha.sh

cat <<'EOF' >/etc/systemd/system/mysqlha.service
[Unit]
Description=MySQL High Availability Service
After=network.target

[Service]
User=root
Type=simple
ExecStart=/usr/local/bin/mysqlha.sh
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload

systemctl enable --now mysqlha
systemctl restart mysqlha

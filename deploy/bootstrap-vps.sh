#!/bin/bash
set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "Por favor, ejecuta este script como root."
  exit 1
fi

echo "=== 1. Actualizaciones del sistema, unattended-upgrades y swap ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y unattended-upgrades curl wget git jq ufw openssh-server ca-certificates

if [ ! -f /swapfile ]; then
  echo "Creando swap de 4GB..."
  fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q "/swapfile" /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "=== 2. Docker Engine y rotación de logs ==="
if ! command -v docker >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
systemctl restart docker

echo "=== 3. ufw y SSH ==="
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable

if grep -q "^ssh-" /root/.ssh/authorized_keys 2>/dev/null; then
  sed -i 's/^#*PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
  sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
  systemctl restart ssh
else
  echo "ADVERTENCIA: No se encontró una clave en /root/.ssh/authorized_keys. Se omite desactivar contraseñas SSH para evitar bloqueos."
fi

echo "=== 4. Red Docker messenger_edge ==="
if ! docker network ls | grep -q messenger_edge; then
  docker network create messenger_edge
fi

echo "=== 5. Usuario gh-runner y directorio base ==="
if ! id "gh-runner" >/dev/null 2>&1; then
  useradd -m -s /bin/bash -G docker gh-runner
fi
mkdir -p /opt/messenger/backend
chown -R gh-runner:gh-runner /opt/messenger/backend
chmod 750 /opt/messenger/backend

echo "=== 6. GitHub Actions runner ==="
if [ -z "${RUNNER_TOKEN:-}" ] || [ -z "${REPO_URL:-}" ]; then
  echo "INFO: RUNNER_TOKEN o REPO_URL no definidos."
  echo "Para instalar el runner automáticamente, ejecuta el script así:"
  echo "REPO_URL=https://github.com/user/repo RUNNER_TOKEN=xyz ./bootstrap-vps.sh"
else
  RUNNER_DIR="/home/gh-runner/actions-runner"
  if [ ! -d "$RUNNER_DIR" ]; then
    echo "Instalando runner..."
    sudo -u gh-runner mkdir -p "$RUNNER_DIR"
    cd "$RUNNER_DIR"
    # Nota: la versión podría cambiar, idealmente descargar la latest recomendada en GitHub
    sudo -u gh-runner curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-linux-x64-2.321.0.tar.gz
    sudo -u gh-runner tar xzf ./actions-runner-linux-x64.tar.gz
    sudo -u gh-runner ./config.sh --unattended --url "$REPO_URL" --token "$RUNNER_TOKEN" --labels messenger-backend --name contabo-1
    ./svc.sh install gh-runner
    ./svc.sh start
  else
    echo "El runner ya parece estar instalado en $RUNNER_DIR"
  fi
fi

echo "Bootstrap finalizado con éxito."

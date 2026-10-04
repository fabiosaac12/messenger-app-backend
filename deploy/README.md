# Despliegue en VPS (Contabo)

Este directorio contiene los recursos para preparar el VPS y levantar el entorno de producción.

## Seguridad

⚠️ **IMPORTANTE**: Este repositorio es público. Con un runner self-hosted, cualquier usuario podría abrir un Pull Request (PR) y ejecutar comandos en el VPS si se disparan los workflows.

Para prevenir incidentes de seguridad:
1. Ve a **Settings → Actions → General**.
2. En la sección **Fork pull request workflows from outside collaborators**, asegúrate de que esté marcado **Require approval for all external contributors**.
3. (Opcional, pero **recomendado**): Cambia el repositorio a **Privado**. El plan gratuito incluye 2000 minutos de Actions/mes para el CI (que usa el runner de GitHub `ubuntu-latest`).

El environment `production` solo admite la rama `master`, por lo que los secretos están a salvo de modificaciones no autorizadas de las Github Actions en otras ramas.
Además, advierte que pertenecer al grupo `docker` (como lo hace el usuario `gh-runner`) equivale a ser root en la máquina. Esto es aceptable dado que el VPS tiene como único propósito ejecutar esta infraestructura.

## Requisitos Previos

- Un VPS con Ubuntu 24.04 (por ejemplo, en Contabo).
- Asegúrate de tener al menos una clave pública SSH (en `/root/.ssh/authorized_keys`) para que el script `bootstrap-vps.sh` deshabilite el inicio de sesión por contraseña de forma segura.
- Nota: Las instancias actuales de Contabo incluyen soporte AVX, requisito para la imagen `mongo:7`.

## Pasos Manuales Iniciales

Sigue este orden cronológico para establecer la infraestructura base:

### 1. Apuntar el DNS
Configura los registros de tu dominio para que apunten a la IP del VPS para aprovechar los certificados HTTPS automáticos de Caddy.

### 2. Ejecutar el Bootstrap
Sube el script `bootstrap-vps.sh` al VPS y ejecútalo como `root`.

\`\`\`bash
# Sube el script y hazlo ejecutable
scp deploy/bootstrap-vps.sh root@<IP_VPS>:/root/
ssh root@<IP_VPS>
chmod +x bootstrap-vps.sh

# Ejecútalo pasándole los datos del repositorio y el token
REPO_URL=https://github.com/USUARIO/messenger-app-backend \
RUNNER_TOKEN=xxxxxxxxxxxx \
./bootstrap-vps.sh
\`\`\`
*Nota: Para obtener el `RUNNER_TOKEN`, ve a **Settings → Actions → Runners → New self-hosted runner** (Linux, x64). Este token caduca en 1 hora.*

### 3. Configurar GitHub Environments y Secrets
1. En GitHub, ve a **Settings → Environments** y crea uno nuevo llamado `production`.
2. Dentro del environment, en **Deployment branches and tags**, selecciona "Selected branches and tags" y agrega `master`.
3. En **Environment secrets**, añade:
   - `JWT_SECRET`
   - `MONGO_ROOT_USER`
   - `MONGO_ROOT_PASSWORD`
   - `RABBITMQ_USER`
   - `RABBITMQ_PASSWORD`
4. En **Environment variables**, añade:
   - `APP_DOMAIN` (tu dominio, ej. `api.midominio.com`)
   - `JWT_EXPIRES_IN` (ej. `15m`)
   - `BCRYPT_SALT` (ej. `10`)

### 4. GitLab Runner Bootstrap
El bootstrap del repo de GitLab (la SPA de React y socket.io) que también se despliega en esta máquina se añade _después_ de que este backend esté operativo. Caddy ya está configurado para rutear peticiones a las rutas de frontend y socket.io, las cuales devolverán `502` hasta que ese runner se encargue de desplegarlos en la red interna `messenger_edge`.

### 5. Primer Push
Una vez hecho todo, haz un push a la rama `master`. El GitHub Action `deploy.yml` se encargará del build, creación de variables de entorno (en `/opt/messenger/backend/.env`) e iniciar todo de forma idempotente con `docker compose`.

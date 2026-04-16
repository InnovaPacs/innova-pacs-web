**Especificaciones Med IQ:**

- [Regresar al indice](../index.md)

| Componente     | Ubicación                   |
| -------------- | --------------------------- |
| Med IQ WEB     | Contenedor docker en el VPS |
| Med IQ Backend | Contenedor docker en el VPS |
| Base de datos  | Contenedor docker en el VPS |
| KAFKA          | Contenedor docker en el VPS |

**Especificaciones Pacs:**

| Componente | Ubicación                   |
| ---------- | --------------------------- |
| DCM4CHEE   | Contenedor docker en el VPS |
| OHIF       | Contenedor docker en el VPS |

**Proceso de deployment Med IQ:**
Repositorios [Med IQ Web](https://github.com/InnovaPacs/innova-pacs-web), [Med IQ Backend](https://github.com/InnovaPacs/innova-pacs-service)

```bash
# Iniciar seción en el VPS para poder desplegar
ssh ssh admin@0.0.0.0

git clone https://github.com/InnovaPacs/innova-pacs-web
git clone https://github.com/InnovaPacs/innova-pacs-service

# Ir a la carpeta innova-pacs-service
cd innova-pacs-service

# Construir las imagenes
docker compose build --no-cache

# Levantar los conteneodres
docker compose up -d
```

**Proceso de deployment DCM4CHEE:**
Clonar repositorios [DCM4CHEE](https://github.com/InnovaPacs/innova-pacs-docker-compose).

```bash
# Iniciar seción en el VPS para poder desplegar
ssh ssh admin@0.0.0.0

git clone https://github.com/InnovaPacs/innova-pacs-docker-compose

# Ir a la carpeta innova-pacs-docker-compose
cd innova-pacs-docker-compose

# Construir las imagenes
docker compose build --no-cache

# Levantar los conteneodres
docker compose up -d

```

**Entornos:**

- **Desarrollo:** [Med IQ web](https://persist.rocks/med-iq/auth/login)

# InnovaPACS - Sistema de Información Radiológica (RIS)

InnovaPACS es una aplicación web desarrollada con Angular para la gestión de información radiológica y de pacientes. Este sistema (RIS/PACS) permite administrar citas, pacientes, médicos, estudios y configuraciones del sistema PACS.

## Características

El proyecto está organizado en los siguientes módulos principales:

- **Auth**: Gestión de autenticación de usuarios y protección de rutas.
- **Appointments**: Creación y administración de citas médicas.
- **Calendar**: Visualización de citas y eventos en un calendario.
- **Dashboard**: Panel principal con información relevante.
- **Doctors**: Administración del personal médico.
- **Medical-Office**: Gestión de consultorios médicos.
- **PACS-Configuration**: Configuración de servidores y parámetros del sistema PACS.
- **Patients**: Registro y gestión de la información de los pacientes.
- **Studies**: Administración y visualización de estudios radiológicos.
- **Users**: Gestión de usuarios y roles del sistema.

## Prerrequisitos

Asegúrate de tener instalado Node.js y Angular CLI en tu entorno de desarrollo.

- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [Angular CLI](https://github.com/angular/angular-cli) (versión 17.x o superior)

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    ```
2.  Navega al directorio del proyecto:
    ```bash
    cd innova-pacs
    ```
3.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

## Scripts Disponibles

Este proyecto cuenta con los siguientes scripts definidos en `package.json`:

- **Development server**: Inicia un servidor de desarrollo en `http://localhost:4200/`. La aplicación se recargará automáticamente al detectar cambios en los archivos fuente.
  ```bash
  npm start
  ```
  o
  ```bash
  ng serve
  ```

- **Development server (dev environment)**: Inicia el servidor de desarrollo utilizando la configuración del entorno `dev`.
  ```bash
  npm run start:dev
  ```

- **Build**: Compila la aplicación para producción. Los artefactos de la compilación se almacenan en el directorio `dist/`.
  ```bash
  npm run build
  ```

- **Build (dev environment)**: Compila la aplicación utilizando la configuración `deploy` para un entorno de desarrollo/pruebas.
  ```bash
  npm run build:dev
  ```

- **Watch**: Compila la aplicación en modo de observación, reconstruyendo automáticamente ante cualquier cambio.
  ```bash
  npm run watch
  ```

- **Unit Tests**: Ejecuta las pruebas unitarias a través de Karma.
  ```bash
  npm run test
  ```

## Despliegue con Docker

El proyecto incluye un `Dockerfile` y una configuración de `nginx.conf` para facilitar el despliegue en un contenedor Docker.

Para construir la imagen de Docker, ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker build -t innova-pacs .
```

Luego, para ejecutar el contenedor:

```bash
docker run -p 80:80 innova-pacs
```

La aplicación estará disponible en `http://localhost/`.

## Ayuda Adicional

Para obtener más ayuda sobre Angular CLI, utiliza `ng help` o consulta la [documentación oficial de Angular CLI](https://angular.io/cli).
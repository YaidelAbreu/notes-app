# notes-app
Esta rama incluye el código para la parte de interfaz de usuario, y el backend de una aplicación de gestión de notas. Este trabajo esta en progreso.

Requisitos Previos

Node.js
npm o yarn
PostgreSQL
Python

■ Tecnologías utilizadas y razones para elegirlas.

Frontend
-React.js con el objetivo de construir una interfaz de usuario interactiva y responsiva.

Backend
-FastAPI: por su velocidad, simplicidad y compatibilidad integrada con operaciones asincrónicas.

Base de Datos
-PostgreSQL: base de datos relacional confiable con soporte sólido para integridad transaccional

Otras Librerias
-SQLAlchemy: Por sus capacidades ORM y soporte para operaciones de bases de datos asincrónicas.

-Redux Toolkit: Para gestionar el estado de manera efectiva en toda la aplicación.

-dotenv: Para una gestión segura y flexible de variables de entorno.

 ■ Instrucciones sobre cómo configurar y ejecutar el proyecto localmente.
-Clona el repositorio:
    git clone https://github.com/YaidelAbreu/notes-app.git

-Instala las dependencias del frontend:
    cd notes-app
    cd frontend
    npm install o yarn install
-Iniciar el servidor de desarrollo: npm start o yarn start.

Abrir http://localhost:3000 en el navegador

-Instala las dependencias del backend:
    cd ..
    cd backend

-Crea un entorno virtual: python -m venv venv

-Activa el entorno virtual
    - Windows: venv\Scripts\activate
    - Unix/Linux: source venv/bin/activate

-Instalar dependencias: pip install-r requirements.txt.

-Establecer variables de entorno según .env.example.

-Instalar y ejecutar PostgreSQL.

-Crear la base de datos y el usuario necesarios con la misma configuración que estableció en el backend.

-Ejecutar migraciones de base de datos si está usando Alembic con SQLAlchemy: alembic upgrade head

-Iniciar el servidor: uvicorn app.main:app --reload.

 ■ Explicación detallada de la estrategia de bloqueo implementada.

    Problema
    Cuando múltiples usuarios o procesos intentan modificar el mismo recurso (por ejemplo, una nota), puede ocurrir una condición de carrera, lo que resulta en cambios conflictivos o sobreescritos.

    Solución

    Implementamos un mecanismo de Bloqueo Optimista para manejar este problema de manera efectiva. Aquí está el detalle de cómo funciona:

    Campo de Versionado: Cada registro en la base de datos incluye un campo version que se incrementa en cada actualización y forma parte de la llave primaria junto al id. Por lo que esta convinación no se puede repetir en los datos. Para conocer la última versión de una nota adicionamos un campo fecha que si es null esto indica que es la última version de la nota.
    Esta estrategia nos permite conocer todas las versiones de una nota de forma simple.

    Verificación de Concurrencia: Antes de actualizar un registro, el sistema verifica si la ultima versión en la base de datos de la nota coincide con la versión enviada por el usuario:

     Si la versión coincide, la actualización continúa.
     Si la versión no coincide, el sistema rechaza la actualización e informa al usuario que el recurso ha sido modificado por otro proceso.

■ Desafío enfrentado: 
Crear un schema para la entidad nota que permitiera versionarla y no fuera necesario relaciones adicionales que complicaran las transacciones en la Base de Datos.

# SST Formularios Digitales

Aplicación independiente para diligenciar formularios del Sistema de Gestión de Seguridad y Salud en el Trabajo (SST) de Tecnoproyectos Ingeniería S.A.S.

> **Estado:** fase inicial de arquitectura. Este repositorio es un entorno de desarrollo separado; no modificar ni conectar con la aplicación que está en producción hasta completar pruebas y aprobar la integración.

## Objetivos de la primera versión

- Interfaz web adaptable a computador, tableta y móvil.
- Formularios estructurados con validación de campos.
- Guardado de borradores y consulta de registros con permisos.
- Generación y descarga de PDF a partir de las plantillas oficiales.
- Auditoría básica de autoría y fechas.
- Integración futura mediante una interfaz definida, sin acoplar el módulo a la aplicación principal.

## Alcance inicial

Se priorizarán estos dos formatos, verificando primero sus campos y plantillas originales:

1. **FM-SST-14 — Registro de asistencia**
2. **FM-SST-16 — Evaluación de inducción SST**

Los demás formatos se incorporarán después de validar el flujo inicial.

## Arquitectura prevista

- **Frontend:** React + TypeScript + Vite.
- **Estilos:** CSS tradicional, adaptable y accesible.
- **Datos y autenticación:** Supabase, con políticas de acceso por rol.
- **PDF:** generación en el navegador a partir de plantillas revisadas.
- **Despliegue de pruebas:** Vercel u otro entorno separado.
- **Configuración:** variables de entorno; nunca guardar claves privadas en el repositorio.

La elección final de servicios puede ajustarse tras una prueba técnica. El módulo debe conservar separación entre interfaz, lógica de formularios, persistencia y generación de documentos.

## Seguridad y datos

- No cargar datos reales de trabajadores durante el desarrollo inicial.
- No almacenar claves privadas ni credenciales en GitHub.
- Aplicar el principio de mínimo privilegio a usuarios y archivos.
- Configurar políticas de acceso en la base de datos antes de usar información real.
- Usar almacenamiento privado para documentos que contengan datos personales.
- Probar la autorización en cada operación de lectura y escritura.

## Desarrollo local (cuando se cree el proyecto)

Requisitos previstos: Node.js LTS y npm.

```bash
npm install
npm run dev
```

Los comandos estarán disponibles cuando se agreguen los archivos iniciales de la aplicación.

## Flujo de trabajo

El trabajo inicial se realiza en la rama `setup/arquitectura-inicial`. Los cambios se revisarán antes de integrarlos a `main`. No se realizarán cambios en otros repositorios ni en producción desde este proyecto.

Consulta [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) para las decisiones técnicas y las etapas de implementación.

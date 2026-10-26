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

## Estado actual del prototipo

- Catálogo inicial con búsqueda de formatos.
- Formulario FM-SST-14 con validaciones básicas y filas dinámicas de participantes.
- Captura de firmas dibujadas para asistentes y facilitador (solo en memoria del navegador).
- Generación de un PDF preliminar para revisión, no basado todavía en la plantilla oficial.
- Compilación automatizada en GitHub Actions; se deben completar pruebas funcionales y revisión visual.
- Sin autenticación, persistencia ni almacenamiento remoto en esta etapa.

**No usar datos personales reales ni emplear el PDF generado como registro oficial.**

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

## Ejecutar en local

Requisitos: Node.js 22 LTS y npm.

```bash
npm install
npm run dev
```

Para comprobar la compilación de producción:

```bash
npm run build
npm run preview
```

La compilación automática se ejecuta en GitHub Actions al subir cambios a `setup/arquitectura-inicial`. La comprobación de compilación no reemplaza las pruebas funcionales en navegador ni la validación visual del PDF.

## Flujo de trabajo

El trabajo inicial se realiza en la rama `setup/arquitectura-inicial`. Los cambios se revisarán antes de integrarlos a `main`. No se realizarán cambios en otros repositorios ni en producción desde este proyecto.

Consulta [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) para las decisiones técnicas y las etapas de implementación.

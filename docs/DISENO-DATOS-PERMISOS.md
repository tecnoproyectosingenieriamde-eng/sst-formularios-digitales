# Diseño preliminar de datos y permisos

Estado: propuesta para revisión técnica. No se han creado tablas ni conectado una base de datos. No cargar datos reales hasta implementar y probar las políticas.

## Principios
- Mantener este módulo separado de producción.
- Usar Supabase Auth para identidad; no construir autenticación propia.
- Denegar acceso por defecto y validar permisos en el servidor/base de datos, no solo ocultar botones en React.
- Aplicar Row Level Security (RLS) a todas las tablas expuestas por la API.
- Guardar firmas y PDFs en un bucket privado; entregar acceso temporal únicamente después de autorizar al usuario.
- No incluir claves de servicio en el frontend, repositorio ni archivos `.env` versionados.
- Minimizar datos personales y definir retención, respaldo y eliminación con el responsable de SST.

## Entidades propuestas

### `profiles`
- `user_id`: UUID que referencia a `auth.users`.
- `display_name`: nombre visible.
- `role`: uno de `admin`, `sst_manager`, `evaluator`, `viewer`.
- `active`: permite revocar el acceso de una persona.
- marcas de tiempo de creación y actualización.

Los usuarios no deben poder asignarse roles ni reactivarse a sí mismos. La asignación de roles debe hacerse por una operación administrativa confiable.

### `sst_records`
- `id`: UUID.
- `form_code`: código del formato, inicialmente `FM-SST-14` o `FM-SST-16`.
- `status`: `draft`, `submitted`, `reviewed`, `void`.
- `created_by`, `created_at`, `updated_at`.
- `payload`: contenido validado del formulario; evitar duplicar campos indexables innecesariamente.
- `reviewed_by`, `reviewed_at`: revisión cuando corresponda.

Antes de definir el contenido definitivo, separar los datos de participantes y resultados de evaluación si se necesitan consultas, retención o permisos distintos.

### `sst_record_events`
- `id`, `record_id`, `actor_user_id`, `event_type`, `created_at`, `metadata` limitada.
- Registro de creación, envío, revisión, anulación y exportación cuando sea necesario.
- Sin contraseñas, tokens, firmas ni copias completas del formulario en los metadatos.

## Matriz de permisos propuesta

| Acción | admin | sst_manager | evaluator | viewer |
|---|---:|---:|---:|---:|
| Administrar roles | Sí | No | No | No |
| Crear borrador | Sí | Sí | Sí | No |
| Consultar registros autorizados | Sí | Sí | Según asignación | Solo lectura autorizada |
| Revisar evaluación | Sí | Sí | Según asignación | No |
| Anular registro | Sí | Según procedimiento | No | No |
| Leer o descargar archivos privados | Según permiso del registro | Según permiso del registro | Según asignación | Según permiso de lectura |

Esta matriz es una base de discusión; el responsable de SST debe aprobar los roles, las asignaciones y las reglas de retención antes de codificar las políticas.

## Controles antes de habilitar datos reales
1. Crear migraciones versionadas y reproducibles.
2. Implementar RLS para cada tabla y comprobar acceso autorizado y denegado con usuarios de prueba de cada rol.
3. Impedir que un usuario cambie `created_by`, el rol propio o campos de revisión mediante una actualización directa.
4. Validar tipo y tamaño de archivos, y usar almacenamiento privado.
5. Probar revocación de usuario, eliminación/anulación, respaldo y restauración.
6. Revisar los requisitos aplicables de protección de datos personales y conservación documental con la empresa.
7. No conectar el módulo a sistemas productivos sin revisión, aprobación explícita y plan de reversión.

## Pendientes de decisión
- Quiénes pueden crear, revisar, consultar y anular cada formato.
- Si los evaluadores solo pueden ver los registros que tienen asignados.
- Qué datos personales son estrictamente necesarios.
- Plazos de conservación, corrección, exportación y eliminación.
- Dónde se alojará el entorno de pruebas y quién administrará las credenciales.

# Plan de implementación

## Fase 1 — Prototipo de interfaz
- [x] Documentar arquitectura inicial.
- [x] Crear interfaz base con catálogo y búsqueda.
- [x] Marcar claramente que es un entorno de pruebas.
- [x] Comprobar instalación de dependencias y compilación automática en GitHub Actions.
- [ ] Ejecutar la aplicación en navegador y revisar diseño en escritorio y móvil.

## Fase 2 — Formularios y PDF
- [ ] Inspeccionar las plantillas originales FM-SST-14 y FM-SST-16.
- [ ] Documentar campos, obligatoriedad y reglas de validación.
- [x] Crear prototipo interactivo de registro de asistencia (pendiente validar campos oficiales).
- [ ] Construir la evaluación de inducción SST.
- [ ] Alinear los datos con la plantilla oficial y verificar visualmente el PDF (pendiente).

## Fase 3 — Persistencia y permisos
- [ ] Definir roles con el responsable de SST.
- [ ] Crear esquema de base de datos y migraciones.
- [ ] Implementar autenticación.
- [ ] Implementar políticas de acceso y almacenamiento privado.
- [ ] Probar acceso autorizado y denegado.

## Fase 4 — Pruebas y publicación independiente
- [ ] Pruebas funcionales y de seguridad.
- [ ] Probar con datos ficticios.
- [ ] Publicar en un entorno separado de producción.
- [ ] Documentar configuración y recuperación.

## Fase 5 — Integración futura
- [ ] Identificar tecnología y autenticación de la aplicación principal.
- [ ] Definir contrato de integración y responsables.
- [ ] Probar en un entorno de ensayo.
- [ ] Documentar despliegue y plan de reversión.
- [ ] Integrar solo después de aprobación explícita.

# Plan de implementación

## Fase 1 — Prototipo de interfaz
- [x] Documentar arquitectura inicial.
- [x] Crear interfaz base con catálogo y búsqueda.
- [x] Marcar claramente que es un entorno de pruebas.
- [x] Comprobar instalación de dependencias y compilación automática en GitHub Actions.
- [ ] Ejecutar la aplicación en navegador y revisar diseño en escritorio y móvil (pendiente de prueba visual interactiva).
- [x] Crear checklist de pruebas manuales funcionales, impresión, PDF y seguridad en `docs/PRUEBAS-MANUALES.md`.
- [x] Ejecutar compilación CI de los cambios recientes; los commits `5f3f05e` y `7821c92` terminaron correctamente en GitHub Actions.

## Fase 2 — Formularios y PDF
- [x] Inspeccionar las plantillas originales FM-SST-14 y FM-SST-16 compartidas por el usuario.
- [x] Documentar los campos visibles de FM-SST-14; obligatoriedad funcional pendiente de acordar con SST.
- [x] Crear prototipo interactivo de registro de asistencia con los campos del FM-SST-14.
- [x] Inspeccionar el PDF original FM-SST-16 adjuntado por el usuario y documentar sus secciones y preguntas.
- [x] Construir prototipo digital FM-SST-16 con preguntas abiertas, falso/verdadero, selección múltiple, pregunta de ARL, compromiso y firma.
- [x] Configurar el mismo valor para cada pregunta (1 punto) y ARL editable con valor inicial Positiva.
- [ ] Validar con SST los criterios para calificar manualmente las preguntas abiertas; la nota automática queda pendiente porque las respuestas abiertas requieren revisión humana.
- [ ] Validar visualmente la impresión/PDF de FM-SST-16 contra la plantilla original.
- [ ] Validar visualmente el PDF generado contra el original; logotipo vectorial actual es provisional.

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

# Plan de implementación

## Fase 1 — Prototipo de interfaz
- [x] Documentar arquitectura inicial.
- [x] Crear interfaz base con catálogo y búsqueda.
- [x] Marcar claramente que es un entorno de pruebas.
- [x] Comprobar instalación de dependencias y compilación automática en GitHub Actions.
- [ ] Ejecutar la aplicación en navegador y revisar diseño en escritorio y móvil (pendiente de prueba visual interactiva).
- [x] Ejecutar compilación CI de los cambios recientes; el commit `5f3f05e` terminó correctamente en GitHub Actions.

## Fase 2 — Formularios y PDF
- [x] Inspeccionar la plantilla original FM-SST-14 (PDF adjunto por el usuario); FM-SST-16 sigue pendiente.
- [x] Documentar los campos visibles de FM-SST-14; obligatoriedad funcional pendiente de acordar con SST.
- [x] Crear prototipo interactivo de registro de asistencia con los campos del FM-SST-14.
- [ ] Construir la evaluación de inducción SST.
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

# Pruebas manuales del prototipo SST

Este checklist se ejecuta en un entorno de pruebas y con datos ficticios. No constituye aprobación para uso oficial ni prueba de seguridad.

## Catálogo y navegación
- [ ] El catálogo carga y permite buscar por código o nombre.
- [ ] FM-SST-14 abre desde el catálogo y permite volver.
- [ ] FM-SST-16 abre desde el catálogo y permite volver.
- [ ] Los formatos aún no implementados se identifican como pendientes.

## FM-SST-14 — Registro de asistencia
- [ ] Los campos obligatorios impiden generar el PDF si están vacíos.
- [ ] Se pueden agregar y quitar participantes sin perder los demás datos.
- [ ] Las firmas de participantes y facilitador se pueden dibujar con ratón o pantalla táctil y borrar.
- [ ] La generación de PDF descarga un archivo legible con tema, fecha, lugar, responsable, participantes y observaciones.
- [ ] Revisar saltos de página con 1, 22, 23 y más participantes.
- [ ] Comparar visualmente el PDF con el original; verificar encabezado, dimensiones, márgenes, tabla, observaciones y firmas.
- [ ] Confirmar que el logotipo provisional no se confunda con el oficial.

## FM-SST-16 — Evaluación de inducción
- [ ] Nombre, cargo y fecha son obligatorios.
- [ ] Tipo de proceso permite Inducción y Re-inducción.
- [ ] Las cinco preguntas abiertas permiten escribir respuestas.
- [ ] Las preguntas 6 y 7 exigen seleccionar Falso o Verdadero.
- [ ] Las preguntas 8 a 14 exigen una opción de selección múltiple.
- [ ] La pregunta 15 de ARL es obligatoria y aparece inicialmente como Positiva.
- [ ] Cambiar la ARL, limpiar el formulario y confirmar que el valor vuelve a Positiva.
- [ ] La firma se puede dibujar y borrar.
- [ ] El botón Generar PDF descarga un FM-SST-16 con datos, las 15 respuestas, compromiso y firma.
- [ ] El PDF de FM-SST-16 conserva todas las preguntas/respuestas cuando el contenido ocupa varias páginas.
- [ ] Imprimir / guardar como PDF produce páginas legibles y no corta preguntas ni firma.
- [ ] El puntaje mínimo indicado es 12; no debe mostrarse una nota automática hasta definir y validar la calificación de respuestas abiertas.

## Seguridad y privacidad
- [ ] No introducir datos reales de trabajadores durante estas pruebas.
- [ ] Confirmar que al recargar o cerrar la pestaña no existe persistencia remota.
- [ ] Antes de habilitar registros reales, implementar autenticación, autorización, almacenamiento privado, auditoría y pruebas de acceso denegado.

## Evidencia
Registrar fecha, navegador, dispositivo, caso probado, resultado (aprobado/fallido), observaciones y responsable de la prueba. Cualquier diferencia con el formato oficial debe corregirse antes de aprobar el formulario.

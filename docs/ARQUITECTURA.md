# Arquitectura del módulo SST

## 1. Principios

1. **Independencia:** el módulo se construye y prueba sin depender de la aplicación existente.
2. **Integración posterior:** cualquier conexión futura tendrá un contrato explícito y se probará por separado.
3. **Seguridad desde el inicio:** roles, políticas de acceso y privacidad antes de manejar información real.
4. **Trazabilidad:** registrar quién crea o actualiza cada formulario y cuándo.
5. **Plantillas fieles:** los campos del formulario y la ubicación de los datos en el PDF deben verificarse contra cada formato original.

## 2. Componentes

- **Interfaz React:** navegación, formularios, mensajes de validación y listados.
- **Catálogo de formularios:** definiciones tipadas de los campos y reglas de cada formato.
- **Servicios de aplicación:** guardado, consulta, estados de borrador/finalizado y generación de PDF.
- **Supabase:** autenticación, base de datos y almacenamiento privado, sujeto a configuración y pruebas.
- **Adaptador de integración futura:** punto de conexión aislado para integrar el módulo con la aplicación principal cuando se conozcan su tecnología y mecanismos de autenticación.

## 3. Organización prevista del código

```text
src/
  app/
  components/
  pages/
  forms/
  services/
  types/
  styles/
public/
  formatos/
supabase/
  migrations/
docs/
```

No se agregarán credenciales ni datos personales de prueba al repositorio. Los archivos PDF originales se incorporarán después de confirmar que pueden usarse como plantillas y revisar sus campos.

## 4. Modelo de datos inicial

- **profiles:** identificador vinculado al usuario autenticado, nombre visible y rol.
- **sst_records:** identificador, código de formato, estado, creador, fechas de creación y actualización.
- **sst_record_data:** contenido estructurado del formulario asociado al registro.
- **sst_documents:** referencia privada al documento generado, tipo de documento y fecha.

Este modelo es preliminar. Se concretará mediante migraciones y políticas de acceso antes de conectar la base de datos.

## 5. Roles iniciales propuestos

- **Administrador SST:** gestiona usuarios y consulta los registros autorizados.
- **Responsable SST:** crea, edita y finaliza los formularios que tiene asignados.
- **Consulta/Auditoría:** lectura de los registros que tenga autorizados.

Los permisos definitivos deben validarse con la organización. La interfaz no será la única barrera: la autorización también debe aplicarse en la base de datos y en el almacenamiento.

## 6. Flujo de un registro

1. Seleccionar el formato.
2. Completar los campos y validar la información obligatoria.
3. Guardar como borrador.
4. Revisar y finalizar el registro.
5. Generar el PDF y guardarlo de forma privada si corresponde.
6. Consultar el historial según los permisos del usuario.

## 7. Etapas

1. Documentar arquitectura y crear el esqueleto del frontend.
2. Construir navegación y formularios de prueba con datos ficticios.
3. Verificar las plantillas FM-SST-14 y FM-SST-16 y ajustar la generación PDF.
4. Configurar autenticación, roles, políticas de acceso y persistencia.
5. Ejecutar pruebas funcionales y de seguridad en un entorno independiente.
6. Definir el contrato y el plan de reversión para la integración futura.

## 8. Criterios de aceptación antes de integrar

- Los formularios validan los campos obligatorios.
- El PDF generado se revisa visualmente contra la plantilla original.
- Los usuarios no pueden acceder a registros fuera de sus permisos.
- Las claves privadas no aparecen en el cliente ni en Git.
- Los registros de prueba pueden crearse, consultarse y actualizarse de forma controlada.
- Existe un plan de reversión y la integración no requiere modificar servicios existentes sin revisión.

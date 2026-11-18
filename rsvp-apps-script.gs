/**
 * Confirmaciones de asistencia — María Agustina & Ignacio
 * Recibe cada confirmación de la invitación y la guarda en la hoja "RSVP"
 * (la crea sola, con encabezados, si no existe).
 * Publicar: Implementar → Nueva implementación → Aplicación web,
 * Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario.
 */
function doPost(e) {
  const datos = JSON.parse(e.postData.contents);
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName("RSVP") || libro.insertSheet("RSVP");

  if (hoja.getLastRow() === 0) {
    hoja.appendRow(["Fecha", "Nombre y apellido", "Asiste", "Menú", "Restricciones alimentarias"]);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, 5).setFontWeight("bold");
  }

  // Un texto que empieza con = + - @ se guarda como texto, no como fórmula
  const texto = (v) => {
    const t = String(v == null ? "" : v).slice(0, 300);
    return /^[=+\-@]/.test(t) ? "'" + t : t;
  };

  hoja.appendRow([
    new Date(),
    texto(datos.name),
    texto(datos.attending),
    texto(datos.menu),
    texto(datos.restrictions)
  ]);

  return ContentService.createTextOutput(JSON.stringify({ result: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

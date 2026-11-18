/**
 * RSVP.JS
 * Maneja el envío del formulario de confirmación de asistencia.
 * El modo se define en config.js -> rsvp.mode: "whatsapp" | "sheets" | "both"
 */
(function () {
  "use strict";
  const cfg = window.WEDDING_CONFIG;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  function buildWhatsAppMessage(data) {
    const lines = [
      `*Confirmación de asistencia — ${cfg.couple.brideName} & ${cfg.couple.groomName}*`,
      `Nombre: ${data.name}`,
      `¿Asiste?: ${data.attending}`,
      data.attending === "Sí" ? `Cantidad de invitados: ${data.guests}` : null,
      data.attending === "Sí" ? `Menú: ${data.menu}` : null,
      data.restrictions ? `Restricciones alimentarias: ${data.restrictions}` : null,
      data.comments ? `Comentarios: ${data.comments}` : null
    ].filter(Boolean);
    return lines.join("\n");
  }

  function sendViaWhatsApp(data) {
    const phone = cfg.rsvp.whatsapp.phoneNumber;
    const text = encodeURIComponent(buildWhatsAppMessage(data));
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, "_blank", "noopener");
  }

  /**
   * Envía datos a un Google Apps Script Web App publicado.
   * Se usa "no-cors" porque Apps Script no siempre responde con headers CORS;
   * esto significa que no podemos leer la respuesta, pero el POST sí llega
   * y queda guardado en la planilla. Ver /guia-google-sheets.md para el script
   * que hay que pegar en Apps Script.
   */
  window.sendToSheets = async function (data) {
    const url = cfg.rsvp.sheets?.webAppUrl;
    if (!url || url.includes("TU_ID_DE_DESPLIEGUE")) {
      console.warn("Falta configurar rsvp.sheets.webAppUrl en config.js");
      return false;
    }
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      });
      return true;
    } catch (err) {
      console.error("Error enviando a Google Sheets:", err);
      return false;
    }
  };

  function setFeedback(msg, type) {
    const el = $("#rsvp-feedback");
    el.textContent = msg;
    el.className = "rsvp-feedback" + (type ? ` is-${type}` : "");
  }

  function init() {
    const form = $("#rsvp-form");
    if (!form) return;
    const guests = $("#rsvp-guests");
    const choiceGroup = $(".choice-group", form);
    const attendingValue = () => (form.querySelector('input[name="attending"]:checked') || {}).value || "";

    // Sí / No: si no viene, se ocultan cantidad, menú y restricciones
    form.querySelectorAll('input[name="attending"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        form.classList.toggle("is-declining", attendingValue() === "No");
        choiceGroup.classList.remove("field-error");
      });
    });

    // Botones − / + de cantidad de personas
    form.querySelectorAll(".stepper-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!guests) return;
        const min = Number(guests.min) || 1;
        const max = Number(guests.max) || 10;
        const next = (Number(guests.value) || min) + Number(btn.dataset.step);
        guests.value = Math.min(max, Math.max(min, next));
      });
    });

    $("#rsvp-name").addEventListener("input", (e) => e.target.classList.remove("field-error"));

    // "Enviar otra confirmación" vuelve a mostrar el formulario vacío
    $("#rsvp-again").addEventListener("click", () => {
      $("#rsvp-thanks").hidden = true;
      form.hidden = false;
      $("#rsvp-name").focus();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = $("#rsvp-submit");
      const attending = attendingValue();
      const name = $("#rsvp-name").value.trim();

      if (!name || !attending) {
        if (!name) $("#rsvp-name").classList.add("field-error");
        if (!attending) choiceGroup.classList.add("field-error");
        setFeedback(!name ? "Contanos tu nombre y apellido." : "Elegí si venís o no.", "error");
        return;
      }

      const going = attending === "Sí";
      const data = {
        type: "rsvp",
        name,
        attending,
        guests: going ? String(guests ? Math.max(1, Number(guests.value) || 1) : 1) : "0",
        menu: going ? $("#rsvp-menu").value : "",
        restrictions: going ? $("#rsvp-restrictions").value.trim() : "",
        comments: $("#rsvp-comments") ? $("#rsvp-comments").value.trim() : "",
        date: new Date().toISOString()
      };

      submitBtn.disabled = true;
      setFeedback("Enviando...", null);

      const mode = cfg.rsvp.mode || "whatsapp";
      let sheetsOk = true;

      if (mode === "sheets" || mode === "both") {
        sheetsOk = await window.sendToSheets(data);
      }
      if (mode === "whatsapp" || mode === "both") {
        sendViaWhatsApp(data);
      }

      submitBtn.disabled = false;

      if (mode === "sheets" && !sheetsOk) {
        setFeedback("No pudimos enviar tu confirmación. Probá de nuevo en un momento.", "error");
        return;
      }

      // Tarjeta de agradecimiento en lugar del formulario
      const firstName = name.split(" ")[0];
      $("#rsvp-thanks-title").textContent = `¡Gracias, ${firstName}!`;
      $("#rsvp-thanks-text").textContent = going
        ? "Recibimos tu confirmación. Nos hace muy felices que nos acompañes."
        : "Recibimos tu respuesta. Te vamos a extrañar, gracias por avisarnos.";
      setFeedback("", null);
      form.reset();
      form.classList.remove("is-declining");
      form.hidden = true;
      $("#rsvp-thanks").hidden = false;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

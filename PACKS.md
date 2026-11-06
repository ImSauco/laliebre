# Packs de maratón 2027

Precio: 179,97 € en pago único por tres meses de preparación (59,99 €/mes equivalentes). Gestión de contratación y pago por email.

La regla comercial sigue el ejemplo del propietario: carrera en marzo → preparación enero–marzo → cierre el 25 de diciembre anterior, incluido, en Europe/Madrid. Se usa el día 25 fijo; no se restan literalmente cinco días al inicio del mes.

`packs-2027.js` reúne las fechas y enlaces oficiales consultados el 6 de noviembre de 2026. En Londres se incluyen las dos jornadas, 24 y 25 de abril. Ciudad del Cabo forma parte de los Majors de 2027 según https://www.worldmarathonmajors.com/cape-town-major .

Málaga, Valencia y Alicante tienen fecha `null`: no se ha verificado una fecha oficial de 2027 y solo se aceptan consultas informativas. Para activarlos, confirmar primero la fecha con el organizador y actualizar el catálogo y el texto de la tarjeta en `index.html`.

La página bloquea los botones vencidos y comprueba también los enlaces directos y el envío del formulario de contacto. Esta web estática depende del reloj del navegador: no sustituye la comprobación del plazo por parte de Jaime antes de aceptar un pago por email. No hay pagos ni reserva automática de plaza en la carrera.

Comprobaciones: `node check-packs.cjs`.

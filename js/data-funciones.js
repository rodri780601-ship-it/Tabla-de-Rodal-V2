/* Funciones de volumen de árboles individuales transcritas del "Compendio de Funciones Dendrométricas del Bosque Nativo" (Drake, Emanuelli y Acuña, 2003).
   expr: D = DAP (cm), H = altura (m) según "alturaTipo". Resultado en la unidad indicada.
   validacion: comparación automática de la ecuación con la tabla de volumen impresa en el compendio. */
window.FUNCIONES_COMPENDIO = [
{
"id": 1,
"pag": 23,
"especies": [
"Alerce"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.0153415+0.0000602163*D*D*H",
"eq": "V = - 0,0153415 + 0,0000602163 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 2,
"pag": 23,
"especies": [
"Alerce"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Bruto ssc (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00002032*D*D*H+0.00000713*D*D*D",
"eq": "V = 0,00002032 • D 2 • H + 0,00000713 • D 3",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 3,
"pag": 24,
"especies": [
"Alerce"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1987",
"muestra": "Sin Información",
"r2": "0,9859",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0859142+0.0000988347*D*D-0.00104059*D*H+0.0000465418*D*D*H",
"eq": "V = 0,0859142 + 0,0000988347 • D 2 - 0,00104059 • D • H + 0,0000465418 • D 2 H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 4,
"pag": 24,
"especies": [
"Alerce"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Provincia de Osorno y Llanquihue.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Kawas",
"anio": "1978",
"muestra": "27 árboles",
"r2": "0,9880",
"variable": "Logaritmo natural del volumen total",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.291067+0.974113*Math.log(D*D*H))",
"eq": "LNV = (- 10,291067 + 0,974113 • LN (D 2H))",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 5,
"pag": 25,
"especies": [
"Alerce"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "12 - 63 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "85 árboles",
"r2": "0,9660",
"variable": "Volumen sólido sin corteza hasta un DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.063254+0.000045*D*D*H-8.99e-10*Math.pow(D*D*H,2)+9.297e-15*Math.pow(D*D*H,3)",
"eq": "V = - 0,063254 + 0,000045 • D 2 H - 8,99 • 10 -10 • (D 2H) 2 + 9,297 • 10 -15 • (D 2 H) 3",
"validacion": "verificada",
"valOk": 33,
"valTot": 33
},
{
"id": 6,
"pag": 25,
"especies": [
"Alerce"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "20",
"rangoD": "22,2 - 63 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "51 árboles",
"r2": "0,9505",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.387862+0.000073*D*D*H-1.692089e-10*Math.pow(D*D*H,2)+1.560314e-15*Math.pow(D*D*H,3)",
"eq": "V = - 0,387862 + 0,000073 • D2 H - 1,692089 • 10 -10 • (D 2 H) 2 + 1,560314 • 10 -15 • (D 2H) 3",
"validacion": "verificada",
"valOk": 27,
"valTot": 27
},
{
"id": 7,
"pag": 26,
"especies": [
"Alerce",
"Ciprés de las Guaitecas"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Cordillera de los Andes. Provincia",
"dlu": "0",
"rangoD": "20 - 120 cm",
"rangoH": "10 - 20 m",
"fuente": "Sandoval",
"anio": "1987",
"muestra": "Sin Información",
"r2": "0,7479",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.000608051+0.000081064*D*D+0.00061803*D*H+0.0000199*D*D*H",
"eq": "V = -0,000608051 + 0,000081064 • D 2 + 0,00061803 • D • H + 0,0000199 • D 2 H",
"validacion": "verificada",
"valOk": 41,
"valTot": 41
},
{
"id": 8,
"pag": 26,
"especies": [
"Alerce",
"Avellano",
"Canelo",
"Coigüe de Chiloé",
"Luma",
"Mañío de hojas punzantes",
"Mañío de hojas cortas",
"Melí",
"Olivillo",
"Tepa",
"Tineo",
"Ulmo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "0",
"rangoD": "6,5 - 98 cm",
"rangoH": "8 - 28 m",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "1262 árboles",
"r2": "0,9649",
"variable": "Volumen sólido sin corteza total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000019*D*D*H+0.00024*D*D",
"eq": "V = 0,000019 • D 2H + 0,00024 • D 2",
"validacion": "verificada",
"valOk": 26,
"valTot": 26
},
{
"id": 9,
"pag": 27,
"especies": [
"Alerce",
"Avellano",
"Canelo",
"Coigüe de Chiloé",
"Luma",
"Mañío de hojas punzantes",
"Mañío de hojas cortas",
"Melí",
"Olivillo",
"Tepa",
"Tineo",
"Ulmo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "15",
"rangoD": "15 - 98 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "1262 árboles",
"r2": "0,9612",
"variable": "Volumen sólido sin corteza hasta un",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000019*D*D*H+0.000191*D*D",
"eq": "V = 0,000019 • D 2H + 0,000191 • D 2",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 10,
"pag": 27,
"especies": [
"Alerce",
"Canelo",
"Ciprés de las Guaitecas"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Zona Costera de la Provincia de",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nabil",
"anio": "1978",
"muestra": "84 árboles",
"r2": "0,9781",
"variable": "Logaritmo Natural del volumen",
"alturaTipo": "comercial",
"alturaDesc": "Altura Comercial hasta",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.12171+0.9610084*Math.log(D*D*H))",
"eq": "LNV = (- 10,12171 + 0,9610084 • LN (D 2H))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 11,
"pag": 28,
"especies": [
"Araucaria"
],
"regiones": [
"VIII",
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Cordillera Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH (1984), citado por Sandoval (1996)",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00003544*D*D*H+0.00015692*D*D",
"eq": "V = 0,00003544 • D 2H + 0,00015692 • D 2",
"validacion": "verificada",
"valOk": 80,
"valTot": 80
},
{
"id": 12,
"pag": 28,
"especies": [
"Araucaria"
],
"regiones": [
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Forestal",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "JICA",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total del fuste con corteza (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": false,
"expr": "-0.97089+0.000658*D*D",
"eq": "V = - 0,97089 + 0,000658 • D 2 95 4,9676",
"validacion": "verificada",
"valOk": 9,
"valTot": 9
},
{
"id": 13,
"pag": 29,
"especies": [
"Arrayán"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Isla de Chiloé.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "48 árboles",
"r2": "0,9801",
"variable": "Volumen sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0381+0.4731*Math.pow(D/100,2)*(-5.081+0.7704*H)",
"eq": "V = 0,0381 + 0,4731 • ( D ) 2 • (- 5,081 + 0,7704 • H)",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 14,
"pag": 29,
"especies": [
"Avellano"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Peñaloza",
"anio": "1985",
"muestra": "50 árboles",
"r2": "0,9604",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0000799+0.000033318*D*D*H",
"eq": "V = 0,0000799 + 0,000033318 • D 2H",
"validacion": "verificada",
"valOk": 33,
"valTot": 33
},
{
"id": 15,
"pag": 30,
"especies": [
"Avellano"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "11,2 - 27,2 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "29 árboles",
"r2": "0,8206",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000025*D*D*H",
"eq": "V = 0,000025 • D 2H",
"validacion": "verificada",
"valOk": 22,
"valTot": 22
},
{
"id": 16,
"pag": 30,
"especies": [
"Avellano",
"Ulmo"
],
"regiones": [
"VIII",
"IX"
],
"estructura": "Renoval",
"localidad": "Cordillera Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00004057*D*D*H+0.00009389*D*D",
"eq": "V = 0,00004057 • D 2H + 0,00009389 • D 2",
"validacion": "verificada",
"valOk": 34,
"valTot": 34
},
{
"id": 17,
"pag": 31,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Reserva Forestal Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Gunckel",
"anio": "1980",
"muestra": "27 árboles",
"r2": "0,9584",
"variable": "Volumen comercial del árbol sin",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.06524+0.00062*D*D",
"eq": "V = - 0,06524 + 0,00062 • D 2",
"validacion": "verificada",
"valOk": 10,
"valTot": 10
},
{
"id": 18,
"pag": 31,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Reserva Forestal Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Gunckel",
"anio": "1980",
"muestra": "27 árboles",
"r2": "0,9467",
"variable": "Volumen Total del Árbol",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.03+0.00063*D*D",
"eq": "V = - 0,03 + 0,00063 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 19,
"pag": 32,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Reserva Forestal Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Gunckel",
"anio": "1980",
"muestra": "27 árboles",
"r2": "0,9351",
"variable": "Volumen Total (m2).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.03588+0.00075*D*D",
"eq": "V = - 0,03588 + 0,00075 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 20,
"pag": 32,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Isla de Chiloé.",
"dlu": "5",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "272 árboles",
"r2": "0,7193",
"variable": "Volumen sólido sin corteza hasta un diámetro",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.pow(D/100,2)*(-0.73691+0.33301*H)",
"eq": "V = (D/100) 2 • (- 0,73691 + 0,33301 • H)",
"validacion": "verificada",
"valOk": 49,
"valTot": 49
},
{
"id": 21,
"pag": 33,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Hacienda Chaihuín y Hacienda",
"dlu": "0",
"rangoD": "10 - 75 cm",
"rangoH": "2 - 22 m",
"fuente": "Terranova S.A",
"anio": "1990",
"muestra": "88 árboles",
"r2": "0,9821",
"variable": "Logaritmo Natural del volumen",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.285)*Math.pow(D,2.015)*Math.pow(H,0.73)",
"eq": "LNV = (- 9,285) • D 2,015 • H 0,73",
"validacion": "verificada",
"valOk": 41,
"valTot": 41
},
{
"id": 22,
"pag": 33,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Reserva Forestal Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1980",
"muestra": "27 árboles",
"r2": "0,9860",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.02266+0.00003103*D*D*H",
"eq": "V = -0,02266 + 0,00003103 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 23,
"pag": 34,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Río Maullín - Lago Llanquihue -",
"dlu": "5",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Niebuhr",
"anio": "1988",
"muestra": "278 árboles",
"r2": "0,8048",
"variable": "Volumen sólido sin corteza",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.pow(D/100,2)*(-0.51886+0.31913*H)",
"eq": "V = ( D ) 2 • (- 0,51886 + 0,31913 • H)",
"validacion": "verificada",
"valOk": 56,
"valTot": 56
},
{
"id": 24,
"pag": 34,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Reserva Forestal Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Gunckel",
"anio": "1980",
"muestra": "27 árboles",
"r2": "0,9821",
"variable": "Volumen Total del árbol, sin corteza(m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01222+0.0000315502*D*D*H",
"eq": "V = 0,01222 + 0,0000315502 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 25,
"pag": 35,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Provincia de Osorno y Llanquihue.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Kawas",
"anio": "1978",
"muestra": "37 árboles",
"r2": "0,9565",
"variable": "Logaritmo natural del volumen (m 2).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.121633+0.963638*Math.log(D*D*H))",
"eq": "LNV = (- 10,121633 + 0,963638 • LN (D 2H))",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 26,
"pag": 35,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Predio Quitaluto, Reserva Forestal Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Tapia",
"anio": "1982",
"muestra": "47 árboles",
"r2": "0,9139",
"variable": "Volumen Total del árbol, sin",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.0114+0.00063*D*D",
"eq": "V = - 0,0114 + 0,00063 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 27,
"pag": 36,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "11 - 77 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "170 árboles",
"r2": "0,9560",
"variable": "Volumen sólido sin corteza hasta un DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0000096543*D*D*H+0.00035*D*D",
"eq": "V = 0,0000096543 • D 2H + 0,00035 • D 2",
"validacion": "verificada",
"valOk": 31,
"valTot": 31
},
{
"id": 28,
"pag": 36,
"especies": [
"Canelo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "20",
"rangoD": "20,3 - 77 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "117 árboles",
"r2": "0,9541",
"variable": "Volumen sólido sin corteza hasta un",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000007357*D*D*H+0.000371*D*D",
"eq": "V = 0,000007357 • D 2H + 0,000371 • D 2",
"validacion": "verificada",
"valOk": 27,
"valTot": 27
},
{
"id": 29,
"pag": 37,
"especies": [
"Canelo"
],
"regiones": [
"XII"
],
"estructura": "Sin Información",
"localidad": "Isla Navarino.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total del árbol, sin",
"alturaTipo": "copa",
"alturaDesc": "Altura comienzo de copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.401+0.0000318*D*D*H",
"eq": "V = 0,401 + 0,0000318 • D 2H",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 30,
"pag": 37,
"especies": [
"Canelo"
],
"regiones": [
"XII"
],
"estructura": "Sin Información",
"localidad": "Cordillera de la Costa.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Quiroz",
"anio": "1990",
"muestra": "38 árboles",
"r2": "0,9409",
"variable": "Volumen del árbol sin corteza hasta DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.3767+0.0002*D*D+0.0198*H",
"eq": "V = - 0,3767 + 0,0002 • D 2 + 0,0198 • H",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 31,
"pag": 38,
"especies": [
"Canelo"
],
"regiones": [
"XII"
],
"estructura": "Sin Información",
"localidad": "Cordillera de la Costa.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Quiroz",
"anio": "1990",
"muestra": "35 árboles",
"r2": "0,9409",
"variable": "Volumen del árbol sin corteza hasta DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.1185+0.0005*D*D+0.0091*H",
"eq": "V = - 0,1185 + 0,0005 • D 2 + 0,0091 • H",
"validacion": "verificada",
"valOk": 50,
"valTot": 50
},
{
"id": 32,
"pag": 38,
"especies": [
"Canelo",
"Tiaca",
"Avellano"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Llano central de la Provincia de",
"dlu": "0",
"rangoD": "40 - 150 cm",
"rangoH": "4 - 24 m",
"fuente": "Urzúa, et al",
"anio": "1980",
"muestra": "38 árboles",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.17079+3.1379*D*D*H/100000",
"eq": "V = 0,17079 + 3,1379 • D 2 • H",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 33,
"pag": 39,
"especies": [
"Ciprés de las Guaitecas"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Comuna de Quellón.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cruz y Lara",
"anio": "1981",
"muestra": "47 árboles",
"r2": "0,9848",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0026518+0.0000206*D*D*H",
"eq": "V = 0,0026518 + 0,0000206 • D 2H",
"validacion": "verificada",
"valOk": 35,
"valTot": 35
},
{
"id": 34,
"pag": 39,
"especies": [
"Coigüe"
],
"regiones": [
"VII",
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Cordillera de Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Real y Sandoval",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen total con corteza (m 3).",
"alturaTipo": "copa",
"alturaDesc": "Altura comienzo de copa(m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00003544*D*D*H+0.00015692*D*D",
"eq": "V = 0,00003544 • D 2H + 0,00015692 • D 2",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 35,
"pag": 40,
"especies": [
"Coigüe"
],
"regiones": [
"VIII"
],
"estructura": "Bosque Adulto",
"localidad": "Cordillera Nahuelbuta (Predios BASA).",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Real y Sandoval",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00003544*D*D*H+0.00015692*D*D",
"eq": "V = 0,00003544 • D 2H + 0,00015692 • D 2",
"validacion": "verificada",
"valOk": 51,
"valTot": 54
},
{
"id": 36,
"pag": 40,
"especies": [
"Coigüe"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Hacienda Chaihuin y Hacienda Venecia.",
"dlu": "0",
"rangoD": "15 - 110 cm",
"rangoH": "2 - 28 m",
"fuente": "Terranova S.A",
"anio": "1990",
"muestra": "108 árboles",
"r2": "0,9841",
"variable": "Volumen total con corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.049)*Math.pow(D,1.95)*Math.pow(H,0.749)",
"eq": "V = EXP (- 9,049) • D 1,95 • H 0,749",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 37,
"pag": 41,
"especies": [
"Coigüe"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Morrompulli.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Maureira",
"anio": "1995",
"muestra": "30 árboles",
"r2": "0,9216",
"variable": "Volumen bruto total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.001846+0.000037*D*D*H",
"eq": "V = - 0,001846 + 0,000037 • D 2 H",
"validacion": "verificada",
"valOk": 46,
"valTot": 46
},
{
"id": 38,
"pag": 41,
"especies": [
"Coigüe"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Llanquihue.",
"dlu": "0",
"rangoD": "40 - 150 cm",
"rangoH": "4 - 24 m",
"fuente": "Urzúa et al",
"anio": "1980",
"muestra": "34 árboles",
"r2": "Sin Información.",
"variable": "Volumen total con corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.20904+4.0358*D*D*H/100000",
"eq": "V = 0,20904 + 4,0358 • D 2 • H",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 39,
"pag": 42,
"especies": [
"Coigüe"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Las Palmas.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1995",
"muestra": "30 árboles",
"r2": "0,9604",
"variable": "Volumen bruto total (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.006066+0.000032*D*D*H",
"eq": "V = - 0,006066 + 0,000032 • D 2 H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 40,
"pag": 42,
"especies": [
"Coigüe"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Area Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "INFOR",
"anio": "1991",
"muestra": "50 árboles",
"r2": "0,9604",
"variable": "Volumen total sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": false,
"expr": "-0.05476487+0.00073611*D*D",
"eq": "V = - 0,05476487 + 0,00073611 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 41,
"pag": 43,
"especies": [
"Coigüe"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Panguipuli - Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cubillos",
"anio": "1988",
"muestra": "40 árboles",
"r2": "0,9800",
"variable": "Volumen total desde una altura de 0.3 m hasta el",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01210478+0.000029462*D*D*H",
"eq": "V = 0,01210478 + 0,000029462 • D 2H",
"validacion": "verificada",
"valOk": 44,
"valTot": 44
},
{
"id": 42,
"pag": 43,
"especies": [
"Coigüe"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Provincia de Osorno y Llanquihue.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Kawas",
"anio": "1978",
"muestra": "36 árboles",
"r2": "0,9860",
"variable": "Volumen total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.312929+0.991795*Math.log(D*D*H))",
"eq": "V = EXP (- 10,312929 + 0,991795 • LN (D 2H))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 43,
"pag": 44,
"especies": [
"Coigüe"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Predio Los Troncos.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Lavanderos",
"anio": "1997",
"muestra": "Sin Información",
"r2": "0,9898",
"variable": "Volumen total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.004656537+0.000032538*D*D*H",
"eq": "V = 0,004656537 + 0,000032538 • D 2H",
"validacion": "verificada",
"valOk": 39,
"valTot": 39
},
{
"id": 44,
"pag": 44,
"especies": [
"Coigüe"
],
"regiones": [
"XI"
],
"estructura": "Renoval",
"localidad": "Laguna Pedro Aguirre",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Delgado",
"anio": "1986",
"muestra": "86 árboles",
"r2": "0,9800",
"variable": "Volumen total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.000751218791+0.0000386766673*D*D*H",
"eq": "V = - 0,000751218791 + 0,0000386766673 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 45,
"pag": 45,
"especies": [
"Coigüe"
],
"regiones": [
"XI"
],
"estructura": "Renoval",
"localidad": "Predio El Canelo.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Ferrando",
"anio": "1994",
"muestra": "31 árboles",
"r2": "0,9799",
"variable": "Volumen total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.0257+0.968963*Math.log(D*D*H))",
"eq": "V = EXP (- 10,0257 + 0,968963 • LN (D 2H))",
"validacion": "verificada",
"valOk": 44,
"valTot": 44
},
{
"id": 46,
"pag": 45,
"especies": [
"Coigüe",
"Coigüe de Magallanes"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Río Maullín - Llanquihue -",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "38 árboles",
"r2": "0,7960",
"variable": "Volumen total sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.pow(D/100,2)*(-2.96307+0.4779*H)",
"eq": "V=( D ) 2 • (- 2,96307 + 0,4779 • H)",
"validacion": "verificada",
"valOk": 51,
"valTot": 51
},
{
"id": 47,
"pag": 46,
"especies": [
"Coigüe",
"Mañío de hojas punzantes",
"Roble"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Zona Costera de la Provincia",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nabil",
"anio": "1978",
"muestra": "96 árboles",
"r2": "0,9663",
"variable": "Logaritmo Natural del",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.367+0.997323*Math.log(D*D*H))",
"eq": "LNV = (- 10,367 + 0,997323 • LN (D 2 H))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 48,
"pag": 46,
"especies": [
"Coigüe de Chiloé"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia. Rango Altura",
"dlu": "10",
"rangoD": "12,5 - 88,2 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "187 árboles",
"r2": "0,9756",
"variable": "Volumen sólido sin corteza hasta un",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0000077273*D*D*H+0.000527*D*D",
"eq": "V = 0,0000077273 • D 2H + 0,000527 • D 2",
"validacion": "verificada",
"valOk": 31,
"valTot": 31
},
{
"id": 49,
"pag": 47,
"especies": [
"Coigüe de Chiloé"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "20",
"rangoD": "20 - 88,2 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "150 árboles",
"r2": "0,9662",
"variable": "Volumen sólido sin corteza hasta un DLU de 20 cm (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000007308044*D*D*H+0.0005*D*D",
"eq": "V = 0,000007308044 • D 2 • H + 0,0005 • D 2",
"validacion": "verificada",
"valOk": 25,
"valTot": 25
},
{
"id": 50,
"pag": 47,
"especies": [
"Coigüe de Magallanes"
],
"regiones": [
"XII"
],
"estructura": "Renoval",
"localidad": "Tierra del Fuego.",
"dlu": "10",
"rangoD": "11 - 82 cm",
"rangoH": "11 - 30 m",
"fuente": "Sandoval",
"anio": "1995",
"muestra": "17 árboles",
"r2": "0,9140",
"variable": "Volumen total sin corteza hasta la",
"alturaTipo": "copa",
"alturaDesc": "Altura comienzo de copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.085762209+0.000045139*D*D*H",
"eq": "V = 0,085762209 + 0,000045139 • D 2H",
"validacion": "verificada",
"valOk": 33,
"valTot": 33
},
{
"id": 51,
"pag": 48,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Llaimávida.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.020184745+0.000036075*D*D*H",
"eq": "V = - 0,020184745 + 0,000036075 • D 2H",
"validacion": "discrepancia",
"valOk": 6,
"valTot": 38,
"nota": "La tabla del compendio coincide con intercepto positivo (+0,020184745); se usa la ecuación impresa."
},
{
"id": 52,
"pag": 48,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "El Ranchillo.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.034547117+0.0000317108*D*D*H",
"eq": "V = 0,034547117 + 0,0000317108 • D 2H",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 53,
"pag": 49,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "El Colorado.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Barrales",
"anio": "1993",
"muestra": "44 árboles",
"r2": "0,9801",
"variable": "Volumen inicio de copa sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00639217+0.0000309905*D*D*H",
"eq": "V = 0,00639217 + 0,0000309905 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 54,
"pag": 49,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "El Colorado.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Barrales",
"anio": "1993",
"muestra": "44 árboles",
"r2": "0,9801",
"variable": "Volumen Total con corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01110888+0.0000409735*D*D*H",
"eq": "V = 0,01110888 + 0,0000409735 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 55,
"pag": 50,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "El Colorado.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Barrales",
"anio": "1993",
"muestra": "44 árboles",
"r2": "0,9801",
"variable": "Volumen Total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00731631+0.0000311403*D*D*H",
"eq": "V = 0,00731631 + 0,0000311403 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 56,
"pag": 50,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "El Colorado.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Barrales",
"anio": "1993",
"muestra": "44 árboles",
"r2": "0,9801",
"variable": "Volumen inicio de copa con corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00976343+0.0000406346*D*D*H",
"eq": "V = 0,00976343 + 0,0000406346 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 57,
"pag": 51,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "El Colorado.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Valladares",
"anio": "1992",
"muestra": "Sin Información",
"r2": "0,9799",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0048874+0.000035024*D*D*H",
"eq": "V = 0,0048874 + 0,000035024 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 58,
"pag": 51,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Sector El Armerillo.",
"dlu": "5",
"rangoD": "10 - 40 cm",
"rangoH": "Sin Información",
"fuente": "Martínez",
"anio": "1996",
"muestra": "114 árboles",
"r2": "0,9654",
"variable": "Volumen sin corteza hasta un DLU de 5 cm (m3).",
"alturaTipo": "comercial",
"alturaDesc": "Altura Comercial hasta un DLU de 5 cm (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.014168+0.000039*D*D*H",
"eq": "V = 0,014168 + 0,000039 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 59,
"pag": 52,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "San Clemente.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Bustos",
"anio": "1990",
"muestra": "Sin Información",
"r2": "0,9900",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "0.0306+0.000028475*D*D*H",
"eq": "V = 0,0306 + 0,000028475 • D 2H",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 60,
"pag": 52,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Constitución.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Bustos",
"anio": "1995",
"muestra": "26 árboles",
"r2": "0,9900",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "0.0293+0.0000281*D*D*H",
"eq": "V = 0,0293 + 0,0000281 • D 2H",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 61,
"pag": 53,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Constitución.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Pérez",
"anio": "1985",
"muestra": "29 árboles",
"r2": "0,9600",
"variable": "Sin Información.",
"alturaTipo": "no aplica",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": false,
"expr": "0.3939-0.03501*D+0.00142*D*D",
"eq": "V = 0,3939 - 0,03501 • D + 0,00142 • D2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 62,
"pag": 53,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Rabones.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Carrasco",
"anio": "1998",
"muestra": "Sin Información",
"r2": "0,9500",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "0.0002853*Math.pow(D,1.610158)*Math.pow(H,0.805079)",
"eq": "V = 0,0002853 • D 1,610158 • H 0,805079",
"validacion": "verificada",
"valOk": 27,
"valTot": 27
},
{
"id": 63,
"pag": 54,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Vega de Salas.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Vargas",
"anio": "1998",
"muestra": "60 árboles",
"r2": "0,8900",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-8.425079)*Math.pow(D*D*H,0.792437)",
"eq": "V = e - 8,425079 • (D 2H) 0,792437",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 64,
"pag": 54,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Sin Información",
"localidad": "Picazo Alto.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Flandez",
"anio": "1998",
"muestra": "Sin Información",
"r2": "0,9800",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.08544+0.882965*Math.log(D*D*H))",
"eq": "LNV = - 9,08544 + 0,882965 • Ln (D 2H)",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 65,
"pag": 55,
"especies": [
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Precordillera Andina.",
"dlu": "0",
"rangoD": "7 - 60 cm",
"rangoH": "4 - 24 m",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "198 árboles",
"r2": "0,9574",
"variable": "Logaritmo Natural del Volumen Total.",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.519438+0.9152567*Math.log(D*D*H))",
"eq": "LNV = - 9,519438 + 0,9152567 • LN (D 2H)",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 66,
"pag": 55,
"especies": [
"Laurel",
"Tepa",
"Trevo"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Peñaloza",
"anio": "1985",
"muestra": "50 árboles",
"r2": "0,9604",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.0000799+0.000033318*D*D*H",
"eq": "V = - 0,0000799 + 0,000033318 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 67,
"pag": 56,
"especies": [
"Lenga"
],
"regiones": [
"XI"
],
"estructura": "Renoval",
"localidad": "Cerro La Virgen.",
"dlu": "0",
"rangoD": "17 - 39 cm",
"rangoH": "Sin Información",
"fuente": "Siebert",
"anio": "1995",
"muestra": "Sin Información",
"r2": "0,9460",
"variable": "Volumen sólido sin corteza (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.085+0.0000193*D*D*D",
"eq": "V = 0,085 + 0,0000193 • D 3",
"validacion": "discrepancia",
"valOk": 0,
"valTot": 11,
"nota": "La ecuación impresa no reproduce la tabla del compendio."
},
{
"id": 68,
"pag": 56,
"especies": [
"Lenga"
],
"regiones": [
"XI"
],
"estructura": "Bosque Adulto",
"localidad": "Predio El Canelo.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Ferrando",
"anio": "1994",
"muestra": "301 árboles",
"r2": "0,9700",
"variable": "Volumen sólido sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.6026-0.00000044665*D*D*D+0.8021*Math.log(D*D*H)+0.6757*Math.log(D))",
"eq": "V = EXP (- 10,6026 - 0,00000044665 • D 3 + 0,8021 • LN (D 2 H) + 0,6757 • LN (D))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 69,
"pag": 57,
"especies": [
"Lenga"
],
"regiones": [
"XI"
],
"estructura": "Bosque Adulto",
"localidad": "Predio El Canelo.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Ferrando",
"anio": "1994",
"muestra": "108 árboles",
"r2": "0,8800",
"variable": "Volumen sólido sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.016092+0.00003*D*D*H",
"eq": "V = 0,016092 + 0,00003 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 70,
"pag": 57,
"especies": [
"Lenga"
],
"regiones": [
"XI"
],
"estructura": "Sin Información",
"localidad": "Predio El Canelo.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Ferrando",
"anio": "1994",
"muestra": "66 árboles",
"r2": "0,8500",
"variable": "Volumen neto sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.2667224-0.0000005079614*D*D*D+0.000048*D*D*H",
"eq": "V = -0,2667224 - 0,0000005079614 • D 3 + 0,000048 • D 2H",
"validacion": "verificada",
"valOk": 51,
"valTot": 51
},
{
"id": 71,
"pag": 58,
"especies": [
"Lenga"
],
"regiones": [
"XI"
],
"estructura": "Bosque Adulto",
"localidad": "Alto Mañihuales.",
"dlu": "0",
"rangoD": "15 - 100 cm",
"rangoH": "5 - 30 m",
"fuente": "Alvarez y Grosse",
"anio": "1978",
"muestra": "44 árboles",
"r2": "0,9637",
"variable": "Volumen total(m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "D*D*(0.000286+0.0000215*H)",
"eq": "V = D 2 • (0,000286 + 0,0000215 • H)",
"validacion": "verificada",
"valOk": 65,
"valTot": 65
},
{
"id": 72,
"pag": 58,
"especies": [
"Lenga"
],
"regiones": [
"XI"
],
"estructura": "Bosque Adulto",
"localidad": "Alto Mañihuales.",
"dlu": "0",
"rangoD": "5 - 100 cm",
"rangoH": "5 - 30 m",
"fuente": "Alvarez y Grosse",
"anio": "1978",
"muestra": "44 árboles",
"r2": "0,9324",
"variable": "Volumen aserrable(m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00893+0.0000159*D*D*H",
"eq": "V = 0,00893 + 0,0000159 • D 2H",
"validacion": "verificada",
"valOk": 66,
"valTot": 66
},
{
"id": 73,
"pag": 59,
"especies": [
"Lenga"
],
"regiones": [
"XI"
],
"estructura": "Bosque Adulto",
"localidad": "Alto Mañihuales.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Alvarez y Grosse",
"anio": "1978",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.0078+0.000871*D*D",
"eq": "V = - 0,0078 + 0,000871 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 74,
"pag": 59,
"especies": [
"Lenga"
],
"regiones": [
"XI"
],
"estructura": "Bosque Adulto",
"localidad": "Cerro La Virgen.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Manosalva",
"anio": "1995",
"muestra": "Sin Información",
"r2": "0,9460",
"variable": "Volumen total sólido sin corteza (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.085+0.0000193*D*D*D",
"eq": "V = 0,085 + 0,0000193 • D 3",
"validacion": "verificada",
"valOk": 19,
"valTot": 19
},
{
"id": 75,
"pag": 60,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Sin Información",
"localidad": "Comuna de Río Rubens.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Mosqueda",
"anio": "1995",
"muestra": "Sin Información",
"r2": "0,9598",
"variable": "Volumen bruto con corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.001109*Math.pow(D,1.89411)",
"eq": "V = 0,001109 • D 1,89411",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 76,
"pag": 60,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Sin Información",
"localidad": "Comuna de Río Rubens",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Mosqueda",
"anio": "1995",
"muestra": "Sin Información",
"r2": "0,9598",
"variable": "Volumen bruto con corteza (m 3)",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.001126*Math.pow(D,1.84682)",
"eq": "V = 0,001126 • D 1,84682",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 77,
"pag": 61,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Sin Información",
"localidad": "Comuna de Río Rubens.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Mosqueda",
"anio": "1995",
"muestra": "Sin Información",
"r2": "0,9498",
"variable": "Volumen bruto con corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.001863*D*H-0.015086*D",
"eq": "V = 0,001863 • D • H - 0,015086 • D",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 78,
"pag": 61,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Bosque Adulto",
"localidad": "Tierra del Fuego.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1985",
"muestra": "Sin Información",
"r2": "0,9750",
"variable": "Volumen bruto sin corteza hasta un",
"alturaTipo": "copa",
"alturaDesc": "Altura comienzo de copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.018946497+0.000048158*D*D*H",
"eq": "V = - 0,018946497 + 0,000048158 • D 2H",
"validacion": "verificada",
"valOk": 35,
"valTot": 37
},
{
"id": 79,
"pag": 62,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Forestal de",
"dlu": "0",
"rangoD": "12 - 82 cm",
"rangoH": "6,1 - 27,7 m",
"fuente": "Schmidt y Urzúa",
"anio": "1982",
"muestra": "523 árboles",
"r2": "Sin Información.",
"variable": "Volumen bruto con .",
"alturaTipo": "total",
"alturaDesc": "Altura total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.030311892+0.00003272319*D*D*H",
"eq": "V = 0,030311892 + 0,00003272319 • D 2H",
"validacion": "verificada",
"valOk": 24,
"valTot": 24
},
{
"id": 80,
"pag": 62,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Bosque Adulto",
"localidad": "ReservaForestal de Skiring y",
"dlu": "0",
"rangoD": "25 - 80 cm",
"rangoH": "Sin Información",
"fuente": "Schmidt y Urzúa",
"anio": "1982",
"muestra": "523 árboles",
"r2": "Sin Información.",
"variable": "Volumen bruto con corteza (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.247641-0.01494661*D+0.0007925322*D*D",
"eq": "V = 0,247641 - 0,01494661 • D + 0,0007925322 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 81,
"pag": 63,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Bosque Adulto",
"localidad": "Isla Navarino.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen total bruto sin",
"alturaTipo": "sin información",
"alturaDesc": "Altura comienzo de",
"unidad": "m3",
"usaH": true,
"expr": "0.222+0.00003753*D*D*H",
"eq": "V = 0,222 + 0,00003753 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 82,
"pag": 63,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Forestal de Skiring y",
"dlu": "10",
"rangoD": "12 - 82 cm",
"rangoH": "6,1 - 27,7 m",
"fuente": "Schmidt y Urzúa",
"anio": "1982",
"muestra": "523 árboles",
"r2": "Sin Información.",
"variable": "Volumen total con corteza hasta la altura comercial de 10 cm (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.06061936+0.0000280696*D*D*H",
"eq": "V = 0,06061936 + 0,0000280696 • D 2H",
"validacion": "verificada",
"valOk": 24,
"valTot": 24
},
{
"id": 83,
"pag": 64,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Forestal de Skiring y",
"dlu": "10",
"rangoD": "12 - 82 cm",
"rangoH": "Sin Información",
"fuente": "Schmidt y Urzúa",
"anio": "1982",
"muestra": "523 árboles",
"r2": "Sin Información.",
"variable": "Volumen total con corteza hasta la",
"alturaTipo": "no aplica",
"alturaDesc": "Altura total (m).",
"unidad": "m3",
"usaH": false,
"expr": "0.03744712-0.001943534*D+0.0005492494*D*D",
"eq": "V = 0,03744712 - 0,001943534 • D + 0,0005492494 • D 2",
"validacion": "verificada",
"valOk": 10,
"valTot": 10
},
{
"id": 84,
"pag": 64,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Bosque Adulto",
"localidad": "Isla de Tierra del Fuego.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Garib",
"anio": "1996",
"muestra": "249 árboles",
"r2": "0,8699",
"variable": "Volumen Total Bruto sin corteza",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "pulgadas madereras",
"usaH": true,
"expr": "0.000008863e-6+0.001027*D*H-2.329321e-6+0.001027*D*D*H",
"eq": "V = 0,000008863 • 10 -6 + 0,001027 • D • H - 2,329321 • 10 -6 + 0,001027 • D 2 H",
"validacion": "discrepancia",
"valOk": 26,
"valTot": 30,
"nota": "Unidad: pulgadas madereras (no m³). No se usa para volumen en m³."
},
{
"id": 85,
"pag": 65,
"especies": [
"Lenga"
],
"regiones": [
"XII"
],
"estructura": "Bosque Adulto",
"localidad": "Isla Navarino.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen total bruto sin corteza (m 3).",
"alturaTipo": "copa",
"alturaDesc": "Altura comienzo de copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.222+0.00003753*D*D*H",
"eq": "V = 0,222 + 0,00003753 • D 2H",
"validacion": "verificada",
"valOk": 35,
"valTot": 35
},
{
"id": 86,
"pag": 65,
"especies": [
"Lenga",
"Coigüe"
],
"regiones": [
"XI"
],
"estructura": "Sin Información",
"localidad": "Reserva Forestal Coyhaique.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Vera",
"anio": "1985",
"muestra": "115 árboles",
"r2": "0,9866",
"variable": "Volumen Sólido sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.002874+0.00003998067*D*D*H",
"eq": "V = 0,002874 + 0,00003998067 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 87,
"pag": 66,
"especies": [
"Lingue"
],
"regiones": [
"VIII",
"IX"
],
"estructura": "Sin Información",
"localidad": "Cordillera de Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total con corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00005084*D*D*H+0.000000468*D*D*H*H",
"eq": "V = 0,00005084 • D 2H + 0,000000468 • D 2H 2",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 88,
"pag": 66,
"especies": [
"Lingue"
],
"regiones": [
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Jauja.",
"dlu": "10",
"rangoD": "DAP > 30 cm",
"rangoH": "Sin Información",
"fuente": "Santelices",
"anio": "1989",
"muestra": "22 árboles",
"r2": "0,9604",
"variable": "Volumen Total hasta un DLU de 10 cm (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.041488+0.000448*D*D+0.003063*H",
"eq": "V = - 0,041488 + 0,000448 • D 2 + 0,003063 • H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 89,
"pag": 67,
"especies": [
"Lingue"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Loncoche.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Corti",
"anio": "1996",
"muestra": "18 árboles",
"r2": "0,9918",
"variable": "Logaritmo natural del volumen sin",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.8164928+1.7003591*Math.log(D)+1.0726914*Math.log(H))",
"eq": "LNV = (- 9,8164928 + 1,7003591 • LN (D) + 1,0726914 • LN (H))",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 90,
"pag": 67,
"especies": [
"Lingue"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Santelices",
"anio": "1989",
"muestra": "22 árboles",
"r2": "0,9565",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.003155+0.000475*D*D",
"eq": "V = 0,003155 + 0,000475 • D 2",
"validacion": "verificada",
"valOk": 9,
"valTot": 9
},
{
"id": 91,
"pag": 68,
"especies": [
"Luma"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "10,6 - 41,1 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "49 árboles",
"r2": "0,9832",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000028*D*D*H+7.0473e-10*D*D*H*H-2.583e-14*D*D*H*H",
"eq": "V = 0,000028 • D 2H + 7,0473 • 10 -10 • D 2H 2 - 2,583 • 10 -14 • D 2 H 2",
"validacion": "verificada",
"valOk": 23,
"valTot": 23
},
{
"id": 92,
"pag": 68,
"especies": [
"Mañío de hojas cortas"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "10,30 - 58 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "83 árboles",
"r2": "0,9766",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000013*D*D*H+0.0000267*D*D",
"eq": "V = 0,000013 • D 2H + 0,0000267 • D 2",
"validacion": "verificada",
"valOk": 29,
"valTot": 29
},
{
"id": 93,
"pag": 69,
"especies": [
"Mañío de hojas cortas"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "20",
"rangoD": "21 - 58 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "48 árboles",
"r2": "0,9627",
"variable": "Volumen sólido sin corteza hasta un",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000025*D*D*H",
"eq": "V = 0,000025 • D 2H",
"validacion": "verificada",
"valOk": 24,
"valTot": 24
},
{
"id": 94,
"pag": 69,
"especies": [
"Mañío de hojas cortas"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Provincia de Osorno y Llanquihue.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Kawas",
"anio": "1978",
"muestra": "30 árboles",
"r2": "0,9841",
"variable": "Logaritmo Natural del volumen Cúbico",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.915425+0.939798*Math.log(D*D*H))",
"eq": "LNV = (- 9,915425 + 0,939798 • LN (D 2H))",
"validacion": "verificada",
"valOk": 43,
"valTot": 43
},
{
"id": 95,
"pag": 70,
"especies": [
"Mañío de hojas punzantes"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00004375*D*D*H+0.00009836*D*D",
"eq": "V = 0,00004375 • D 2H + 0,00009836 • D 2",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 96,
"pag": 70,
"especies": [
"Mañío de hojas punzantes"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Area de Cumleufu, Cordilera de la Costa,",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Santelices",
"anio": "1989",
"muestra": "30 árboles",
"r2": "0,9781",
"variable": "Volumen Total (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.114037+0.000864*D*D",
"eq": "V = 0,114037 + 0,000864 • D 2",
"validacion": "verificada",
"valOk": 8,
"valTot": 8
},
{
"id": 97,
"pag": 71,
"especies": [
"Mañío de hojas punzantes"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Provincia de Osorno y Llanquihue.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Santelices",
"anio": "1989",
"muestra": "26 árboles",
"r2": "0,9781",
"variable": "Volumen Total (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.09988+0.000019*D*D*D",
"eq": "V = 0,09988 + 0,000019 • D 3",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 98,
"pag": 71,
"especies": [
"Mañío de hojas punzantes"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "11,3 - 79 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "112 árboles",
"r2": "0,9589",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.07139+0.000007722589697*D*D*H+0.000539*D*D",
"eq": "V = - 0,07139 + 0,000007722589697 • D 2H + 0,000539 • D 2",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 99,
"pag": 72,
"especies": [
"Mañío de hojas punzantes"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Hacienda Chaihuín y Hacieda",
"dlu": "0",
"rangoD": "15 a 60 cm",
"rangoH": "2 a 18 m",
"fuente": "Terranova S.A",
"anio": "1990",
"muestra": "81 árboles",
"r2": "0,9643",
"variable": "Logaritmo Natural del",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-8.895)*Math.pow(D,1.893)*Math.pow(H,0.735)",
"eq": "LNV = (- 8,895) • D 1,893 • H 0,735",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 100,
"pag": 72,
"especies": [
"Maqui"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Reserva Forestal Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "JICA",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0381+0.4731*Math.pow(D/100,2)*(-5.0851+0.7704*H)",
"eq": "V = 0,0381 + 0,4731 • ( D ) 2 • (-5,0851 + 0,7704 • H)",
"validacion": "verificada",
"valOk": 13,
"valTot": 13
},
{
"id": 101,
"pag": 73,
"especies": [
"Maqui"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Río Maullín - Lago Llanquihue -",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "24 árboles",
"r2": "0,8100",
"variable": "Logaritmo Natural del volumen",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "Math.exp(-6.85116+1.6647*Math.log(D))",
"eq": "LNV = (- 6,85116 + 1,6647 • LN(D))",
"validacion": "verificada",
"valOk": 1,
"valTot": 1
},
{
"id": 102,
"pag": 73,
"especies": [
"Maqui"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Río Maullín - Lago Llanquihue - Seno de Reloncaví -",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "24 árboles",
"r2": "0,8987",
"variable": "Logaritmo Natural del volumen",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "Math.exp(-7.79199+2.0737*Math.log(D))",
"eq": "LNV = (- 7,79199 + 2,0737 • LN (D))",
"validacion": "verificada",
"valOk": 25,
"valTot": 25
},
{
"id": 103,
"pag": 74,
"especies": [
"Melí"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "11,7 - 82,8 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "99 árboles",
"r2": "0,9705",
"variable": "Volumen sólido sin corteza hasta un",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000025*D*D*H+1.4085e-10*Math.pow(D*D*H,2)-1.28933e-15*Math.pow(D*D*H,3)",
"eq": "V = 0,000025 • D 2H + 1,4085 • 10 -10 • (D 2 H)2 - 1,28933 • 10 -15 • (D2 H)3",
"validacion": "verificada",
"valOk": 31,
"valTot": 31
},
{
"id": 104,
"pag": 74,
"especies": [
"Melí"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "20",
"rangoD": "21,2 - 82,8 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "79 árboles",
"r2": "0,9623",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000015*D*D*H+3.676738e-10*Math.pow(D*D*H,2)-2.719e-15*Math.pow(D*D*H,3)",
"eq": "V = 0,000015 • D 2H + 3,676738 • 10 -10 • (D 2 H)2 - 2,719 • 10 -15 • (D 2H) 3",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 105,
"pag": 75,
"especies": [
"Ñirre"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Río Maullín - Lago Llanquihue -",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "38 árboles",
"r2": "0,7958",
"variable": "Volumen sólido sin corteza",
"alturaTipo": "dominante",
"alturaDesc": "Altura Dominante (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.pow(D/100,2)*(-2.96307+0.4779*H)",
"eq": "V=(",
"validacion": "verificada",
"valOk": 35,
"valTot": 35
},
{
"id": 106,
"pag": 75,
"especies": [
"Olivillo"
],
"regiones": [
"VIII",
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Cordillera Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m)",
"unidad": "m3",
"usaH": true,
"expr": "0.00003915*D*D*H+0.0000802*D*D",
"eq": "V = 0,00003915 • D 2H + 0,0000802 • D 2",
"validacion": "verificada",
"valOk": 34,
"valTot": 34
},
{
"id": 107,
"pag": 76,
"especies": [
"Olivillo"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Zona Costera de la",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nabil",
"anio": "1978",
"muestra": "25 árboles",
"r2": "0,9900",
"variable": "Logaritmo Natural del volumen",
"alturaTipo": "comercial",
"alturaDesc": "Altura Comercial hasta diámetro",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.970339+2.4774308*Math.log(D)+0.313590783*Math.log(H))",
"eq": "LNV = (- 9,970339 + 2,4774308 • LN (D) + 0,313590783 • LN (H))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 108,
"pag": 76,
"especies": [
"Olivillo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Hacienda Chaihuin y Hacienda Venecia,",
"dlu": "0",
"rangoD": "20 a 80 cm",
"rangoH": "4 a 22 m",
"fuente": "Terranova S.A",
"anio": "1990",
"muestra": "46 árboles",
"r2": "0,9761",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.064)*Math.pow(D,1.918)*Math.pow(H,0.771)",
"eq": "LNV = (- 9,064) • D 1,918 • H 0,771",
"validacion": "verificada",
"valOk": 55,
"valTot": 55
},
{
"id": 109,
"pag": 77,
"especies": [
"Olivillo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "11,2 - 88,5 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "104 árboles",
"r2": "0,9387",
"variable": "Volumen sólido sin corteza hasta un DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.2129+0.000014*D*D*H+0.000459*D*D",
"eq": "V = - 0,2129 + 0,000014 • (D 2H) + 0,000459 • D 2",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 110,
"pag": 77,
"especies": [
"Olivillo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "20",
"rangoD": "21,5 - 88,5 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "93 árboles",
"r2": "0,9631",
"variable": "Volumen sólido sin corteza hasta un DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000018*D*D*H+0.000243*D*D",
"eq": "V = 0,000018 • (D 2H) + 0,000243 • D 2",
"validacion": "verificada",
"valOk": 25,
"valTot": 25
},
{
"id": 111,
"pag": 78,
"especies": [
"Peumo",
"Maqui"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Reserva Forestal Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "JICA",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01270452+0.000031284*D*D*H",
"eq": "V = 0,01270452 + 0,000031284 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 112,
"pag": 78,
"especies": [
"Radal"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Loncoche.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Corti",
"anio": "1996",
"muestra": "18 árboles",
"r2": "0,9208",
"variable": "Volumen Total sin corteza (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.007019+0.00002229*D*D*D",
"eq": "V = 0,007019 + 0,00002229 • D 3",
"validacion": "verificada",
"valOk": 8,
"valTot": 8
},
{
"id": 113,
"pag": 79,
"especies": [
"Raulí"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Precordillera Andina.",
"dlu": "0",
"rangoD": "10 - 53 cm",
"rangoH": "8,5 - 26 m",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "40 árboles",
"r2": "0,9351",
"variable": "Logaritmo Natural del Volumen Total.",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.50235389+0.9044538*Math.log(D*D*H))",
"eq": "LNV = - 9,50235389 + 0,9044538 • LN (D 2H)",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 114,
"pag": 79,
"especies": [
"Raulí"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Maquehua.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cubillos",
"anio": "1988",
"muestra": "36 árboles",
"r2": "0,9801",
"variable": "Volumen Total sin corteza desde una altura",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.02322+0.0006986*D*D",
"eq": "V = - 0,02322 + 0,0006986 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 115,
"pag": 80,
"especies": [
"Raulí"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Tucapel.",
"dlu": "5",
"rangoD": "5,0 - 38,0 cm",
"rangoH": "5,5 - 23,5 m",
"fuente": "Emanuelli, Quappe y González",
"anio": "2003",
"muestra": "18 árboles",
"r2": "0,9832",
"variable": "Volumen Total con corteza (m3).",
"alturaTipo": "copa",
"alturaDesc": "Altura Comienzo de Copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00003752*D*D*H-3.06387e-10*Math.pow(D*D*H,2)",
"eq": "V = 0,00003752 • D 2H - 3,06387 • 10 -10 • (D 2H) 2",
"validacion": "verificada",
"valOk": 1,
"valTot": 1,
"nota": "Tabla del compendio usa punto decimal; verificada manualmente."
},
{
"id": 116,
"pag": 80,
"especies": [
"Raulí"
],
"regiones": [
"VIII",
"IX"
],
"estructura": "Renoval",
"localidad": "Cordillera de Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total con corteza (m 3).",
"alturaTipo": "copa",
"alturaDesc": "Altura comienzo de copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0000351*D*D*H+0.0002135*D*D+0.007392*H-0.08867",
"eq": "V = 0,0000351 • D 2H + 0,0002135 • D 2 + 0,007392 • H - 0,08867",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 117,
"pag": 81,
"especies": [
"Raulí"
],
"regiones": [
"VIII",
"IX",
"X"
],
"estructura": "Renoval",
"localidad": "Maquehua - Jauja - Melipeuco -",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "INFOR",
"anio": "1991",
"muestra": "156 árboles",
"r2": "0,9801",
"variable": "Volumen Total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00762+0.000028017*D*D*H",
"eq": "V = 0,00762 + 0,000028017 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 118,
"pag": 81,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cubillos",
"anio": "1988",
"muestra": "13 árboles",
"r2": "0,9801",
"variable": "Volumen sólido sin corteza desde una altura de",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01411+0.00002689*D*D*H",
"eq": "V = 0,01411 + 0,00002689 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 119,
"pag": 82,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Sector Plazuela.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1982",
"muestra": "26 árboles",
"r2": "0,9930",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0137104+0.000028899*D*D*H",
"eq": "V = 0,0137104 + 0,000028899 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 120,
"pag": 82,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Herrera y May",
"anio": "1976",
"muestra": "15 árboles",
"r2": "0,9448",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.074+0.003*D+0.001*D*D",
"eq": "V = - 0,074 + 0,003 • D + 0,001 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 121,
"pag": 83,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Reserva Forestal Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "JICA - INFOR",
"anio": "1992",
"muestra": "105 árboles",
"r2": "0,9801",
"variable": "Volumen sólido sin corteza desde una altura de",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.0017+0.000031623*D*D*H",
"eq": "V = - 0,0017 + 0,000031623 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 122,
"pag": 83,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Avilés",
"anio": "1993",
"muestra": "Sin Información",
"r2": "0,7569",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.069372-0.005363*D+0.000748*D*D",
"eq": "V = - 0,069372 - 0,005363 • D + 0,000748 • D 2",
"validacion": "verificada",
"valOk": 10,
"valTot": 10
},
{
"id": 123,
"pag": 84,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Melipeuco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cubillos",
"anio": "1988",
"muestra": "21 árboles",
"r2": "0,9604",
"variable": "Volumen Total sin corteza desde una altura de",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.0286+0.000726*D*D",
"eq": "V = - 0,0286 + 0,000726 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 124,
"pag": 84,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Melipeuco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cubillos",
"anio": "1988",
"muestra": "21 árboles",
"r2": "0,9801",
"variable": "Volumen Total sin corteza desde una altura",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.00085+0.00002888329*D*D*H",
"eq": "V = - 0,00085 + 0,00002888329 • D 2H",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 125,
"pag": 85,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cubillos",
"anio": "1988",
"muestra": "13 árboles",
"r2": "0,9801",
"variable": "Volumen Total sin corteza desde una altura",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.03616+0.00070162*D*D",
"eq": "V = - 0,03616 + 0,00070162 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 126,
"pag": 85,
"especies": [
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Casas Viejas.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Puente et al",
"anio": "1981",
"muestra": "41 árboles",
"r2": "0,9643",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.000802+0.000033316*D*D*H",
"eq": "V = - 0,000802 + 0,000033316 • D 2H",
"validacion": "verificada",
"valOk": 39,
"valTot": 39
},
{
"id": 127,
"pag": 86,
"especies": [
"Raulí"
],
"regiones": [
"IX",
"X"
],
"estructura": "Renoval",
"localidad": "Jauja - Casas Viejas - Pirihueico.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Puente et al",
"anio": "1981",
"muestra": "95 árboles",
"r2": "0,9761",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01086+0.00003028*D*D*H",
"eq": "V = 0,01086 + 0,00003028 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 128,
"pag": 86,
"especies": [
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Sin Información",
"localidad": "Provincia de Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Barria",
"anio": "1996",
"muestra": "35 árboles",
"r2": "0,9759",
"variable": "Logaritmo Natural del Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.915295+0.937855*Math.log(D*D*H))",
"eq": "LNV = (- 9,915295 + 0,937855 • LN (D 2H))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 129,
"pag": 87,
"especies": [
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Riñihue.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Hernández",
"anio": "1996",
"muestra": "32 árboles",
"r2": "0,9888",
"variable": "Logaritmo Natural del Volumen Total sin",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.1509+0.975675185*Math.log(D*D*H))",
"eq": "LNV = (- 10,1509 + 0,975675185 • LN (D 2H))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 130,
"pag": 87,
"especies": [
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "INFOR",
"anio": "1991",
"muestra": "75 árboles",
"r2": "0,9801",
"variable": "Volumen Total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00207+0.00003*D*D*H",
"eq": "V = 0,00207 + 0,00003 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 131,
"pag": 88,
"especies": [
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Llancacura.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "INFOR",
"anio": "1988",
"muestra": "11 árboles",
"r2": "0,9604",
"variable": "Volumen Total sin corteza desde una altura de",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.00978+0.00002795*D*D*H",
"eq": "V = - 0,00978 + 0,00002795 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 132,
"pag": 88,
"especies": [
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "INFOR",
"anio": "1991",
"muestra": "75 árboles",
"r2": "0,9604",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.03655+0.00002*D*D*D",
"eq": "V = 0,03655 + 0,00002 • D 3",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 133,
"pag": 89,
"especies": [
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Llancacura.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "INFOR",
"anio": "1988",
"muestra": "11 árboles",
"r2": "0,9025",
"variable": "Volumen Total sin corteza desde una altura de 0,3 m",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.0218+0.0005626*D*D",
"eq": "V = - 0,0218 + 0,0005626 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 134,
"pag": 89,
"especies": [
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Maquehua.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cubillos",
"anio": "1988",
"muestra": "36 árboles",
"r2": "0,9801",
"variable": "Volumen Total sin corteza desde una",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00265+0.00002795*D*D*H",
"eq": "V = 0,00265 + 0,00002795 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 135,
"pag": 90,
"especies": [
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Pirihueico.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Puente et al",
"anio": "1981",
"muestra": "28 árboles",
"r2": "0,9880",
"variable": "Volumen Total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01337+0.0000299306*D*D*H",
"eq": "V = 0,01337 + 0,0000299306 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 136,
"pag": 90,
"especies": [
"Roble"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Predio Agua Fría.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.015958742+0.000034608*D*D*H",
"eq": "V = 0,015958742 + 0,000034608 • D 2H",
"validacion": "verificada",
"valOk": 39,
"valTot": 39
},
{
"id": 137,
"pag": 91,
"especies": [
"Roble"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Fundo Riquelme.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Carrasco",
"anio": "1998",
"muestra": "Sin Información",
"r2": "0,9700",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "0.0002009*Math.pow(D,1.64969)*Math.pow(H,0.824845)",
"eq": "V = 0,0002009 • D 1,64969 • H 0,824845",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 138,
"pag": 91,
"especies": [
"Roble"
],
"regiones": [
"VII"
],
"estructura": "Sin Información",
"localidad": "Trancas.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Carrasco",
"anio": "1998",
"muestra": "Sin Información",
"r2": "0,9000",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "0.0000965*Math.pow(D,1.862058)*Math.pow(H,0.931029)",
"eq": "V = 0,0000965 • D 1,862058 • H 0,931029",
"validacion": "verificada",
"valOk": 29,
"valTot": 29
},
{
"id": 139,
"pag": 92,
"especies": [
"Roble"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Vilches Alto.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Flandez",
"anio": "1998",
"muestra": "Sin Información",
"r2": "0,9890",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.9182+0.966942*Math.log(D*D*H))",
"eq": "LNV = - 9,9182 + 0,966942 • Ln D 2H",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 140,
"pag": 92,
"especies": [
"Roble"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Precordillera Andina.",
"dlu": "0",
"rangoD": "7 - 63 cm",
"rangoH": "4 - 28,5 m",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "266 árboles",
"r2": "0,9735",
"variable": "Logaritmo Natural del Volumen Total.",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.77474858+0.94166084*Math.log(D*D*H))",
"eq": "LNV = - 9,77474858 + 0,94166084 • LN (D 2H)",
"validacion": "verificada",
"valOk": 21,
"valTot": 21
},
{
"id": 141,
"pag": 93,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Agua Fría (Forestal Millalemu).",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.015958742+0.000034608*D*D*H",
"eq": "V = 0,015958742 + 0,000034608 • D 2H",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 142,
"pag": 93,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "El Durazno (Forestal Millalemu).",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.072208359+0.000026103*D*D*H",
"eq": "V= 0,072208359 + 0,000026103 • D 2H",
"validacion": "verificada",
"valOk": 31,
"valTot": 31
},
{
"id": 143,
"pag": 94,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Agua Fría (Forestal Millalemu).",
"dlu": "20",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.032038365+0.00002631*D*D*H",
"eq": "V= - 0,032038365 + 0,00002631 • D 2H",
"validacion": "verificada",
"valOk": 33,
"valTot": 33
},
{
"id": 144,
"pag": 94,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "El Ranchillo.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.073548424+0.000026413*D*D*H",
"eq": "V = 0,073548424 + 0,000026413 • D 2H",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 145,
"pag": 95,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Agua Fría (Forestal Millalemu).",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.003041611+0.0000352*D*D*H",
"eq": "V = 0,003041611 + 0,0000352 • D 2H",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 146,
"pag": 95,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Predio Agua Fría.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.003041611+0.0000352*D*D*H",
"eq": "V = 0,003041611 + 0,0000352 • D 2H",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 147,
"pag": 96,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Predio Agua Fría.",
"dlu": "20",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen sin corteza hasta DLU 20 cm (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.032038365+0.00002631*D*D*H",
"eq": "V = - 0,032038365 + 0,00002631 • D 2H",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 148,
"pag": 96,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "San Fabián.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Rodríguez",
"anio": "1979",
"muestra": "Sin Información",
"r2": "0,9400",
"variable": "Sin Información.",
"alturaTipo": "no aplica",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": false,
"expr": "-0.073996+0.000848*D*D",
"eq": "V = - 0,073996 + 0,000848 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 149,
"pag": 97,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Nacimiento.",
"dlu": "10",
"rangoD": "9,3 - 50,2 cm",
"rangoH": "9,0 - 21,3 m",
"fuente": "Emanuelli, Quappe y González",
"anio": "2003",
"muestra": "62 árboles",
"r2": "0,9854",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.02359+3.10046e-5*D*D*H-1.9394e-10*Math.pow(D*D*H,2)",
"eq": "V = - 0,02359 + 3,10046 • 10 -5 • D 2 H - 1,9394 • 10 -10 • (D 2 H) 2",
"validacion": "sin tabla",
"valOk": 0,
"valTot": 0
},
{
"id": 150,
"pag": 97,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Quilleco.",
"dlu": "10",
"rangoD": "9,0 - 27,0 cm",
"rangoH": "10,5 - 22,5 m",
"fuente": "Emanuelli, Quappe y González",
"anio": "2003",
"muestra": "41 árboles",
"r2": "0,9531",
"variable": "Volumen Total con corteza (m3).",
"alturaTipo": "copa",
"alturaDesc": "Altura Comienzo de Copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.029804+0.000035112*D*D*H",
"eq": "V = - 0,029804 + 0,000035112 • D 2H",
"validacion": "sin tabla",
"valOk": 0,
"valTot": 0
},
{
"id": 151,
"pag": 98,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Santa Bárbara.",
"dlu": "10",
"rangoD": "9,0 - 40,0 cm",
"rangoH": "10,0 - 26,0 m",
"fuente": "Emanuelli, Quappe y González",
"anio": "2003",
"muestra": "42 árboles",
"r2": "0,9759",
"variable": "Volumen Total con corteza (m3).",
"alturaTipo": "copa",
"alturaDesc": "Altura Comienzo de Copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.031708+3.66839e-5*D*D*H-3.1425e-10*Math.pow(D*D*H,2)",
"eq": "V = - 0,031708 + 3,66839 • 10 -5 • D2H - 3,1425 • 10 -10 • (D 2H) 2",
"validacion": "sin tabla",
"valOk": 0,
"valTot": 0
},
{
"id": 152,
"pag": 98,
"especies": [
"Roble"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Nacimiento, Quilleco y",
"dlu": "10",
"rangoD": "10,0 - 50,2 cm",
"rangoH": "6,5 - 26,0 m",
"fuente": "Emanuelli, Quappe y González",
"anio": "2003",
"muestra": "152 árboles",
"r2": "0,9734",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.03272+0.000035978*D*D*H-2.8597e-10*Math.pow(D*D*H,2)",
"eq": "V = - 0,03272 + 0,000035978 • D 2 H - 2,8597 • 10 -10 • (D 2H) 2",
"validacion": "sin tabla",
"valOk": 0,
"valTot": 0
},
{
"id": 153,
"pag": 99,
"especies": [
"Roble"
],
"regiones": [
"VIII",
"IX"
],
"estructura": "Renoval",
"localidad": "Cordillera de Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1982",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0000351*D*D*H+0.0002135*D*D+0.007392*H-0.08867",
"eq": "V = 0,0000351 • D 2 H + 0,0002135 • D 2 + 0,007392 • H - 0,08867",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 154,
"pag": 99,
"especies": [
"Roble"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Nueva Etruria.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen sin corteza hasta un DLU de 10 cm (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.20643883+0.000033279*D*D*H",
"eq": "V = - 0,20643883 + 0,000033279 • D 2H",
"validacion": "verificada",
"valOk": 30,
"valTot": 30
},
{
"id": 155,
"pag": 100,
"especies": [
"Roble"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Nueva Etruria.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen sin corteza hasta un DLU de 10 cm (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.002512368+0.000031228*D*D*H",
"eq": "V = - 0,002512368 + 0,000031228 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 156,
"pag": 100,
"especies": [
"Roble"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Nueva Etruria.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.025957030+0.000030292*D*D*H",
"eq": "V = 0,025957030 + 0,000030292 • D2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 157,
"pag": 101,
"especies": [
"Roble"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Sector Plazuela.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1982",
"muestra": "24 árboles",
"r2": "0,9742",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00032298+0.000032138*D*D*H",
"eq": "V = 0,00032298 + 0,000032138 • D2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 158,
"pag": 101,
"especies": [
"Roble"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Reserva Forestal Malleco. Rango Altura",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "JICA",
"anio": "1993",
"muestra": "89 árboles",
"r2": "0,9975",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.00729+0.00003146*D*D*H",
"eq": "V = - 0,00729 + 0,00003146 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 159,
"pag": 102,
"especies": [
"Roble"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Jauja - Pirihueico.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Puente et al",
"anio": "1981",
"muestra": "39 árboles",
"r2": "0,9761",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000347+0.00003273*D*D*H",
"eq": "V = 0,000347 + 0,00003273 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 160,
"pag": 102,
"especies": [
"Roble"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Pirihueico.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Puente et al",
"anio": "1981",
"muestra": "15 árboles",
"r2": "0,9742",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.07112+0.00003389*D*D*H",
"eq": "V = - 0,07112 + 0,00003389 • D 2H",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 161,
"pag": 103,
"especies": [
"Roble"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Area de Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Cubillos",
"anio": "1988",
"muestra": "50 árboles",
"r2": "0,9604",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.03695309+0.00075407*D*D",
"eq": "V = - 0,03695309 + 0,00075407 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 162,
"pag": 103,
"especies": [
"Roble"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Area Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Grosse y Cubillos",
"anio": "1991",
"muestra": "50 árboles",
"r2": "0,9801",
"variable": "Volumen sólido sin corteza, desde una altura de",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.02582821+0.000028502*D*D*H",
"eq": "V = 0,02582821 + 0,000028502 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 163,
"pag": 104,
"especies": [
"Roble"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Predio Aillapán.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Corti",
"anio": "1996",
"muestra": "33 árboles",
"r2": "0,9978",
"variable": "Volumen sólido sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.8038017+1.071131157*Math.log(D*D*H))",
"eq": "V = EXP (- 10,8038017 + 1,071131157 • LN (D 2H))",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 164,
"pag": 104,
"especies": [
"Roble"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincias de Osorno y Llanquihue.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Kawas",
"anio": "1978",
"muestra": "30 árboles",
"r2": "0,9860",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.51381+1.010275*Math.log(D*D*H))",
"eq": "V = EXP (- 10,51381 + 1,010275 • LN (D 2H))",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 165,
"pag": 105,
"especies": [
"Roble"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Area Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Grosse y Cubillos",
"anio": "1991",
"muestra": "50 árboles",
"r2": "0,9604",
"variable": "Volumen sólido sin corteza, desde una altura",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.03695309+0.00075407*D*D",
"eq": "V = - 0,03695309 + 0,00075407 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 166,
"pag": 105,
"especies": [
"Roble",
"Coigüe"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Nueva Etruria.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total sin corteza hasta un DLU de 10 cm (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.00184197+0.000031492*D*D*H",
"eq": "V = - 0,00184197 + 0,000031492 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 167,
"pag": 106,
"especies": [
"Roble",
"Coigüe"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Nueva Etruria.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Real",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información",
"variable": "Volumen total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.024623404+0.000030644*D*D*H",
"eq": "V = 0,024623404 + 0,000030644 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 168,
"pag": 106,
"especies": [
"Roble",
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Radal - Picazo Alto.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Donoso",
"anio": "1992",
"muestra": "80 árboles",
"r2": "0,9900",
"variable": "Sin Información.",
"alturaTipo": "sin información",
"alturaDesc": "Sin Información.",
"unidad": "m3",
"usaH": true,
"expr": "0.012742+0.0000300718*D*D*H",
"eq": "V = 0,012742 + 0,0000300718 • D 2H 2",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 169,
"pag": 107,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Radal 7 Tazas.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Donoso",
"anio": "1988",
"muestra": "54 árboles",
"r2": "0,9722",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00697549+0.0000322071*D*D*H",
"eq": "V = 0,00697549 + 0,0000322071 • D 2H",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 170,
"pag": 107,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Radal 7 Tazas.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Donoso",
"anio": "1988",
"muestra": "80 árboles",
"r2": "0,9880",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.012742+0.0000300718*D*D*H",
"eq": "V = 0,012742 + 0,0000300718 • D 2H",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 171,
"pag": 108,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"VII"
],
"estructura": "Renoval",
"localidad": "Radal 7 Tazas.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Donoso",
"anio": "1988",
"muestra": "54 árboles",
"r2": "0,9722",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00697549+0.0000322071*D*D*H",
"eq": "V = 0,00697549 + 0,0000322071 • D 2H",
"validacion": "verificada",
"valOk": 35,
"valTot": 35
},
{
"id": 172,
"pag": 108,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Precordillera Andina .",
"dlu": "10",
"rangoD": "12 - 45 cm",
"rangoH": "10 - 28 m",
"fuente": "Emanuelli",
"anio": "1994",
"muestra": "211 árboles",
"r2": "0,8754",
"variable": "Logaritmo natural del volumen sólido",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(0.8830638-197.5114/Math.sqrt(D*D*H))",
"eq": "LNV = 0,8830638 - 197,5114 •",
"validacion": "verificada",
"valOk": 18,
"valTot": 18
},
{
"id": 173,
"pag": 109,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"VIII"
],
"estructura": "Renoval",
"localidad": "Precordillera Andina .",
"dlu": "Variable (0 - 20)",
"rangoD": "5 - 45 cm",
"rangoH": "8 - 28 m",
"fuente": "Emanuelli",
"anio": "1994",
"muestra": "1302 árboles",
"r2": "0,8747",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0313393+0.0000292*D*D*H-0.0000174*1000",
"eq": "V = 0,0313393 + 0,0000292 • D 2H - 0,0000174 • DLU 3",
"validacion": "verificada",
"valOk": 20,
"valTot": 20
},
{
"id": 174,
"pag": 109,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"VIII",
"IX"
],
"estructura": "Renoval",
"localidad": "Cordillera Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total con corteza (m3).",
"alturaTipo": "copa",
"alturaDesc": "Altura Comienzo de Copa (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.08867+0.0000351*D*D*H+0.0002135*D*D+0.007392*H",
"eq": "V = -0,08867 + 0,0000351 • D 2H + 0,0002135 • D 2 + 0,007392 • H",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 175,
"pag": 110,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Provincia de Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1982",
"muestra": "134 árboles",
"r2": "0,9742",
"variable": "Volumen total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.02031+0.00003509*D*D*H-0.00008074*D*D-0.000635*H",
"eq": "V = 0,02031 + 0,00003509 • D 2 H - 0,00008074 • D 2 - 0,000635 • H",
"validacion": "verificada",
"valOk": 43,
"valTot": 43
},
{
"id": 176,
"pag": 110,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Provincia de Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1982",
"muestra": "134 árboles",
"r2": "0,9742",
"variable": "Volumen total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.005+0.00003151*D*D*H",
"eq": "V = 0,005 + 0,00003151 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 177,
"pag": 111,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Provincia de Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1982",
"muestra": "134 árboles",
"r2": "0,9742",
"variable": "Volumen total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01789+0.00003611*D*D*H-0.0001299*D*D-0.001196*H",
"eq": "V = 0,01789 + 0,00003611 • D 2 H - 0,0001299 • D2 -0,001196 • H",
"validacion": "verificada",
"valOk": 34,
"valTot": 34
},
{
"id": 178,
"pag": 111,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Provincia de Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1982",
"muestra": "134 árboles",
"r2": "0,9742",
"variable": "Volumen total sin corteza (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.0094+0.00003413*D*D*H-0.0000635*D*D",
"eq": "V = 0,0094 + 0,00003413 • D 2H - 0,0000635 • D2",
"validacion": "verificada",
"valOk": 45,
"valTot": 45
},
{
"id": 179,
"pag": 112,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Malleco.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UACH",
"anio": "1982",
"muestra": "333 árboles",
"r2": "0,9835",
"variable": "Volumen sin corteza hasta un DLU de 10 cm (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.0086+0.0000309589*D*D*H",
"eq": "V = - 0,0086 + 0,0000309589 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 180,
"pag": 112,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Forestal Malleco.",
"dlu": "10",
"rangoD": "10 - 55 cm",
"rangoH": "Sin Información",
"fuente": "JICA",
"anio": "1993",
"muestra": "116 árboles",
"r2": "Sin Información.",
"variable": "Volumen sin corteza hasta un DLU de 10 cm (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.00416+0.000031545*D*D*H",
"eq": "V = - 0,00416 + 0,000031545 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 181,
"pag": 113,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Herrera y May",
"anio": "1976",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "0.001*D*D-0.001*D-0.026",
"eq": "V = 0,001 • D 2 - 0,001 • D - 0,026",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 182,
"pag": 113,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"IX"
],
"estructura": "Renoval",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Herrera y May",
"anio": "1976",
"muestra": "11 árboles",
"r2": "0,9880",
"variable": "Volumen Total sin corteza (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.315+0.037*D",
"eq": "V = - 0,315 + 0,037 • D",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 183,
"pag": 114,
"especies": [
"Roble",
"Raulí"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Area Neltume.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "INFOR",
"anio": "1993",
"muestra": "75 árboles",
"r2": "0,9448",
"variable": "Volumen sólido sin corteza hasta un DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.02484+0.0000344272*D*D*H",
"eq": "V = - 0,02484 + 0,0000344272 • D 2H",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 184,
"pag": 114,
"especies": [
"Roble",
"Raulí",
"Hualo"
],
"regiones": [
"VII"
],
"estructura": "Bosque Adulto",
"localidad": "Radal 7 tazas.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Donoso",
"anio": "1988",
"muestra": "80 árboles",
"r2": ":",
"variable": "Volumen Total sin corteza(m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.012742+0.0000300718*D*D*H",
"eq": "V = 0,012742 + 0,0000300718 • D 2H",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 185,
"pag": 115,
"especies": [
"Tamarugo"
],
"regiones": [
"I"
],
"estructura": "Sin Información",
"localidad": "Reserva Nacional Pampa del Tamarugal.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Alvarez de Araya",
"anio": "1994",
"muestra": "37 árboles",
"r2": "0,7276",
"variable": "Volumen Total hasta un DLU de",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00089458+0.0002675789*D*D+0.0000162092*D*D*H",
"eq": "V = 0,00089458 + 0,0002675789 • D 2 + 0,0000162092 • D 2H",
"validacion": "verificada",
"valOk": 25,
"valTot": 25
},
{
"id": 186,
"pag": 115,
"especies": [
"Tepa"
],
"regiones": [
"IX"
],
"estructura": "Sin Información",
"localidad": "Reserva Forestal Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "JICA - INFOR",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total con corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01270452+0.000031284*D*D*H",
"eq": "V = 0,01270452 + 0,000031284 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 187,
"pag": 116,
"especies": [
"Tepa"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Hacienda Chaihuin y",
"dlu": "0",
"rangoD": "15 - 80 cm",
"rangoH": "2 - 18 m",
"fuente": "Terranova S.A",
"anio": "1990",
"muestra": "90 árboles",
"r2": "0,9332",
"variable": "Logaritmo Natural del volumen cúbico",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.307)*Math.pow(D,1.994)*Math.pow(H,0.805)",
"eq": "LNV = (- 9,307) • D 1,994 • H 0,805",
"validacion": "verificada",
"valOk": 46,
"valTot": 46
},
{
"id": 188,
"pag": 116,
"especies": [
"Tepa"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Cordillera de la Costa.",
"dlu": "0",
"rangoD": "40 - 150 cm",
"rangoH": "4 - 24 m",
"fuente": "Convenio SERPLAC - UACH",
"anio": "1980",
"muestra": "23 árboles",
"r2": "Sin Información.",
"variable": "Volumen Total con corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.377+3.431*D*D*H/100000",
"eq": "V = 0,377 + 3,431 • D 2 •",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 189,
"pag": 117,
"especies": [
"Tepa"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Area de Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "INFOR",
"anio": "1991",
"muestra": "50 árboles",
"r2": "0,9409.",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.04220197+0.00067576*D*D",
"eq": "V = - 0,04220197 + 0,00067576 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 190,
"pag": 117,
"especies": [
"Tepa"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Provincia de Osorno y",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "4 árboles",
"r2": "0,9898",
"variable": "Logaritmo natural del Volumen",
"alturaTipo": "sin información",
"alturaDesc": "",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.3047+2.40424*Math.log(H))",
"eq": "LNV = (- 9,3047 + 2,40424 • LN(H))",
"validacion": "discrepancia",
"valOk": 7,
"valTot": 11,
"nota": "La ecuación impresa no reproduce la tabla del compendio."
},
{
"id": 191,
"pag": 118,
"especies": [
"Tepa"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Llanquihue y",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Corvalán",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total sin corteza hasta un DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.pow(D/100,2)*(-0.7363118+0.33301*H)",
"eq": "V=( D ) 2 • (- 0,7363118 + 0,33301 • H)",
"validacion": "verificada",
"valOk": 50,
"valTot": 50
},
{
"id": 192,
"pag": 118,
"especies": [
"Tepa"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Area de Neltume.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Grosse y Cubillos",
"anio": "1991",
"muestra": "50 árboles",
"r2": "0,9409",
"variable": "Volumen Total sin corteza (m 3).",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "-0.04220197+0.00067576*D*D",
"eq": "V = - 0,04220197 + 0,00067576 • D 2",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 193,
"pag": 119,
"especies": [
"Tepa"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "11,28 - 69 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "110 árboles",
"r2": "0,9781",
"variable": "Volumen sólido sin corteza hasta un DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000024*D*D*H+0.000152*D*D",
"eq": "V = 0,000024 • (D 2H) + 0,000152 • D 2",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 194,
"pag": 119,
"especies": [
"Tepa"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "20",
"rangoD": "21,8 - 69 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "84 árboles",
"r2": "0,9237",
"variable": "Volumen sólido sin corteza hasta un DLU",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00003*D*D*H-9.258e-11*Math.pow(D*D*H,2)",
"eq": "V = 0,00003 • (D 2H) - 9,258 • 10 -11 • (D 2H) 2",
"validacion": "verificada",
"valOk": 29,
"valTot": 29
},
{
"id": 195,
"pag": 120,
"especies": [
"Tepa",
"Tineo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Zona Costera de la Provincia",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nabil",
"anio": "1978",
"muestra": "79 árboles",
"r2": "0,9890",
"variable": "Logaritmo natural del",
"alturaTipo": "comercial",
"alturaDesc": "Altura Comercial",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.53493+1.020495*Math.log(D*D*H))",
"eq": "LNV = (- 10,53493 + 1,020495 • LN (D 2H))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 196,
"pag": 120,
"especies": [
"Tepa",
"Trevo"
],
"regiones": [
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Forestal Malleco.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "JICA",
"anio": "1992",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total con corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.01270452+0.000031284*D*D*H",
"eq": "V = 0,01270452 + 0,000031284 • D2H",
"validacion": "verificada",
"valOk": 35,
"valTot": 35
},
{
"id": 197,
"pag": 121,
"especies": [
"Tiaca",
"Avellano"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Río Maullín - Lago Llanquihue -",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "48 árboles",
"r2": "0,9801",
"variable": "Logaritmo Natural del",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "Math.exp(-7.9911+2.13606*Math.log(D))",
"eq": "LNV = (- 7,9911 + 2,13606 • LN (D))",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 198,
"pag": 121,
"especies": [
"Tiaca",
"Lingue",
"Avellano"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Isla Grande de Chiloé.",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Corvalán",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen total hasta un diámetro de utilización",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.pow(D/100,2)*4.1675+0.1303*(-6.3217+0.8706*H)",
"eq": "V = ( D ) 2 • 4,1675 + 0,1303 • (- 6,3217 + 0,8706 • H)",
"validacion": "verificada",
"valOk": 50,
"valTot": 50
},
{
"id": 199,
"pag": 122,
"especies": [
"Tineo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Valdivia.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1985",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.1052+0.00004606*D*D*H+0.0001776*D*D+0.0002609*H",
"eq": "V = - 0,1052 + 0,00004606 • D 2H + 0,0001776 • D 2 + 0,0002609 • H",
"validacion": "verificada",
"valOk": 36,
"valTot": 36
},
{
"id": 200,
"pag": 122,
"especies": [
"Tineo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Hacienda Chaihuín y",
"dlu": "0",
"rangoD": "20 a 75 cm",
"rangoH": "2 a 14 m",
"fuente": "Terranova S.A",
"anio": "1990",
"muestra": "20 árboles",
"r2": "0,984064",
"variable": "Logaritmo Natural del",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-9.097)*Math.pow(D,1.968)*Math.pow(H,0.732)",
"eq": "LNV = (- 9,097) • D 1,968 • H 0,732",
"validacion": "verificada",
"valOk": 32,
"valTot": 32
},
{
"id": 201,
"pag": 123,
"especies": [
"Tineo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Río Maullín-Lago Llanquihue-Seno",
"dlu": "10",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "UCH",
"anio": "1988",
"muestra": "11 árboles",
"r2": "0,9444",
"variable": "Logaritmo Natural del",
"alturaTipo": "no aplica",
"alturaDesc": "",
"unidad": "m3",
"usaH": false,
"expr": "Math.exp(-7.79199+2.07237*Math.log(D))",
"eq": "LNV = (- 7,79199 + 2,07237 • LN (D))",
"validacion": "verificada",
"valOk": 11,
"valTot": 11
},
{
"id": 202,
"pag": 123,
"especies": [
"Tineo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Provincia de Osorno y Llanquihue.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Kawas",
"anio": "1978",
"muestra": "35 árboles",
"r2": "0,9841",
"variable": "Logaritmo natural del volumen total",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-10.269013+0.99643*Math.log(D*D*H))",
"eq": "LNV = (- 10,269013 + 0,99643 • LN (D 2H))",
"validacion": "verificada",
"valOk": 37,
"valTot": 37
},
{
"id": 203,
"pag": 124,
"especies": [
"Tineo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "11,7 - 79,6 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "99 árboles",
"r2": "0,9732",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.000038*D*D*H-1.07637e-10*Math.pow(D*D*H,2)",
"eq": "V = 0,000038 • (D 2H) - 1,07637 • 10 -10 • (D 2H) 2",
"validacion": "verificada",
"valOk": 28,
"valTot": 28
},
{
"id": 204,
"pag": 124,
"especies": [
"Trevo"
],
"regiones": [
"VIII",
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Cordillera Nahuelbuta.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Sandoval",
"anio": "1984",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "0.00005084*D*D*H+0.000000468*D*D*H*H",
"eq": "V = 0,00005084 • D 2H + 0,000000468 • D 2H 2",
"validacion": "verificada",
"valOk": 38,
"valTot": 38
},
{
"id": 205,
"pag": 125,
"especies": [
"Trevo"
],
"regiones": [
"IX"
],
"estructura": "Bosque Adulto",
"localidad": "Jauja.",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nuñez y Peñaloza",
"anio": "1985",
"muestra": "50 árboles",
"r2": "0,9604",
"variable": "Volumen Total sin corteza (m3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.0000799+0.000033318*D*D*H",
"eq": "V = - 0,0000799 + 0,000033318 • D 2H",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 206,
"pag": 125,
"especies": [
"Ulmo"
],
"regiones": [
"X"
],
"estructura": "Renoval",
"localidad": "Zona Costera de la Provincia de",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Nabil",
"anio": "1978",
"muestra": "35 árboles",
"r2": "0,9900",
"variable": "Logaritmo natural del Volumen Total sin corteza (m3).",
"alturaTipo": "comercial",
"alturaDesc": "Altura Comercial",
"unidad": "m3",
"usaH": true,
"expr": "Math.exp(-8.666544+2.149093*Math.log(D)+0.2508636*Math.log(H))",
"eq": "LNV = (- 8,666544 + 2,149093 • LN (D) + 0,2508636 • LN (H))",
"validacion": "verificada",
"valOk": 40,
"valTot": 40
},
{
"id": 207,
"pag": 126,
"especies": [
"Ulmo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Reserva Nacional Valdivia.",
"dlu": "10",
"rangoD": "10,4 - 98 cm",
"rangoH": "Sin Información",
"fuente": "Emanuelli",
"anio": "1999",
"muestra": "34 árboles",
"r2": "0,9819",
"variable": "Volumen sólido sin corteza hasta",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "-0.10377-0.0000099208*D*D*H+0.0009*D*D",
"eq": "V = - 0,10377 - 0,0000099208 • (D 2H) + 0,0009 • D 2",
"validacion": "discrepancia",
"valOk": 6,
"valTot": 30,
"nota": "La ecuación impresa no reproduce la tabla del compendio."
},
{
"id": 208,
"pag": 126,
"especies": [
"Ulmo",
"Tineo"
],
"regiones": [
"X"
],
"estructura": "Bosque Adulto",
"localidad": "Isla Grande de Chiloé y",
"dlu": "0",
"rangoD": "Sin Información",
"rangoH": "Sin Información",
"fuente": "Corvalan",
"anio": "1987",
"muestra": "Sin Información",
"r2": "Sin Información.",
"variable": "Volumen Total (m 3).",
"alturaTipo": "total",
"alturaDesc": "Altura Total (m).",
"unidad": "m3",
"usaH": true,
"expr": "Math.pow(D/100,2)*(1.7972+0.3529*(-0.1895+0.6633*H))",
"eq": "V=( ) 2 • (1,7972 + 0,3529 • (- 0,1895 + 0,6633 • H))",
"validacion": "verificada",
"valOk": 56,
"valTot": 56
}
];

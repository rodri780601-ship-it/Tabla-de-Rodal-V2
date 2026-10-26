/* División político-administrativa de Chile: 16 regiones, 56 provincias y 346 comunas.
   Estructura: [{ region, numero, provincias: [{ provincia, comunas: [...] }] }], de norte a sur. */
window.TERRITORIO_CHILE = [
  { region: 'Arica y Parinacota', numero: 'XV', provincias: [
    { provincia: 'Arica', comunas: ['Arica', 'Camarones'] },
    { provincia: 'Parinacota', comunas: ['Putre', 'General Lagos'] }] },
  { region: 'Tarapacá', numero: 'I', provincias: [
    { provincia: 'Iquique', comunas: ['Iquique', 'Alto Hospicio'] },
    { provincia: 'Tamarugal', comunas: ['Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'] }] },
  { region: 'Antofagasta', numero: 'II', provincias: [
    { provincia: 'Antofagasta', comunas: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal'] },
    { provincia: 'El Loa', comunas: ['Calama', 'Ollagüe', 'San Pedro de Atacama'] },
    { provincia: 'Tocopilla', comunas: ['Tocopilla', 'María Elena'] }] },
  { region: 'Atacama', numero: 'III', provincias: [
    { provincia: 'Copiapó', comunas: ['Copiapó', 'Caldera', 'Tierra Amarilla'] },
    { provincia: 'Chañaral', comunas: ['Chañaral', 'Diego de Almagro'] },
    { provincia: 'Huasco', comunas: ['Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'] }] },
  { region: 'Coquimbo', numero: 'IV', provincias: [
    { provincia: 'Elqui', comunas: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña'] },
    { provincia: 'Choapa', comunas: ['Illapel', 'Canela', 'Los Vilos', 'Salamanca'] },
    { provincia: 'Limarí', comunas: ['Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'] }] },
  { region: 'Valparaíso', numero: 'V', provincias: [
    { provincia: 'Valparaíso', comunas: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar'] },
    { provincia: 'Isla de Pascua', comunas: ['Isla de Pascua'] },
    { provincia: 'Los Andes', comunas: ['Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban'] },
    { provincia: 'Petorca', comunas: ['La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar'] },
    { provincia: 'Quillota', comunas: ['Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales'] },
    { provincia: 'San Antonio', comunas: ['San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo'] },
    { provincia: 'San Felipe de Aconcagua', comunas: ['San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María'] },
    { provincia: 'Marga Marga', comunas: ['Quilpué', 'Limache', 'Olmué', 'Villa Alemana'] }] },
  { region: 'Metropolitana de Santiago', numero: 'RM', provincias: [
    { provincia: 'Santiago', comunas: ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura'] },
    { provincia: 'Cordillera', comunas: ['Puente Alto', 'Pirque', 'San José de Maipo'] },
    { provincia: 'Chacabuco', comunas: ['Colina', 'Lampa', 'Tiltil'] },
    { provincia: 'Maipo', comunas: ['San Bernardo', 'Buin', 'Calera de Tango', 'Paine'] },
    { provincia: 'Melipilla', comunas: ['Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro'] },
    { provincia: 'Talagante', comunas: ['Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'] }] },
  { region: "Libertador General Bernardo O'Higgins", numero: 'VI', provincias: [
    { provincia: 'Cachapoal', comunas: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente'] },
    { provincia: 'Cardenal Caro', comunas: ['Pichilemu', 'La Estrella', 'Litueche', 'Marchigüe', 'Navidad', 'Paredones'] },
    { provincia: 'Colchagua', comunas: ['San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'] }] },
  { region: 'Maule', numero: 'VII', provincias: [
    { provincia: 'Talca', comunas: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael'] },
    { provincia: 'Cauquenes', comunas: ['Cauquenes', 'Chanco', 'Pelluhue'] },
    { provincia: 'Curicó', comunas: ['Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén'] },
    { provincia: 'Linares', comunas: ['Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'] }] },
  { region: 'Ñuble', numero: 'XVI', provincias: [
    { provincia: 'Diguillín', comunas: ['Chillán', 'Bulnes', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay'] },
    { provincia: 'Itata', comunas: ['Quirihue', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Ránquil', 'Treguaco'] },
    { provincia: 'Punilla', comunas: ['San Carlos', 'Coihueco', 'Ñiquén', 'San Fabián', 'San Nicolás'] }] },
  { region: 'Biobío', numero: 'VIII', provincias: [
    { provincia: 'Concepción', comunas: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén'] },
    { provincia: 'Arauco', comunas: ['Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa'] },
    { provincia: 'Biobío', comunas: ['Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'] }] },
  { region: 'La Araucanía', numero: 'IX', provincias: [
    { provincia: 'Cautín', comunas: ['Temuco', 'Carahue', 'Cholchol', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica'] },
    { provincia: 'Malleco', comunas: ['Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'] }] },
  { region: 'Los Ríos', numero: 'XIV', provincias: [
    { provincia: 'Valdivia', comunas: ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli'] },
    { provincia: 'Ranco', comunas: ['La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'] }] },
  { region: 'Los Lagos', numero: 'X', provincias: [
    { provincia: 'Llanquihue', comunas: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas'] },
    { provincia: 'Chiloé', comunas: ['Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao'] },
    { provincia: 'Osorno', comunas: ['Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo'] },
    { provincia: 'Palena', comunas: ['Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'] }] },
  { region: 'Aysén del General Carlos Ibáñez del Campo', numero: 'XI', provincias: [
    { provincia: 'Coyhaique', comunas: ['Coyhaique', 'Lago Verde'] },
    { provincia: 'Aysén', comunas: ['Aysén', 'Cisnes', 'Guaitecas'] },
    { provincia: 'Capitán Prat', comunas: ['Cochrane', "O'Higgins", 'Tortel'] },
    { provincia: 'General Carrera', comunas: ['Chile Chico', 'Río Ibáñez'] }] },
  { region: 'Magallanes y de la Antártica Chilena', numero: 'XII', provincias: [
    { provincia: 'Magallanes', comunas: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio'] },
    { provincia: 'Antártica Chilena', comunas: ['Cabo de Hornos', 'Antártica'] },
    { provincia: 'Tierra del Fuego', comunas: ['Porvenir', 'Primavera', 'Timaukel'] },
    { provincia: 'Última Esperanza', comunas: ['Natales', 'Torres del Paine'] }] }
];

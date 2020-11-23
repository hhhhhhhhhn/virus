let words = `COVID-19: Enfermedad infecciosa causada por el virus SARS-CoV-2.
SARS-CoV2: Virus causante de la enfermedad COVID-19.
Coronavirus: Familia de virus, causante de la enfermedad COVID-19.
Crecimiento exponencial: Curva que crece cada vez más rápido en el tiempo.
Asintomático: Persona infectada, la cual no presenta los síntomas.
Cuarentena: Aislamiento de personas para limitar el riesgo de contagio de una enfermedad.
Distanciamiento social: Conjunto de medidas que buscan reducir la exposición de personas a una enfermedad.
Aplanar la curva: Ralentizar la expansión de una enfermedad para evitar una curva pronunciada.
Letalidad: Porcentaje de casos letales en las infecciones.
Mortalidad: Cantidad de casos letales en la población total.
Ventilador: Máquina que proporciona oxígeno a pacientes que lo necesitan.
Inmunidad: Estado en el que el cuerpo humano es resistente a un tipo de infección.
OMS: Organización Mundial de la Salud, parte de la ONU, encargada de gestionar políticas de salud mundial.
Brote: Propagación de una enfermedad en un tiempo determinado.
Epidemia: Término general que explica la propagación rápida de una enfermedad en un periodo corto de tiempo.
Pandemia: Propagación de una enfermedad en un área extensa geográficamente.
Vacuna: Preparación contra enfermedad, generalmente buscando la creación de anticuerpos.
KN95: Estándar de mascarilla establecido en China que busca evaluar criterios de reducción de propagación.
N95: Estándar de mascarilla establecido en Estados Unidos que busca evaluar criterios de reducción de propagación.
R0: Número básico de reproducción, promedio de casos nuevos causados por cada caso.
SIR: Modelo epidemiológico que busca predecir los susceptibles, infectados y recuperados.
Prueba clínica: Experimento realizado en humanos para resolver preguntas de tratamientos.
Seguimiento de contactos: Monitoreo de personas que han estado en contacto con un infectado.
Área de contención: Área de la cual se busca que una enfermedad no salga.
Periodo de incubación: Tiempo desde que una persona es infectada hasta que muestra síntomas.
Paciente cero: Primer infectado de una enfermedad.
PUI: Persona bajo investigación.
Supercontagiador: Persona que infecta a una cantidad de personas inusual.
Inmunidad de grupo: Reducción del riesgo de infección de una comunidad por una infección previa.
Hidroxicloroquina: Droga comúnmente utilizada para tratar con la malaria.
Inmunodeficiente: Persona con mayor riesgo a una enfermedad por una condición previa.
Transmisión: Mecanismo en el que una enfermedad pasa de un hospedero a otro.
Intensivista: Médico encargado de pacientes graves.
Enfermedad zoonótica: Enfermedad animal transmitida a humanos.
Antibiótico: Droga efectiva tratando a bacterias.
Antiviral: Droga efectiva tratando a virus.
Peste negra: Pandemia del siglo XIV causada por la bacteria Yersinia pestis.
Viruela: Enfermedad viral altamente contagiosa, erradicada en 1980.
Gripe española: Pandemia viral centrada en europa dada por la influenza H1N1, durante la primera guerra mundial.
Gripe de Hong Kong: Pandemia viral centrada en China dada por la influenza H3N2, a finales de los 60 's.
Anticuerpo: Proteína de la sangre que inhibe el funcionamiento de un patógeno.
Neumonía: Enfermedad del sistema respiratorio que consiste en la inflamación de los espacios alveolares de los pulmones.
Síntoma: Manifestación de una enfermedad.
Fiebre: Aumento temporal de temperatura corporal dado a una enfermedad.
Fomite: Objeto capaz de transmitir una enfermedad, como una manilla.
Máscara quirúrgica: Mascarilla con los criterios para la utilización médica.
PPE: Equipamiento necesario para llevar a cabo trabajo para reducir riesgos de salud.
Epidemiología: Estudio de la propagación de enfermedades.`
	.split("\n").map(e => e.split(": "))

function shuffle(array) {
	for(let i = array.length - 1; i != 0; i--) {
		let j = Math.floor(Math.random() * i)
		let tmp = array[i]
		array[i] = array[j]
		array[j] = tmp
	}
}

shuffle(words)

function normalize(word) {
	return word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
// Arreglo de largo 10 para nombres
const nombres = new Array(10);
// Matriz de 10 filas por 3 columnas para notas
const notas = Array.from({ length: 10 }, () => [0, 0, 0]);

let totalAlumnos = 0; // Contador de alumnos ingresados

function limitarRango100(valor) {
    if (Number.isNaN(valor)) return 0;
    return Math.min(100, Math.max(0, valor));
}

// Función para agregar un alumno desde el formulario
function agregarAlumno(event) {
    event.preventDefault();
    const nombreInput = document.getElementById('nombre');
    const c1Input = document.getElementById('certamen1');
    const c2Input = document.getElementById('certamen2');
    const c3Input = document.getElementById('certamen3');
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = '';
    const nombre = nombreInput.value.trim();
    const c1 = parseFloat(c1Input.value);
    const c2 = parseFloat(c2Input.value);
    const c3 = parseFloat(c3Input.value);

    // Verificación de datos válidos
    if (!nombre) {
        errorDiv.textContent = 'Por favor ingrese el nombre del estudiante.';
        return;
    }
    if (isNaN(c1) || isNaN(c2) || isNaN(c3) || c1 < 0 || c2 < 0 || c3 < 0 || c1 > 100 || c2 > 100 || c3 > 100) {
        errorDiv.textContent = 'Por favor ingrese notas válidas entre 0 y 100.';
        return;
    }
    if (totalAlumnos >= 10) {
        errorDiv.textContent = 'Se ha alcanzado el límite máximo de 10 estudiantes.';
        return;
    }

    // Almacenamiento en arreglo y matriz
    nombres[totalAlumnos] = nombre;
    notas[totalAlumnos][0] = c1;
    notas[totalAlumnos][1] = c2;
    notas[totalAlumnos][2] = c3;
    totalAlumnos++;

    // Limpiar campos del formulario
    nombreInput.value = '';
    c1Input.value = '';
    c2Input.value = '';
    c3Input.value = '';
    nombreInput.focus();
    // Actualizar resultados en la pantalla
    renderizarResultados();
    // Si se llegó a 10 alumnos, deshabilitar formulario
    if (totalAlumnos === 10) {
        document.getElementById('btn-submit').disabled = true;
        document.getElementById('btn-submit').textContent = 'Curso Completo (10/10)';
    }
}
// Cálculo de promedios individuales usando funciones de orden superior
function calcularPromedioAlumno(index) {
    const notasAlumno = notas[index];
    const suma = notasAlumno.reduce((acc, curr) => acc + curr, 0);
    return limitarRango100(suma / notasAlumno.length);  
}
// Cálculo del promedio del curso por notadel curso (0, 1 o 2)
function calcularPromedioCertamen(certamenIndex) {
    if (totalAlumnos === 0) return 0;
    const suma = notas.slice(0, totalAlumnos).reduce((acc, curr) => acc + curr[certamenIndex], 0);
    return limitarRango100(suma / totalAlumnos);
}
// Cálculo del promedio general del curso
function calcularPromedioGeneral() {
    if (totalAlumnos === 0) return 0;
    const promedios = Array.from({ length: totalAlumnos }, (_, i) => calcularPromedioAlumno(i));
    const sumaTotal = promedios.reduce((acc, curr) => acc + curr, 0);
    return limitarRango100(sumaTotal / totalAlumnos);
}
// Renderización de resultados en la pantalla
function renderizarResultados() {
    const resultsCard = document.getElementById('results-card');
    const detailsDiv = document.getElementById('output-details');
    const rankingDiv = document.getElementById('output-ranking');

    if (totalAlumnos === 0) {
        resultsCard.style.display = 'none';
        return;
    }
    resultsCard.style.display = 'block';
    let htmlDetails = '';

    // Muestra cada alumno ingresado con sus notas y promedio
    for (let i = 0; i < totalAlumnos; i++) {
        const prom = calcularPromedioAlumno(i);
        htmlDetails += `
            <div class="alumno-item">
                <p class="bold">Nombre del estudiante ${i + 1}: ${nombres[i]}</p>
                <p>C1: ${notas[i][0]}</p>
                <p>C2: ${notas[i][1]}</p>
                <p>C3: ${notas[i][2]}</p>
                <p class="bold">Promedio: ${prom.toFixed(2)}</p>
            </div>
        `;
    }

    // Cálculos del curso
    const promC1 = calcularPromedioCertamen(0);
    const promC2 = calcularPromedioCertamen(1);
    const promC3 = calcularPromedioCertamen(2);
    const promGeneral = calcularPromedioGeneral();
    // Filtros de aprobados y reprobados
    const listaAlumnos = Array.from({ length: totalAlumnos }, (_, i) => ({
        nombre: nombres[i],
        promedio: calcularPromedioAlumno(i)
    }));
    const aprobados = listaAlumnos.filter(a => a.promedio >= 55).length;
    const reprobados = listaAlumnos.filter(a => a.promedio < 55).length;

    htmlDetails += `
        <div class="totales-section">
            <p><span class="bold">Promedio del curso C1:</span> ${promC1.toFixed(2)}</p>
            <p><span class="bold">Promedio del curso C2:</span> ${promC2.toFixed(2)}</p>
            <p><span class="bold">Promedio del curso C3:</span> ${promC3.toFixed(2)}</p>
            <p><span class="bold">Promedio Final Curso:</span> ${promGeneral.toFixed(2)}</p>
            <p><span class="bold">Aprobados:</span> ${aprobados}</p>
            <p><span class="bold">Reprobados:</span> ${reprobados}</p>
        </div>
    `;
    detailsDiv.innerHTML = htmlDetails;

    // Clasificación y ordenamiento por promedio (de mayor a menor)
    const rankingOrdenado = [...listaAlumnos].sort((a, b) => b.promedio - a.promedio);
    let htmlRanking = '<div class="ranking-title">Alumnos Ordenados por Promedio:</div>';
    rankingOrdenado.forEach((al, index) => {
        htmlRanking += `
            <div class="ranking-item">
                ${index + 1}. <span class="bold">${al.nombre}</span> - Promedio: ${al.promedio.toFixed(2)}
            </div>
        `;
    });
    rankingDiv.innerHTML = htmlRanking;
}
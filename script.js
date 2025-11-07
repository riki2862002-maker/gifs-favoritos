
const GIPHY_API_KEY = 'yipyIMw2DSznbuwbFrCpLQIIY4agkOKG'; 
const GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';
const LIMIT = 9; // Número de GIFs por página
let currentOffset = 0;
let currentSearchTerm = '';

// Elementos del DOM
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const gifsContainer = document.getElementById('gifs-container');
const nextPageBtn = document.getElementById('next-page-btn');

// --- Funciones Principales ---

/**
 * Realiza la llamada a la API de Giphy para obtener GIFs.
 * Rubro 9: La página realiza el consumo de la API GIF.
 * Rubro 10: Las imágenes mostradas corresponden al tema de la búsqueda.
 */
async function fetchGifs(searchTerm, offset) {
    const url = new URL(GIPHY_ENDPOINT);
    
    // Configuración de los parámetros de la API
    url.searchParams.append('api_key', GIPHY_API_KEY);
    url.searchParams.append('q', searchTerm);
    url.searchParams.append('limit', LIMIT);
    url.searchParams.append('offset', offset); // Rubro 12: Paginación
    url.searchParams.append('rating', 'g');
    
    gifsContainer.innerHTML = `<p>Buscando "${searchTerm}" (Página ${Math.floor(offset / LIMIT) + 1})...</p>`;
    nextPageBtn.disabled = true; // Deshabilitar mientras carga

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        displayGifs(jsonResponse.data);
        
        // Habilitar botón si hay potencial para más resultados
        if (jsonResponse.data.length === LIMIT) {
            nextPageBtn.disabled = false;
        }

    } catch (error) {
        console.error('Error al obtener GIFs:', error);
        gifsContainer.innerHTML = `<p style="color: red;">Error al cargar GIFs. Verifique su API Key.</p>`;
    }
}

/**
 * Muestra los GIFs en el contenedor.
 * Rubro 8: Se muestran las imágenes.
 */
function displayGifs(gifsData) {
    if (currentOffset === 0) {
        gifsContainer.innerHTML = ''; // Limpiar solo en la primera página
    }
    
    if (gifsData.length === 0 && currentOffset === 0) {
        gifsContainer.innerHTML = `<p>No se encontraron resultados para "${currentSearchTerm}".</p>`;
        nextPageBtn.disabled = true;
        return;
    }
    
    if (gifsData.length === 0 && currentOffset > 0) {
        gifsContainer.innerHTML += `<p>Fin de los resultados.</p>`;
        nextPageBtn.disabled = true;
        return;
    }
    
    gifsData.forEach(gif => {
        // Usamos 'fixed_height' para un tamaño consistente
        const gifUrl = gif.images.fixed_height.url; 
        
        const img = document.createElement('img');
        img.src = gifUrl;
        img.alt = gif.title;
        
        gifsContainer.appendChild(img);
    });
}

// --- Manejo de Eventos ---

// Manejar el envío del formulario (Nueva búsqueda)
form.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const searchTerm = input.value.trim();
    if (searchTerm) {
        currentSearchTerm = searchTerm;
        currentOffset = 0; // Reiniciar offset para una nueva búsqueda
        fetchGifs(currentSearchTerm, currentOffset);
    }
});

// Manejar el botón de paginación (Siguiente página)
nextPageBtn.addEventListener('click', function() {
    currentOffset += LIMIT; // Aumentar el offset por el límite de la página
    fetchGifs(currentSearchTerm, currentOffset);
});

// Mensaje inicial
gifsContainer.innerHTML = '<p>¡Empieza a buscar tus GIFs favoritos!</p>';

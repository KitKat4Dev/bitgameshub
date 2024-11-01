document.getElementById('addVideoBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    const videoLink = document.getElementById('videoLink').value.trim(); // Remove espaços em branco
    const videoCount = parseInt(document.getElementById('videoCount').value);
    const videoList = document.getElementById('videoList');

    // Limpa a lista de vídeos anterior
    videoList.innerHTML = '';

    // Valida a entrada
    if (!videoLink || isNaN(videoCount) || videoCount < 1) {
        alert('Por favor, insira um link válido do YouTube e um número positivo de vídeos.');
        return;
    }

    // Obtém o ID do vídeo do YouTube a partir do link
    const videoId = getYouTubeID(videoLink);

    if (!videoId) {
        alert('Por favor, insira um link válido de vídeo do YouTube.');
        return;
    }

    // Cria um fragmento de documento para melhor desempenho
    const fragment = document.createDocumentFragment();

    // Adiciona o número especificado de vídeos
    for (let i = 0; i < videoCount; i++) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`; // Adicionado &rel=0 para desabilitar vídeos relacionados
        iframe.width = '560'; // Define a largura do iframe
        iframe.height = '315'; // Define a altura do iframe
        iframe.allow = 'autoplay; encrypted-media'; // Permite autoplay e mídia criptografada
        iframe.style.margin = '10px'; // Adiciona algum espaço entre os iframes
        fragment.appendChild(iframe);
    }

    // Anexa o fragmento à lista de vídeos
    videoList.appendChild(fragment);

    // Limpa os campos de entrada
    document.getElementById('videoLink').value = '';
    document.getElementById('videoCount').value = '';
});

// Função para extrair o ID do vídeo do YouTube a partir do link
function getYouTubeID(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// gallery.js - JavaScript para gerenciar a galeria e modal

document.addEventListener('DOMContentLoaded', function() {
    // Seletores para elementos da galeria
    const imageContainers = document.querySelectorAll('.image-container');
    const modal = document.querySelector('.gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.querySelector('.modal-close');
    const modalCaption = document.querySelector('.modal-caption');

    // Verificar se o modal existe, senão criar
    if (!modal) {
        // Criar modal e adicioná-lo ao body
        const modalHTML = `
        <div class="gallery-modal">
            <span class="modal-close">&times;</span>
            <img id="modal-img" class="modal-content">
            <div class="modal-caption"></div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Atualizar referências
        modal = document.querySelector('.gallery-modal');
        modalImg = document.getElementById('modal-img');
        modalClose = document.querySelector('.modal-close');
        modalCaption = document.querySelector('.modal-caption');
    }

    // Abrir o modal ao clicar na imagem
    imageContainers.forEach(container => {
        container.addEventListener('click', function() {
            const img = this.querySelector('img');
            const imgSrc = img.getAttribute('data-full-img') || img.src;
            const title = this.querySelector('.overlay h3').textContent;
            const info = this.querySelector('.overlay p').textContent;
            
            // Configurar e exibir o modal
            modalImg.src = imgSrc;
            modalCaption.textContent = `${title} - ${info}`;
            modal.style.display = 'block';
            
            // Adicionar classe ao body para impedir scroll
            document.body.style.overflow = 'hidden';
            
            // Animar a abertura do modal
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        });
    });

    // Fechar o modal ao clicar no X
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Fechar o modal ao clicar fora da imagem
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Fechar o modal com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Função para fechar o modal
    function closeModal() {
        if (!modal) return;
        
        // Animar o fechamento do modal
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            // Restaurar o scroll
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Animar a exibição dos itens da galeria ao fazer scroll
    const animateOnScroll = function() {
        const galleries = document.querySelectorAll('.artist-gallery');
        
        galleries.forEach(gallery => {
            const rect = gallery.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.75) && (rect.bottom >= 0);
            
            if (isVisible) {
                const galleryItems = gallery.querySelectorAll('.gallery-item');
                galleryItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    };

    // Adicionar os estilos para animações e modal
    const addStyles = function() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Animações para os itens da galeria */
            .gallery-item {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .gallery-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Estilos para o modal */
            .gallery-modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.9);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 35px;
                color: #f1f1f1;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
                z-index: 1001;
            }
            
            .modal-content {
                display: block;
                margin: auto;
                max-width: 90%;
                max-height: 80vh;
                margin-top: 5vh;
            }
            
            .modal-caption {
                margin: auto;
                width: 80%;
                max-width: 700px;
                text-align: center;
                color: #ccc;
                padding: 10px 0;
                height: 150px;
            }
        `;
        document.head.appendChild(style);
    };

    // Inicializar animações e estilos
    addStyles();
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez na carga inicial

    // Scroll suave para as âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80, // Ajuste para o header fixo
                    behavior: 'smooth'
                });
            }
        });
    });
});
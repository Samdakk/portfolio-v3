// Variables globales
let sectionsLoaded = 0;
const totalSections = 6;
let sectionsInitialized = false;

// Función para verificar si todas las secciones están cargadas
function checkAllSectionsLoaded() {
    sectionsLoaded++;
    if (sectionsLoaded >= totalSections && !sectionsInitialized) {
        sectionsInitialized = true;
        initializeAnimations();
    }
}

// Función para inicializar todas las animaciones
function initializeAnimations() {
    // Inicializar Three.js si está disponible
    if (typeof THREE !== 'undefined') {
        requestIdleCallback(() => {
            initThreeJS();
        });
    }
    
    // Inicializar GSAP si está disponible
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        requestIdleCallback(() => {
            initGSAPAnimations();
        });
    }
    
    // Inicializar cursor personalizado
    initCustomCursor();
    
    // Inicializar tarjetas de habilidades
    initSkillCards();
}

// Función para inicializar Three.js
function initThreeJS() {
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const container = document.querySelector('.three-container');
        if (container) {
            container.appendChild(renderer.domElement);
        }
        
        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshNormalMaterial();
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);
        
        camera.position.z = 30;
        
        let animationFrameId;
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            torusKnot.rotation.x += 0.01;
            torusKnot.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Optimizar el manejo del resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }, 250);
        });
    } catch (error) {
        console.error('Error al inicializar Three.js:', error);
    }
}

// Función para inicializar animaciones GSAP
function initGSAPAnimations() {
    try {
        gsap.registerPlugin(ScrollTrigger);
        
        // Optimizar las animaciones de scroll
        gsap.utils.toArray('.section').forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'top 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Optimizar animaciones del hero
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-button, .hero-button-outline');
        gsap.from(heroElements, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });
    } catch (error) {
        console.error('Error al inicializar GSAP:', error);
    }
}

// Función para inicializar el cursor personalizado
function initCustomCursor() {
    try {
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        
        if (cursor && cursorDot) {
            let mouseX = 0;
            let mouseY = 0;
            let cursorX = 0;
            let cursorY = 0;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            function updateCursor() {
                const dx = mouseX - cursorX;
                const dy = mouseY - cursorY;
                
                cursorX += dx * 0.1;
                cursorY += dy * 0.1;
                
                gsap.set(cursor, { x: cursorX, y: cursorY });
                gsap.set(cursorDot, { x: mouseX, y: mouseY });
                
                requestAnimationFrame(updateCursor);
            }
            
            updateCursor();
            
            document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('hover');
                    cursorDot.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hover');
                    cursorDot.classList.remove('hover');
                });
            });
        }
    } catch (error) {
        console.error('Error al inicializar cursor personalizado:', error);
    }
}

// Función para inicializar las tarjetas de habilidades
function initSkillCards() {
    try {
        const skillFlipBtns = document.querySelectorAll('.skill-flip-btn');
        
        // Asegurarse de que los botones existan
        if (!skillFlipBtns.length) {
            console.warn('No se encontraron botones de flip');
            return;
        }

        skillFlipBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = this.closest('.skill-card');
                if (!card) {
                    console.warn('No se encontró la tarjeta padre');
                    return;
                }
                
                // Toggle de la clase flipped en la tarjeta actual
                card.classList.toggle('flipped');
                
                if (card.classList.contains('flipped')) {
                    const progressBars = card.querySelectorAll('.progress-fill');
                    const percentages = card.querySelectorAll('.skill-percentage');
                    
                    progressBars.forEach((bar, index) => {
                        const percentage = bar.getAttribute('data-percentage');
                        if (!percentage) return;
                        
                        bar.style.width = '0%'; // Resetear el ancho
                        requestAnimationFrame(() => {
                            bar.style.width = percentage + '%';
                        });
                        
                        let startValue = 0;
                        const endValue = parseInt(percentage);
                        const duration = 1000;
                        const increment = endValue / (duration / 16);
                        
                        const updateCounter = () => {
                            if (startValue < endValue) {
                                startValue += increment;
                                if (percentages[index]) {
                                    percentages[index].textContent = Math.floor(startValue) + '%';
                                }
                                requestAnimationFrame(updateCounter);
                            } else if (percentages[index]) {
                                percentages[index].textContent = endValue + '%';
                            }
                        };
                        
                        updateCounter();
                    });
                } else {
                    // Resetear las barras de progreso cuando se voltea hacia atrás
                    const progressBars = card.querySelectorAll('.progress-fill');
                    progressBars.forEach(bar => {
                        bar.style.width = '0%';
                    });
                }
            });
        });

        // Agregar animaciones hover a todas las tarjetas
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('flipped')) {
                    card.style.transform = 'translateY(-10px)';
                    card.style.boxShadow = '0 20px 25px -5px rgba(99, 102, 241, 0.2), 0 10px 10px -5px rgba(99, 102, 241, 0.1)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('flipped')) {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }
            });
        });
    } catch (error) {
        console.error('Error al inicializar tarjetas de habilidades:', error);
    }
}

// Función para inicializar la navegación
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveLink(sectionId);
            }
        });
    }, {
        root: null,
        threshold: 0.15
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    function updateActiveLink(activeSectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función para inicializar el formulario de contacto
function initContactForm() {
    console.log('Iniciando initContactForm...');
    try {
        // Inicializar EmailJS primero
        emailjs.init("Udxmy4j5mqzfZPWOh");
        console.log('EmailJS inicializado');

        // Crear un observer para detectar cuando la sección de contacto se carga
        const observer = new MutationObserver((mutations, obs) => {
            const contactForm = document.querySelector('#contact form');
            console.log('Buscando formulario...', contactForm);
            
            if (contactForm) {
                console.log('Formulario encontrado, configurando...');
                obs.disconnect(); // Detener la observación

                contactForm.addEventListener('submit', async function(e) {
                    console.log('Formulario enviado');
                    e.preventDefault();
                    
                    const name = this.querySelector('#name').value;
                    const email = this.querySelector('#email').value;
                    const message = this.querySelector('#message').value;
                    
                    console.log('Valores del formulario:', { name, email, message });
                    
                    if (!name || !email || !message) {
                        alert('Por favor, completa todos los campos');
                        return;
                    }

                    try {
                        console.log('Enviando correo...');
                        // Enviar el correo
                        const templateParams = {
                            name: name,
                            email: email,
                            message: message
                        };
                        
                        console.log('Parámetros del correo:', templateParams);
                        
                        const response = await emailjs.send("service_oj9gv7n", "template_jxwbtqs", templateParams);
                        console.log('Respuesta de EmailJS:', response);

                        if (response.status === 200) {
                            console.log('Correo enviado exitosamente');
                            alert('¡Mensaje enviado con éxito!');
                            this.reset();
                        } else {
                            console.error('Error en la respuesta:', response);
                            throw new Error('Error al enviar el mensaje');
                        }
                    } catch (error) {
                        console.error('Error detallado:', error);
                        if (error.text) {
                            console.error('Mensaje de error de EmailJS:', error.text);
                        }
                        alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
                    }
                });
            }
        });

        // Configurar el observer para observar cambios en el DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // También intentar inicializar inmediatamente por si la sección ya está cargada
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            console.log('Formulario encontrado inmediatamente');
            observer.disconnect();
            // Configurar el evento submit aquí...
        }
    } catch (error) {
        console.error('Error al inicializar el formulario de contacto:', error);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando...');
    initNavigation();
    initContactForm();
});

// Exportar funciones necesarias globalmente
window.checkAllSectionsLoaded = checkAllSectionsLoaded;
window.initializeAnimations = initializeAnimations;
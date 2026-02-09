document.addEventListener('DOMContentLoaded', () => {
    
    // --- FONCTION GITHUB AUTO-LOAD ---
    async function fetchGitHubProjects() {
        const username = 'carlimma'; // Ton pseudo GitHub
        const container = document.getElementById('github-projects');
        
        if (!container) return; // Sécurité si on n'est pas sur la page projets

        try {
            // On récupère les 6 derniers dépôts modifiés
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
            const repos = await response.json();

            container.innerHTML = repos.map(repo => `
                <article class="card" data-aos="fade-up">
                    <div class="card-body">
                        <div style="margin-bottom: 1rem;">
                            <span class="tag">${repo.language || 'Code'}</span>
                            <span class="tag"><i class="bi bi-star-fill"></i> ${repo.stargazers_count}</span>
                        </div>
                        <h3>${repo.name.replace(/-/g, ' ')}</h3>
                        <p>${repo.description || 'Projet passionnant à découvrir sur mon GitHub.'}</p>
                        <a href="${repo.html_url}" target="_blank" class="btn btn-outline" style="width: 100%">
                            Voir le Code <i class="bi bi-github"></i>
                        </a>
                    </div>
                </article>
            `).join('');

            // On réactive l'observateur d'animation pour les nouveaux éléments
            const animatedElements = container.querySelectorAll('[data-aos]');
            animatedElements.forEach(el => observer.observe(el));

        } catch (error) {
            container.innerHTML = `<p style="text-align: center; grid-column: 1/-1;">Erreur lors du chargement des projets. <a href="https://github.com/carlimma">Visitez mon profil GitHub</a>.</p>`;
            console.error("Erreur GitHub:", error);
        }
    }

    // Appeler la fonction au chargement
    fetchGitHubProjects();


    // --- MOBILE NAVIGATION TOGGLE ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('bi-list');
                icon.classList.add('bi-x-lg');
            } else {
                icon.classList.remove('bi-x-lg');
                icon.classList.add('bi-list');
            }
        });
    }

    // --- SCROLL ANIMATION (AOS) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));

    // --- FORM SUBMISSION ---
    const contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const myForm = e.target;
            const formData = new FormData(myForm);
            const submitBtn = myForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Envoi en cours...';

            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Envoyé !';
                submitBtn.classList.replace('btn-primary', 'btn-success');
                myForm.reset();
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.classList.replace('btn-success', 'btn-primary');
                }, 5000);
            })
            .catch(error => {
                alert("Erreur lors de l'envoi : " + error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.querySelector('i').classList.replace('bi-x-lg', 'bi-list');
                }
            }
        });
    });
});

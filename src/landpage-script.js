document.addEventListener("DOMContentLoaded", () => {
            
            // 1. Efek Hover untuk Navigasi Header (Teks berubah putih & bergeser naik sedikit)
            const navLinks = document.querySelectorAll('nav ul li a');
            navLinks.forEach(link => {
                link.style.transition = "all 0.3s ease";
                
                link.addEventListener('mouseenter', () => {
                    link.style.color = "#ffffff";
                    link.style.textShadow = "0px 2px 4px rgba(0,0,0,0.2)";
                });
                
                link.addEventListener('mouseleave', () => {
                    link.style.color = "#333333";
                    link.style.textShadow = "none";
                });
            });

            // 2. Efek Hover untuk Kotak Fitur / Cards (Berubah warna jadi hijau tema & naik sedikit)
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.style.transition = "all 0.3s ease";
                
                card.addEventListener('mouseenter', () => {
                    card.style.backgroundColor = "#54f77a";
                    card.style.color = "#ffffff";
                    card.style.borderColor = "#54f77a";
                    card.style.transform = "translateY(-5px)";
                    card.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.backgroundColor = "#ffffff";
                    card.style.color = "#333333";
                    card.style.borderColor = "#999";
                    card.style.transform = "translateY(0)";
                    card.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
                });
            });

            // 3. Efek Hover untuk Tombol "Buka Peta!" (Inversi warna hitam-putih)
            const btnPeta = document.querySelector('.btn-peta');
            if (btnPeta) {
                btnPeta.style.transition = "all 0.3s ease";
                
                btnPeta.addEventListener('mouseenter', () => {
                    btnPeta.style.backgroundColor = "#333333";
                    btnPeta.style.color = "#ffffff";
                    btnPeta.style.borderColor = "#333333";
                });
                
                btnPeta.addEventListener('mouseleave', () => {
                    btnPeta.style.backgroundColor = "#ffffff";
                    btnPeta.style.color = "#333333";
                    btnPeta.style.borderColor = "#999";
                });
            }
        });

        const featureMessages = {
    rute: {
        title: "Rute",
        description: "Informasi rute masih dalam tahap pengembangan."
    },
    halte: {
        title: "Halte",
        description: "Terdapat lebih dari 20 halte di wilayah perkotaan."
    },
    jangkauan: {
        title: "Jangkauan",
        description: "Jangkauan layanan mencakup radius 300 meter dari titik halte."
    },
    fasilitas: {
        title: "Fasilitas Sekitar",
        description: "Informasi fasilitas sekitar masih dalam tahap pengembangan."
    }
};

const modal = document.querySelector("#feature-modal");
const modalTitle = document.querySelector("#feature-modal-title");
const modalDescription = document.querySelector("#feature-modal-description");
const closeModal = document.querySelector(".feature-modal-close");

document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
        const feature = featureMessages[card.dataset.feature];

        modalTitle.textContent = feature.title;
        modalDescription.textContent = feature.description;
        modal.hidden = false;
    });
});

closeModal.addEventListener("click", () => {
    modal.hidden = true;
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.hidden = true;
    }
});
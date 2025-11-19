window.addEventListener("load", () => {
    const letters = gsap.utils.toArray(".logo span");
    const tela1 = document.getElementById("tela1");
    const tela2 = document.getElementById("tela2");
    const tela3 = document.getElementById("tela3");
    const form = tela2.querySelector(".form-wrapper");
    const cadastroBtn = form.querySelector("button");

    // ENTRADA DA LOGO
    gsap.fromTo(
        letters,
        { opacity:0, z:-140, scale:0.4, rotateX:55, filter:"blur(12px)" },
        { opacity:1, z:0, scale:1, rotateX:0, filter:"blur(0px)", duration:0.9, ease:"power3.out", stagger:0.12 }
    );

    // TRANSIÇÃO PARA TELA 2
    setTimeout(() => {
        const tl = gsap.timeline();

        tl.to(letters, {
            opacity:0,
            z:-200,
            scale:0.2,
            rotateX:45,
            filter:"blur(12px)",
            ease:"power2.in",
            stagger: { each:0.06, from:"center" },
            duration:0.6
        });

        tl.add(() => {
            const portal = document.createElement("div");
            portal.style.cssText = `
                position:absolute; top:50%; left:50%; width:4px; height:4px; background:#e9dfbe;
                border-radius:50%; transform:translate(-50%,-50%) scale(0.2); opacity:0; filter:blur(12px);
            `;
            document.body.appendChild(portal);
            gsap.fromTo(portal,
                { scale:0.1, opacity:0 },
                { scale:3, opacity:0.8, filter:"blur(30px)", duration:0.45, ease:"power3.out", onComplete:()=>portal.remove() }
            );
        });

        // TROCA DE TELAS
        tl.add(() => {
            tela1.classList.add("hidden");
            tela2.classList.remove("hidden");
        }, "-=0.2");

        // ENTRADA FORM
        tl.fromTo(form,
            { opacity:0, scale:0.4, z:-160, filter:"blur(12px)" },
            { opacity:1, scale:1, z:0, filter:"blur(0px)", duration:0.8, ease:"power3.out" }
        );

    }, 5000);

    // VALIDAÇÃO DO FORMULÁRIO
    cadastroBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let valid = true;

        const inputs = form.querySelectorAll(".input-group input");
        inputs.forEach(input => {
            input.classList.remove("error");
            const errorSpan = input.nextElementSibling;
            if (!input.value.trim()) {
                input.classList.add("error");
                errorSpan.textContent = "Campo obrigatório";
                valid = false;
            } else if (input.type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    input.classList.add("error");
                    errorSpan.textContent = "E-mail inválido";
                    valid = false;
                }
            }
        });

        // Senha e confirmação
        const senha = inputs[2].value;
        const confirmaSenha = inputs[3].value;
        if (senha && confirmaSenha && senha !== confirmaSenha) {
            inputs[3].classList.add("error");
            inputs[3].nextElementSibling.textContent = "As senhas não conferem";
            valid = false;
        }

        // Termos obrigatórios
        const termos = form.querySelector('input[type="checkbox"][required]');
        if (!termos.checked) {
            alert("Você precisa aceitar os Termos de Uso e Política de Privacidade!");
            valid = false;
        }

        // Se tudo certo, mostra tela 3
        if (valid) {
            showAvatarScreen();
        }
    });

    // FUNÇÃO PARA MOSTRAR A TELA 3
    function showAvatarScreen() {
        tela2.classList.add("hidden");
        tela3.classList.remove("hidden");

        const wrapper = tela3.querySelector(".avatar-wrapper");
        gsap.fromTo(
            wrapper,
            { opacity:0, scale:0.4, z:-160, filter:"blur(12px)" },
            { opacity:1, scale:1, z:0, filter:"blur(0px)", duration:0.8, ease:"power3.out" }
        );
    }

    // SELEÇÃO DE AVATAR
    const avatars = tela3.querySelectorAll(".avatar-option");
    let selectedAvatar = null;
    avatars.forEach(img => {
        img.addEventListener("click", () => {
            avatars.forEach(a => a.classList.remove("selected"));
            img.classList.add("selected");
            selectedAvatar = img.src;
        });
    });

    // BOTÃO FINALIZAR AVATAR
    const finalizarBtn = tela3.querySelector("#finalizarAvatar");
    finalizarBtn.addEventListener("click", () => {
        const nicknameInput = tela3.querySelector("#nickname");
        if (!nicknameInput.value.trim()) {
            nicknameInput.classList.add("error");
            nicknameInput.nextElementSibling.textContent = "Nickname obrigatório";
            return;
        } else {
            nicknameInput.classList.remove("error");
            nicknameInput.nextElementSibling.textContent = "";
        }

        if (!selectedAvatar) {
            alert("Selecione um avatar para continuar!");
            return;
        }

        alert(`Cadastro completo!\nNickname: ${nicknameInput.value}\nAvatar: ${selectedAvatar}`);
        // Aqui você pode ir para a próxima tela ou iniciar a aplicação
    });
});

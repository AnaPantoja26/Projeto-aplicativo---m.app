window.addEventListener("load", () => {
  const safe = (v, name) => {
    if (!v) console.error(`[SCRIPT] Elemento não encontrado: ${name}`);
    return v;
  };

  const showScreen = (id) => {
    const telas = document.querySelectorAll(".stage");
    telas.forEach(t => {
      t.classList.add("hidden");
      t.style.display = "none";
      t.style.opacity = "";
    });
    const tela = document.getElementById(id);
    if (!tela) return console.error(`[SCRIPT] showScreen: id inválido -> ${id}`);
    tela.classList.remove("hidden");
    tela.style.display = "flex";
    tela.style.opacity = "1";
  };

  // ELEMENTOS
  const tela1 = safe(document.getElementById("tela1"), "tela1");
  const tela2 = safe(document.getElementById("tela2"), "tela2");
  const tela3 = safe(document.getElementById("tela3"), "tela3");
  const tela4 = safe(document.getElementById("tela4"), "tela4");
  const telaPrincipal = safe(document.getElementById("telaPrincipal"), "telaPrincipal");

  const form2 = safe(tela2.querySelector(".form-wrapper"), ".form-wrapper (tela2)");
  const cadastroBtn = safe(form2.querySelector("button"), "botão de cadastrar (tela2)");
  const finalizarBtn = safe(tela3.querySelector("#finalizarAvatar"), "finalizarAvatar (tela3)");
  const avatars = tela3.querySelectorAll(".avatar-option");

  const welcomeMessage = safe(document.getElementById("welcome-message"), "welcome-message (tela4)");
  const welcomeAvatar = safe(document.getElementById("selected-avatar"), "selected-avatar (tela4)");
  const startAppBtn = safe(document.getElementById("start-app"), "start-app (tela4)");

  // ELEMENTOS TELA PRINCIPAL
  const btnMapa = safe(document.getElementById("btnMapa"), "btnMapa");
  const btnConfig = safe(document.getElementById("btnConfig"), "btnConfig");
  const userPoints = safe(document.getElementById("userPoints"), "userPoints");
  const cameraFeed = safe(document.getElementById("cameraFeed"), "cameraFeed");
  const mapContainer = safe(document.getElementById("mapContainer"), "mapContainer");

  console.log("[SCRIPT] elementos carregados:", { 
    tela1, tela2, tela3, tela4, telaPrincipal, 
    form2, cadastroBtn, finalizarBtn, avatarsCount: avatars.length 
  });

  let selectedAvatar = null;
  let points = 0;

  /* --- ANIMAÇÃO LOGO --- */
  try {
      if (window.gsap) {
      const letters = gsap.utils.toArray(".logo span");
      gsap.fromTo(
          letters,
          { opacity: 0, z: -140, scale: 0.4, rotateX: 55, filter: "blur(12px)" },
          { opacity: 1, z: 0, scale: 1, rotateX: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out", stagger: 0.12 }
      );
      } else {
      console.warn("[SCRIPT] GSAP não encontrado — pulando animação.");
      }
  } catch (err) {
      console.warn("[SCRIPT] Erro ao executar GSAP:", err);
  }

  /* --- TRANSIÇÃO AUTOMÁTICA PARA TELA 2 --- */
  setTimeout(() => {
    try {
      if (window.gsap) {
        const letters = gsap.utils.toArray(".logo span");
        gsap.to(letters, {
          opacity: 0,
          z: -200,
          scale: 0.2,
          rotateX: 45,
          filter: "blur(12px)",
          ease: "power2.in",
          stagger: { each: 0.06, from: "center" },
          duration: 0.3,
          onComplete: () => {
            showScreen("tela2");
            const wrapper = tela2.querySelector(".form-wrapper");
            if (wrapper) {
              gsap.fromTo(wrapper,
                { opacity: 0, scale: 0.4, z: -160, filter: "blur(12px)" },
                { opacity: 1, scale: 1, z: 0, filter: "blur(0)", duration: 0.8, ease: "power3.out" }
              );
            }
          }
        });
      } else {
        showScreen("tela2");
      }
    } catch (err) {
      console.error("[SCRIPT] Erro na transição automática:", err);
    }
  }, 5000);

  /* --- VALIDAÇÃO TELA 2 --- */
  cadastroBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const inputs = Array.from(form2.querySelectorAll(".input-group input"));
    const termos = form2.querySelector('input[type="checkbox"][required]');

    let valid = true;

    inputs.forEach(input => {
      input.classList.remove("error");
      const span = input.nextElementSibling;
      if (span) span.textContent = "";
    });

    inputs.forEach(input => {
      const span = input.nextElementSibling;

      if (!input.value.trim()) {
        input.classList.add("error");
        if (span) span.textContent = "Campo obrigatório";
        valid = false;
      } else if (input.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          input.classList.add("error");
          if (span) span.textContent = "E-mail inválido";
          valid = false;
        }
      }
    });

    if (inputs.length >= 4) {
      const senha = inputs[2].value;
      const confirmaSenha = inputs[3].value;
      if (senha && confirmaSenha && senha !== confirmaSenha) {
        inputs[3].classList.add("error");
        const span = inputs[3].nextElementSibling;
        if (span) span.textContent = "As senhas não conferem";
        valid = false;
      }
    }

    if (!termos || !termos.checked) {
      alert("Você precisa aceitar os Termos de Uso e Política de Privacidade!");
      valid = false;
    }

    if (valid) {
      const nomeUsuario = inputs[0].value.trim();
      localStorage.setItem("nomeUsuario", nomeUsuario);

      showScreen("tela3");

      const wrapper3 = tela3.querySelector(".avatar-wrapper");
      if (window.gsap && wrapper3) {
        gsap.fromTo(wrapper3,
          { opacity: 0, scale: 0.7, filter: "blur(12px)" },
          { opacity: 1, scale: 1, filter: "blur(0)", duration: 0.8, ease: "power3.out" }
        );
      }
    } else {
      const firstErr = form2.querySelector(".error");
      if (firstErr) firstErr.focus();
    }
  });

  /* --- SELEÇÃO DE AVATAR --- */
  if (avatars && avatars.length) {
    avatars.forEach(img => {
      img.addEventListener("click", () => {
        avatars.forEach(a => a.classList.remove("selected"));
        img.classList.add("selected");
        selectedAvatar = img.src;
      });
    });
  }

  /* --- FINALIZAR AVATAR —> IR PARA TELA 4 --- */
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      const nicknameInput = tela3.querySelector("#nickname");
      const nicknameError = nicknameInput?.nextElementSibling;

      nicknameInput.classList.remove("error");
      if (nicknameError) nicknameError.textContent = "";

      let valid = true;

      if (!nicknameInput.value.trim()) {
        nicknameInput.classList.add("error");
        if (nicknameError) nicknameError.textContent = "Campo obrigatório";
        valid = false;
      }

      if (!selectedAvatar) {
        alert("Selecione um avatar para continuar!");
        valid = false;
      }

      if (valid) {
        localStorage.setItem("avatarUsuario", selectedAvatar);
        localStorage.setItem("nickname", nicknameInput.value.trim());

        showWelcomeScreen();
      }
    });
  }

  /* --- FUNÇÃO DA TELA DE BOAS-VINDAS (TELA 4) --- */
  function showWelcomeScreen() {
    const nome = localStorage.getItem("nomeUsuario") || "Usuário";
    const avatar = localStorage.getItem("avatarUsuario");

    welcomeMessage.textContent = `Pode começar, ${nome}!`;
    welcomeAvatar.src = avatar;

    showScreen("tela4");

    if (window.gsap) {
      gsap.fromTo(".welcome-wrapper",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }

  /* --- BOTÃO COMEÇAR (TELA 4) --- */
  if (startAppBtn) {
    startAppBtn.addEventListener("click", () => {
      showScreen("telaPrincipal");
      initCamera();
      initMap();
    });
  }

  /* --- CLIQUE LOGO --- */
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", () => showScreen("tela2"));
  }

  /* --- FUNÇÕES TELA PRINCIPAL --- */
  function initCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          cameraFeed.srcObject = stream;
        })
        .catch(err => console.error("Erro ao acessar câmera:", err));
    } else {
      console.warn("Câmera não suportada.");
    }
  }

  function initMap() {
    if (window.google) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const map = new google.maps.Map(mapContainer, {
          center: { lat: latitude, lng: longitude },
          zoom: 16,
        });
        new google.maps.Marker({ position: { lat: latitude, lng: longitude }, map });
      }, (err) => console.error(err));
    } else {
      console.warn("Google Maps API não carregada");
    }
  }

  // ATUALIZA PONTUAÇÃO
  function addPoints(val) {
    points += val;
    userPoints.textContent = points;
  }

  // EXEMPLO DE INTERAÇÕES
  btnMapa.addEventListener("click", () => alert("Abrir mapa full screen!"));
  btnConfig.addEventListener("click", () => alert("Abrir configurações!"));
});

// AR básico
  let scene, camera, renderer, cube;
  function initAR(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, arOverlay.clientWidth/arOverlay.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha:true });
    renderer.setSize(arOverlay.clientWidth,arOverlay.clientHeight);
    arOverlay.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
    const material = new THREE.MeshBasicMaterial({ color:0x66fcf1 });
    cube = new THREE.Mesh(geometry,material);
    cube.position.z = -2;
    scene.add(cube);
    animateAR();

    renderer.domElement.addEventListener("click", () => { points+=100; userPoints.textContent=points; cube.material.color.set(Math.random()*0xffffff); });
  }
  function animateAR(){ requestAnimationFrame(animateAR); cube.rotation.x+=0.01; cube.rotation.y+=0.01; renderer.render(scene,camera); }

  btnMapa.addEventListener("click",()=>alert("Abrir mapa full screen!"));
  btnConfig.addEventListener("click",()=>alert("Abrir configurações!"));


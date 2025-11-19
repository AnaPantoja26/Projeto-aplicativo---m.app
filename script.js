window.addEventListener("load", () => {
    const letters = gsap.utils.toArray(".logo span");
    const form = document.querySelector(".form-wrapper");

    // ENTRADA DA LOGO
    gsap.fromTo(
        letters,
        { opacity:0, z:-140, scale:0.4, rotateX:55, filter:"blur(12px)" },
        { opacity:1, z:0, scale:1, rotateX:0, filter:"blur(0px)", duration:0.9, ease:"power3.out", stagger:0.12 }
    );

    // TRANSIÇÃO PARA TELA 2
    setTimeout(() => {
        const tl = gsap.timeline();

        // LOGO REVERSE
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

        // FLASH / PORTAL
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
            document.getElementById("tela1").classList.add("hidden");
            document.getElementById("tela2").classList.remove("hidden");
        }, "-=0.2");

        // ENTRADA FORM
        tl.fromTo(form,
            { opacity:0, scale:0.4, z:-160, filter:"blur(12px)" },
            { opacity:1, scale:1, z:0, filter:"blur(0px)", duration:0.8, ease:"power3.out" }
        );

    }, 5000);
});

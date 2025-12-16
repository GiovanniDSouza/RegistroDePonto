 function login() {
      const user = document.getElementById("username").value.trim().toLowerCase();
      const pass = document.getElementById("password").value;

      // Exemplo de login simples
      const validUsers = {
        admin: "admin123",
        giovanni: "123",
        renan: "123"
      };

      if (validUsers[user] && validUsers[user] === pass) {
        localStorage.setItem("loggedUser", user);
        window.location.href = "gia.html";
      } else {
        alert("Usuário ou senha inválidos");
      }
    }
 
 function toggleSidebar() {
      const user = localStorage.getItem("loggedUser") || "";
    document.getElementById("usernameDisplay").innerText = user.charAt(0).toUpperCase() + user.slice(1);
    if (user === "admin") document.getElementById("relatorioTodos").style.display = "block";
    if (!user) window.location.href = "login.html";


 
   
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.toggle("hidden");
    }
  

    function logout() {
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    }

    const modal = document.getElementById("extraModal");
    const overlay = document.getElementById("overlay");
  
    let inicioExpediente, inicioIntervalo, retornoIntervalo, fimExpediente, inicioExtra, fimExtra;
    let tipoTrabalhoSelecionado = "Presencial";
    let historicoExtras = JSON.parse(localStorage.getItem("historicoExtras")) || [];
  
    document.querySelectorAll('input[name="tipoTrabalho"]').forEach(input => {
      input.addEventListener("change", function () {
        tipoTrabalhoSelecionado = this.value;
        zerarHorarios();
      });
    });
  
    function registrarInicioExpediente() {
      inicioExpediente = new Date();
      document.getElementById("inicioExpediente").innerText =
        inicioExpediente.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  
    function registrarInicioIntervalo() {
      inicioIntervalo = new Date();
      document.getElementById("inicioIntervalo").innerText =
        inicioIntervalo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  
    function registrarRetornoIntervalo() {
      retornoIntervalo = new Date();
      document.getElementById("retornoIntervalo").innerText =
        retornoIntervalo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  
    function registrarFimExpediente() {
      fimExpediente = new Date();
      document.getElementById("fimExpediente").innerText =
        fimExpediente.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      calcularHorasExtras();
      zerarHorarios();
    }
  
    function registrarInicioExtra() {
      inicioExtra = new Date();
      document.getElementById("inicioExtra").innerText =
        inicioExtra.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  
    function registrarFimExtra() {
      fimExtra = new Date();
      document.getElementById("fimExtra").innerText =
        fimExtra.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      calcularHorasExtras();
    }
  
    function calcularHorasExtras() {
      let minutosExtras = 0;
      let temRegistro = false;
  
      if (inicioExpediente && fimExpediente) {
        const cargaHoraria = 2; // 2 minutos para teste
        const diffTotal = (fimExpediente - inicioExpediente) / 60000;
  
        let tempoIntervalo = 0;
        if (inicioIntervalo && retornoIntervalo) {
          tempoIntervalo = (retornoIntervalo - inicioIntervalo) / 60000;
        }
  
        const tempoTrabalhado = diffTotal - tempoIntervalo;
        temRegistro = true;
  
        minutosExtras += Math.floor(tempoTrabalhado - cargaHoraria);
      }
  
      if (inicioExtra && fimExtra) {
        temRegistro = true;
        minutosExtras += Math.floor((fimExtra - inicioExtra) / 60000);
      }
  
      if (!temRegistro) return;
  
      const horas = Math.floor(Math.abs(minutosExtras) / 60);
      const minutos = Math.abs(minutosExtras) % 60;
      const hoje = new Date().toLocaleDateString();
  
      let textoHoras = `${horas}h ${minutos}min`;
      if (minutosExtras < 0) {
        textoHoras = `-${textoHoras}`;
        document.getElementById("horasExtras").style.color = "#e74c3c"; // vermelho
      } else {
        document.getElementById("horasExtras").style.color = "#fff"; // branco
      }
  
      document.getElementById("horasExtras").innerText = textoHoras;
      historicoExtras.push([hoje, tipoTrabalhoSelecionado, textoHoras]);
      localStorage.setItem("historicoExtras", JSON.stringify(historicoExtras));
    }
  
    function mostrarModal() {
      modal.style.display = "block";
      overlay.style.display = "block";
    }
  
    overlay.addEventListener("click", () => {
      modal.style.display = "none";
      overlay.style.display = "none";
    });
  
    function exportarParaExcel() {
      const presencial = historicoExtras.filter(item => item[1] === "Presencial");
      const home = historicoExtras.filter(item => item[1] === "Home Office");
  
      let data = [
        ["--- HORAS EXTRAS PRESENCIAL ---"],
        ["Data", "Tipo", "Horas Extras"],
        ...presencial,
        [],
        ["--- HORAS EXTRAS HOME OFFICE ---"],
        ["Data", "Tipo", "Horas Extras"],
        ...home
      ];
  
      let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
  
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "horas_extras.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  
    function zerarPlanilha() {
  if (confirm("Tem certeza que deseja apagar todas as informações de horas extras?")) {
    localStorage.removeItem("historicoExtras");
    historicoExtras = [];
    document.getElementById("horasExtras").innerText = "0h 00 min";
    document.getElementById("horasExtras").style.color = "#fff";
    alert("Planilha de horas extras foi zerada com sucesso!");
  }
}

    function zerarHorarios() {
      inicioExpediente = null;
      inicioIntervalo = null;
      retornoIntervalo = null;
      fimExpediente = null;
      inicioExtra = null;
      fimExtra = null;
  
      document.getElementById("inicioExpediente").innerText = "--:--";
      document.getElementById("inicioIntervalo").innerText = "--:--";
      document.getElementById("retornoIntervalo").innerText = "--:--";
      document.getElementById("fimExpediente").innerText = "--:--";
      document.getElementById("inicioExtra").innerText = "--:--";
      document.getElementById("fimExtra").innerText = "--:--";
      document.getElementById("horasExtras").innerText = `0h 00 min`;
      document.getElementById("horasExtras").style.color = "#fff";
    }
  
    document.querySelectorAll(".has-submenu").forEach(item => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        this.classList.toggle("open");
      });
    });
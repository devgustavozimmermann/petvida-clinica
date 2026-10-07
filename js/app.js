// PetVida - sistema de agendamento e prontuário
// Feito com HTML, CSS e JavaScript puro. Os dados ficam salvos no localStorage.

var CHAVE = 'petvida-dados';
var db = carregar();

// ---------- Dados salvos ----------
function copiaDemo() {
  return JSON.parse(JSON.stringify(DADOS));
}

function carregar() {
  var texto = localStorage.getItem(CHAVE);
  if (texto) {
    try {
      var d = JSON.parse(texto);
      if (d.profs && d.tutores && d.pets && d.ag && d.vacinas && d.historico) {
        return d;
      }
    } catch (erro) {
      console.log('Dados salvos inválidos, usando a demonstração.');
    }
  }
  return copiaDemo();
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(db));
  } catch (erro) {
    console.log('Não foi possível salvar.');
  }
}

// ---------- Funções auxiliares ----------
function achar(lista, id) {
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id == id) {
      return lista[i];
    }
  }
  return null;
}

function proximoId(lista) {
  var maior = 0;
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id > maior) {
      maior = lista[i].id;
    }
  }
  return maior + 1;
}

// troca caracteres especiais para o texto digitado não virar HTML
function escapar(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatarData(iso) {
  var p = iso.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

function diasAte(iso) {
  var hoje = new Date(dia(0) + 'T00:00');
  var data = new Date(iso + 'T00:00');
  return Math.round((data - hoje) / 86400000);
}

function situacao(v) {
  var d = diasAte(v.proxima);
  if (d < 0) {
    return {classe: 'atraso', texto: 'Atrasada ' + (-d) + ' dia(s)'};
  }
  if (d <= 30) {
    return {classe: 'aviso', texto: 'Vence em ' + d + ' dia(s)'};
  }
  return {classe: 'ok', texto: 'Em dia'};
}

// posições (em db.vacinas) das vacinas/retornos que vencem em até 30 dias
function lembretesProximos() {
  var lista = [];
  for (var i = 0; i < db.vacinas.length; i++) {
    if (diasAte(db.vacinas[i].proxima) <= 30) {
      lista.push(i);
    }
  }
  return lista;
}

function opcoesPets() {
  var html = '';
  for (var i = 0; i < db.pets.length; i++) {
    var p = db.pets[i];
    html += '<option value="' + p.id + '">' + escapar(p.nome) + ' (' + escapar(achar(db.tutores, p.tutor).nome) + ')</option>';
  }
  return html;
}

function opcoesProfs() {
  var html = '';
  for (var i = 0; i < db.profs.length; i++) {
    var p = db.profs[i];
    html += '<option value="' + p.id + '">' + escapar(p.nome) + ' - ' + p.funcao + '</option>';
  }
  return html;
}

function opcoesTexto(lista) {
  var html = '';
  for (var i = 0; i < lista.length; i++) {
    html += '<option>' + lista[i] + '</option>';
  }
  return html;
}

// quando um atendimento fica "Concluído", ele entra no prontuário do pet
function atualizarHistorico(a) {
  var novo = [];
  for (var i = 0; i < db.historico.length; i++) {
    var h = db.historico[i];
    if (!(h.ag == a.id && h.data == dia(0))) {
      novo.push(h);
    }
  }
  db.historico = novo;
  if (a.status == 'Concluído') {
    db.historico.push({
      pet: a.pet,
      data: dia(0),
      tipo: a.tipo,
      ag: a.id,
      texto: 'Atendimento concluído com ' + achar(db.profs, a.prof).nome + ' às ' + a.hora + '.'
    });
  }
}

// ---------- Telas ----------
function listaLembretes(posicoes, comBotao) {
  if (posicoes.length == 0) {
    return '';
  }
  var html = '<div class="rolagem"><table><tr><th>Pet</th><th>Item</th><th>Data</th><th>Situação</th>';
  if (comBotao) {
    html += '<th>Ação</th>';
  }
  html += '</tr>';
  for (var i = 0; i < posicoes.length; i++) {
    var v = db.vacinas[posicoes[i]];
    var s = situacao(v);
    html += '<tr><td>' + escapar(achar(db.pets, v.pet).nome) + '</td>';
    html += '<td>' + escapar(v.nome) + '</td>';
    html += '<td>' + formatarData(v.proxima) + '</td>';
    html += '<td><span class="tag ' + s.classe + '">' + s.texto + '</span></td>';
    if (comBotao) {
      if (v.enviado) {
        html += '<td>Enviado</td>';
      } else {
        html += '<td><button class="btn" data-lem="' + posicoes[i] + '">Enviar lembrete</button></td>';
      }
    }
    html += '</tr>';
  }
  return html + '</table></div>';
}

function telaDashboard() {
  var livres = HORAS.length * db.profs.length - db.ag.length;

  var confirmados = 0;
  for (var i = 0; i < db.ag.length; i++) {
    if (db.ag[i].status != 'Agendado') {
      confirmados++;
    }
  }
  var porcentagem = 0;
  if (db.ag.length > 0) {
    porcentagem = Math.round(confirmados / db.ag.length * 100);
  }

  var aEnviar = 0;
  for (var j = 0; j < db.vacinas.length; j++) {
    if (diasAte(db.vacinas[j].proxima) <= 30 && !db.vacinas[j].enviado) {
      aEnviar++;
    }
  }

  var barras = '';
  for (var k = 0; k < db.profs.length; k++) {
    var qtd = 0;
    for (var m = 0; m < db.ag.length; m++) {
      if (db.ag[m].prof == db.profs[k].id) {
        qtd++;
      }
    }
    var ocupacao = Math.round(qtd / HORAS.length * 100);
    barras += '<div>' + escapar(db.profs[k].nome) + ' <small>(' + ocupacao + '% ocupado)</small>';
    barras += '<div class="barra"><i style="width:' + ocupacao + '%"></i></div></div>';
  }

  var proximos = lembretesProximos().slice(0, 4);

  return '<h1>Dashboard</h1><p class="sub">Visão geral do dia</p>' +
    '<div class="cards">' +
    '<div class="card"><b>' + db.ag.length + '</b><span>Atendimentos hoje</span></div>' +
    '<div class="card"><b>' + porcentagem + '%</b><span>Confirmados ou concluídos</span></div>' +
    '<div class="card alerta"><b>' + livres + '</b><span>Horários livres</span></div>' +
    '<div class="card alerta"><b>' + aEnviar + '</b><span>Lembretes a enviar</span></div>' +
    '</div>' +
    '<h2>Ocupação por profissional</h2><div class="box">' + barras + '</div>' +
    '<h2>Próximas vacinas e retornos</h2><div class="box">' + (listaLembretes(proximos, false) || 'Nenhum registro.') + '</div>';
}

function telaAgenda() {
  var html = '<h1>Agenda de hoje</h1>' +
    '<p class="sub">Veterinários e tosadores na mesma agenda. Clique em "+ livre" para agendar ou em um horário para mudar o status.</p>' +
    '<div class="box"><form id="fAg">' +
    '<label>Pet<select name="pet">' + opcoesPets() + '</select></label>' +
    '<label>Serviço<select name="tipo">' + opcoesTexto(Object.keys(TIPOS)) + '</select></label>' +
    '<label>Profissional<select name="prof">' + opcoesProfs() + '</select></label>' +
    '<label>Horário<select name="hora">' + opcoesTexto(HORAS) + '</select></label>' +
    '<button class="btn">Agendar</button></form><div id="msg" class="msg"></div></div>' +
    '<h2>Grade</h2><div class="rolagem"><table class="grade"><tr><th></th>';

  for (var i = 0; i < db.profs.length; i++) {
    html += '<th>' + escapar(db.profs[i].nome) + '<small>' + db.profs[i].funcao + '</small></th>';
  }
  html += '</tr>';

  for (var h = 0; h < HORAS.length; h++) {
    html += '<tr><td>' + HORAS[h] + '</td>';
    for (var p = 0; p < db.profs.length; p++) {
      var ag = acharAgendamento(db.profs[p].id, HORAS[h]);
      if (ag) {
        html += '<td><button type="button" class="ag ' + ag.status + '" data-ag="' + ag.id + '">' +
          '<b>' + escapar(achar(db.pets, ag.pet).nome) + '</b>' + ag.tipo + ' · ' + ag.status + '</button></td>';
      } else {
        html += '<td><button type="button" class="livre" data-p="' + db.profs[p].id + '" data-h="' + HORAS[h] + '">+ livre</button></td>';
      }
    }
    html += '</tr>';
  }
  return html + '</table></div>';
}

function acharAgendamento(profId, hora) {
  for (var i = 0; i < db.ag.length; i++) {
    if (db.ag[i].prof == profId && db.ag[i].hora == hora) {
      return db.ag[i];
    }
  }
  return null;
}

function telaCadastros() {
  var linhas = '';
  for (var i = 0; i < db.pets.length; i++) {
    var p = db.pets[i];
    var t = achar(db.tutores, p.tutor);
    linhas += '<tr><td>' + escapar(p.nome) + '</td><td>' + escapar(p.especie) + ' / ' + escapar(p.raca) + '</td>' +
      '<td>' + escapar(t.nome) + '</td><td>' + escapar(t.tel) + '</td>' +
      '<td><a class="lnk" href="#prontuario/' + p.id + '">Ver prontuário</a></td></tr>';
  }
  var tutores = '';
  for (var j = 0; j < db.tutores.length; j++) {
    tutores += '<option value="' + db.tutores[j].id + '">' + escapar(db.tutores[j].nome) + '</option>';
  }

  return '<h1>Tutores e Pets</h1><p class="sub">Cadastro único: tutor, pets e histórico ficam ligados.</p>' +
    '<div class="dupla">' +
    '<div class="box"><h2>Novo tutor</h2><form id="fTutor">' +
    '<label>Nome<input name="nome" required></label>' +
    '<label>Telefone<input name="tel" required placeholder="(41) 90000-0000"></label>' +
    '<button class="btn">Cadastrar</button></form></div>' +
    '<div class="box"><h2>Novo pet</h2><form id="fPet">' +
    '<label>Nome<input name="nome" required></label>' +
    '<label>Espécie<select name="especie"><option>Cão</option><option>Gato</option><option>Outro</option></select></label>' +
    '<label>Raça<input name="raca" required></label>' +
    '<label>Tutor<select name="tutor">' + tutores + '</select></label>' +
    '<button class="btn">Cadastrar</button></form></div>' +
    '</div>' +
    '<h2>Pets cadastrados</h2><div class="rolagem"><table>' +
    '<tr><th>Pet</th><th>Espécie / Raça</th><th>Tutor</th><th>Telefone</th><th></th></tr>' + linhas + '</table></div>';
}

function telaProntuario(id) {
  if (db.pets.length == 0) {
    return '<h1>Prontuário</h1><p class="sub">Cadastre um pet para ver o prontuário.</p>';
  }
  var p = achar(db.pets, id);
  if (!p) {
    p = db.pets[0];
  }
  var t = achar(db.tutores, p.tutor);

  var seletor = '';
  for (var i = 0; i < db.pets.length; i++) {
    var marcado = '';
    if (db.pets[i].id == p.id) {
      marcado = ' selected';
    }
    seletor += '<option value="' + db.pets[i].id + '"' + marcado + '>' + escapar(db.pets[i].nome) + '</option>';
  }

  var vacinasDoPet = [];
  for (var j = 0; j < db.vacinas.length; j++) {
    if (db.vacinas[j].pet == p.id) {
      vacinasDoPet.push(j);
    }
  }

  // histórico do pet, do mais novo para o mais antigo
  var historico = [];
  for (var k = 0; k < db.historico.length; k++) {
    if (db.historico[k].pet == p.id) {
      historico.push(db.historico[k]);
    }
  }
  historico.sort(function (a, b) {
    return b.data.localeCompare(a.data);
  });
  var linhaDoTempo = '';
  for (var m = 0; m < historico.length; m++) {
    linhaDoTempo += '<div class="linha"><b>' + historico[m].tipo + '</b> · ' + formatarData(historico[m].data) +
      '<br><small>' + escapar(historico[m].texto) + '</small></div>';
  }

  return '<h1>Prontuário</h1><p class="sub">Consultas, vacinas e banhos no mesmo lugar.</p>' +
    '<label>Pet<select id="selPet">' + seletor + '</select></label>' +
    '<div class="box" style="margin-top:12px"><b>' + escapar(p.nome) + '</b> - ' + escapar(p.especie) + ', ' + escapar(p.raca) +
    '<br><small>Tutor: ' + escapar(t.nome) + ' · ' + escapar(t.tel) + '</small></div>' +
    '<div class="dupla"><div><h2>Vacinas e retornos</h2><div class="box">' + (listaLembretes(vacinasDoPet, false) || 'Nenhum registro.') + '</div></div>' +
    '<div><h2>Linha do tempo</h2><div class="box">' + (linhaDoTempo || 'Sem histórico.') + '</div></div></div>';
}

function telaLembretes() {
  var lista = lembretesProximos();
  return '<h1>Lembretes</h1><p class="sub">Vacinas e retornos que vencem em até 30 dias. O lembrete leva o tutor de volta à agenda.</p>' +
    (listaLembretes(lista, true) || '<div class="box">Nenhum lembrete pendente.</div>') + '<div id="previa"></div>';
}

function telaEquipe() {
  var linhas = '';
  for (var i = 0; i < db.profs.length; i++) {
    var p = db.profs[i];
    var qtd = 0;
    for (var j = 0; j < db.ag.length; j++) {
      if (db.ag[j].prof == p.id) {
        qtd++;
      }
    }
    linhas += '<tr><td>' + escapar(p.nome) + '</td><td>' + p.funcao + '</td><td>' + escapar(p.obs) + '</td><td>' + qtd + '</td></tr>';
  }
  return '<h1>Equipe</h1><p class="sub">' + db.profs.length + ' profissionais · 2 recepcionistas</p>' +
    '<div class="rolagem"><table><tr><th>Nome</th><th>Função</th><th>Observação</th><th>Atendimentos hoje</th></tr>' + linhas + '</table></div>';
}

// ---------- Navegação ----------
function mostrarTela() {
  var partes = (location.hash.slice(1) || 'dashboard').split('/');
  var nome = partes[0];
  var html = '';

  if (nome == 'agenda') {
    html = telaAgenda();
  } else if (nome == 'cadastros') {
    html = telaCadastros();
  } else if (nome == 'prontuario') {
    html = telaProntuario(partes[1]);
  } else if (nome == 'lembretes') {
    html = telaLembretes();
  } else if (nome == 'equipe') {
    html = telaEquipe();
  } else {
    nome = 'dashboard';
    html = telaDashboard();
  }
  document.getElementById('app').innerHTML = html;

  var links = document.querySelectorAll('nav a');
  for (var i = 0; i < links.length; i++) {
    if (links[i].hash == '#' + nome) {
      links[i].classList.add('on');
    } else {
      links[i].classList.remove('on');
    }
  }
  ligarEventos();
}

function mostrarAviso(texto, ok) {
  var msg = document.getElementById('msg');
  msg.className = ok ? 'msg ok' : 'msg erro';
  msg.textContent = texto;
}

// ---------- Eventos (formulários e botões) ----------
function ligarEventos() {
  var i;

  // agendar
  var fAg = document.getElementById('fAg');
  if (fAg) {
    fAg.onsubmit = function (e) {
      e.preventDefault();
      var petId = Number(fAg.pet.value);
      var profId = Number(fAg.prof.value);
      var tipo = fAg.tipo.value;
      var hora = fAg.hora.value;
      var profissional = achar(db.profs, profId);

      if (!achar(db.pets, petId)) {
        mostrarAviso('Cadastre um pet antes de agendar.', false);
        return;
      }
      if (TIPOS[tipo] != profissional.funcao) {
        mostrarAviso(tipo + ' deve ser feito por ' + TIPOS[tipo] + '.', false);
        return;
      }
      if (acharAgendamento(profId, hora)) {
        mostrarAviso('Conflito: ' + profissional.nome + ' já tem atendimento às ' + hora + '.', false);
        return;
      }
      for (var n = 0; n < db.ag.length; n++) {
        if (db.ag[n].pet == petId && db.ag[n].hora == hora) {
          mostrarAviso('Conflito: ' + achar(db.pets, petId).nome + ' já está agendado às ' + hora + '.', false);
          return;
        }
      }
      db.ag.push({id: proximoId(db.ag), pet: petId, prof: profId, hora: hora, tipo: tipo, status: 'Agendado'});
      salvar();
      mostrarTela();
      mostrarAviso('Agendamento criado sem conflitos.', true);
    };

    // clicar em "+ livre" preenche o formulário
    var livres = document.querySelectorAll('.livre');
    for (i = 0; i < livres.length; i++) {
      livres[i].onclick = function () {
        fAg.prof.value = this.dataset.p;
        fAg.hora.value = this.dataset.h;
        fAg.scrollIntoView();
      };
    }

    // clicar em um atendimento muda o status
    var atendimentos = document.querySelectorAll('.ag');
    for (i = 0; i < atendimentos.length; i++) {
      atendimentos[i].onclick = function () {
        var a = achar(db.ag, this.dataset.ag);
        var posicao = STATUS.indexOf(a.status);
        a.status = STATUS[(posicao + 1) % STATUS.length];
        atualizarHistorico(a);
        salvar();
        mostrarTela();
      };
    }
  }

  // novo tutor
  var fTutor = document.getElementById('fTutor');
  if (fTutor) {
    fTutor.onsubmit = function (e) {
      e.preventDefault();
      var nome = fTutor.nome.value.trim();
      var tel = fTutor.tel.value.trim();
      if (nome == '' || tel == '') {
        return;
      }
      db.tutores.push({id: proximoId(db.tutores), nome: nome, tel: tel});
      salvar();
      mostrarTela();
    };
  }

  // novo pet
  var fPet = document.getElementById('fPet');
  if (fPet) {
    fPet.onsubmit = function (e) {
      e.preventDefault();
      var nome = fPet.nome.value.trim();
      var raca = fPet.raca.value.trim();
      var tutorId = Number(fPet.tutor.value);
      if (nome == '' || raca == '' || !achar(db.tutores, tutorId)) {
        return;
      }
      db.pets.push({id: proximoId(db.pets), nome: nome, especie: fPet.especie.value, raca: raca, tutor: tutorId});
      salvar();
      mostrarTela();
    };
  }

  // trocar o pet no prontuário
  var selPet = document.getElementById('selPet');
  if (selPet) {
    selPet.onchange = function () {
      location.hash = '#prontuario/' + selPet.value;
    };
  }

  // enviar lembrete (a mensagem é só uma simulação)
  var botoes = document.querySelectorAll('[data-lem]');
  for (i = 0; i < botoes.length; i++) {
    botoes[i].onclick = function () {
      var v = db.vacinas[this.dataset.lem];
      var p = achar(db.pets, v.pet);
      var primeiroNome = achar(db.tutores, p.tutor).nome.split(' ')[0];
      v.enviado = true;
      salvar();
      var mensagem = 'Olá, ' + primeiroNome + '! Aqui é a PetVida. O item "' + v.nome + '" do(a) ' + p.nome +
        ' é para ' + formatarData(v.proxima) + '. Responda esta mensagem para escolher o melhor horário!';
      mostrarTela();
      document.getElementById('previa').innerHTML = '<h2>Mensagem enviada (simulação)</h2><div class="zap">' + escapar(mensagem) + '</div>';
    };
  }
}

window.onload = function () {
  document.getElementById('reset').onclick = function () {
    if (confirm('Voltar aos dados de demonstração? Suas alterações serão perdidas.')) {
      db = copiaDemo();
      salvar();
      mostrarTela();
    }
  };
  window.onhashchange = mostrarTela;
  mostrarTela();
};

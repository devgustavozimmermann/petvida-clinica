// Dados fictícios para demonstração.
// A função dia() devolve a data de hoje somada a um número de dias (assim a demo funciona em qualquer data).
function dia(off) {
  const x = new Date();
  x.setDate(x.getDate() + off);
  return x.toLocaleDateString('sv-SE'); // formato AAAA-MM-DD
}

const HORAS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
const TIPOS = {Consulta:'Veterinário', Vacina:'Veterinário', Cirurgia:'Veterinário', Banho:'Tosador', Tosa:'Tosador'};
const STATUS = ['Agendado','Confirmado','Concluído'];

const DADOS = {
  profs: [
    {id:1, nome:'Dr. Gabriel Santos', funcao:'Veterinário', obs:'Sócio-fundador'},
    {id:2, nome:'Dra. Camila Paes', funcao:'Veterinário', obs:'Sócia-fundadora'},
    {id:3, nome:'Dr. Rafael Lima', funcao:'Veterinário', obs:'Plantonista'},
    {id:4, nome:'Dra. Juliana Costa', funcao:'Veterinário', obs:'Plantonista'},
    {id:5, nome:'Marcos', funcao:'Tosador', obs:'Banho e tosa'},
    {id:6, nome:'Paula', funcao:'Tosador', obs:'Banho e tosa'},
    {id:7, nome:'Diego', funcao:'Tosador', obs:'Banho e tosa'}
  ],
  tutores: [
    {id:1, nome:'Ana Beatriz Souza', tel:'(41) 99111-2233'},
    {id:2, nome:'Carlos Mendes', tel:'(41) 99222-3344'},
    {id:3, nome:'Fernanda Rocha', tel:'(41) 99333-4455'},
    {id:4, nome:'João Pedro Alves', tel:'(41) 99444-5566'}
  ],
  pets: [
    {id:1, nome:'Thor', especie:'Cão', raca:'Golden Retriever', tutor:1},
    {id:2, nome:'Mel', especie:'Cão', raca:'Shih-tzu', tutor:2},
    {id:3, nome:'Bolinha', especie:'Gato', raca:'SRD', tutor:3},
    {id:4, nome:'Rex', especie:'Cão', raca:'Pastor Alemão', tutor:4},
    {id:5, nome:'Luna', especie:'Gato', raca:'Siamês', tutor:1}
  ],
  ag: [
    {id:1, pet:1, prof:1, hora:'08:00', tipo:'Consulta', status:'Concluído'},
    {id:2, pet:2, prof:5, hora:'08:00', tipo:'Banho', status:'Concluído'},
    {id:3, pet:3, prof:2, hora:'09:00', tipo:'Vacina', status:'Confirmado'},
    {id:4, pet:4, prof:6, hora:'09:00', tipo:'Tosa', status:'Confirmado'},
    {id:5, pet:2, prof:7, hora:'10:00', tipo:'Tosa', status:'Agendado'},
    {id:6, pet:5, prof:3, hora:'10:00', tipo:'Consulta', status:'Confirmado'},
    {id:7, pet:1, prof:5, hora:'11:00', tipo:'Banho', status:'Agendado'},
    {id:8, pet:4, prof:1, hora:'14:00', tipo:'Cirurgia', status:'Confirmado'},
    {id:9, pet:3, prof:6, hora:'15:00', tipo:'Banho', status:'Agendado'}
  ],
  vacinas: [
    {pet:1, nome:'V10', proxima:dia(-5), enviado:false},
    {pet:1, nome:'Antirrábica', proxima:dia(120), enviado:false},
    {pet:2, nome:'V10', proxima:dia(200), enviado:false},
    {pet:3, nome:'V4 Felina', proxima:dia(6), enviado:false},
    {pet:4, nome:'Antirrábica', proxima:dia(18), enviado:false},
    {pet:5, nome:'V4 Felina', proxima:dia(25), enviado:false},
    {pet:2, nome:'Retorno de banho (a cada 15 dias)', proxima:dia(2), enviado:false}
  ],
  historico: [
    {pet:1, data:dia(-370), tipo:'Vacina', texto:'V10 aplicada. Sem reações.'},
    {pet:1, data:dia(-60), tipo:'Consulta', texto:'Dermatite leve; prescrito shampoo medicado.'},
    {pet:1, data:dia(-20), tipo:'Banho', texto:'Banho com shampoo medicado. Pele melhorando (obs. do tosador).'},
    {pet:2, data:dia(-15), tipo:'Banho', texto:'Banho e tosa higiênica.'},
    {pet:3, data:dia(-350), tipo:'Vacina', texto:'V4 Felina aplicada.'},
    {pet:4, data:dia(-340), tipo:'Vacina', texto:'Antirrábica aplicada.'},
    {pet:4, data:dia(-30), tipo:'Consulta', texto:'Displasia leve; cirurgia agendada.'},
    {pet:5, data:dia(-335), tipo:'Vacina', texto:'V4 Felina aplicada.'},
    {pet:1, data:dia(0), tipo:'Consulta', ag:1, texto:'Atendimento concluído com Dr. Gabriel Santos às 08:00.'},
    {pet:2, data:dia(0), tipo:'Banho', ag:2, texto:'Atendimento concluído com Marcos às 08:00.'}
  ]
};

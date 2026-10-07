**PetVida Clínica
Trabalho da disciplina de Design Profissional, professor Sedenilso Antonio Machado.**

É um sistema web de agendamento e prontuário para a clínica veterinária PetVida.

Link do site no GitHub Pages: 

**Sobre a clínica**

A PetVida é uma clínica veterinária e centro de estética pet de bairro, criada pelo Dr. Gabriel Santos e pela Dra. Camila Paes. Eles fazem consultas, vacinas, cirurgias pequenas, banho e tosa. A equipe tem os dois sócios, dois veterinários plantonistas, três tosadores e duas recepcionistas.

**O problema**

Hoje tudo é marcado numa agenda de papel na recepção. Com mais de 30 banhos por dia e consultas no mesmo horário, os horários acabam batendo uns nos outros. Os tutores esquecem a data do banho ou da vacina, e isso deixa buracos na agenda que ninguém consegue preencher a tempo. A recepção ainda perde tempo procurando o histórico dos animais em pastas de papel. A ideia do trabalho é juntar o cuidado estético com o histórico de saúde do pet.

O problema está dentro da clínica, na recepção, O sistema abre em qualquer navegador, sem instalar nada, e a recepção, os veterinários e os tosadores usam a mesma tela. O contato com o tutor fica por conta dos lembretes, que no trabalho são só uma simulação de mensagem de WhatsApp.

**O que o sistema faz**

A agenda mostra veterinários e tosadores juntos, e não deixa marcar dois atendimentos para o mesmo profissional no mesmo horário, nem o mesmo pet em dois lugares ao mesmo tempo. Consulta, vacina e cirurgia só podem ser marcadas com veterinário, e banho e tosa só com tosador. Os horários vagos aparecem com o botão "+ livre", e clicar em um atendimento muda o status entre agendado, confirmado e concluído.
Quando um atendimento é concluído ele entra sozinho no prontuário do pet, junto com as consultas e vacinas. Na tela de lembretes aparecem as vacinas e retornos que vencem em até 30 dias, com uma mensagem pronta para o tutor. Também tem cadastro de tutores e pets, uma tela da equipe e um dashboard com a ocupação dos profissionais, os horários livres e os lembretes que faltam enviar.

**Telas**

Dashboard:
![Dashboard](docs/dashboard.png)
Agenda, com o aviso de conflito de horário:
![Agenda](docs/agenda.png)
Tutores e pets:
![Tutores e Pets](docs/cadastros.png)
Prontuário:
![Prontuário](docs/prontuario.png)
Lembretes:
![Lembretes](docs/lembretes.png)
Equipe:
![Equipe](docs/equipe.png)

**Como foi feito**

Usei só HTML, CSS e JavaScript, sem biblioteca nenhuma e sem backend. Os dados eu inventei e ficam no arquivo `js/data.js`. Quando o usuário cadastra ou muda alguma coisa, o sistema salva no localStorage do navegador. É uma página só, e o menu troca de tela usando o `#` do endereço.
```
petvida-clinica/
├── index.html      estrutura da página e menu
├── css/style.css   visual
├── js/data.js      dados de exemplo
├── js/app.js       telas e regras do sistema
├── docs/           prints das telas
├── .gitignore
├── LICENSE
└── README.md
```
**Como abrir**
Não precisa instalar nada. Basta baixar o projeto e abrir o `index.html` no navegador. Para publicar, vá em Settings, Pages, escolha "Deploy from a branch", branch `main` e pasta `/ (root)`. O botão "Restaurar demo" no menu volta os dados para o começo.

**Segurança**

O projeto não tem senha, token nem chave de API, nem no código nem nos commits, e todos os dados são inventados. O texto digitado nos formulários é tratado antes de aparecer na tela. Num sistema de verdade seria preciso ter login, banco de dados e controle de acesso.

**Licença**

Licença MIT, veja o arquivo LICENSE.

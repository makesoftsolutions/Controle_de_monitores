function submitForm(data,path) {
  const apiUrl = 'http://localhost:3000/api/' + path;

  axios.post(apiUrl, data)
      .then(response => {
          alert('Cadastro concluído com sucesso!');
          clearForm();
      })
      .catch(error => {
          alert('Erro ao cadastrar: ' + error.response.data.error);
      });
}

let salvaStudents = []
function addStudent() {
  const name = document.getElementById('name').value;
  const rawDate = document.getElementById('date').value;
  const gradeReference = document.getElementById('gradeReference').value.split(',');

  if (!rawDate || isNaN(new Date(rawDate))) {
    alert('Data inválida!');
    return;
  }

  const formattedDate = new Date(rawDate).toISOString();
  const studentData = {
      name,
      date: [formattedDate],
      gradeReference: gradeReference.map(reference => Number(reference.trim()))
  }; 

  salvaStudents.push(studentData);
  
}

function showPopup(studentData, index) {
  const popupContent = document.getElementById('popup-content');
  popupContent.innerHTML = `
      <strong>Nome:</strong> ${studentData.name} - 
      <strong>Data:</strong> ${studentData.date} - 
      <strong>Referências de Grade:</strong> ${studentData.gradeReference.join(', ')}
      <p class="warning-message">Após cadastrar, não será mais possível editar ou excluir.</p>
      <p>  
      Para manter o controle da limpeza, organização e orientação dos alunos, é necessário limitar o número de pessoas
      dentro do laboratório.
      <strong>REGRAS:</strong>
      <ol>
        <li>Não é permitido marcar horário para estudo, laboratório não é lugar para estudar, é local de fazer projetos.</li>
        <li>Poderá ser marcado no mesmo horário um máximo de 8 pessoas, de acordo com o número de cadeiras.</li>
        <li>Os horários disponíveis são de acordo com a disponibilidade dos monitores.</li>
        <li>Cada marcação terá duração de uma hora, portanto, se atente em marcar mais horários caso queira ficar um tempo maior.</li>
        <li>É necessário que cada pessoa marque individualmente, para que não extrapole o limite de pessoas no laboratório.</li>
        <li>O aluno que abusar do horários de marcação, por exemplo marcar inúmeros horários desnecessariamente ou marcar
          horário para ficar ocioso no laboratório, estará sujeito a punição de restrição temporária.</li>
        <li>É imprescindível seguir as orientações do monitores, casos de desrespeito serão punidos perante as regras do
          campus.</li>
        <li>Todos os materiais utilizados deverão ser guardados no local que estavam, caso esteja fora, peça auxílio a algum
          monitor.</li>
      </ol>
    </p>
      <button onclick="removeStudent(${index})">Remover </button>
      <button onclick="cadastrarStudent()">Cadastrar</button>
      <button type="button" onclick="closePopup()">Fechar</button>
  `;

  const popup = document.getElementById('popup');
  popup.style.display = 'block';
}

function cadastrarStudent() {
  const latestStudentIndex = salvaStudents.length - 1;
  const latestStudentData = salvaStudents[latestStudentIndex];
  submitForm(latestStudentData,'students');
  closePopup(); 
  localStorage.setItem('form', 'student');
  window.location.reload()
}

function removeStudent(index) {
  salvaStudents.splice(index, 1);
  alert('Estudante removido com sucesso!');
  clearForm();
  console.log(salvaStudents);
}

function closePopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('date').value = '';
    document.getElementById('gradeReference').value = '';
}

function getCurrentDate() {
  const today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  const currentDate = today.getFullYear() + '-' + month + '-' + day;
  return currentDate;
}

function getNextDayOfWeek(dayOfWeek,id) {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const daysUntilNextDay = (dayOfWeek + 7 - currentDayOfWeek) % 7;

  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + daysUntilNextDay);

  document.getElementById(id).innerText = "-  " + nextDay.getDate() + " / " + (nextDay.getMonth() + 1)
}

window.onload = ()=>{

  var daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  const currentDayIndex = new Date().getDay() -1
  const adjustedIndex = currentDayIndex < 0 ? 4 : currentDayIndex
  daysOfWeek = [
    ...daysOfWeek.slice(adjustedIndex),
    ...daysOfWeek.slice(0, adjustedIndex)
  ];

  const dict = {
    'Segunda': 'monday',
    'Terça': 'tuesday',
    'Quarta': 'wednesday',
    'Quinta': 'thursday',
    'Sexta': 'friday'
  }
  
  daysOfWeek.forEach(day => {

    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('day-header');

    const dayParagraph = document.createElement('p');
    dayParagraph.textContent = day;
    headerDiv.appendChild(dayParagraph);

    const headerDateDiv = document.createElement('div');
    headerDateDiv.id = `${dict[day]}`;

    const StudentsListDiv = document.createElement('div');
    StudentsListDiv.id = `${dict[day]}-list`;
    StudentsListDiv.classList.add('students-list')
    
    dayDiv.appendChild(headerDiv);
    headerDiv.appendChild(headerDateDiv);
    dayDiv.appendChild(StudentsListDiv)

    document.getElementById("week").appendChild(dayDiv);
  });

  getNextDayOfWeek(1,"monday");
  getNextDayOfWeek(2, 'tuesday');
  getNextDayOfWeek(3, 'wednesday');
  getNextDayOfWeek(4, 'thursday');
  getNextDayOfWeek(5, 'friday');
}
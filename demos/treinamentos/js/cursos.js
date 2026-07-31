document.addEventListener('click',event=>{
  const edit=event.target.closest('[data-edit="cursos"]');
  if(!edit)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openCourseModal(edit.dataset.id);
},true);

document.querySelectorAll('[data-course-close]').forEach(button=>button.addEventListener('click',closeCourseModal));
document.querySelector('#courseModal').addEventListener('click',event=>{if(event.target.id==='courseModal')closeCourseModal()});
document.querySelector('#courseHasEvaluation').addEventListener('change',toggleCourseQuestions);
document.querySelector('#addCourseQuestion').addEventListener('click',()=>{
  readCourseQuestions();
  courseQuestions.push({question:'',a:'',b:'',c:'',d:'',correct:'A'});
  renderCourseQuestions();
});

document.querySelector('#courseForm').addEventListener('submit',event=>{
  event.preventDefault();
  readCourseQuestions();
  const processes=[...document.querySelector('#courseProcesses').selectedOptions].map(option=>option.value);
  if(!processes.length){toast('Selecione ao menos um processo');return}
  if(document.querySelector('#courseHasEvaluation').checked&&!courseQuestions.length){toast('Adicione ao menos uma questão para a avaliação');return}
  const id=Number(document.querySelector('#courseId').value);
  const previous=id?data.cursos.find(course=>course.id===id):null;
  const workload=document.querySelector('#courseWorkload').value.trim();
  const item={
    id:id||Date.now(),
    code:document.querySelector('#courseCode').value.trim(),
    name:document.querySelector('#courseName').value.trim(),
    revision:document.querySelector('#courseRevision').value.trim(),
    category:document.querySelector('#courseCategory').value,
    country:document.querySelector('#courseCountry').value,
    processes,
    description:document.querySelector('#courseDescription').value.trim(),
    objectives:document.querySelector('#courseObjectives').value.trim(),
    workload,
    instructor:document.querySelector('#courseInstructor').value.trim(),
    detail:`${processes.length} processo${processes.length>1?'s':''} · ${workload}`,
    status:previous?.status||'Ativo',
    hasEvaluation:document.querySelector('#courseHasEvaluation').checked,
    questions:document.querySelector('#courseHasEvaluation').checked?courseQuestions:[]
  };
  if(id)data.cursos=data.cursos.map(course=>course.id===id?item:course);
  else data.cursos.push(item);
  closeCourseModal();
  render();
  toast('Curso salvo temporariamente');
});

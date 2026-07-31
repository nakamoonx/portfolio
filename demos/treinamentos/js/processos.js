const originalRender=render;
let processDeleteId=null;
const editIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
const deleteIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
const documentIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';

function processesPage(){
  return wrap(`<div class="cursos-banner">ⓘ ${lang==='pt'?'Gerencie os processos da organização. Eles associam grupos de colaboradores a treinamentos específicos.':'Gestiona los procesos de la organización y sus formaciones.'}</div><div class="process-search search-container"><div class="search-wrapper"><span>⌕</span><input id="processSearch" placeholder="${lang==='pt'?'Pesquisar por código ou nome do processo...':'Buscar por código o nombre del proceso...'}"></div></div><section class="panel"><div class="section-head"><h2>${lang==='pt'?'Processos cadastrados':'Procesos registrados'}</h2><span class="process-counter" id="processCounter">${data.processos.length} processos</span></div><div class="process-grid" id="processGrid">${processCards(data.processos)}</div></section>`);
}

function processCards(items){
  if(!items.length)return `<div class="process-empty"><h3>Nenhum processo encontrado</h3><p>Crie um processo ou altere o termo pesquisado.</p></div>`;
  return items.map((item,index)=>`<article class="process-card"><div class="process-card-head"><span class="entity-number">${index+1}</span><h3>${item.name}</h3><div class="process-card-actions"><button data-process-edit="${item.id}" title="Editar">${editIcon}</button><button data-process-delete="${item.id}" title="Excluir">${deleteIcon}</button></div></div><div class="process-card-body"><div class="process-code-row"><span>${documentIcon}${lang==='pt'?'Código do processo':'Código del proceso'}</span><strong>${item.code}</strong></div></div></article>`).join('');
}

function bindProcessesPage(){
  document.querySelector('#pageTitle').textContent=lang==='pt'?'Gerenciamento de Processos':'Gestión de Procesos';
  document.querySelector('.page-icon svg').innerHTML='<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>';
  const action=document.querySelector('#pageAction');
  action.textContent=lang==='pt'?'+ Criar processo':'+ Crear proceso';
  action.onclick=()=>openProcessModal();
  document.querySelectorAll('[data-process-edit]').forEach(button=>button.onclick=()=>openProcessModal(button.dataset.processEdit));
  document.querySelectorAll('[data-process-delete]').forEach(button=>button.onclick=()=>{processDeleteId=Number(button.dataset.processDelete);document.querySelector('#deleteProcessModal').classList.add('show')});
  const search=document.querySelector('#processSearch');
  search.oninput=()=>{
    const query=search.value.trim().toLowerCase();
    const filtered=data.processos.filter(item=>`${item.code} ${item.name}`.toLowerCase().includes(query));
    document.querySelector('#processGrid').innerHTML=processCards(filtered);
    document.querySelector('#processCounter').textContent=`${filtered.length} processos`;
    document.querySelectorAll('[data-process-edit]').forEach(button=>button.onclick=()=>openProcessModal(button.dataset.processEdit));
    document.querySelectorAll('[data-process-delete]').forEach(button=>button.onclick=()=>{processDeleteId=Number(button.dataset.processDelete);document.querySelector('#deleteProcessModal').classList.add('show')});
  };
}

render=function(){
  originalRender();
  if(page!=='processos')return;
  content.innerHTML=processesPage();
  applyLang();
  bindProcessesPage();
};

function openProcessModal(id){
  const item=id?data.processos.find(process=>process.id===Number(id)):null;
  document.querySelector('#processId').value=id||'';
  document.querySelector('#processCode').value=item?.code||'';
  document.querySelector('#processName').value=item?.name||'';
  document.querySelector('#processModalTitle').textContent=item?'Editar Processo':'Criar Processo';
  document.querySelector('#processModal').classList.add('show');
  document.querySelector('#processName').focus();
}
function closeProcessModal(){document.querySelector('#processModal').classList.remove('show');document.querySelector('#processForm').reset()}

document.querySelectorAll('[data-process-close]').forEach(button=>button.onclick=closeProcessModal);
document.querySelector('#processModal').onclick=event=>{if(event.target.id==='processModal')closeProcessModal()};
document.querySelectorAll('[data-process-delete-close]').forEach(button=>button.onclick=()=>{document.querySelector('#deleteProcessModal').classList.remove('show');processDeleteId=null});
document.querySelector('#deleteProcessModal').onclick=event=>{if(event.target.id==='deleteProcessModal'){event.target.classList.remove('show');processDeleteId=null}};
document.querySelector('#confirmDeleteProcess').onclick=()=>{
  data.processos=data.processos.filter(process=>process.id!==processDeleteId);
  processDeleteId=null;
  document.querySelector('#deleteProcessModal').classList.remove('show');
  render();
  toast('Processo removido temporariamente');
};
document.querySelector('#processForm').onsubmit=event=>{
  event.preventDefault();
  const id=Number(document.querySelector('#processId').value);
  const name=document.querySelector('#processName').value.trim();
  const nextCode=String(Math.max(0,...data.processos.map(process=>Number(process.code)||0))+1).padStart(4,'0');
  const previous=id?data.processos.find(process=>process.id===id):null;
  const item={id:id||Date.now(),code:previous?.code||nextCode,name,detail:previous?.detail||'0 participantes',status:previous?.status||'Em andamento'};
  if(id)data.processos=data.processos.map(process=>process.id===id?item:process);
  else data.processos.push(item);
  closeProcessModal();
  render();
  toast('Processo salvo temporariamente');
};

render();

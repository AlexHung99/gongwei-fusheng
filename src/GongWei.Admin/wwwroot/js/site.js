document.querySelector('[data-sidebar-toggle]')?.addEventListener('click',()=>document.querySelector('#sidebar')?.classList.toggle('open'));

document.querySelectorAll('[data-confirm]').forEach(form=>form.addEventListener('submit',event=>{if(!window.confirm(form.dataset.confirm))event.preventDefault()}));

function filterRows(control){const panel=control.closest('.panel');const target=panel?.querySelector('[data-filter-target]')??document.querySelector('[data-filter-target]');const rows=[...(target?.querySelectorAll('tr,.rank-option-row')??[])];const term=(panel?.querySelector('[data-table-filter]')?.value??'').trim().toLowerCase();const role=panel?.querySelector('[data-rank-role-filter]')?.value??'';rows.forEach(row=>row.hidden=!(row.textContent.toLowerCase().includes(term)&&(!role||row.dataset.role===role)));const count=panel?.querySelector('[data-filter-count]');if(count){const total=Number(count.dataset.total??rows.length);count.textContent=`顯示 ${rows.filter(row=>!row.hidden).length} / ${total} 個位號`}}

document.querySelectorAll('[data-table-filter]').forEach(input=>input.addEventListener('input',()=>filterRows(input)));
document.querySelectorAll('[data-rank-role-filter]').forEach(select=>select.addEventListener('change',()=>filterRows(select)));

function setupRankTable(){
  const root=document.querySelector('[data-rank-table]');
  const searchForm=document.querySelector('[data-rank-search-form]');
  if(!root||!searchForm)return;

  const records=[...root.querySelectorAll('[data-rank-record]')];
  const editors=new Map([...root.querySelectorAll('[data-rank-editor-for]')].map(row=>[row.dataset.rankEditorFor,row]));
  const count=root.querySelector('[data-rank-result-count]');
  const pageSummary=root.querySelector('[data-rank-page-summary]');
  const pagination=root.querySelector('[data-rank-pagination]');
  const pageSizeControl=root.querySelector('[data-rank-page-size]');
  const empty=root.querySelector('[data-rank-empty]');
  let matching=records;
  let currentPage=1;

  function closeEditors(exceptId){
    editors.forEach((editor,id)=>{
      if(id===exceptId)return;
      editor.hidden=true;
      root.querySelector(`[data-rank-edit-toggle="${CSS.escape(id)}"]`)?.setAttribute('aria-expanded','false');
    });
  }

  function currentCriteria(){
    const data=new FormData(searchForm);
    return {
      role:String(data.get('role')??''),
      grade:String(data.get('grade')??''),
      active:String(data.get('active')??''),
      application:String(data.get('application')??''),
      keyword:String(data.get('keyword')??'').trim().toLowerCase()
    };
  }

  function renderPagination(totalPages){
    pagination.replaceChildren();
    if(totalPages<=1)return;
    const addButton=(label,page,active=false,disabled=false)=>{
      const button=document.createElement('button');
      button.type='button';button.textContent=label;button.disabled=disabled;
      button.className=active?'active':'';
      button.setAttribute('aria-label',label===String(page)?`第 ${page} 頁`:label);
      button.addEventListener('click',()=>{currentPage=page;applyFilters(false);root.scrollIntoView({behavior:'smooth',block:'start'})});
      pagination.append(button);
    };
    addButton('上一頁',Math.max(1,currentPage-1),false,currentPage===1);
    const start=Math.max(1,Math.min(currentPage-2,totalPages-4));
    const end=Math.min(totalPages,start+4);
    for(let page=start;page<=end;page++)addButton(String(page),page,page===currentPage);
    addButton('下一頁',Math.min(totalPages,currentPage+1),false,currentPage===totalPages);
  }

  function applyFilters(resetPage=true){
    if(resetPage)currentPage=1;
    const criteria=currentCriteria();
    matching=records.filter(row=>(!criteria.role||row.dataset.role===criteria.role)
      &&(!criteria.grade||row.dataset.grade===criteria.grade)
      &&(!criteria.active||row.dataset.active===criteria.active)
      &&(!criteria.application||row.dataset.application===criteria.application)
      &&(!criteria.keyword||row.dataset.search.toLowerCase().includes(criteria.keyword)));
    const pageSize=Number(pageSizeControl.value)||20;
    const totalPages=Math.max(1,Math.ceil(matching.length/pageSize));
    currentPage=Math.min(currentPage,totalPages);
    const visibleIds=new Set(matching.slice((currentPage-1)*pageSize,currentPage*pageSize).map(row=>row.dataset.id));
    records.forEach(row=>{
      row.hidden=!visibleIds.has(row.dataset.id);
      if(row.hidden){const editor=editors.get(row.dataset.id);if(editor)editor.hidden=true}
    });
    count.textContent=`符合 ${matching.length} / ${records.length} 個位號`;
    const first=matching.length?(currentPage-1)*pageSize+1:0;
    const last=Math.min(currentPage*pageSize,matching.length);
    pageSummary.textContent=`顯示 ${first}–${last} 筆，共 ${matching.length} 筆`;
    empty.hidden=matching.length!==0;
    renderPagination(totalPages);
  }

  searchForm.addEventListener('submit',event=>{event.preventDefault();closeEditors();applyFilters()});
  searchForm.addEventListener('reset',()=>setTimeout(()=>{closeEditors();applyFilters()},0));
  pageSizeControl.addEventListener('change',()=>applyFilters());
  searchForm.querySelector('[name="keyword"]')?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();searchForm.requestSubmit()}});

  root.addEventListener('click',event=>{
    const toggle=event.target.closest('[data-rank-edit-toggle]');
    const cancel=event.target.closest('[data-rank-edit-cancel]');
    if(!toggle&&!cancel)return;
    const id=(toggle?.dataset.rankEditToggle??cancel?.dataset.rankEditCancel);
    const editor=editors.get(id);
    if(!editor)return;
    if(cancel){editor.hidden=true;root.querySelector(`[data-rank-edit-toggle="${CSS.escape(id)}"]`)?.setAttribute('aria-expanded','false');return}
    const willOpen=editor.hidden;
    closeEditors(willOpen?id:undefined);
    editor.hidden=!willOpen;
    toggle.setAttribute('aria-expanded',String(willOpen));
    if(willOpen)editor.scrollIntoView({behavior:'smooth',block:'nearest'});
  });

  applyFilters();
}

setupRankTable();

function renumberEffects(form){form.querySelectorAll('[data-effect-rows] .effect-row').forEach((row,index)=>{row.querySelectorAll('[name],[data-field]').forEach(field=>{const key=field.dataset.field??field.name.split('.').pop();field.name=`Effects[${index}].${key}`})})}

function syncEffectCode(row){const type=row.querySelector('[data-effect-type]')?.value;const code=row.querySelector('[data-effect-code]');if(!type||!code)return;const options=[...code.options];options.forEach(option=>option.hidden=option.dataset.effectType!==type);if(code.selectedOptions[0]?.hidden){const first=options.find(option=>!option.hidden);if(first)code.value=first.value}}

document.querySelectorAll('.effect-row').forEach(syncEffectCode);

document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add-effect]');
  if(add){const form=add.closest('[data-effect-form]');const template=document.querySelector('#effect-row-template');form.querySelector('[data-effect-rows]').append(template.content.cloneNode(true));renumberEffects(form);syncEffectCode(form.querySelector('[data-effect-rows] .effect-row:last-child'));return}
  const remove=event.target.closest('[data-remove-effect]');
  if(remove){const form=remove.closest('[data-effect-form]');if(form.querySelectorAll('.effect-row').length<=1){window.alert('每支籤至少需要一項效果。');return}remove.closest('.effect-row').remove();renumberEffects(form)}
});

document.addEventListener('change',event=>{if(event.target.matches('[data-effect-type]'))syncEffectCode(event.target.closest('.effect-row'))});

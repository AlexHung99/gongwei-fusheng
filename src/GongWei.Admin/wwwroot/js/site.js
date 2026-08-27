document.querySelector('[data-sidebar-toggle]')?.addEventListener('click',()=>document.querySelector('#sidebar')?.classList.toggle('open'));

document.querySelectorAll('[data-confirm]').forEach(form=>form.addEventListener('submit',event=>{if(!window.confirm(form.dataset.confirm))event.preventDefault()}));

function filterRows(control){const panel=control.closest('.panel');const target=panel?.querySelector('[data-filter-target]')??document.querySelector('[data-filter-target]');const rows=[...(target?.querySelectorAll('tr,.rank-option-row')??[])];const term=(panel?.querySelector('[data-table-filter]')?.value??'').trim().toLowerCase();const role=panel?.querySelector('[data-rank-role-filter]')?.value??'';rows.forEach(row=>row.hidden=!(row.textContent.toLowerCase().includes(term)&&(!role||row.dataset.role===role)));const count=panel?.querySelector('[data-filter-count]');if(count){const total=Number(count.dataset.total??rows.length);count.textContent=`顯示 ${rows.filter(row=>!row.hidden).length} / ${total} 個位號`}}

document.querySelectorAll('[data-table-filter]').forEach(input=>input.addEventListener('input',()=>filterRows(input)));
document.querySelectorAll('[data-rank-role-filter]').forEach(select=>select.addEventListener('change',()=>filterRows(select)));

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

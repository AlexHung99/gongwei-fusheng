document.querySelector('[data-sidebar-toggle]')?.addEventListener('click',()=>document.querySelector('#sidebar')?.classList.toggle('open'));

document.querySelectorAll('[data-confirm]').forEach(form=>form.addEventListener('submit',event=>{if(!window.confirm(form.dataset.confirm))event.preventDefault()}));

document.querySelectorAll('[data-table-filter]').forEach(input=>input.addEventListener('input',()=>{const target=input.closest('.panel')?.querySelector('[data-filter-target]')??document.querySelector('[data-filter-target]');const rows=target?.querySelectorAll('tr,.rank-option-row')??[];const term=input.value.trim().toLowerCase();rows.forEach(row=>row.hidden=!row.textContent.toLowerCase().includes(term))}));

function renumberEffects(form){form.querySelectorAll('[data-effect-rows] .effect-row').forEach((row,index)=>{row.querySelectorAll('[name],[data-field]').forEach(field=>{const key=field.dataset.field??field.name.split('.').pop();field.name=`Effects[${index}].${key}`})})}

document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add-effect]');
  if(add){const form=add.closest('[data-effect-form]');const template=document.querySelector('#effect-row-template');form.querySelector('[data-effect-rows]').append(template.content.cloneNode(true));renumberEffects(form);return}
  const remove=event.target.closest('[data-remove-effect]');
  if(remove){const form=remove.closest('[data-effect-form]');if(form.querySelectorAll('.effect-row').length<=1){window.alert('每支籤至少需要一項效果。');return}remove.closest('.effect-row').remove();renumberEffects(form)}
});

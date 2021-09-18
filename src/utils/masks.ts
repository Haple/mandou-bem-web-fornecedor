export function cnpj(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 18;
  let value = e.currentTarget.value;
  if (!value.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)) {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    e.currentTarget.value = value;
  }
  return e;
}

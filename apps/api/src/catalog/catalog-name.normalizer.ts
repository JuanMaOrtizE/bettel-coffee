export function normalizeCatalogName(name: string) {
  return name.normalize('NFKC').toLocaleLowerCase('es');
}

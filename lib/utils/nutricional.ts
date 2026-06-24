export function calcularIMC(peso: number, tallaCm: number): number {
  const tallaM = tallaCm / 100;
  return peso / (tallaM * tallaM);
}

export function categoriaIMC(imc: number): string {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25) return "Normal";
  if (imc < 30) return "Sobrepeso";
  return "Obesidad";
}

export function colorIMC(imc: number): string {
  if (imc < 18.5) return "text-blue-500";
  if (imc < 25) return "text-green-500";
  if (imc < 30) return "text-yellow-500";
  return "text-red-500";
}

export function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let age = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) age--;
  return age;
}

export function calcularTDEE(
  peso: number,
  tallaCm: number,
  edad: number,
  sexo: string,
  nivelActividad: string
): number {
  // Mifflin-St Jeor
  const bmr =
    sexo === "masculino"
      ? 10 * peso + 6.25 * tallaCm - 5 * edad + 5
      : 10 * peso + 6.25 * tallaCm - 5 * edad - 161;

  const factores: Record<string, number> = {
    sedentario: 1.2,
    levemente_activo: 1.375,
    moderadamente_activo: 1.55,
    muy_activo: 1.725,
  };

  return Math.round(bmr * (factores[nivelActividad] ?? 1.2));
}

export function relacionCinturaCandera(cintura: number, cadera: number): string {
  return (cintura / cadera).toFixed(2);
}

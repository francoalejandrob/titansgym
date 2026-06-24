export function buildWhatsappLink(phone: string, message: string) {
  const digitsOnly = phone.replace(/[^\d]/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encodedMessage}`;
}

export const defaultWhatsappMessage =
  "Hola Titan's Gym, quiero información sobre membresías 💪";

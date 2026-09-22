export const ALL_CATEGORIES = "Todos"

export const categories = [
  "Adoçantes",
  "Amendoins",
  "Caramelizados",
  "Castanhas de caju",
  "Castanhas do Pará",
  "Chips",
  "Chás e ervas",
  "Drageados",
  "Farináceos",
  "Frutas desidratadas",
  "Mix",
  "Nozes e grãos",
  "Sementes",
  "Temperos e especiarias",
] as const

export type CategoryName = (typeof categories)[number]

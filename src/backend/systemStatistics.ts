// Define interfaces for type safety
interface Program {
  Citizens: Array<any>; // Replace `any` with the specific type for Citizen objects
  Beneficiaries: string | number; // Handles both string and number inputs
}

interface Stock {
  Quantity: string | number; // Handles both string and number inputs
  RemainingStock: string | number; // Handles both string and number inputs
}

// Function to calculate program statistics
const calculateProgramStats = (programs: Program[]) => {
  const totalPrograms = programs.length;

  // Use reduce to calculate totals
  const { totalEnrolled, totalBeneficiaries } = programs.reduce(
    (acc, program) => {
      acc.totalEnrolled += program.Citizens.length;
      acc.totalBeneficiaries += Number(program.Beneficiaries || 0);
      return acc;
    },
    { totalEnrolled: 0, totalBeneficiaries: 0 }
  );

  return {
    totalPrograms,
    totalEnrolled,
    totalBeneficiaries,
  };
};

// Function to calculate stock statistics
const calculateStockStats = (stocks: Stock[]) => {
  const totalStocks = stocks.length;

  // Use reduce to calculate totals
  const { totalQuantity, totalRemaining } = stocks.reduce(
    (acc, stock) => {
      acc.totalQuantity += Number(stock.Quantity || 0);
      acc.totalRemaining += Number(stock.RemainingStock || 0);
      return acc;
    },
    { totalQuantity: 0, totalRemaining: 0 }
  );

  return {
    totalStocks,
    totalQuantity,
    totalRemaining,
  };
};

export { calculateProgramStats, calculateStockStats };

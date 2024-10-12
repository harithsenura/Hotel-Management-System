import express from "express";
import Income from "../models/FinanceStatement.js"; // Use ES module import

const router = express.Router();

// Route to add a new income statement with gross and net profit calculations (Create)
router.route("/add").post((req, res) => {
  const {
    sales,
    costofsales,
    otherincomes,
    deliverycost,
    administrativecost,
    otherexpences,
    financeexpences,
  } = req.body;

  // Calculate gross profit
  const grossprofit = sales - costofsales;

  // Calculate net profit
  const netprofit =
    grossprofit +
    otherincomes - 
    deliverycost - 
    administrativecost - 
    otherexpences - 
    financeexpences;

  const newIncome = new Income({
    sales,
    costofsales,
    grossprofit, // Calculated value
    otherincomes,
    deliverycost,
    administrativecost,
    otherexpences,
    financeexpences,
    netprofit, // Calculated value
  });

  newIncome
    .save()
    .then(() => res.json("Income statement added with calculations"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Route to get all income statements (Read all)
router.route("/").get((req, res) => {
  Income.find()
    .then((incomes) => res.json(incomes))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Route to incrementally update a specific income statement by ID with recalculations (Update)
router.route("/update/:id").put(async (req, res) => {
  const userId = req.params.id;

  try {
    const income = await Income.findById(userId);

    if (!income) {
      return res.status(404).json("Income statement not found");
    }

    // Update the fields if provided in the request body
    income.sales = req.body.sales ? Number(req.body.sales) : income.sales;
    income.costofsales = req.body.costofsales
      ? Number(req.body.costofsales)
      : income.costofsales;
    income.otherincomes = req.body.otherincomes
      ? Number(req.body.otherincomes)
      : income.otherincomes;
    income.deliverycost = req.body.deliverycost
      ? Number(req.body.deliverycost)
      : income.deliverycost;
    income.administrativecost = req.body.administrativecost
      ? Number(req.body.administrativecost)
      : income.administrativecost;
    income.otherexpences = req.body.otherexpences
      ? Number(req.body.otherexpences)
      : income.otherexpences;
    income.financeexpences = req.body.financeexpences
      ? Number(req.body.financeexpences)
      : income.financeexpences;

    // Recalculate gross profit and net profit
    income.grossprofit = income.sales - income.costofsales;
    income.netprofit =
      income.grossprofit +
      income.otherincomes -
      income.deliverycost -
      income.administrativecost -
      income.otherexpences -
      income.financeexpences;

    await income.save();
    res.json("Income statement updated with recalculations");
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

// Route to delete a specific income statement by ID (Delete)
router.route("/delete/:id").delete(async (req, res) => {
  let userId = req.params.id;

  await Income.findByIdAndDelete(userId)
    .then(() => {
      res.status(200).send({ status: "Income statement deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Error with deletion", error: err.message });
    });
});

// Export router using ES modules
export default router;

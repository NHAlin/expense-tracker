$(document).ready(function () {

    /* ==================================================
       APPLICATION SETTINGS
    ================================================== */

    const EXPENSE_STORAGE_KEY = "dailyExpenseTrackerExpenses";

    const YEAR_STORAGE_KEY = "dailyExpenseTrackerSelectedYear";

    let expenses = [];

    const currentYear = new Date().getFullYear();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    /* ==================================================
       HTML ELEMENTS
    ================================================== */

    const expenseFormSection = $("#expenseFormSection");
    const expenseForm = $("#expenseForm");
    const expenseTitle = $("#expenseTitle");
    const expenseAmount = $("#expenseAmount");
    const expenseDate = $("#expenseDate");
    const yearFilter = $("#yearFilter");
    const expenseSearch = $("#expenseSearch");
    const expenseSort = $("#expenseSort");
    const exportCsvButton = $("#exportCsvButton");


    /* ==================================================
       CURRENCY FORMATTING
    ================================================== */

    function formatCurrency(amount) {
        return new Intl.NumberFormat(
            "en-MY",
            {
                style: "currency",
                currency: "MYR",
                minimumFractionDigits: 2
            }
        ).format(amount);
    }

    function formatCompactCurrency(amount) {
        if (amount >= 1000000) {
            return (
                `RM${(amount / 1000000).toFixed(1)}m`
            );
        }

        if (amount >= 1000) {
            return (`RM${(amount / 1000).toFixed(1)}k`
            );
        }

        if (amount % 1 !== 0) {
            return `RM${amount.toFixed(2)}`;
        }

        return `RM${amount.toFixed(0)}`;
    }


    /* ==================================================
       LOCAL STORAGE
    ================================================== */

    function saveExpenses() {
        try {
            localStorage.setItem(
                EXPENSE_STORAGE_KEY,
                JSON.stringify(expenses)
            );
        } catch (error) {
            console.error(
                "Unable to save expenses:",
                error
            );
        }
    }

    function loadExpenses() {
        try {
            const savedData = localStorage.getItem(EXPENSE_STORAGE_KEY);

            if (!savedData) {
                return [];
            }

            const parsedExpenses = JSON.parse(savedData);

            if (!Array.isArray(parsedExpenses)) {
                return [];
            }

            return parsedExpenses
                .filter(function (expense) {
                    return (
                        expense && typeof expense.title === "string" &&
                        expense.title.trim() !== "" &&
                        Number.isFinite(Number(expense.amount)) &&
                        Number(expense.amount) > 0 &&
                        typeof expense.date === "string" &&
                        /^\d{4}-\d{2}-\d{2}$/.test(expense.date)
                    );
                })
                .map(function (expense) {
                    return {
                        id: expense.id || Date.now() + Math.random(),
                        title: expense.title.trim(),
                        amount: Number(expense.amount),
                        date: expense.date
                    };
                });

        } catch (error) {
            console.error("Unable to load expenses:",
                error
            );

            return [];
        }
    }

    function saveSelectedYear(year) {
        try {
            localStorage.setItem(YEAR_STORAGE_KEY, String(year));
        } catch (error) {
            console.error("Unable to save selected year:", error);
        }
    }

    function loadSelectedYear() {
        try {
            const savedYear =
                Number(
                    localStorage.getItem(YEAR_STORAGE_KEY)
                );

            if (
                Number.isInteger(savedYear) && savedYear > 1900
            ) {
                return savedYear;
            }

        } catch (error) {
            console.error("Unable to load selected year:", error);
        }

        return currentYear;
    }


    /* ==================================================
       DATE FUNCTIONS
    ================================================== */

    function getDateInformation(dateValue) {
        const date = new Date(`${dateValue}T00:00:00`);

        return {
            year: date.getFullYear(),
            monthNumber: date.getMonth(),
            monthShort: date.toLocaleDateString("en-MY",
                    {
                        month: "short"
                    }
                ),
            day: date.getDate(),
            fullDate: date.toLocaleDateString("en-MY",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                )
        };
    }

    function setDefaultDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        expenseDate.val(
            `${year}-${month}-${day}`
        );
    }


    /* ==================================================
       OPEN AND CLOSE FORM
    ================================================== */

    function openExpenseForm() {
        expenseFormSection.stop(true, true).slideDown(250);
        setDefaultDate();

        setTimeout(function () {
            expenseTitle.trigger("focus");
        }, 260);
    }

    function clearValidation() {
        expenseForm.find(".is-invalid").removeClass("is-invalid");
    }

    function closeExpenseForm() {
        expenseFormSection.stop(true, true).slideUp(250);
        expenseForm[0].reset();
        clearValidation();
    }


    /* ==================================================
       FORM VALIDATION
    ================================================== */

    function validateTitle() {
        const title = expenseTitle.val().trim();

        if (title === "") {
            expenseTitle.addClass("is-invalid");
            return false;
        }

        expenseTitle.removeClass("is-invalid" );
        return true;
    }

    function validateAmount() {
        const value = expenseAmount.val().trim();
        const amount = Number(value);

        if (value === "" || Number.isNaN(amount) || amount <= 0) {
            expenseAmount.addClass("is-invalid");
            return false;
        }

        expenseAmount.removeClass("is-invalid");
        return true;
    }

    function validateDate() {
        const date = expenseDate.val();

        if (date === "") {
            expenseDate.addClass("is-invalid");
            return false;
        }

        expenseDate.removeClass("is-invalid");
        return true;
    }

    function validateExpenseForm() {
        const isTitleValid = validateTitle();
        const isAmountValid = validateAmount();
        const isDateValid = validateDate();

        return ( isTitleValid && isAmountValid && isDateValid);
    }


    /* ==================================================
       YEAR FILTER
    ================================================== */

    function getSelectedYear() {
        return Number(yearFilter.val());
    }

    function populateYearFilter(preferredYear) {
        const existingSelection = preferredYear || getSelectedYear() || currentYear;
        const availableYears = new Set([currentYear, currentYear - 1, currentYear - 2]);

        expenses.forEach(function (expense) {
                const expenseYear = getDateInformation(expense.date).year;
                availableYears.add(expenseYear);
            }
        );

        const sortedYears = Array.from(availableYears).sort(function (a, b) {
                return b - a;
            });

        yearFilter.empty();
        sortedYears.forEach(function (year) {
                const option = $("<option>").val(year).text(year);
                yearFilter.append(option);
            }
        );

        yearFilter.val(existingSelection);

        if (!yearFilter.val()) {
            yearFilter.val(currentYear);
        }

        updateSelectedYearDisplay();
    }

    function updateSelectedYearDisplay() {
        $("#chartYear").text(getSelectedYear());
    }

    function getFilteredExpenses() {
        const selectedYear = getSelectedYear();

        return expenses.filter(function (expense) {
                return (getDateInformation(expense.date).year === selectedYear);
            }
        );
    }


    /* ==================================================
       SEARCH AND SORTING
    ================================================== */

    function getVisibleExpenses() {
        const searchValue = expenseSearch.val().trim().toLowerCase();
        const sortValue = expenseSort.val();
        let visibleExpenses =  getFilteredExpenses();

        if (searchValue !== "") {
            visibleExpenses = visibleExpenses.filter(function (expense) {
                        return expense.title
                            .toLowerCase()
                            .includes(searchValue);
                    }
                );
        }

        visibleExpenses = [...visibleExpenses];

        if (sortValue === "highest") {
            visibleExpenses.sort(function (a, b) {
                    if (b.amount === a.amount) {
                        return b.date.localeCompare(a.date);
                    }

                    return (b.amount - a.amount);
                }
            );
        } else {
            visibleExpenses.sort(function (a, b) {
                    return b.date.localeCompare(a.date);
                }
            );
        }

        return visibleExpenses;
    }


    /* ==================================================
       MONTHLY TOTALS
    ================================================== */

    function calculateMonthlyTotals(filteredExpenses) {
        const monthlyTotals = Array(12).fill(0);

        filteredExpenses.forEach(function (expense) {
                const monthNumber = getDateInformation(expense.date).monthNumber;

                monthlyTotals[monthNumber] += expense.amount;
            }
        );

        return monthlyTotals;
    }


    /* ==================================================
       CREATE EXPENSE ELEMENT
    ================================================== */

    function createExpenseElement(expense) {
        const dateInformation = getDateInformation(expense.date);
        const expenseItem = $("<article>").addClass("expense-item").attr("data-expense-id", expense.id);
        const dateContainer = $("<div>").addClass("expense-date");
        const dateMonth = $("<span>").addClass("expense-date-month").text(dateInformation.monthShort);
        const dateDay = $("<strong>").addClass("expense-date-day").text(dateInformation.day);

        dateContainer.append(dateMonth, dateDay);

        const informationContainer = $("<div>").addClass("expense-information");
        const titleElement = $("<h3>").text(expense.title);
        const fullDateElement =$("<p>").text(dateInformation.fullDate);

        informationContainer.append(titleElement, fullDateElement);

        const amountElement = $("<strong>").addClass("expense-amount").text(formatCurrency(expense.amount));
        const deleteButton = $("<button>").attr({type: "button", "data-expense-id": expense.id, "aria-label": 
            `Delete ${expense.title}`, title:"Delete expense"})
                .addClass("delete-expense-button")
                .text("×");

        expenseItem.append(dateContainer, informationContainer, amountElement, deleteButton);
        return expenseItem;
    }


    /* ==================================================
       RENDER EXPENSE LIST
    ================================================== */

    function createEmptyState(icon, title, description) {
        const emptyState = $("<div>").addClass("empty-state");
        const emptyIcon = $("<div>").addClass("empty-state-icon").text(icon);
        const emptyTitle = $("<h3>").text(title);
        const emptyDescription = $("<p>").text(description);

        emptyState.append(emptyIcon, emptyTitle, emptyDescription);

        return emptyState;
    }

    function renderExpenses() {
        const expenseList = $("#expenseList");
        const selectedYear = getSelectedYear();
        const yearExpenses = getFilteredExpenses();
        const visibleExpenses = getVisibleExpenses();

        expenseList.empty();

        if (yearExpenses.length === 0) {
            expenseList.append(createEmptyState(
                "$", "Found no expenses.", `There are no expenses recorded for ${selectedYear}.`
            ));

            return;
        }

        if (visibleExpenses.length === 0) {
            expenseList.append(createEmptyState(
                "?", "No matching expenses.", "Try a different search term."
            ));

            return;
        }

        visibleExpenses.forEach(function (expense) {
                expenseList.append(createExpenseElement(expense));
            }
        );
    }


    /* ==================================================
       SUMMARY CARDS
    ================================================== */

    function updateSummary() {
        const filteredExpenses = getFilteredExpenses();
        const expenseCount = filteredExpenses.length;
        const totalAmount = filteredExpenses.reduce(function (total, expense) {
                return (total + expense.amount);
            }, 0
        );
        const averageAmount = expenseCount > 0 ? totalAmount / expenseCount : 0;

        $("#totalExpenseAmount").text(formatCurrency(totalAmount));
        $("#averageExpenseAmount").text(formatCurrency(averageAmount));
        $("#expenseCount").text(`${expenseCount} ${expenseCount === 1 ? "expense" : "expenses"} recorded`);
        $("#expenseListCount").text(expenseCount);
        updateHighestMonth(filteredExpenses);
    }

    function updateHighestMonth(filteredExpenses) {
        if (filteredExpenses.length === 0) {
            $("#highestExpenseMonth").text("-");
            $("#highestMonthAmount").text("No spending yet");

            return;
        }

        const monthlyTotals = calculateMonthlyTotals(filteredExpenses);
        const highestAmount = Math.max(...monthlyTotals);
        const highestMonthIndex = monthlyTotals.indexOf(highestAmount);

        $("#highestExpenseMonth").text(monthNames[highestMonthIndex]);
        $("#highestMonthAmount").text(formatCurrency(highestAmount));
    }


    /* ==================================================
       MONTHLY CHART
    ================================================== */

    function renderMonthlyChart() {
        const chart = $("#monthlyChart");
        const filteredExpenses = getFilteredExpenses();
        const monthlyTotals = calculateMonthlyTotals(filteredExpenses);
        const highestAmount = Math.max(...monthlyTotals);
        const maximumBarHeight = 145;

        chart.empty();

        const chartBars = $("<div>").addClass("chart-bars");

        monthlyTotals.forEach(function (monthlyAmount, monthIndex) {
                let barHeight = 5;

                if (highestAmount > 0 && monthlyAmount > 0) {
                    barHeight = (monthlyAmount / highestAmount) * maximumBarHeight;
                    barHeight = Math.max(barHeight, 10);
                }

                const column = $("<div>").addClass("chart-column").attr({
                    role: "img", "aria-label": `${monthNames[monthIndex]}: ${formatCurrency(monthlyAmount)}`
                });
                const barArea = $("<div>").addClass("chart-bar-area");
                const valueLabel = $("<span>").addClass("chart-value").text(formatCompactCurrency(monthlyAmount));
                const bar = $("<div>").addClass("chart-bar").css("height", `${barHeight}px`)
                    .attr("title", `${monthNames[monthIndex]}: ${formatCurrency(monthlyAmount)}`);

                if (monthlyAmount === highestAmount && highestAmount > 0) {
                    bar.addClass("highest");
                }

                const monthLabel = $("<span>").addClass("chart-month")
                    .text(monthNames[monthIndex].substring(0, 3));

                barArea.append(valueLabel, bar);
                column.append(barArea, monthLabel);
                chartBars.append(column);
            }
        );

        chart.append(chartBars);
    }


    /* ==================================================
       QUICK INSIGHT
    ================================================== */

    function updateInsight() {
        const filteredExpenses = getFilteredExpenses();
        const selectedYear = getSelectedYear();

        if (filteredExpenses.length === 0) {
            $("#insightTitle").text("Ready when you are.");
            $("#insightDescription").text(
                `Add your first ${selectedYear} expense to start seeing useful monthly patterns.`
            );

            return;
        }

        const monthlyTotals = calculateMonthlyTotals(filteredExpenses);
        const totalAmount = monthlyTotals.reduce(function (total, amount) {
                return (total + amount);
            }, 0
        );
        const highestAmount = Math.max(...monthlyTotals);
        const highestMonthIndex = monthlyTotals.indexOf(highestAmount);
        const percentage = totalAmount > 0 ? Math.round((highestAmount / totalAmount) * 100) : 0;

        $("#insightTitle").text(`${monthNames[highestMonthIndex]} was your biggest month.`);
        $("#insightDescription").text(
            `${percentage}% of your ${selectedYear} spending happened in ${monthNames[highestMonthIndex]}.`
        );
    }


    /* ==================================================
       DELETE EXPENSE
    ================================================== */

    function deleteExpense(expenseId) {
        const expenseToDelete = expenses.find(function (expense) {
                return (String(expense.id) === String(expenseId));
            }
        );

        if (!expenseToDelete) {
            return;
        }

        const shouldDelete = window.confirm(`Delete "${expenseToDelete.title}"?`);

        if (!shouldDelete) {
            return;
        }

        const selectedYear = getSelectedYear();

        expenses = expenses.filter(function (expense) {
                return (String(expense.id) !== String(expenseId));
            }
        );

        saveExpenses();

        populateYearFilter(selectedYear);
        saveSelectedYear(getSelectedYear());

        refreshExpenseDisplay();
    }


    /* ==================================================
       CSV EXPORT
    ================================================== */

    function escapeCsvValue(value) {
        let stringValue = String(value);

        /*
         * Prevent spreadsheet formulas from
         * being executed when opening the CSV.
         */
        if (/^[=+\-@]/.test(stringValue)) {
            stringValue = `'${stringValue}`;
        }

        return (`"${stringValue.replace(/"/g, '""')}"`);
    }

    function exportExpensesToCsv() {
        const selectedYear = getSelectedYear();
        const yearExpenses = getFilteredExpenses();

        if (yearExpenses.length === 0) {
            window.alert(`There are no ${selectedYear} expenses to export.`);

            return;
        }

        const csvRows = [["Title", "Amount (MYR)", "Date"]];

        yearExpenses
            .slice()
            .sort(function (a, b) {
                return b.date.localeCompare(a.date);
            })
            .forEach(function (expense) {
                    csvRows.push([expense.title, expense.amount.toFixed(2), expense.date]);
                }
            );

        const csvContent = csvRows.map(function (row) {
                return row.map(escapeCsvValue).join(",");
            })
            .join("\n");
        const csvFile = new Blob(["\uFEFF", csvContent], {type: "text/csv;charset=utf-8"});
        const downloadUrl = URL.createObjectURL(csvFile);
        const downloadLink = document.createElement("a");

        downloadLink.href = downloadUrl;
        downloadLink.download = `expenses-${selectedYear}.csv`;
        document.body.appendChild(downloadLink);

        downloadLink.click();
        downloadLink.remove();

        setTimeout(function () {
            URL.revokeObjectURL(downloadUrl);
        }, 0);
    }


    /* ==================================================
       REFRESH DASHBOARD
    ================================================== */

    function refreshExpenseDisplay() {
        updateSelectedYearDisplay();
        renderExpenses();
        updateSummary();
        renderMonthlyChart();
        updateInsight();

        const hasExpenses = getFilteredExpenses().length > 0;

        exportCsvButton.prop("disabled", !hasExpenses);
    }


    /* ==================================================
       FORM BUTTON EVENTS
    ================================================== */

    $("#showExpenseFormButton").on("click", function () {
            openExpenseForm();
        }
    );

    $("#cancelExpenseButton").on("click", function () {
            closeExpenseForm();
        }
    );

    $("#closeExpenseFormButton").on("click", function () {
            closeExpenseForm();
        }
    );


    /* ==================================================
       LIVE VALIDATION EVENTS
    ================================================== */

    expenseTitle.on("input", function () {
            if ($(this).hasClass("is-invalid")) {
                validateTitle();
            }
        }
    );

    expenseAmount.on("input", function () {
            if ($(this).hasClass("is-invalid")) {
                validateAmount();
            }
        }
    );

    expenseDate.on("change", function () {
            if ($(this).hasClass("is-invalid")) {
                validateDate();
            }
        }
    );


    /* ==================================================
       YEAR, SEARCH AND SORT EVENTS
    ================================================== */

    yearFilter.on("change", function () {
            saveSelectedYear(getSelectedYear());

            refreshExpenseDisplay();
        }
    );

    expenseSearch.on("input", function () {
            renderExpenses();
        }
    );

    expenseSort.on("change", function () {
            renderExpenses();
        }
    );


    /* ==================================================
       DELETE BUTTON EVENT
    ================================================== */

    $("#expenseList").on("click", ".delete-expense-button", function () {
            const expenseId = $(this).attr("data-expense-id");

            deleteExpense(expenseId);
        }
    );


    /* ==================================================
       CSV BUTTON EVENT
    ================================================== */

    exportCsvButton.on("click", function () {
            exportExpensesToCsv();
        }
    );


    /* ==================================================
       FORM SUBMISSION
    ================================================== */

    expenseForm.on("submit", function (event) {
            event.preventDefault();

            const isFormValid = validateExpenseForm();

            if (!isFormValid) {
                expenseForm
                    .find(".is-invalid")
                    .first()
                    .trigger("focus");

                return;
            }

            const newExpense = {
                id: Date.now(),
                title: expenseTitle.val().trim(),
                amount: Number(expenseAmount.val()),
                date: expenseDate.val()
            };

            expenses.push(newExpense);

            saveExpenses();

            const newExpenseYear = getDateInformation(newExpense.date).year;

            populateYearFilter(newExpenseYear);
            saveSelectedYear(newExpenseYear);

            /*
             * Clear search and use newest sorting
             * so the new expense is visible.
             */
            expenseSearch.val("");
            expenseSort.val("newest");

            refreshExpenseDisplay();

            closeExpenseForm();

            console.log("Expense added:", newExpense);
        }
    );


    /* ==================================================
       INITIAL PAGE SETUP
    ================================================== */

    expenses = loadExpenses();

    const startingYear = loadSelectedYear();

    populateYearFilter(startingYear);

    refreshExpenseDisplay();

    console.log("Daily Expense Tracker is ready.");

});

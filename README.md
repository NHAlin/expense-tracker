Project Overview

A responsive web page that allows users to record daily expenses, filter expenses by year, and view monthly expense totals in a diagram.

Technologies
HTML5
CSS3
JavaScript
Bootstrap 5
jQuery
Browser localStorage

Main Requirements
1. Add Expense

The user can add an expense using a form containing:

Title
Amount
Date

Validation rules:

All fields are required.
Title cannot contain only spaces.
Amount must be greater than 0.
Date must be selected.
The form cannot be submitted if any field is invalid.
Validation messages must appear below invalid fields.

After successful submission:

Add the expense to the list.
Recalculate the summary and monthly diagram.
Clear and close the form.
Save the expense in localStorage.

2. Filter Expenses by Year

A dropdown allows the user to select a year.

When a year is selected:

Only expenses from that year are displayed.
The yearly summary is updated.
The monthly diagram is updated.
If no expenses exist, display:

Found no expenses.

3. Monthly Expense Diagram

Display a bar diagram containing all 12 months:

January to December
Monthly total expense amount
Highlight the month with the highest total
Show an empty or minimum bar for months without expenses
Automatically update when expenses are added or deleted
Additional Features
Expense Summary

Display:

Total yearly expenses
Number of expenses
Average expense amount
Highest-spending month
Search

Allow users to search expenses by title.

If expenses exist for the year but none match the search, display:

No matching expenses.

Sorting

Allow users to sort expenses by:

Newest date
Highest amount
Delete Expense

Each expense contains a delete button.

After deleting an expense:

Update the expense list.
Update the yearly summary.
Update the monthly diagram.
Update localStorage.
CSV Export

Allow users to export expenses from the selected year into a CSV file containing:

Title
Amount
Date
Browser Storage

Use localStorage so expenses remain available after refreshing or reopening the page on the same browser.

Page Layout
Header
Application logo and name
Add Expense button
Introduction
Main heading
Short description
Year filter
Summary Section
Total spent
Average expense
Highest-spending month
Monthly Diagram
Twelve monthly bars
Monthly expense totals
Selected year
Highest monthly amount
Expense List

Each expense displays:

Date
Title
Amount
Delete button

The section also contains:

Search field
Sorting dropdown
CSV export button
Expense Form

The form contains:

Title field
Amount field
Date field
Cancel button
Save Expense button
Suggested File Structure

expense-tracker/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md

Expense Data Format
{
    id: "unique-expense-id",
    title: "Internet Bill",
    amount: 129.00,
    date: "2026-08-08"
}
Monthly Total Calculation
const monthlyTotals = Array(12).fill(0);

filteredExpenses.forEach((expense) => {
    const month = new Date(`${expense.date}T00:00:00`).getMonth();
    monthlyTotals[month] += Number(expense.amount);
});
Responsive Design

Bootstrap’s grid and utility classes will be used with custom CSS.

Screen size	Layout
Desktop	Summary cards in one row; diagram and insight panel side by side
Tablet	Reduced columns with responsive spacing
Mobile	All sections stack vertically with full-width controls

The page must not create horizontal scrolling on mobile devices.

Acceptance Criteria
Users can add a valid expense.
Empty forms cannot be submitted.
Invalid amounts cannot be submitted.
Expenses can be filtered by year.
The message “Found no expenses.” appears when required.
Monthly totals are correctly displayed in a diagram.
Search and sorting work correctly.
Users can delete expenses.
Expenses remain after refreshing the browser.
Users can export yearly expenses to CSV.
The page is responsive on desktop, tablet, and mobile.
Bootstrap is used in the implementation.
Testing Checklist
Submit the form with all fields empty.
Submit the form with only some fields completed.
Enter 0 or a negative amount.
Add expenses from different months.
Add expenses from different years.
Select a year without expenses.
Confirm the diagram matches the expense list.
Search using full and partial titles.
Test both sorting options.
Delete an expense and confirm totals update.
Refresh the page and confirm data remains.
Export and inspect the CSV file.
Test desktop, tablet, and mobile layouts.
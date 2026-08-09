# Daily Expense Tracker

A responsive expense-tracking dashboard built with HTML, CSS, Bootstrap, JavaScript, and jQuery. It lets users record daily expenses, review yearly spending, compare monthly totals, and keep their data in the browser.

## Features

- Add expenses with a title, amount, and date
- Validate required fields and reject invalid amounts
- Filter expenses by year
- Search expenses by title
- Sort expenses by newest date or highest amount
- View total spending, average spending, and the highest-spending month
- Compare all 12 months in a responsive bar chart
- Delete expenses after confirmation
- Export the selected year's expenses as a CSV file
- Preserve expenses and the selected year with `localStorage`
- Adapt the dashboard for desktop, tablet, and mobile screens

## Technologies

- HTML5
- CSS3
- JavaScript
- [Bootstrap 5.3.8](https://getbootstrap.com/)
- [jQuery 3.7.1](https://jquery.com/)
- Browser `localStorage`

## Getting Started

No build process or package installation is required.

1. Download or clone the project.
2. Open `index.html` in a modern web browser.
3. Select **Add Expense** to create your first entry.

An internet connection is required when first loading the page because Bootstrap and jQuery are loaded from CDNs.

## How to Use

### Add an expense

Select **Add Expense**, complete the title, amount, and date fields, and then select **Save Expense**. The title cannot contain only spaces, and the amount must be greater than zero.

### Filter, search, and sort

Use the year selector to display expenses from a specific year. The search field filters the visible expenses by title, while the sorting menu orders them by newest date or highest amount.

### Delete an expense

Select the delete button beside an expense and confirm the prompt. The expense list, summary cards, chart, and saved browser data update automatically.

### Export a CSV file

Select **Export CSV** to download the expenses for the currently selected year. The exported file contains the expense title, amount in MYR, and date.

## Project Structure

```text
expense-tracker/
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   `-- app.js
`-- README.md
```

## Expense Data

Expenses are stored in `localStorage` as objects with the following structure:

```javascript
{
    id: 1786204800000,
    title: "Internet Bill",
    amount: 129.00,
    date: "2026-08-08"
}
```

The date uses the `YYYY-MM-DD` format. Amounts are displayed as Malaysian ringgit (`MYR`).

## Monthly Totals

The dashboard creates a total for each month of the selected year. Every expense is assigned to its month, and its amount is added to that month's total. The month with the largest total is highlighted in the chart and summary.

Months without expenses remain visible with a minimum-height bar so that the chart always represents the full year.

## Browser Storage

The application stores all expense records and the selected year in the browser's `localStorage`. Data remains available after refreshing or reopening the page in the same browser. Clearing site data or using another browser or device will not preserve those records.

## Testing Checklist

- Submit the form with all fields empty
- Submit the form with only some fields completed
- Enter zero or a negative amount
- Add expenses from different months and years
- Select a year without expenses
- Confirm that monthly totals match the expense list
- Search with full and partial expense titles
- Test both sorting options
- Delete an expense and confirm that all totals update
- Refresh the page and confirm that saved data remains
- Export a CSV file and inspect its contents
- Test the layout on desktop, tablet, and mobile widths

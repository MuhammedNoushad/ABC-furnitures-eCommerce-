// to download pdf 
// Function to get the selected date from the input field
function getSelectedDate() {
    return document.getElementById('daterange').value;
}

// Function to download PDF with optional date parameter
async function downloadPDF() {
    try {
        const selectedDate = getSelectedDate();
        const url = '/admin/download-pdf' + (selectedDate ? `?date=${selectedDate}` : '');
        
        const response = await fetch(url);
        const blob = await response.blob();

        // Create a link element and trigger a click to start the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'sale_report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading PDF:', error);
    }
}

// Function to download Excel with optional date parameter
async function downloadExcel() {
    try {
        const selectedDate = getSelectedDate();
        const url = '/admin/download-excel' + (selectedDate ? `?date=${selectedDate}` : '');

        const response = await fetch(url);
        const blob = await response.blob();

        // Create a link element and trigger a click to start the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'sale_report.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading Excel:', error);
    }
}



// to call the sales reports regarding to the specific date 
function updateSalesReport() {


    const selectedDate = document.getElementById('daterange').value;


    // Construct the URL with the selected date as a query parameter
    const apiUrl = `/admin/orders/sales-report?date=${selectedDate}`;

    // Navigate to the URL
    window.location.href = apiUrl;
}



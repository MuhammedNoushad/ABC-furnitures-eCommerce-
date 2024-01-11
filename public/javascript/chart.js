// Declare myChart outside the function to make it accessible globally
let myChart;

// Function to fetch sales data from the server based on the selected interval
async function fetchSalesData(interval) {
    try {

        const response = await fetch(`/admin/sales-data?interval=${interval}`);

        if (!response.ok) {
            console.error('Error fetching sales data. Server responded with:', response.status);
            throw new Error('Failed to fetch sales data');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching sales data:', error.message);
        throw error;
    }
}

// Function to render or update the sales chart based on the fetched data
async function renderSalesChart(interval) {
    try {
        const salesData = await fetchSalesData(interval);

        const ctx = document.getElementById('salesChartCanvas').getContext('2d');

        if (myChart) {
            // If myChart exists, update its data
            updateChart(myChart, salesData);
        } else {
            // If myChart doesn't exist, create a new chart
            createChart(ctx, salesData);
        }
    } catch (error) {
        console.error('Error rendering sales chart:', error.message);
    }
}

// Function to update an existing chart
function updateChart(chart, data) {
    chart.data.labels = data.labels;
    chart.data.datasets[0].data = data.values;
    chart.update();
}

// Function to create a new chart
function createChart(ctx, data) {
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Total Sales',
                data: data.values,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.2,
            }],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                }
            }
        }
    });
}

// Function to handle changes in the interval selector
function handleFilterChange() {
    try {
        const intervalSelector = document.getElementById('intervalSelector');
        const selectedInterval = intervalSelector.value;


        if (!['daily', 'monthly', 'yearly'].includes(selectedInterval)) {
            console.error('Error: Invalid time interval');
            return;
        }

        renderSalesChart(selectedInterval);
    } catch (error) {
        console.error('Error handling filter change:', error.message);
    }
}

// Event listener for changes in the interval selector
const intervalSelector = document.getElementById('intervalSelector');
intervalSelector.addEventListener('change', handleFilterChange);

// Set the default interval and render the initial sales chart
const defaultInterval = intervalSelector.options[0].value;
renderSalesChart(defaultInterval);

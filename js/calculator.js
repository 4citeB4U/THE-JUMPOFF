// Revenue Calculator

document.addEventListener('DOMContentLoaded', function() {
    initRevenueCalculator();
});

function initRevenueCalculator() {
    const calculator = document.querySelector('.calculator');
    
    if (!calculator) return;
    
    const streamSlider = document.getElementById('stream-count');
    const streamValue = document.getElementById('stream-value');
    const platformSelect = document.getElementById('platform');
    const directSalesValue = document.getElementById('direct-sales-value');
    const chartCanvas = document.getElementById('revenue-chart');
    const platformRevenue = document.getElementById('platform-revenue');
    const artistRevenue = document.getElementById('artist-revenue');
    const compareRevenue = document.getElementById('compare-revenue');
    
    // Initialize Chart.js
    let revenueChart;
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        revenueChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Platform Cut', 'Artist Revenue'],
                datasets: [{
                    data: [70, 30], // Default values
                    backgroundColor: [
                        '#e74c3c',
                        '#2ecc71'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom'
                }
            }
        });
    }
    
    // Platform rates (approximate percentages that go to the artist)
    const platformRates = {
        'spotify': 0.3, // 30% to artist
        'apple': 0.5, // 50% to artist
        'youtube': 0.45, // 45% to artist
        'bandcamp': 0.85, // 85% to artist
        'direct': 0.95 // 95% to artist (accounting for payment processing)
    };
    
    // Average stream value in dollars
    const streamValue$ = {
        'spotify': 0.003,
        'apple': 0.006,
        'youtube': 0.001,
        'bandcamp': 0.01,
        'direct': 0.5 // Direct sales are much higher
    };
    
    // Update values when slider changes
    if (streamSlider) {
        streamSlider.addEventListener('input', updateCalculator);
        streamValue.textContent = streamSlider.value;
    }
    
    // Update values when platform changes
    if (platformSelect) {
        platformSelect.addEventListener('change', updateCalculator);
    }
    
    // Initial calculation
    updateCalculator();
    
    function updateCalculator() {
        // Get current values
        const streams = parseInt(streamSlider.value);
        const platform = platformSelect.value;
        streamValue.textContent = streams.toLocaleString();
        
        // Calculate revenues
        const platformRate = platformRates[platform];
        const streamValueAmount = streamValue$[platform];
        const totalRevenue = streams * streamValueAmount;
        
        const artistAmount = totalRevenue * platformRate;
        const platformAmount = totalRevenue - artistAmount;
        
        // Direct sales comparison (assuming 100 sales instead of streams)
        const directSales = Math.ceil(streams / 100); // Estimate: 1 direct sale per 100 streams
        const directAmount = directSales * streamValue$.direct * platformRates.direct;
        directSalesValue.textContent = directSales.toLocaleString();
        
        // Update displayed values
        platformRevenue.textContent = '$' + platformAmount.toFixed(2);
        artistRevenue.textContent = '$' + artistAmount.toFixed(2);
        compareRevenue.textContent = '$' + directAmount.toFixed(2);
        
        // Update chart
        if (revenueChart) {
            revenueChart.data.datasets[0].data = [platformAmount, artistAmount];
            revenueChart.update();
        }
        
        // Update comparison text
        const percentageDiff = ((directAmount / artistAmount) * 100) - 100;
        const diffText = document.getElementById('revenue-difference');
        if (diffText) {
            diffText.textContent = `That's ${Math.round(percentageDiff)}% more revenue by supporting the artist directly!`;
        }
    }
}
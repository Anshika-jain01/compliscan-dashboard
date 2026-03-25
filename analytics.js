// Analytics Dashboard JavaScript
class AnalyticsDashboard {
  constructor() {
    this.currentPage = 1
    this.itemsPerPage = 10
    this.filteredData = []
    this.charts = {}

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.initializeCharts()
    this.loadRegionalData()
    this.setupGlobalSearch()
    this.updateConfidenceValue()
  }

  setupEventListeners() {
    // Filter controls
    document.getElementById("resetFilters").addEventListener("click", () => this.resetFilters())
    document.getElementById("confidenceRange").addEventListener("input", () => this.updateConfidenceValue())
    document.querySelector(".apply-filters-btn").addEventListener("click", () => this.applyFilters())

    // Search functionality
    document.getElementById("regionSearch").addEventListener("input", (e) => this.searchRegions(e.target.value))

    // Pagination
    document.getElementById("prevPage").addEventListener("click", () => this.changePage(-1))
    document.getElementById("nextPage").addEventListener("click", () => this.changePage(1))

    // Region clicks on map
    document.querySelectorAll(".region").forEach((region) => {
      region.addEventListener("click", (e) => this.showRegionDetails(e.target.dataset.region))
    })

    // Export buttons
    document.querySelectorAll(".export-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.exportData())
    })
  }

  setupGlobalSearch() {
    const searchInput = document.getElementById("globalSearchInput")
    const suggestions = document.getElementById("searchSuggestions")

    const searchSuggestions = [
      "Maharashtra violations",
      "Delhi compliance rate",
      "Amazon platform analysis",
      "Flipkart seller rankings",
      "FSSAI violations",
      "BIS compliance trends",
      "Critical severity analysis",
      "Electronics category violations",
      "Food & beverages compliance",
    ]

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()
      if (query.length > 0) {
        const filtered = searchSuggestions.filter((item) => item.toLowerCase().includes(query))
        this.showSearchSuggestions(filtered, suggestions)
      } else {
        suggestions.style.display = "none"
      }
    })

    searchInput.addEventListener("blur", () => {
      setTimeout(() => (suggestions.style.display = "none"), 200)
    })
  }

  showSearchSuggestions(suggestions, container) {
    if (suggestions.length === 0) {
      container.style.display = "none"
      return
    }

    container.innerHTML = suggestions.map((suggestion) => `<div class="suggestion-item">${suggestion}</div>`).join("")

    container.style.display = "block"

    container.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", () => {
        document.getElementById("globalSearchInput").value = item.textContent
        container.style.display = "none"
        this.performGlobalSearch(item.textContent)
      })
    })
  }

  performGlobalSearch(query) {
    this.showToast(`Searching for: ${query}`, "info")
    // Implement actual search logic here
  }

  updateConfidenceValue() {
    const slider = document.getElementById("confidenceRange")
    const valueDisplay = document.getElementById("confidenceValue")
    valueDisplay.textContent = slider.value + "%"
  }

  resetFilters() {
    // Reset all filter inputs
    document.getElementById("startDate").value = ""
    document.getElementById("endDate").value = ""
    document.getElementById("confidenceRange").value = 70

    // Reset checkboxes
    document.querySelectorAll('.multi-select-item input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false
    })

    // Check default platforms
    document.getElementById("amazon").checked = true
    document.getElementById("flipkart").checked = true
    document.getElementById("north").checked = true
    document.getElementById("south").checked = true
    document.getElementById("electronics").checked = true
    document.getElementById("food").checked = true

    this.updateConfidenceValue()
    this.showToast("Filters reset successfully", "success")
  }

  applyFilters() {
    // Collect filter values
    const filters = {
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
      confidence: document.getElementById("confidenceRange").value,
      platforms: this.getCheckedValues(
        'input[id$="amazon"], input[id$="flipkart"], input[id$="myntra"], input[id$="snapdeal"]',
      ),
      regions: this.getCheckedValues('input[id$="north"], input[id$="south"], input[id$="west"], input[id$="east"]'),
      categories: this.getCheckedValues(
        'input[id$="electronics"], input[id$="food"], input[id$="textiles"], input[id$="cosmetics"]',
      ),
    }

    console.log("[v0] Applied filters:", filters)
    this.showToast("Filters applied successfully", "success")

    // Update charts and data based on filters
    this.updateChartsWithFilters(filters)
    this.loadRegionalData(filters)
  }

  getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector))
      .filter((input) => input.checked)
      .map((input) => input.id)
  }

  initializeCharts() {
    this.createRegulationChart()
    this.createSeverityChart()
    this.createTrendsChart()
  }

  createRegulationChart() {
    const ctx = document.getElementById("regulationChart").getContext("2d")
    this.charts.regulation = new window.Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Legal Metrology", "FSSAI", "BIS", "Other"],
        datasets: [
          {
            data: [35, 28, 22, 15],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
      },
    })
  }

  createSeverityChart() {
    const ctx = document.getElementById("severityChart").getContext("2d")
    this.charts.severity = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Critical", "High", "Medium", "Low"],
        datasets: [
          {
            label: "Violations",
            data: [156, 342, 567, 234],
            backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"],
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#f3f4f6",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }

  createTrendsChart() {
    const ctx = document.getElementById("trendsChart").getContext("2d")
    this.charts.trends = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Total Violations",
            data: [1200, 1350, 1100, 1450, 1600, 1400, 1550, 1700, 1650, 1800, 1750, 1900],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 6,
          },
          {
            label: "Critical Violations",
            data: [180, 200, 160, 220, 240, 210, 230, 260, 250, 280, 270, 300],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#ef4444",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#f3f4f6",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    })
  }

  updateChartsWithFilters(filters) {
    // Update chart data based on applied filters
    console.log("[v0] Updating charts with filters:", filters)

    // Simulate data update
    setTimeout(() => {
      this.charts.regulation.data.datasets[0].data = [
        Math.floor(Math.random() * 40) + 20,
        Math.floor(Math.random() * 35) + 15,
        Math.floor(Math.random() * 30) + 10,
        Math.floor(Math.random() * 20) + 5,
      ]
      this.charts.regulation.update()

      this.charts.severity.data.datasets[0].data = [
        Math.floor(Math.random() * 200) + 100,
        Math.floor(Math.random() * 400) + 200,
        Math.floor(Math.random() * 600) + 300,
        Math.floor(Math.random() * 300) + 150,
      ]
      this.charts.severity.update()

      this.showToast("Charts updated with new filters", "success")
    }, 500)
  }

  loadRegionalData(filters = null) {
    // Sample regional data
    const regionalData = [
      {
        region: "Maharashtra",
        total: 1247,
        critical: 156,
        high: 234,
        medium: 567,
        low: 290,
        compliance: 87.5,
        trend: "up",
      },
      {
        region: "Delhi",
        total: 2156,
        critical: 298,
        high: 445,
        medium: 892,
        low: 521,
        compliance: 82.3,
        trend: "down",
      },
      {
        region: "Karnataka",
        total: 892,
        critical: 89,
        high: 178,
        medium: 356,
        low: 269,
        compliance: 91.2,
        trend: "up",
      },
      { region: "Kerala", total: 234, critical: 23, high: 47, medium: 94, low: 70, compliance: 95.8, trend: "up" },
      {
        region: "Gujarat",
        total: 678,
        critical: 68,
        high: 136,
        medium: 271,
        low: 203,
        compliance: 89.4,
        trend: "stable",
      },
      {
        region: "Tamil Nadu",
        total: 1034,
        critical: 103,
        high: 207,
        medium: 414,
        low: 310,
        compliance: 88.7,
        trend: "up",
      },
      {
        region: "West Bengal",
        total: 567,
        critical: 57,
        high: 113,
        medium: 227,
        low: 170,
        compliance: 92.1,
        trend: "up",
      },
      {
        region: "Rajasthan",
        total: 445,
        critical: 45,
        high: 89,
        medium: 178,
        low: 133,
        compliance: 90.3,
        trend: "stable",
      },
    ]

    this.filteredData = regionalData
    this.renderRegionalTable()
  }

  renderRegionalTable() {
    const tbody = document.getElementById("regionalTableBody")
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    const pageData = this.filteredData.slice(startIndex, endIndex)

    tbody.innerHTML = pageData
      .map(
        (row) => `
            <tr>
                <td><strong>${row.region}</strong></td>
                <td>${row.total.toLocaleString()}</td>
                <td><span class="severity-badge severity-critical">${row.critical}</span></td>
                <td><span class="severity-badge severity-high">${row.high}</span></td>
                <td><span class="severity-badge severity-medium">${row.medium}</span></td>
                <td><span class="confidence-badge confidence-high">${row.low}</span></td>
                <td><strong>${row.compliance}%</strong></td>
                <td>
                    <i class="fas fa-arrow-${row.trend === "up" ? "up" : row.trend === "down" ? "down" : "right"}" 
                       style="color: ${row.trend === "up" ? "#10b981" : row.trend === "down" ? "#ef4444" : "#64748b"}"></i>
                </td>
            </tr>
        `,
      )
      .join("")

    this.updatePaginationInfo()
  }

  searchRegions(query) {
    if (!query) {
      this.loadRegionalData()
      return
    }

    this.filteredData = this.filteredData.filter((row) => row.region.toLowerCase().includes(query.toLowerCase()))

    this.currentPage = 1
    this.renderRegionalTable()
  }

  changePage(direction) {
    const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage)
    const newPage = this.currentPage + direction

    if (newPage >= 1 && newPage <= totalPages) {
      this.currentPage = newPage
      this.renderRegionalTable()
    }
  }

  updatePaginationInfo() {
    const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage)
    document.querySelector(".pagination-info").textContent = `Page ${this.currentPage} of ${totalPages}`

    document.getElementById("prevPage").disabled = this.currentPage === 1
    document.getElementById("nextPage").disabled = this.currentPage === totalPages
  }

  showRegionDetails(region) {
    this.showToast(`Showing details for ${region}`, "info")
    // Implement region detail modal or navigation
  }

  exportData() {
    this.showToast("Exporting data...", "info")
    // Implement actual export functionality
    setTimeout(() => {
      this.showToast("Data exported successfully", "success")
    }, 1500)
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer")
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    const icon =
      type === "success"
        ? "check-circle"
        : type === "error"
          ? "exclamation-circle"
          : type === "warning"
            ? "exclamation-triangle"
            : "info-circle"

    toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `

    container.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 4000)
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AnalyticsDashboard()
})

// Handle notification button
document.getElementById("notificationBtn").addEventListener("click", () => {
  alert(
    "Notifications:\n• New violation detected in Maharashtra\n• Weekly compliance report ready\n• System maintenance scheduled",
  )
})

// Setup chatbot functionality
function setupChatbotFunctionality() {
  const chatbotBtn = document.getElementById('chatbotBtn');
  
  chatbotBtn.addEventListener('click', function() {
    // Add click animation
    this.style.transform = 'translateY(-1px) scale(1.05)';
    
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
    
    // Add loading state
    addLoadingState(this, 1500);
    
    // Simulate chatbot opening
    setTimeout(() => {
      alert('Chatbot feature coming soon! We\'re here to help with your compliance questions.');
    }, 800);
  });
  
  // Add floating animation
  setInterval(() => {
    chatbotBtn.style.transform = 'translateY(-2px)';
    setTimeout(() => {
      chatbotBtn.style.transform = 'translateY(0)';
    }, 1000);
  }, 3000);
}

// Helper function for loading states
function addLoadingState(button, duration = 2000) {
  const originalText = button.innerHTML;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  button.disabled = true;
  
  setTimeout(() => {
    button.innerHTML = originalText;
    button.disabled = false;
  }, duration);
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupChatbotFunctionality();
});

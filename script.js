// Sample data for violations
const violationsData = [
  {
    id: 1,
    productName: "Samsung Galaxy S24 Ultra 256GB",
    platform: "Amazon",
    violationType: "Legal Metrology",
    confidenceScore: 95,
    severity: "Critical",
    timestamp: "2024-01-15 14:30:00",
  },
  {
    id: 2,
    productName: "Organic Honey 500g",
    platform: "Flipkart",
    violationType: "FSSAI",
    confidenceScore: 87,
    severity: "High",
    timestamp: "2024-01-15 14:25:00",
  },
  {
    id: 3,
    productName: "LED TV 55 inch Smart",
    platform: "Myntra",
    violationType: "BIS",
    confidenceScore: 72,
    severity: "Medium",
    timestamp: "2024-01-15 14:20:00",
  },
  {
    id: 4,
    productName: "Wireless Bluetooth Headphones",
    platform: "Amazon",
    violationType: "Legal Metrology",
    confidenceScore: 91,
    severity: "High",
    timestamp: "2024-01-15 14:15:00",
  },
  {
    id: 5,
    productName: "Protein Powder 1kg",
    platform: "Nykaa",
    violationType: "FSSAI",
    confidenceScore: 68,
    severity: "Medium",
    timestamp: "2024-01-15 14:10:00",
  },
  {
    id: 6,
    productName: "Electric Kettle 1.5L",
    platform: "Flipkart",
    violationType: "BIS",
    confidenceScore: 83,
    severity: "High",
    timestamp: "2024-01-15 14:05:00",
  },
]

// Global variables
let currentPage = 1
let filteredData = [...violationsData]
const itemsPerPage = 5

// DOM elements
const violationsTableBody = document.getElementById("violationsTableBody")
const searchInput = document.getElementById("searchInput")
const platformFilter = document.getElementById("platformFilter")
const timeFilter = document.getElementById("timeFilter")
const violationFilter = document.getElementById("violationFilter")
const confidenceFilter = document.getElementById("confidenceFilter")
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")
const startScanBtn = document.getElementById("startScanBtn")
const exportBtn = document.getElementById("exportBtn")
const lastUpdateElement = document.getElementById("lastUpdate")
const chatbotBtn = document.getElementById("chatbotBtn")

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  renderViolationsTable()
  setupEventListeners()
  updateLastUpdateTime()
  startProgressAnimation()
  // setupNavbarFunctionality() - Removed to allow HTML onclick navigation
  setupChatbotFunctionality()
})

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  searchInput.addEventListener("input", handleSearch)

  // Filter functionality
  platformFilter.addEventListener("change", applyFilters)
  timeFilter.addEventListener("change", applyFilters)
  violationFilter.addEventListener("change", applyFilters)
  confidenceFilter.addEventListener("change", applyFilters)

  // Pagination
  prevBtn.addEventListener("click", () => changePage(-1))
  nextBtn.addEventListener("click", () => changePage(1))

  // Action buttons
  startScanBtn.addEventListener("click", startNewScan)
  exportBtn.addEventListener("click", exportData)

  // Logout functionality
  document.querySelector(".logout-btn").addEventListener("click", handleLogout)
}

// Render violations table
function renderViolationsTable() {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pageData = filteredData.slice(startIndex, endIndex)

  violationsTableBody.innerHTML = ""

  pageData.forEach((violation) => {
    const row = createTableRow(violation)
    violationsTableBody.appendChild(row)
  })

  updatePaginationInfo()
}

// Create table row
function createTableRow(violation) {
  const row = document.createElement("tr")

  const confidenceClass = getConfidenceClass(violation.confidenceScore)
  const severityClass = getSeverityClass(violation.severity)

  row.innerHTML = `
        <td>
            <div class="product-name">${violation.productName}</div>
        </td>
        <td>
            <span class="platform-badge">${violation.platform}</span>
        </td>
        <td>${violation.violationType}</td>
        <td>
            <span class="confidence-badge ${confidenceClass}">${violation.confidenceScore}%</span>
        </td>
        <td>
            <span class="severity-badge ${severityClass}">${violation.severity}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="view-btn" onclick="viewViolation(${violation.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="flag-btn" onclick="flagForReview(${violation.id})">
                    <i class="fas fa-flag"></i>
                </button>
                <button class="report-btn" onclick="generateReport(${violation.id})">
                    <i class="fas fa-file-alt"></i>
                </button>
            </div>
        </td>
    `

  return row
}

// Get confidence class based on score
function getConfidenceClass(score) {
  if (score >= 85) return "confidence-high"
  if (score >= 70) return "confidence-medium"
  return "confidence-low"
}

// Get severity class
function getSeverityClass(severity) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "severity-critical"
    case "high":
      return "severity-high"
    case "medium":
      return "severity-medium"
    default:
      return "severity-medium"
  }
}

// Handle search functionality
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase()

  filteredData = violationsData.filter(
    (violation) =>
      violation.productName.toLowerCase().includes(searchTerm) ||
      violation.platform.toLowerCase().includes(searchTerm) ||
      violation.violationType.toLowerCase().includes(searchTerm),
  )

  currentPage = 1
  renderViolationsTable()
}

// Apply filters
function applyFilters() {
  const platform = platformFilter.value
  const timeFilter = document.getElementById("timeFilter").value
  const violationType = violationFilter.value
  const confidence = confidenceFilter.value

  filteredData = violationsData.filter((violation) => {
    const platformMatch = platform === "all" || violation.platform.toLowerCase() === platform
    const violationMatch = violationType === "all" || violation.violationType.toLowerCase().includes(violationType)
    const confidenceMatch = confidence === "all" || getConfidenceLevel(violation.confidenceScore) === confidence

    return platformMatch && violationMatch && confidenceMatch
  })

  currentPage = 1
  renderViolationsTable()
}

// Get confidence level
function getConfidenceLevel(score) {
  if (score >= 85) return "high"
  if (score >= 70) return "medium"
  return "low"
}

// Change page
function changePage(direction) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const newPage = currentPage + direction

  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage
    renderViolationsTable()
  }
}

// Update pagination info
function updatePaginationInfo() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  document.querySelector(".pagination-info").textContent = `Page ${currentPage} of ${totalPages}`

  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = currentPage === totalPages
}

// Action functions
function viewViolation(id) {
  const violation = violationsData.find((v) => v.id === id)
  alert(`Viewing violation details for: ${violation.productName}`)
}

function flagForReview(id) {
  const violation = violationsData.find((v) => v.id === id)
  alert(`Flagged for manual review: ${violation.productName}`)
}

function generateReport(id) {
  const violation = violationsData.find((v) => v.id === id)
  alert(`Generating report for: ${violation.productName}`)
}

function startNewScan() {
  alert("Starting new compliance scan...")
  // Simulate scan start
  updateScanProgress()
}

function exportData() {
  alert("Exporting violation data to CSV...")
  // Simulate data export
  downloadCSV()
}

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    alert("Logging out...")
    // Redirect to login page
  }
}

// Update last update time
function updateLastUpdateTime() {
  setInterval(() => {
    const now = new Date()
    const minutes = Math.floor(Math.random() * 5) + 1
    lastUpdateElement.textContent = `${minutes} minutes ago`
  }, 30000) // Update every 30 seconds
}

// Animate progress bar
function startProgressAnimation() {
  const progressFill = document.querySelector(".progress-fill")
  const progressPercentage = document.querySelector(".progress-percentage")

  let progress = 67

  setInterval(() => {
    if (progress < 100) {
      progress += Math.random() * 2
      if (progress > 100) progress = 100

      progressFill.style.width = `${progress}%`
      progressPercentage.textContent = `${Math.round(progress)}%`
    }
  }, 5000)
}

// Simulate scan progress update
function updateScanProgress() {
  const products = [
    "iPhone 15 Pro Max",
    "Dell Laptop XPS 13",
    "Nike Air Jordan Shoes",
    "Sony WH-1000XM5 Headphones",
    "Samsung 4K Smart TV",
  ]

  const platforms = ["Amazon", "Flipkart", "Myntra", "Nykaa"]

  setInterval(() => {
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]

    document.querySelector(".scanner-detail .value").textContent = randomPlatform
    document.querySelectorAll(".scanner-detail .value")[2].textContent = randomProduct
  }, 10000)
}

// Download CSV function
function downloadCSV() {
  const headers = ["Product Name", "Platform", "Violation Type", "Confidence Score", "Severity", "Timestamp"]
  const csvContent = [
    headers.join(","),
    ...filteredData.map((row) =>
      [`"${row.productName}"`, row.platform, row.violationType, row.confidenceScore, row.severity, row.timestamp].join(
        ",",
      ),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "violations_report.csv"
  a.click()
  window.URL.revokeObjectURL(url)
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
  setInterval(() => {
    // Update metrics randomly
    const metricsValues = document.querySelectorAll(".metric-value")
    metricsValues.forEach((metric) => {
      const currentValue = Number.parseInt(metric.textContent.replace(/[^\d]/g, "")) || 0
      const change = Math.floor(Math.random() * 10) - 5
      const newValue = Math.max(0, currentValue + change)

      if (metric.textContent.includes("%")) {
        metric.textContent = `${Math.min(100, newValue)}%`
      } else {
        metric.textContent = newValue.toLocaleString()
      }
    })
  }, 30000)
}

// Start real-time updates
simulateRealTimeUpdates()

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading states for buttons
function addLoadingState(button, duration = 2000) {
  const originalText = button.innerHTML
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
  button.disabled = true

  setTimeout(() => {
    button.innerHTML = originalText
    button.disabled = false
  }, duration)
}

// Enhanced button interactions
document.querySelectorAll(".btn, .action-btn").forEach((button) => {
  button.addEventListener("click", function () {
    if (!this.disabled) {
      addLoadingState(this)
    }
  })
})

function setupNavbarFunctionality() {
  const navTabs = document.querySelectorAll(".nav-tab")

  navTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      navTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Get tab data
      const tabName = this.dataset.tab

      // Add loading state
      addLoadingState(this, 1000)

      // Simulate tab switching
      setTimeout(() => {
        showTabContent(tabName)
      }, 500)
    })
  })
}

function setupChatbotFunctionality() {
  chatbotBtn.addEventListener("click", function () {
    // Add click animation
    this.style.transform = "translateY(-1px) scale(1.05)"

    setTimeout(() => {
      this.style.transform = ""
    }, 150)

    // Add loading state
    addLoadingState(this, 1500)

    // Simulate chatbot opening
    setTimeout(() => {
      alert("Chatbot feature coming soon! We're here to help with your compliance questions.")
    }, 800)
  })

  // Add floating animation
  setInterval(() => {
    chatbotBtn.style.transform = "translateY(-2px)"
    setTimeout(() => {
      chatbotBtn.style.transform = "translateY(0)"
    }, 1000)
  }, 3000)
}

function showTabContent(tabName) {
  const messages = {
    dashboard: "Dashboard view is currently active",
    analytics: "Loading analytics data...",
    scanner: "Initializing scanner module...",
    archive: "Accessing archived data...",
  }

  // Show a toast notification for tab switching
  showToast(`Switched to ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} tab`, "info")
}

function showToast(message, type = "info") {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.textContent = message

  toast.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-weight: 500;
  `

  document.body.appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

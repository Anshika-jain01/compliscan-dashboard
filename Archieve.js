// Archive Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Sample archive data
  const archiveData = [
    {
      id: 1,
      productName: "Samsung Galaxy S24 Ultra",
      platform: "Amazon",
      scanDate: "2024-01-15",
      violations: ["Legal Metrology", "BIS"],
      confidence: 92,
      status: "reviewed",
    },
    {
      id: 2,
      productName: "iPhone 15 Pro Max",
      platform: "Flipkart",
      scanDate: "2024-01-14",
      violations: ["FSSAI"],
      confidence: 78,
      status: "pending",
    },
    {
      id: 3,
      productName: "OnePlus 12",
      platform: "Myntra",
      scanDate: "2024-01-13",
      violations: ["Legal Metrology"],
      confidence: 85,
      status: "flagged",
    },
  ]

  // Initialize page
  initializeArchivePage()
  populateArchiveTable(archiveData)
  setupEventListeners()
  initializePlatformChart()

  function initializeArchivePage() {
    // Set current date as default end date
    const today = new Date().toISOString().split("T")[0]
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    document.getElementById("startDate").value = lastMonth
    document.getElementById("endDate").value = today

    // Initialize confidence range slider
    updateConfidenceValue()
  }

  function populateArchiveTable(data) {
    const tableBody = document.getElementById("archiveTableBody")
    tableBody.innerHTML = ""

    data.forEach((item) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td><input type="checkbox" class="bulk-checkbox" data-id="${item.id}"></td>
                <td>${item.productName}</td>
                <td>${item.platform}</td>
                <td>${formatDate(item.scanDate)}</td>
                <td>${item.violations.join(", ")}</td>
                <td>
                    <span class="confidence-badge ${getConfidenceClass(item.confidence)}">
                        ${item.confidence}%
                    </span>
                </td>
                <td>
                    <span class="status-badge ${item.status}">
                        ${item.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn-small view" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn-small edit" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn-small report" title="Generate Report">
                            <i class="fas fa-file-alt"></i>
                        </button>
                    </div>
                </td>
            `
      tableBody.appendChild(row)
    })
  }

  function setupEventListeners() {
    // Navigation tabs are handled via inline HTML onclicks

    // Confidence range slider
    const confidenceRange = document.getElementById("confidenceRange")
    confidenceRange.addEventListener("input", updateConfidenceValue)

    // Filter buttons
    document.getElementById("applyFiltersBtn").addEventListener("click", applyFilters)
    document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters)

    // Bulk actions
    document.getElementById("selectAll").addEventListener("change", toggleSelectAll)

    // Bulk action buttons
    document.getElementById("bulkReportBtn").addEventListener("click", generateBulkReports)
    document.getElementById("bulkExportBtn").addEventListener("click", exportBulkData)
    document.getElementById("bulkReviewBtn").addEventListener("click", markBulkReviewed)

    // Chatbot
    document.getElementById("chatbotBtn").addEventListener("click", () => {
      console.log("[v0] Chatbot clicked - Archive page")
      // Add chatbot functionality here
      alert("Archive chatbot activated! How can I help you with historical data?")
    })

    // Table sorting
    document.querySelectorAll(".archive-table th").forEach((header) => {
      if (header.querySelector("i.fa-sort")) {
        header.addEventListener("click", function () {
          sortTable(this)
        })
      }
    })
  }

  function updateConfidenceValue() {
    const slider = document.getElementById("confidenceRange")
    const valueDisplay = document.getElementById("confidenceValue")
    valueDisplay.textContent = slider.value + "%"
  }

  function applyFilters() {
    console.log("[v0] Applying archive filters")
    // Get filter values
    const textSearch = document.getElementById("archiveTextSearch").value
    const startDate = document.getElementById("startDate").value
    const endDate = document.getElementById("endDate").value
    const platform = document.getElementById("archivePlatformFilter").value
    const violationType = document.getElementById("archiveViolationFilter").value
    const confidence = document.getElementById("confidenceRange").value
    const reviewStatus = document.getElementById("reviewStatusFilter").value

    // Apply filters to data (implement filtering logic)
    console.log("[v0] Filters applied:", {
      textSearch,
      startDate,
      endDate,
      platform,
      violationType,
      confidence,
      reviewStatus,
    })
  }

  function clearFilters() {
    document.getElementById("archiveTextSearch").value = ""
    document.getElementById("archivePlatformFilter").value = "all"
    document.getElementById("archiveViolationFilter").value = "all"
    document.getElementById("confidenceRange").value = "50"
    document.getElementById("reviewStatusFilter").value = "all"
    updateConfidenceValue()

    // Reset date range to last month
    const today = new Date().toISOString().split("T")[0]
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    document.getElementById("startDate").value = lastMonth
    document.getElementById("endDate").value = today
  }

  function toggleSelectAll() {
    const selectAll = document.getElementById("selectAll")
    const checkboxes = document.querySelectorAll(".bulk-checkbox[data-id]")

    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAll.checked
    })

    updateBulkActionButtons()
  }

  function updateBulkActionButtons() {
    const checkedBoxes = document.querySelectorAll(".bulk-checkbox[data-id]:checked")
    const bulkButtons = document.querySelectorAll("#bulkReportBtn, #bulkExportBtn, #bulkReviewBtn")

    bulkButtons.forEach((button) => {
      button.disabled = checkedBoxes.length === 0
    })
  }

  function generateBulkReports() {
    const selected = getSelectedItems()
    console.log("[v0] Generating bulk reports for:", selected)
    alert(`Generating reports for ${selected.length} selected items...`)
  }

  function exportBulkData() {
    const selected = getSelectedItems()
    console.log("[v0] Exporting bulk data for:", selected)
    alert(`Exporting data for ${selected.length} selected items...`)
  }

  function markBulkReviewed() {
    const selected = getSelectedItems()
    console.log("[v0] Marking as reviewed:", selected)
    alert(`Marked ${selected.length} items as reviewed.`)
  }

  function getSelectedItems() {
    const checkedBoxes = document.querySelectorAll(".bulk-checkbox[data-id]:checked")
    return Array.from(checkedBoxes).map((checkbox) => checkbox.dataset.id)
  }

  function sortTable(header) {
    console.log("[v0] Sorting table by:", header.textContent)
    // Implement table sorting logic
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  function getConfidenceClass(confidence) {
    if (confidence >= 80) return "high"
    if (confidence >= 60) return "medium"
    return "low"
  }

  function initializePlatformChart() {
    const canvas = document.getElementById("platformChart")
    const ctx = canvas.getContext("2d")

    // Simple pie chart data
    const data = [
      { label: "Amazon", value: 45, color: "#3b82f6" },
      { label: "Flipkart", value: 30, color: "#10b981" },
      { label: "Myntra", value: 15, color: "#f59e0b" },
      { label: "Nykaa", value: 10, color: "#ef4444" },
    ]

    // Draw simple pie chart
    let currentAngle = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 80

    data.forEach((segment) => {
      const sliceAngle = (segment.value / 100) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = segment.color
      ctx.fill()

      currentAngle += sliceAngle
    })

    // Add legend
    let legendY = 20
    data.forEach((segment) => {
      ctx.fillStyle = segment.color
      ctx.fillRect(canvas.width - 150, legendY, 15, 15)
      ctx.fillStyle = "#374151"
      ctx.font = "14px Inter"
      ctx.fillText(`${segment.label} (${segment.value}%)`, canvas.width - 130, legendY + 12)
      legendY += 25
    })
  }

  // Update bulk action buttons when checkboxes change
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("bulk-checkbox") && e.target.dataset.id) {
      updateBulkActionButtons()
    }
  })
})

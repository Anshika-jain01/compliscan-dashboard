// Global variables
let activeJobs = []
let historicalJobs = []
let currentPage = 1
const jobsPerPage = 10

// Sample data
const sampleActiveJobs = [
  {
    id: "JOB-001",
    platform: "Amazon",
    type: "Initial Scan",
    status: "running",
    priority: "High",
    productsProcessed: 1247,
    totalProducts: 2500,
    currentProduct: "iPhone 15 Pro Max",
    startTime: new Date(Date.now() - 3600000),
    progress: 50,
  },
  {
    id: "JOB-002",
    platform: "Flipkart",
    type: "Re-scan",
    status: "running",
    priority: "Medium",
    productsProcessed: 892,
    totalProducts: 1200,
    currentProduct: "Samsung Galaxy S24",
    startTime: new Date(Date.now() - 1800000),
    progress: 74,
  },
  {
    id: "JOB-003",
    platform: "eBay",
    type: "Targeted Check",
    status: "paused",
    priority: "Low",
    productsProcessed: 156,
    totalProducts: 300,
    currentProduct: "MacBook Air M2",
    startTime: new Date(Date.now() - 7200000),
    progress: 52,
  },
]

const sampleHistoricalJobs = [
  {
    id: "JOB-098",
    platform: "Amazon",
    type: "Initial Scan",
    status: "completed",
    productsScanned: 5000,
    violationsFound: 127,
    started: new Date(Date.now() - 86400000),
    duration: "2h 45m",
  },
  {
    id: "JOB-097",
    platform: "Shopify",
    type: "Re-scan",
    status: "completed",
    productsScanned: 1200,
    violationsFound: 23,
    started: new Date(Date.now() - 172800000),
    duration: "1h 12m",
  },
  {
    id: "JOB-096",
    platform: "Flipkart",
    type: "Targeted Check",
    status: "failed",
    productsScanned: 0,
    violationsFound: 0,
    started: new Date(Date.now() - 259200000),
    duration: "0h 05m",
  },
  {
    id: "JOB-095",
    platform: "eBay",
    type: "Initial Scan",
    status: "completed",
    productsScanned: 3200,
    violationsFound: 89,
    started: new Date(Date.now() - 345600000),
    duration: "1h 58m",
  },
  {
    id: "JOB-094",
    platform: "Amazon",
    type: "Re-scan",
    status: "completed",
    productsScanned: 2800,
    violationsFound: 45,
    started: new Date(Date.now() - 432000000),
    duration: "1h 33m",
  },
]

// Search suggestions data
const searchSuggestions = [
  "Amazon scan jobs",
  "Failed violations",
  "High priority jobs",
  "Electronics category",
  "Clothing violations",
  "Recent completions",
  "OCR processing errors",
  "Rule engine failures",
]

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  loadActiveJobs()
  loadHistoricalJobs()
  startLiveUpdates()
})

function initializeApp() {
  console.log("[v0] Scanner page initialized")
  activeJobs = [...sampleActiveJobs]
  historicalJobs = [...sampleHistoricalJobs]
}

function setupEventListeners() {
  // Global search functionality
  const globalSearch = document.getElementById("globalSearch")
  const searchSuggestions = document.getElementById("searchSuggestions")

  globalSearch.addEventListener("input", handleGlobalSearch)
  globalSearch.addEventListener("focus", showSearchSuggestions)
  globalSearch.addEventListener("blur", hideSearchSuggestions)

  // Form submission
  const startScanBtn = document.getElementById("startScanBtn")
  const scheduleJobBtn = document.getElementById("scheduleJobBtn")

  startScanBtn.addEventListener("click", handleStartScan)
  scheduleJobBtn.addEventListener("click", handleScheduleJob)

  // Refresh jobs
  const refreshJobs = document.getElementById("refreshJobs")
  refreshJobs.addEventListener("click", handleRefreshJobs)

  // Historical jobs search and filter
  const jobSearch = document.getElementById("jobSearch")
  const statusFilter = document.getElementById("statusFilter")

  jobSearch.addEventListener("input", handleJobSearch)
  statusFilter.addEventListener("change", handleStatusFilter)
}

function handleGlobalSearch(event) {
  const query = event.target.value.toLowerCase()
  const suggestionsContainer = document.getElementById("searchSuggestions")

  if (query.length > 0) {
    const filteredSuggestions = searchSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(query))

    if (filteredSuggestions.length > 0) {
      suggestionsContainer.innerHTML = filteredSuggestions
        .map(
          (suggestion) => `
                    <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
                        <i class="fas fa-search"></i>
                        ${suggestion}
                    </div>
                `,
        )
        .join("")
      suggestionsContainer.style.display = "block"
    } else {
      suggestionsContainer.style.display = "none"
    }
  } else {
    suggestionsContainer.style.display = "none"
  }
}

function showSearchSuggestions() {
  const suggestionsContainer = document.getElementById("searchSuggestions")
  if (suggestionsContainer.innerHTML) {
    suggestionsContainer.style.display = "block"
  }
}

function hideSearchSuggestions() {
  setTimeout(() => {
    const suggestionsContainer = document.getElementById("searchSuggestions")
    suggestionsContainer.style.display = "none"
  }, 200)
}

function selectSuggestion(suggestion) {
  const globalSearch = document.getElementById("globalSearch")
  globalSearch.value = suggestion
  hideSearchSuggestions()
  // Perform search action here
  showToast(`Searching for: ${suggestion}`, "info")
}

function handleStartScan() {
  const jobType = document.getElementById("jobType").value
  const priority = document.getElementById("priority").value
  const selectedPlatforms = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(
    (cb) => cb.value,
  )
  const selectedCategories = Array.from(document.getElementById("categories").selectedOptions).map(
    (option) => option.value,
  )

  if (selectedPlatforms.length === 0) {
    showToast("Please select at least one platform", "error")
    return
  }

  // Create new job
  const newJob = {
    id: `JOB-${String(Date.now()).slice(-3)}`,
    platform: selectedPlatforms[0], // Use first selected platform
    type: jobType,
    status: "running",
    priority: priority,
    productsProcessed: 0,
    totalProducts: Math.floor(Math.random() * 3000) + 1000,
    currentProduct: "Initializing...",
    startTime: new Date(),
    progress: 0,
  }

  activeJobs.unshift(newJob)
  loadActiveJobs()
  showToast("Scan job started successfully!", "success")

  // Reset form
  document.getElementById("jobType").value = "initial"
  document.getElementById("priority").value = "medium"
  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false))
  document.getElementById("categories").selectedIndex = -1
}

function handleScheduleJob() {
  showToast("Job scheduling feature coming soon!", "info")
}

function handleRefreshJobs() {
  const refreshBtn = document.getElementById("refreshJobs")
  refreshBtn.style.transform = "rotate(360deg)"

  setTimeout(() => {
    loadActiveJobs()
    updatePipelineStats()
    refreshBtn.style.transform = "rotate(0deg)"
    showToast("Jobs refreshed successfully!", "success")
  }, 1000)
}

function loadActiveJobs() {
  const container = document.getElementById("activeJobsGrid")

  if (activeJobs.length === 0) {
    container.innerHTML = `
            <div class="no-jobs">
                <i class="fas fa-tasks"></i>
                <h3>No Active Jobs</h3>
                <p>Start a new scan job to see it here</p>
            </div>
        `
    return
  }

  container.innerHTML = activeJobs
    .map(
      (job) => `
        <div class="job-card">
            <div class="job-header">
                <div class="job-id">${job.id}</div>
                <div class="job-status ${job.status}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</div>
            </div>
            
            <div class="job-info">
                <div class="job-detail">
                    <span>Platform:</span>
                    <span>${job.platform}</span>
                </div>
                <div class="job-detail">
                    <span>Type:</span>
                    <span>${job.type}</span>
                </div>
                <div class="job-detail">
                    <span>Priority:</span>
                    <span>${job.priority}</span>
                </div>
                <div class="job-detail">
                    <span>Current Product:</span>
                    <span>${job.currentProduct}</span>
                </div>
                <div class="job-detail">
                    <span>Started:</span>
                    <span>${formatTimeAgo(job.startTime)}</span>
                </div>
            </div>
            
            <div class="job-progress">
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${job.productsProcessed}/${job.totalProducts} (${job.progress}%)</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${job.progress}%"></div>
                </div>
            </div>
            
            <div class="job-actions">
                <button class="job-btn pause" onclick="pauseJob('${job.id}')">
                    <i class="fas fa-pause"></i>
                    Pause
                </button>
                <button class="job-btn stop" onclick="stopJob('${job.id}')">
                    <i class="fas fa-stop"></i>
                    Stop
                </button>
                <button class="job-btn details" onclick="viewJobDetails('${job.id}')">
                    <i class="fas fa-eye"></i>
                    Details
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function loadHistoricalJobs() {
  const tbody = document.getElementById("jobsTableBody")
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const pageJobs = historicalJobs.slice(startIndex, endIndex)

  tbody.innerHTML = pageJobs
    .map(
      (job) => `
        <tr>
            <td>${job.id}</td>
            <td>${job.platform}</td>
            <td>${job.type}</td>
            <td><span class="status-badge ${job.status}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span></td>
            <td>${job.productsScanned.toLocaleString()}</td>
            <td>${job.violationsFound}</td>
            <td>${formatDate(job.started)}</td>
            <td>${job.duration}</td>
            <td>
                <button class="action-btn view" onclick="viewJobDetails('${job.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn download" onclick="downloadReport('${job.id}')">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        </tr>
    `,
    )
    .join("")

  updatePagination()
}

function updatePagination() {
  const totalPages = Math.ceil(historicalJobs.length / jobsPerPage)
  const pagination = document.getElementById("pagination")

  let paginationHTML = ""

  // Previous button
  if (currentPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="page-btn active">${i}</button>`
    } else {
      paginationHTML += `<button class="page-btn" onclick="changePage(${i})">${i}</button>`
    }
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`
  }

  pagination.innerHTML = paginationHTML
}

function changePage(page) {
  currentPage = page
  loadHistoricalJobs()
}

function handleJobSearch(event) {
  const query = event.target.value.toLowerCase()
  const filteredJobs = sampleHistoricalJobs.filter(
    (job) =>
      job.id.toLowerCase().includes(query) ||
      job.platform.toLowerCase().includes(query) ||
      job.type.toLowerCase().includes(query),
  )

  historicalJobs = filteredJobs
  currentPage = 1
  loadHistoricalJobs()
}

function handleStatusFilter(event) {
  const status = event.target.value

  if (status === "") {
    historicalJobs = [...sampleHistoricalJobs]
  } else {
    historicalJobs = sampleHistoricalJobs.filter((job) => job.status === status)
  }

  currentPage = 1
  loadHistoricalJobs()
}

function pauseJob(jobId) {
  const job = activeJobs.find((j) => j.id === jobId)
  if (job) {
    job.status = job.status === "paused" ? "running" : "paused"
    loadActiveJobs()
    showToast(`Job ${jobId} ${job.status}`, "info")
  }
}

function stopJob(jobId) {
  const jobIndex = activeJobs.findIndex((j) => j.id === jobId)
  if (jobIndex !== -1) {
    const job = activeJobs[jobIndex]

    // Move to historical jobs
    historicalJobs.unshift({
      id: job.id,
      platform: job.platform,
      type: job.type,
      status: "completed",
      productsScanned: job.productsProcessed,
      violationsFound: Math.floor(job.productsProcessed * 0.05),
      started: job.startTime,
      duration: formatDuration(Date.now() - job.startTime.getTime()),
    })

    // Remove from active jobs
    activeJobs.splice(jobIndex, 1)

    loadActiveJobs()
    loadHistoricalJobs()
    showToast(`Job ${jobId} stopped and moved to history`, "success")
  }
}

function viewJobDetails(jobId) {
  showToast(`Viewing details for job ${jobId}`, "info")
  // Here you would typically open a modal or navigate to a details page
}

function downloadReport(jobId) {
  showToast(`Downloading report for job ${jobId}`, "success")
  // Here you would typically trigger a file download
}

function updatePipelineStats() {
  // Simulate real-time updates
  const stats = {
    productsFound: Math.floor(Math.random() * 100) + 1200,
    imagesProcessed: Math.floor(Math.random() * 50) + 850,
    confidenceAvg: (Math.random() * 10 + 85).toFixed(1),
    failures: Math.floor(Math.random() * 10) + 20,
    reportsGenerated: Math.floor(Math.random() * 20) + 150,
  }

  document.getElementById("productsFound").textContent = stats.productsFound.toLocaleString()
  document.getElementById("imagesProcessed").textContent = stats.imagesProcessed.toLocaleString()
  document.getElementById("confidenceAvg").textContent = stats.confidenceAvg + "%"
  document.getElementById("failures").textContent = stats.failures
  document.getElementById("reportsGenerated").textContent = stats.reportsGenerated
}

function startLiveUpdates() {
  // Update active jobs progress every 5 seconds
  setInterval(() => {
    activeJobs.forEach((job) => {
      if (job.status === "running") {
        job.progress = Math.min(job.progress + Math.random() * 5, 100)
        job.productsProcessed = Math.floor((job.progress / 100) * job.totalProducts)

        // Update current product occasionally
        if (Math.random() < 0.3) {
          const products = ["iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Air M2", "iPad Pro", "AirPods Pro"]
          job.currentProduct = products[Math.floor(Math.random() * products.length)]
        }
      }
    })

    loadActiveJobs()
    updatePipelineStats()
  }, 5000)
}

// Utility functions
function formatTimeAgo(date) {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ago`
  } else {
    return `${minutes}m ago`
  }
}

function formatDate(date) {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}

function showToast(message, type = "info") {
  // Create toast element
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        ${message}
    `

  // Add toast styles
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
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

// CSS for search suggestions
const suggestionStyles = `
    .suggestion-item {
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 1px solid #f1f5f9;
    }
    
    .suggestion-item:hover {
        background: rgba(102, 126, 234, 0.1);
    }
    
    .suggestion-item:last-child {
        border-bottom: none;
    }
    
    .suggestion-item i {
        color: #667eea;
        font-size: 0.9rem;
    }
    
    .no-jobs {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    
    .no-jobs i {
        font-size: 3rem;
        color: #ddd;
        margin-bottom: 1rem;
    }
    
    .no-jobs h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
    }
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
`

// Add styles to document
const styleSheet = document.createElement("style")
styleSheet.textContent = suggestionStyles
document.head.appendChild(styleSheet)

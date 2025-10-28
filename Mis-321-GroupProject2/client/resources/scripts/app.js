// Simple Router and App State
const app = {
  currentPage: 'home',
  navCollapse: null,
  
  init() {
    this.setupNavigation();
    this.renderPage('home');
    
    // Initialize collapse instance once (reuse across calls)
    const navElement = document.getElementById('navbarNav');
    if (navElement) {
      this.navCollapse = bootstrap.Collapse.getOrCreateInstance(navElement);
    }
  },

  setupNavigation() {
    // Use event delegation to handle all data-page clicks (including dynamically added elements)
    document.body.addEventListener('click', (e) => {
      const target = e.target.closest('[data-page]');
      if (target) {
        e.preventDefault();
        const page = target.getAttribute('data-page');
        this.renderPage(page);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        if (target.classList.contains('nav-link')) {
          target.classList.add('active');
        }
        
        // Close navbar menu on mobile after selection (reuse instance)
        if (this.navCollapse && this.navCollapse._element.classList.contains('show')) {
          this.navCollapse.hide();
        }
      }
    });
  },

  renderPage(page) {
    this.currentPage = page;
    const appContainer = document.getElementById('app');
    
    switch(page) {
      case 'home':
        appContainer.innerHTML = this.renderHomePage();
        break;
      case 'calculator':
        appContainer.innerHTML = this.renderCalculatorPage();
        this.initCalculator();
        break;
      case 'breakeven':
        appContainer.innerHTML = this.renderBreakevenPage();
        this.initBreakeven();
        break;
      default:
        appContainer.innerHTML = this.renderHomePage();
    }
  },

  // ============ HOME PAGE ============
  renderHomePage() {
    return `
      <div class="container my-5">
        <!-- Hero Section -->
        <div class="row mb-5">
          <div class="col-lg-12 text-center">
            <h1 class="display-4 fw-bold text-success mb-3">
              <i class="bi bi-leaf"></i> Why Clean Energy Matters
            </h1>
            <p class="lead text-muted">
              Discover how renewable energy can transform our future and protect our planet
            </p>
          </div>
        </div>

        <!-- Benefits Grid -->
        <div class="row g-4 mb-5">
          <!-- Environmental Benefits -->
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-success">
              <div class="card-body text-center">
                <div class="display-4 text-success mb-3">
                  <i class="bi bi-globe"></i>
                </div>
                <h3 class="card-title h5">Environmental Protection</h3>
                <p class="card-text">
                  Clean energy produces little to no greenhouse gas emissions, helping combat climate change 
                  and reduce air pollution. Every kilowatt-hour of renewable energy prevents CO₂ from entering 
                  our atmosphere.
                </p>
              </div>
            </div>
          </div>

          <!-- Economic Benefits -->
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-success">
              <div class="card-body text-center">
                <div class="display-4 text-success mb-3">
                  <i class="bi bi-piggy-bank"></i>
                </div>
                <h3 class="card-title h5">Cost Savings</h3>
                <p class="card-text">
                  Renewable energy costs have dropped dramatically. Solar and wind are now the cheapest sources 
                  of electricity in most markets. Homeowners can save thousands on energy bills over time.
                </p>
              </div>
            </div>
          </div>

          <!-- Energy Independence -->
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-success">
              <div class="card-body text-center">
                <div class="display-4 text-success mb-3">
                  <i class="bi bi-lightning-charge"></i>
                </div>
                <h3 class="card-title h5">Energy Independence</h3>
                <p class="card-text">
                  Generate your own power and reduce reliance on the grid. Clean energy provides energy 
                  security and protection from volatile fossil fuel prices.
                </p>
              </div>
            </div>
          </div>

          <!-- Health Benefits -->
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-success">
              <div class="card-body text-center">
                <div class="display-4 text-success mb-3">
                  <i class="bi bi-heart-pulse"></i>
                </div>
                <h3 class="card-title h5">Health Improvements</h3>
                <p class="card-text">
                  Reduced air pollution from clean energy sources means fewer respiratory illnesses, 
                  heart problems, and premature deaths. Cleaner air benefits everyone.
                </p>
              </div>
            </div>
          </div>

          <!-- Job Creation -->
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-success">
              <div class="card-body text-center">
                <div class="display-4 text-success mb-3">
                  <i class="bi bi-people"></i>
                </div>
                <h3 class="card-title h5">Job Creation</h3>
                <p class="card-text">
                  The renewable energy sector is one of the fastest-growing industries, creating millions 
                  of jobs in manufacturing, installation, and maintenance.
                </p>
              </div>
            </div>
          </div>

          <!-- Sustainability -->
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-success">
              <div class="card-body text-center">
                <div class="display-4 text-success mb-3">
                  <i class="bi bi-recycle"></i>
                </div>
                <h3 class="card-title h5">Sustainable Future</h3>
                <p class="card-text">
                  Unlike fossil fuels, renewable energy sources like solar and wind are inexhaustible. 
                  We can power our world for generations without depleting resources.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Statistics -->
        <div class="row mb-5">
          <div class="col-lg-12">
            <div class="card bg-light">
              <div class="card-body">
                <h2 class="card-title text-center mb-4">Renewable Energy by the Numbers</h2>
                <div class="row text-center">
                  <div class="col-md-4 mb-3">
                    <h3 class="display-5 text-success fw-bold">90%</h3>
                    <p class="text-muted">Reduction in solar panel costs since 2010</p>
                  </div>
                  <div class="col-md-4 mb-3">
                    <h3 class="display-5 text-success fw-bold">12M+</h3>
                    <p class="text-muted">Jobs in renewable energy worldwide</p>
                  </div>
                  <div class="col-md-4 mb-3">
                    <h3 class="display-5 text-success fw-bold">29%</h3>
                    <p class="text-muted">Of global electricity from renewables (2023)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <div class="card bg-success text-white">
              <div class="card-body py-5">
                <h2 class="card-title mb-3">Ready to Take Action?</h2>
                <p class="lead mb-4">
                  Calculate your carbon footprint and explore how renewable energy can benefit your household
                </p>
                <div class="d-flex justify-content-center gap-3 flex-wrap">
                  <button class="btn btn-action-calc btn-lg" data-page="calculator">
                    <i class="bi bi-calculator"></i> Calculate Your Emissions
                  </button>
                  <button class="btn btn-action-analyze btn-lg" data-page="breakeven">
                    <i class="bi bi-graph-up"></i> Analyze Your Savings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ============ CARBON CALCULATOR PAGE ============
  renderCalculatorPage() {
    return `
      <div class="container my-5">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h1 class="display-5 fw-bold text-center mb-4">
              <i class="bi bi-calculator"></i> Carbon Footprint Calculator
            </h1>
            <p class="lead text-center text-muted mb-5">
              Calculate your annual carbon emissions based on your lifestyle
            </p>

            <div class="card shadow-sm">
              <div class="card-body p-4">
                <form id="carbonForm">
                  <!-- Electricity Usage -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-lightning-charge text-warning"></i> Electricity Usage
                    </label>
                    <div class="input-group">
                      <input type="number" class="form-control" id="electricity" placeholder="Average monthly kWh" min="0" value="900">
                      <span class="input-group-text">kWh/month</span>
                    </div>
                    <small class="text-muted">Average US household: 900 kWh/month</small>
                  </div>

                  <!-- Natural Gas -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-fire text-danger"></i> Natural Gas Usage
                    </label>
                    <div class="input-group">
                      <input type="number" class="form-control" id="naturalGas" placeholder="Monthly therms" min="0" value="40">
                      <span class="input-group-text">therms/month</span>
                    </div>
                    <small class="text-muted">Average US household: 40 therms/month</small>
                  </div>

                  <!-- Vehicle Miles -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-car-front text-primary"></i> Vehicle Miles Driven
                    </label>
                    <div class="input-group">
                      <input type="number" class="form-control" id="miles" placeholder="Annual miles" min="0" value="12000">
                      <span class="input-group-text">miles/year</span>
                    </div>
                    <small class="text-muted">Average US driver: 12,000 miles/year</small>
                  </div>

                  <!-- Vehicle MPG -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-speedometer2 text-info"></i> Vehicle Fuel Efficiency
                    </label>
                    <div class="input-group">
                      <input type="number" class="form-control" id="mpg" placeholder="Miles per gallon" min="1" value="25">
                      <span class="input-group-text">MPG</span>
                    </div>
                    <small class="text-muted">Average US vehicle: 25 MPG</small>
                  </div>

                  <!-- Flights -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-airplane text-secondary"></i> Air Travel
                    </label>
                    <div class="input-group">
                      <input type="number" class="form-control" id="flights" placeholder="Round-trip flights" min="0" value="2">
                      <span class="input-group-text">flights/year</span>
                    </div>
                    <small class="text-muted">Short-haul round-trip flights (under 3 hours each way)</small>
                  </div>

                  <!-- Calculate Button -->
                  <div class="d-grid">
                    <button type="submit" class="btn btn-success btn-lg">
                      <i class="bi bi-calculator"></i> Calculate My Footprint
                    </button>
                  </div>
                </form>

                <!-- Results Section -->
                <div id="carbonResults" class="mt-4" style="display: none;">
                  <hr>
                  <h4 class="text-center mb-3">Your Annual Carbon Footprint</h4>
                  <div class="alert alert-info text-center">
                    <h2 class="display-4 fw-bold mb-2">
                      <span id="totalEmissions">0</span> <small>tons CO₂</small>
                    </h2>
                  </div>

                  <!-- Breakdown -->
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="card bg-light">
                        <div class="card-body text-center">
                          <h6 class="text-muted">Electricity</h6>
                          <h4 class="text-warning"><span id="electricityEmissions">0</span> tons</h4>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="card bg-light">
                        <div class="card-body text-center">
                          <h6 class="text-muted">Natural Gas</h6>
                          <h4 class="text-danger"><span id="gasEmissions">0</span> tons</h4>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="card bg-light">
                        <div class="card-body text-center">
                          <h6 class="text-muted">Vehicle</h6>
                          <h4 class="text-primary"><span id="vehicleEmissions">0</span> tons</h4>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="card bg-light">
                        <div class="card-body text-center">
                          <h6 class="text-muted">Flights</h6>
                          <h4 class="text-secondary"><span id="flightEmissions">0</span> tons</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Comparison -->
                  <div class="alert alert-warning mt-4">
                    <h6 class="fw-bold">Comparison:</h6>
                    <p class="mb-0">
                      <i class="bi bi-info-circle"></i> 
                      Average US household: ~48 tons CO₂/year<br>
                      <span id="comparison"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initCalculator() {
    const form = document.getElementById('carbonForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.calculateCarbon();
    });
  },

  calculateCarbon() {
    // Get input values with validation
    const electricity = Math.max(0, parseFloat(document.getElementById('electricity').value) || 0);
    const naturalGas = Math.max(0, parseFloat(document.getElementById('naturalGas').value) || 0);
    const miles = Math.max(0, parseFloat(document.getElementById('miles').value) || 0);
    const mpgRaw = parseFloat(document.getElementById('mpg').value) || 25;
    const mpg = Math.max(1, mpgRaw); // Ensure MPG is at least 1 to prevent division by zero
    const flights = Math.max(0, parseFloat(document.getElementById('flights').value) || 0);

    // Emission factors (approximate) - Based on US EPA and EIA data
    const electricityFactor = 0.92; // lbs CO2 per kWh (US grid average, 2023)
    const gasFactor = 11.7; // lbs CO2 per therm (natural gas combustion)
    const gasolineFactor = 19.6; // lbs CO2 per gallon (gasoline combustion)
    const flightFactor = 1100; // lbs CO2 per round-trip short-haul flight (< 3 hours each way)

    // Calculate emissions (in pounds, then convert to tons)
    const electricityEmissions = (electricity * 12 * electricityFactor) / 2000;
    const gasEmissions = (naturalGas * 12 * gasFactor) / 2000;
    const vehicleEmissions = ((miles / mpg) * gasolineFactor) / 2000;
    const flightEmissions = (flights * flightFactor) / 2000;

    const totalEmissions = electricityEmissions + gasEmissions + vehicleEmissions + flightEmissions;

    // Update UI
    document.getElementById('electricityEmissions').textContent = electricityEmissions.toFixed(2);
    document.getElementById('gasEmissions').textContent = gasEmissions.toFixed(2);
    document.getElementById('vehicleEmissions').textContent = vehicleEmissions.toFixed(2);
    document.getElementById('flightEmissions').textContent = flightEmissions.toFixed(2);
    document.getElementById('totalEmissions').textContent = totalEmissions.toFixed(2);

    // Comparison
    const avgHousehold = 48;
    const percentDiff = ((totalEmissions - avgHousehold) / avgHousehold) * 100;
    const absPercent = Math.round(Math.abs(percentDiff));
    const comparisonText = totalEmissions > avgHousehold 
      ? `You emit ${absPercent}% more than average`
      : `You emit ${absPercent}% less than average`;
    
    document.getElementById('comparison').innerHTML = `<strong>${comparisonText}</strong>`;

    // Show results
    document.getElementById('carbonResults').style.display = 'block';
    document.getElementById('carbonResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  // ============ BREAKEVEN CALCULATOR PAGE ============
  renderBreakevenPage() {
    return `
      <div class="container my-5">
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <h1 class="display-5 fw-bold text-center mb-4">
              <i class="bi bi-graph-up"></i> Renewable Energy Breakeven Calculator
            </h1>
            <p class="lead text-center text-muted mb-5">
              Calculate how long it will take for solar panels to pay for themselves
            </p>

            <div class="card shadow-sm">
              <div class="card-body p-4">
                <form id="breakevenForm">
                  <div class="row">
                    <!-- Current Energy Costs -->
                    <div class="col-md-6">
                      <h5 class="mb-3 text-success">
                        <i class="bi bi-receipt"></i> Current Energy Costs
                      </h5>

                      <div class="mb-3">
                        <label class="form-label">Cost per kWh</label>
                        <div class="input-group">
                          <span class="input-group-text">$</span>
                          <input type="number" class="form-control" id="costPerKwh" placeholder="0.14" step="0.01" min="0" value="0.14">
                          <span class="input-group-text">/kWh</span>
                        </div>
                        <small class="text-muted">US average: $0.14/kWh</small>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Annual Energy Usage</label>
                        <div class="input-group">
                          <input type="number" class="form-control" id="annualUsage" placeholder="10800" min="0" value="10800">
                          <span class="input-group-text">kWh/year</span>
                        </div>
                        <small class="text-muted">Average home: 10,800 kWh/year</small>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Expected Rate Increase</label>
                        <div class="input-group">
                          <input type="number" class="form-control" id="rateIncrease" placeholder="3" step="0.1" min="0" value="3">
                          <span class="input-group-text">% per year</span>
                        </div>
                        <small class="text-muted">Historic average: 2-4%</small>
                      </div>
                    </div>

                    <!-- Solar System Costs -->
                    <div class="col-md-6">
                      <h5 class="mb-3 text-warning">
                        <i class="bi bi-sun"></i> Solar System Details
                      </h5>

                      <div class="mb-3">
                        <label class="form-label">System Size</label>
                        <div class="input-group">
                          <input type="number" class="form-control" id="systemSize" placeholder="8" step="0.1" min="0" value="8">
                          <span class="input-group-text">kW</span>
                        </div>
                        <small class="text-muted">Typical home: 6-10 kW</small>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Cost per Watt</label>
                        <div class="input-group">
                          <span class="input-group-text">$</span>
                          <input type="number" class="form-control" id="costPerWatt" placeholder="2.75" step="0.01" min="0" value="2.75">
                          <span class="input-group-text">/watt</span>
                        </div>
                        <small class="text-muted">2024 average: $2.50-$3.50/watt</small>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Federal Tax Credit</label>
                        <div class="input-group">
                          <input type="number" class="form-control" id="taxCredit" placeholder="30" step="1" min="0" max="100" value="30">
                          <span class="input-group-text">%</span>
                        </div>
                        <small class="text-muted">Current federal credit: 30%</small>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">State/Local Incentives</label>
                        <div class="input-group">
                          <span class="input-group-text">$</span>
                          <input type="number" class="form-control" id="stateIncentives" placeholder="0" min="0" value="0">
                        </div>
                        <small class="text-muted">Varies by location</small>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">System Efficiency</label>
                        <div class="input-group">
                          <input type="number" class="form-control" id="efficiency" placeholder="85" step="1" min="0" max="100" value="85">
                          <span class="input-group-text">%</span>
                        </div>
                        <small class="text-muted">Accounts for weather, shading, etc.</small>
                      </div>
                    </div>
                  </div>

                  <!-- Calculate Button -->
                  <div class="d-grid mt-4">
                    <button type="submit" class="btn btn-success btn-lg">
                      <i class="bi bi-calculator"></i> Calculate Breakeven Point
                    </button>
                  </div>
                </form>

                <!-- Results Section -->
                <div id="breakevenResults" class="mt-4" style="display: none;">
                  <hr>
                  <h4 class="text-center mb-4">Your Solar Investment Analysis</h4>
                  
                  <!-- Key Metrics -->
                  <div class="row g-3 mb-4">
                    <div class="col-md-4">
                      <div class="card bg-success text-white text-center h-100">
                        <div class="card-body d-flex flex-column justify-content-center" style="min-height: 120px;">
                          <h6 class="text-uppercase mb-2">Breakeven Time</h6>
                          <h2 class="display-6 fw-bold mb-0"><span id="breakevenYears">0</span> years</h2>
                          <p class="mb-0" style="visibility: hidden;">spacer</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="card bg-warning text-center h-100">
                        <div class="card-body d-flex flex-column justify-content-center" style="min-height: 120px;">
                          <h6 class="text-uppercase mb-2">Total System Cost</h6>
                          <h2 class="display-6 fw-bold mb-0">$<span id="totalCost">0</span></h2>
                          <small class="text-muted">After incentives</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="card bg-info text-white text-center h-100">
                        <div class="card-body d-flex flex-column justify-content-center" style="min-height: 120px;">
                          <h6 class="text-uppercase mb-2">25-Year Savings</h6>
                          <h2 class="display-6 fw-bold mb-0">$<span id="totalSavings">0</span></h2>
                          <p class="mb-0" style="visibility: hidden;">spacer</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Detailed Breakdown -->
                  <div class="card bg-light">
                    <div class="card-body">
                      <h5 class="mb-3">Cost Breakdown</h5>
                      <table class="table table-sm">
                        <tbody>
                          <tr>
                            <td>System Cost (before incentives)</td>
                            <td class="text-end fw-bold">$<span id="costBefore">0</span></td>
                          </tr>
                          <tr>
                            <td>Federal Tax Credit (<span id="taxCreditPercent">30</span>%)</td>
                            <td class="text-end text-success">-$<span id="taxCreditAmount">0</span></td>
                          </tr>
                          <tr>
                            <td>State/Local Incentives</td>
                            <td class="text-end text-success">-$<span id="stateIncentivesAmount">0</span></td>
                          </tr>
                          <tr class="table-primary">
                            <td><strong>Net System Cost</strong></td>
                            <td class="text-end"><strong>$<span id="netCost">0</span></strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="card bg-light mt-3">
                    <div class="card-body">
                      <h5 class="mb-3">Annual Performance</h5>
                      <table class="table table-sm">
                        <tbody>
                          <tr>
                            <td>Annual Energy Production</td>
                            <td class="text-end fw-bold"><span id="annualProduction">0</span> kWh/year</td>
                          </tr>
                          <tr>
                            <td>% of Usage Covered</td>
                            <td class="text-end fw-bold"><span id="percentCovered">0</span>%</td>
                          </tr>
                          <tr>
                            <td>First Year Savings</td>
                            <td class="text-end text-success fw-bold">$<span id="firstYearSavings">0</span></td>
                          </tr>
                          <tr>
                            <td>Annual Maintenance Cost</td>
                            <td class="text-end">$<span id="maintenance">100</span>/year</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Timeline -->
                  <div class="alert alert-info mt-4">
                    <h6 class="fw-bold"><i class="bi bi-calendar-check"></i> Investment Timeline:</h6>
                    <ul class="mb-0">
                      <li class="mb-2"><strong>Break Even:</strong> Year <span id="breakevenYear">0</span> — You'll have recovered your initial investment</li>
                      <li class="mb-2"><strong>10 Years:</strong> Estimated cumulative savings of $<span id="savings10">0</span></li>
                      <li><strong>25 Years:</strong> Estimated cumulative savings of $<span id="savings25">0</span></li>
                    </ul>
                  </div>

                  <!-- Environmental Impact -->
                  <div class="alert alert-success">
                    <h6 class="fw-bold"><i class="bi bi-leaf"></i> Environmental Impact:</h6>
                    <p class="mb-0">
                      Over 25 years, your solar system will offset approximately 
                      <strong><span id="co2Offset">0</span> tons of CO₂</strong> emissions—equivalent to 
                      planting <strong><span id="treesEquivalent">0</span> trees</strong>!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initBreakeven() {
    const form = document.getElementById('breakevenForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.calculateBreakeven();
    });
  },

  calculateBreakeven() {
    // Get input values with validation (ensure no negative values)
    const costPerKwh = Math.max(0, parseFloat(document.getElementById('costPerKwh').value) || 0.14);
    const annualUsage = Math.max(0, parseFloat(document.getElementById('annualUsage').value) || 10800);
    const rateIncrease = Math.max(0, parseFloat(document.getElementById('rateIncrease').value) || 3);
    const systemSize = Math.max(0, parseFloat(document.getElementById('systemSize').value) || 8);
    const costPerWatt = Math.max(0, parseFloat(document.getElementById('costPerWatt').value) || 2.75);
    const taxCredit = Math.max(0, parseFloat(document.getElementById('taxCredit').value) || 30);
    const stateIncentives = Math.max(0, parseFloat(document.getElementById('stateIncentives').value) || 0);
    const efficiency = Math.max(0, Math.min(100, parseFloat(document.getElementById('efficiency').value) || 85)); // Clamp between 0-100%

    // Calculate system costs
    const systemCostBefore = systemSize * 1000 * costPerWatt;
    const taxCreditAmount = systemCostBefore * (taxCredit / 100);
    const netSystemCost = systemCostBefore - taxCreditAmount - stateIncentives;

    // Calculate annual production (kWh)
    // Typical US production: 1 kW system produces ~1,400 kWh/year (varies by location)
    // Range: 1,200-1,800 kWh per kW depending on geographic location and sun hours
    const avgProductionPerKW = 1400; // kWh per kW per year (US average)
    const annualProduction = systemSize * avgProductionPerKW * (efficiency / 100);
    const percentCovered = Math.min((annualProduction / annualUsage * 100), 100);

    // Calculate savings
    const firstYearSavings = annualProduction * costPerKwh;
    const maintenanceCost = Math.max(0, systemSize * 12); // Annual maintenance: ~$12 per kW

    // Calculate breakeven with increasing utility rates
    let cumulativeSavings = 0;
    let breakevenYears = 0;
    let savings10 = 0;
    let savings25 = 0;
    const maxYears = 30;
    
    for (let year = 1; year <= maxYears; year++) {
      const yearlyRate = costPerKwh * Math.pow(1 + (rateIncrease / 100), year - 1);
      const yearlySavings = (annualProduction * yearlyRate) - maintenanceCost;
      cumulativeSavings += yearlySavings;
      
      // Calculate breakeven point
      if (cumulativeSavings >= netSystemCost && breakevenYears === 0) {
        const prevCumulative = cumulativeSavings - yearlySavings;
        const neededToBreakeven = netSystemCost - prevCumulative;
        breakevenYears = year - 1 + (neededToBreakeven / yearlySavings);
      }
      
      // Capture savings at specific years
      if (year === 10) savings10 = cumulativeSavings;
      if (year === 25) savings25 = cumulativeSavings;
      
      // Early exit optimization: if we've calculated breakeven and are past year 25, stop
      if (breakevenYears > 0 && year > 25) break;
    }

    // Handle case where breakeven is never reached (set to a large number)
    if (breakevenYears === 0) {
      breakevenYears = 999; // Indicate system will not pay for itself
    }

    // Environmental calculations
    // Based on US grid average: 0.92 lbs CO2 per kWh ÷ 2000 = tons CO2 per kWh
    const co2OffsetPerKwh = 0.92 / 2000; // tons CO2 per kWh
    const co2Offset = (annualProduction * 25 * co2OffsetPerKwh).toFixed(1);
    const treesEquivalent = Math.round(co2Offset * 16); // rough estimate: 1 ton CO2 = 16 trees

    // Update UI
    const breakevenText = breakevenYears >= 999 ? 'Never' : breakevenYears.toFixed(1);
    document.getElementById('breakevenYears').textContent = breakevenText;
    document.getElementById('totalCost').textContent = netSystemCost.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('totalSavings').textContent = savings25.toLocaleString('en-US', {maximumFractionDigits: 0});
    
    document.getElementById('costBefore').textContent = systemCostBefore.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('taxCreditPercent').textContent = taxCredit;
    document.getElementById('taxCreditAmount').textContent = taxCreditAmount.toLocaleString('en-US', {maximumFractionDigits: 0});
    // Display state incentives (already formatted with -$ in template)
    document.getElementById('stateIncentivesAmount').textContent = Math.round(stateIncentives).toLocaleString('en-US');
    document.getElementById('netCost').textContent = netSystemCost.toLocaleString('en-US', {maximumFractionDigits: 0});
    
    document.getElementById('annualProduction').textContent = annualProduction.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('percentCovered').textContent = percentCovered.toFixed(0);
    document.getElementById('firstYearSavings').textContent = firstYearSavings.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.getElementById('maintenance').textContent = maintenanceCost.toLocaleString('en-US', {maximumFractionDigits: 2});
    
    const breakevenYearText = breakevenYears >= 999 ? '30+' : Math.ceil(breakevenYears).toString();
    document.getElementById('breakevenYear').textContent = breakevenYearText;
    document.getElementById('savings10').textContent = savings10.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('savings25').textContent = savings25.toLocaleString('en-US', {maximumFractionDigits: 0});
    
    document.getElementById('co2Offset').textContent = co2Offset;
    document.getElementById('treesEquivalent').textContent = treesEquivalent.toLocaleString('en-US');

    // Show results
    document.getElementById('breakevenResults').style.display = 'block';
    document.getElementById('breakevenResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});


$(document).ready(function () {
    // Data for available PC parts with pricing
    const pcParts = {
        cpu: [
            { name: "Intel Core i9", price: 500 },
            { name: "Intel Core i7", price: 350 },
            { name: "Intel Core i5", price: 250 },
            { name: "AMD Ryzen 9", price: 500 },
            { name: "AMD Ryzen 7", price: 300 },
            { name: "AMD Ryzen 5", price: 200 },
        ],
        gpu: [
            { name: "RTX 40 Series", price: 700 },
            { name: "RTX 30 Series", price: 500 },
            { name: "GTX 10 Series", price: 350 },
            { name: "GTX 16 Series", price: 200 },
            { name: "AMD RX9000 Series", price: 750 },
            { name: "AMD RX8000 Series", price: 600 },
            { name: "AMD RX7000 Series", price: 500 },
            { name: "AMD RX6000 Series", price: 350 },
        ],
        ram: [
            { name: "16GB", price: 120 },
            { name: "32GB", price: 170 },
            { name: "64GB", price: 220 },
            { name: "128GB", price: 300 },
        ],
        cooler: [
            { name: "Cooler Master", price: 90 },
            { name: "NZXT Kraken", price: 220 },
            { name: "Corsair iCUE", price: 170 },
        ],
        motherboard: [
            { name: "MSI B500", price: 140 },
            { name: "ASUS ROG", price: 250 },
            { name: "Gigabyte D3SH", price: 160 },
            { name: "Gigabyte Aorus Elite", price: 280 },
            { name: "MSI MAG", price: 300 },
        ],
        storage: [
            { name: "500GB SSD", price: 50 },
            { name: "1TB SSD", price: 100 },
            { name: "2TB SSD", price: 160 },
            { name: "500GB HDD", price: 25 },
            { name: "1TB HDD", price: 50 },
            { name: "2TB SSD", price: 100 },
        ],
        case: [
            { name: "NZXT H510", price: 100 },
            { name: "Corsair iCUE 4000X", price: 160 },
            { name: "GAMEPOWER Warcry", price: 140 },
            { name: "Phanteks P400A", price: 120 },
            { name: "Asus TUF GT301", price: 110 },
        ],
        powerSupply: [
            { name: "650W", price: 70 },
            { name: "750W", price: 100 },
            { name: "1000W", price: 160 },
        ],
    };

    let selectedFilters = {
        budget: null,
        parts: [],
    };

    // Handle adding new part selection
    $("#add-part").on("click", function () {
        const partSelectHTML = `
          <div class="form-group part-container">
            <label for="part-type">Choose Part Type</label>
            <select class="form-control part-type" required>
              <option value="">Select Part</option>
              <option value="cpu">CPU</option>
              <option value="gpu">GPU</option>
              <option value="ram">RAM</option>
              <option value="cooler">Cooler</option>
              <option value="motherboard">Motherboard</option>
              <option value="storage">Storage</option>
              <option value="case">Case</option>
              <option value="powerSupply">Power Supply</option>
            </select>
            <label for="part-value">Choose Specific Item</label>
            <select class="form-control part-value" disabled required>
              <option value="">Select Part First</option>
            </select>
            <button type="button" class="btn btn-danger remove-part">Remove Part</button>
          </div>
        `;
        $("#part-container").append(partSelectHTML);
    });

    // Handles types for each part
    $(document).on("change", ".part-type", function () {
        const partType = $(this).val();
        const partValueSelect = $(this).closest(".part-container").find(".part-value");
        partValueSelect.empty();

        if (partType && pcParts[partType]) {
            partValueSelect.removeAttr("disabled");
            pcParts[partType].forEach((item) => {
                const optionText = `${item.name} - $${item.price}`;
                partValueSelect.append(new Option(optionText, JSON.stringify(item)));
            });
        } else {
            partValueSelect.attr("disabled", true);
            partValueSelect.append(new Option("Select Part First", ""));
        }
    });

    // Remove part on click
    $(document).on("click", ".remove-part", function () {
        $(this).closest(".part-container").remove();
    });

    // Handle search submission
    $("#filter-form").on("submit", function (e) {
        e.preventDefault();

        const budget = $("#budget").val();
        const parts = [];

        // Make sure budget is a number
        if (!budget || isNaN(budget) || budget <= 0) {
            alert("Please enter a valid budget");
            return;
        }

        // Collect selected parts
        $(".part-container").each(function () {
            const partType = $(this).find(".part-type").val();
            const partValue = $(this).find(".part-value").val();
            if (partType && partValue) {
                const selectedPart = JSON.parse(partValue);
                parts.push({
                    partType,
                    name: selectedPart.name,
                    price: selectedPart.price,
                });
            }
        });

        // Store selected filters
        selectedFilters = { budget, parts };

        // Call AI for feedback
        AIResponse(selectedFilters);

        // Display the selected filters
        if (parts.length > 0) {
            $("#pc-cards").html(
                `<p>Filtered by Budget: $${budget}</p><p>Selected Parts:</p><ul>${parts.map(
                    (part) => `<li>${part.name} - $${part.price}</li>`
                ).join("")}</ul>`
            );
        } else {
            alert("Please select parts to build a PC.");
        }
    });

    // AI response function gemini call
    async function AIResponse(filters) {
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB0LQnI2MGX8ASm4_ZO-1Y6Wf_gTzrF408';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: `Budget: $${filters.budget}` },
                                { text: `Parts Selected: ${JSON.stringify(filters.parts)}` }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();

            // Check if the response contains the expected content
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const feedback = data.candidates[0].content.parts[0].text.trim();
                // Display the AI feedback in the UI
                $('#pc-cards').append(`<p><strong>AI Feedback:</strong> ${feedback}</p>`);
            } else {
                $('#pc-cards').append(`<p><strong>AI Feedback:</strong> Unable to generate feedback. Please try again later.</p>`);
            }

        } catch (error) {
            console.error("Error fetching AI response:", error);
            $('#pc-cards').append(`<p><strong>AI Feedback:</strong> There was an error retrieving the AI response. Please try again later.</p>`);
        }
    }
});
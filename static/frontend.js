document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    const chatForm = document.getElementById('chat-form');
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const chatSubmitButton = document.getElementById('chat-submit');
    const reportContainer = document.getElementById('report-container');
    let initialResearchDone = false;
    let companyName = '';

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        console.log('Chat form submitted with message:', message);
        
        if (!message) {
            console.log('Message is empty, not proceeding with submission');
            return;
        }

        addMessageToChat('user', message);
        chatInput.value = '';
        chatSubmitButton.disabled = true;

        if (!initialResearchDone) {
            companyName = message;
            console.log(`Initial research not done, starting it for company: ${companyName}`);
            addMessageToChat('ai', "Report is being prepared. Please wait...");

            fetch('/run-script', {
                method: 'POST',
                body: JSON.stringify({ company: companyName }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => {
                console.log('Received response from /run-script');
                return response.json();
            })
            .then(data => {
                initialResearchDone = true;
                console.log('Initial research done, fetching report for company:', companyName);
                fetchReport(companyName);
            })
            .catch(error => {
                console.error('Error during /run-script fetch:', error);
                addMessageToChat('ai', 'An error occurred while preparing the report.');
            })
            .finally(() => {
                chatSubmitButton.disabled = false;
            });
        } else {
            console.log('Handling subsequent user interactions');
            interactWithUser(message);
        }
    });
    

    // Function to add messages to the chat
    function addMessageToChat(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = text; // Use innerHTML to allow HTML content
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
    }

    // Function to fetch and display report content
    function fetchReport(company) {
        fetch(`/get-report?company=${encodeURIComponent(company)}`)
            .then(response => response.json())
            .then(data => {
                // Function to display report content goes here
                displayReport(data);
            })
            .catch(error => console.error('Error fetching report:', error));
    }
    

    function displayLegalCompanyName(sectionContent) {
        const companyNameElement = document.getElementById('legal-company-name');
        if (!companyNameElement) {
            console.error('Legal company name element not found in the document.');
            return;
        }
    
        companyNameElement.innerHTML = '';
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Legal Company Name:';
        companyNameElement.appendChild(sectionTitle);
    
        // Extract the key which contains the actual legal company name data
        const firebaseKey = Object.keys(sectionContent)[0];
        let parsedData;
    
        try {
            // Attempt to parse the JSON string
            parsedData = JSON.parse(sectionContent[firebaseKey]);
        } catch (error) {
            console.error('Error parsing legal company name data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Legal company name data is not available due to a parsing error.';
            companyNameElement.appendChild(errorMessage);
            return;
        }
    
        // Process the legal company name if it exists
        if (parsedData && parsedData.name) {
            const nameElement = document.createElement('p');
            nameElement.textContent = `Name: ${parsedData.name}`;
            companyNameElement.appendChild(nameElement);
        } else {
            console.error('Legal company name data is missing or structured incorrectly:', parsedData);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Legal company name data is missing or structured incorrectly.';
            companyNameElement.appendChild(errorMessage);
        }
    }
    
    
    
    
    
    


    

    function displayHeadquarters(sectionContent) {
        const headquartersElement = document.getElementById('headquarters');
        if (!headquartersElement) {
            console.error('Headquarters element not found in the document.');
            return;
        }
    
        headquartersElement.innerHTML = '';
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Headquarters:';
        headquartersElement.appendChild(sectionTitle);
    
        // Extract the key which contains the actual headquarters data
        const firebaseKey = Object.keys(sectionContent)[0];
        let parsedData;
    
        try {
            // Attempt to parse the JSON string
            parsedData = JSON.parse(sectionContent[firebaseKey]);
        } catch (error) {
            console.error('Error parsing headquarters data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Headquarters data is not available due to a parsing error.';
            headquartersElement.appendChild(errorMessage);
            return;
        }
    
        // Process the headquarters location if it exists
        if (parsedData && parsedData.location) {
            const addressElement = document.createElement('p');
            addressElement.textContent = `Location: ${parsedData.location}`;
            headquartersElement.appendChild(addressElement);
        } else {
            console.error('Headquarters data is missing or structured incorrectly:', parsedData);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Headquarters data is missing or structured incorrectly.';
            headquartersElement.appendChild(errorMessage);
        }
    }
    
    
    
    

    function displayYearIncorporated(sectionContent) {
        const yearIncorporatedElement = document.getElementById('year-incorporated');
        if (!yearIncorporatedElement) {
            console.error('Year Incorporated element not found in the document.');
            return;
        }
    
        yearIncorporatedElement.innerHTML = '';
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Year Incorporated:';
        yearIncorporatedElement.appendChild(sectionTitle);
    
        // Extract the key which contains the actual year incorporated data
        const firebaseKey = Object.keys(sectionContent)[0];
        let parsedData;
    
        try {
            // Attempt to parse the JSON string. If the string begins with '{', it's assumed to be JSON
            parsedData = sectionContent[firebaseKey].startsWith('{') 
                         ? JSON.parse(sectionContent[firebaseKey]) 
                         : sectionContent[firebaseKey];
        } catch (error) {
            console.error('Error parsing year incorporated data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Year Incorporated data is not available due to a parsing error.';
            yearIncorporatedElement.appendChild(errorMessage);
            return;
        }
    
        // Process the parsed data
        if (parsedData && parsedData.year) {
            const yearElement = document.createElement('p');
            yearElement.textContent = `Year Incorporated: ${parsedData.year}`;
            yearIncorporatedElement.appendChild(yearElement);
        } else {
            console.error('Year of incorporation data is missing or not in the expected format.');
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Year Incorporated data is missing.';
            yearIncorporatedElement.appendChild(errorMessage);
        }
    }
    
    

    function displayBriefSynopsis(sectionContent) {
        const briefSynopsisElement = document.getElementById('brief-synopsis');
        if (!briefSynopsisElement) {
            console.error('Brief synopsis element not found in the document.');
            return;
        }
    
        briefSynopsisElement.innerHTML = '';
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Brief Synopsis:';
        briefSynopsisElement.appendChild(sectionTitle);
    
        // Extract the key which contains the actual brief synopsis data
        const firebaseKey = Object.keys(sectionContent)[0];
        let parsedData;
    
        try {
            parsedData = JSON.parse(sectionContent[firebaseKey]);
        } catch (error) {
            console.error('Error parsing brief synopsis data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Brief synopsis data is not available due to a parsing error.';
            briefSynopsisElement.appendChild(errorMessage);
            return;
        }
    
        // Process the parsed data
        if (parsedData && parsedData.synopsis) {
            const synopsisElement = document.createElement('p');
            synopsisElement.textContent = parsedData.synopsis;
            briefSynopsisElement.appendChild(synopsisElement);
        } else {
            console.error('Synopsis data is missing or not in the expected format.');
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Brief synopsis data is missing.';
            briefSynopsisElement.appendChild(errorMessage);
        }
    }
    

    function displayLinesOfBusiness(businessLinesData) {
        const linesOfBusinessElement = document.getElementById('lines-of-business');
        if (!linesOfBusinessElement) {
            console.error('Lines of business element not found in the document.');
            return;
        }
    
        linesOfBusinessElement.innerHTML = '';
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Line(s) of business:';
        linesOfBusinessElement.appendChild(sectionTitle);
    
        // Extract the key which contains the actual lines of business data
        const firebaseKey = Object.keys(businessLinesData)[0];
        let parsedData;
        
        try {
            parsedData = JSON.parse(businessLinesData[firebaseKey]);
        } catch (error) {
            console.error('Error parsing lines of business data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Lines of business data is not available due to a parsing error.';
            linesOfBusinessElement.appendChild(errorMessage);
            return;
        }
    
        // Display primary business lines
        if (parsedData.primary_business_lines) {
            parsedData.primary_business_lines.forEach((line) => {
                const lineElement = document.createElement('p');
                lineElement.innerHTML = `<strong>${line.line_name}:</strong> ${line.description}`;
                linesOfBusinessElement.appendChild(lineElement);
        
                // Assuming sub_details is an array of sub-detail objects
                if (line.sub_details) {
                    line.sub_details.forEach((subDetail) => {
                        const subDetailElement = document.createElement('p');
                        subDetailElement.textContent = `     - ${subDetail.detail_name}: ${subDetail.detail_description}`;
                        linesOfBusinessElement.appendChild(subDetailElement);
                    });
                }
            });
        }
    
        // Display other notable business lines if they exist
        if (parsedData.other_notable_business_lines && parsedData.other_notable_business_lines.length > 0) {
            const otherLinesTitle = document.createElement('h3');
            otherLinesTitle.textContent = 'Other Notable Business Lines:';
            linesOfBusinessElement.appendChild(otherLinesTitle);
        
            parsedData.other_notable_business_lines.forEach((line) => {
                const otherLineElement = document.createElement('p');
                otherLineElement.textContent = `     - ${line}`;
                linesOfBusinessElement.appendChild(otherLineElement);
            });
        }
    }
    
    
    
    
    

    function displayBannerBrands(bannerBrandsData) {
        const bannerBrandsElement = document.getElementById('banner-brands');
        if (!bannerBrandsElement) {
            console.error('Banner brands element not found in the document.');
            return;
        }
    
        bannerBrandsElement.innerHTML = ''; // Clear existing content
    
        // Extract the key which contains the actual banner brands data
        const firebaseKey = Object.keys(bannerBrandsData)[0];
        const bannerData = JSON.parse(bannerBrandsData[firebaseKey]);
    
        const sectionTitle = document.createElement('h2');
        // Assuming 'company_name' is a direct property of the bannerData object
        sectionTitle.textContent = `${bannerData.company_name} Banner Brands:`;
        bannerBrandsElement.appendChild(sectionTitle);
    
        // Assuming 'banner_brands' is an array of objects with 'name' and 'description' properties
        if (Array.isArray(bannerData.banner_brands)) {
            bannerData.banner_brands.forEach((brand) => {
                const brandElement = document.createElement('p');
                brandElement.innerHTML = `<strong>${brand.name}:</strong> ${brand.description}`;
                bannerBrandsElement.appendChild(brandElement);
            });
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Banner brands data not found or incorrectly structured.';
            bannerBrandsElement.appendChild(errorMessage);
        }
    }
    
    

    function displayTargetMarket(sectionContent) {
        const targetMarketElement = document.getElementById('target-market');
        if (!targetMarketElement) {
            console.error('No element found with the ID "target-market".');
            return; 
        }
    
        targetMarketElement.innerHTML = ''; 
    
        // Extract the key which contains the actual target market data
        const firebaseKey = Object.keys(sectionContent)[0];
        const targetMarketData = JSON.parse(sectionContent[firebaseKey]);
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Target Market:';
        targetMarketElement.appendChild(sectionTitle);
    
        for (const [category, details] of Object.entries(targetMarketData)) {
            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category.replace(/_/g, ' ')
                                            .split(' ') 
                                            .map(word => word[0].toUpperCase() + word.slice(1))                
                                            .join(' '); 
            targetMarketElement.appendChild(categoryTitle);
    
            for (const [key, value] of Object.entries(details)) {
                if (value.toLowerCase() === 'n/a') {
                    continue; // Skip if the value is 'N/A'
                } 
    
                const detailHeading = document.createElement('strong');
                detailHeading.textContent = key.replace(/_/g, ' ')
                                               .split(' ')
                                               .map(word => word[0].toUpperCase() + word.slice(1))
                                               .join(' ') + ': '; 
                const detailText = document.createTextNode(value);
    
                const paragraph = document.createElement('p');
                paragraph.appendChild(detailHeading); 
                paragraph.appendChild(detailText);
                targetMarketElement.appendChild(paragraph); 
            }
        }
    }
    
    
    



    function displayRevenue(revenueSection) {
        const revenueElement = document.getElementById('revenue');
        if (!revenueElement) return;
    
        revenueElement.innerHTML = ''; // Clear previous content
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Revenue Information:';
        revenueElement.appendChild(sectionTitle);
    
        // Extract the key which contains the actual revenue data
        const firebaseKey = Object.keys(revenueSection)[0];
        let revenueData;
    
        // Handle both stringified JSON and direct object formats
        try {
            revenueData = typeof revenueSection[firebaseKey] === 'string' ? JSON.parse(revenueSection[firebaseKey]) : revenueSection[firebaseKey];
        } catch (error) {
            console.error('Error parsing revenue data:', error);
            // Display an error message if parsing fails
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error parsing revenue data.';
            revenueElement.appendChild(errorMessage);
            return;
        }
    
        // If 'revenue' is an object, iterate over its keys for year-specific data
        if (typeof revenueData === 'object' && !Array.isArray(revenueData) && revenueData.revenue === undefined) {
            Object.entries(revenueData).forEach(([year, amount]) => {
                const yearRevenueText = document.createElement('p');
                yearRevenueText.textContent = `${year} Revenue: ${amount}`;
                revenueElement.appendChild(yearRevenueText);
            });
        } else if (typeof revenueData === 'string' || revenueData.revenue) {
            // Handle 'revenue' as a general description string
            const overallRevenueText = document.createElement('p');
            overallRevenueText.textContent = typeof revenueData === 'string' ? revenueData : revenueData.revenue;
            revenueElement.appendChild(overallRevenueText);
        }
    
        // Display 'extra_information' if present
        if (revenueData.extra_information) {
            const extraInfoText = document.createElement('p');
            extraInfoText.textContent = revenueData.extra_information;
            revenueElement.appendChild(extraInfoText);
        }
    
        // Display an error message if no relevant data was found
        if (!revenueData || (typeof revenueData === 'object' && Object.keys(revenueData).length === 0 && !revenueData.extra_information)) {
            console.error('Revenue data is missing or not in expected format.');
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Revenue data is not available.';
            revenueElement.appendChild(errorMessage);
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    function displayFinancialPerformance(sectionContent) {
        const financialPerformanceElement = document.getElementById('financial-performance');
        if (!financialPerformanceElement) return;
    
        financialPerformanceElement.innerHTML = '';
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Financial Performance 2023:';
        financialPerformanceElement.appendChild(sectionTitle);
    
        // Extract the key which contains the actual financial performance data
        const firebaseKey = Object.keys(sectionContent)[0];
        const financialData = JSON.parse(sectionContent[firebaseKey]);
    
        // Display the description
        if (financialData.description) {
            const descriptionParagraph = document.createElement('p');
            descriptionParagraph.textContent = financialData.description;
            financialPerformanceElement.appendChild(descriptionParagraph);
        }
    
        // Display key highlights
        if (financialData.key_highlights && financialData.key_highlights.length > 0) {
            const highlightsTitle = document.createElement('h4');
            highlightsTitle.textContent = 'Key Highlights:';
            financialPerformanceElement.appendChild(highlightsTitle);
    
            const highlightsList = document.createElement('ul');
            financialData.key_highlights.forEach(highlight => {
                const listItem = document.createElement('li');
                listItem.textContent = highlight;
                highlightsList.appendChild(listItem);
            });
            financialPerformanceElement.appendChild(highlightsList);
        }
    
        // Display the summary
        if (financialData.summary) {
            const summaryTitle = document.createElement('h4');
            summaryTitle.textContent = 'Summary:';
            financialPerformanceElement.appendChild(summaryTitle);
    
            const summaryParagraph = document.createElement('p');
            summaryParagraph.textContent = financialData.summary;
            financialPerformanceElement.appendChild(summaryParagraph);
        }
    
        // Display the link to the full report
        if (financialData.link) {
            const sourceLink = document.createElement('a');
            sourceLink.href = financialData.link;
            sourceLink.textContent = 'Read the full report';
            sourceLink.target = '_blank';
            sourceLink.style.display = 'block'; // Source on a new line
            financialPerformanceElement.appendChild(sourceLink);
        } else {
            console.error('Financial performance link is missing.');
        }
    }
    
    
    
    
    
    
    
    
    
    
    

    function displayMarketCapitalization(sectionContent) {
        const marketCapElement = document.getElementById('market-capitalization');
        if (!marketCapElement) return;
    
        marketCapElement.innerHTML = '';
    
        // Extract the key which contains the actual market capitalization data
        const firebaseKey = Object.keys(sectionContent)[0];
        const marketCapData = JSON.parse(sectionContent[firebaseKey]);
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Market Capitalization:';
        marketCapElement.appendChild(sectionTitle);
    
        // Use the 'description' property to display the market capitalization
        if (marketCapData.description) {
            const paragraph = document.createElement('p');
            paragraph.textContent = marketCapData.description;
            marketCapElement.appendChild(paragraph);
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Market capitalization information is missing.';
            marketCapElement.appendChild(errorMessage);
        }
    }
    
    
    
    
    
    
    

    function displayCompanyOwner(sectionContent) {
        const companyOwnerElement = document.getElementById('company-owner');
        if (!companyOwnerElement) return;
    
        companyOwnerElement.innerHTML = '';
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Ownership Structure:';
        companyOwnerElement.appendChild(sectionTitle);
    
        // Extract the key which contains the actual ownership data
        const firebaseKey = Object.keys(sectionContent)[0];
        const ownerData = JSON.parse(sectionContent[firebaseKey]);
    
        // Display the ownership structure
        if (ownerData.ownership_structure) {
            const structureParagraph = document.createElement('p');
            structureParagraph.innerHTML = ownerData.ownership_structure;
            companyOwnerElement.appendChild(structureParagraph);
        }
    
        // Display major shareholders
        if (ownerData.major_shareholders) {
            const shareholdersTitle = document.createElement('h4');
            shareholdersTitle.textContent = 'Major Shareholders:';
            companyOwnerElement.appendChild(shareholdersTitle);
    
            const shareholdersList = document.createElement('ul');
            ownerData.major_shareholders.forEach(({ shareholder, ownership_percentage }) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${shareholder}: ${ownership_percentage}`;
                shareholdersList.appendChild(listItem);
            });
            companyOwnerElement.appendChild(shareholdersList);
        }
    
        // Display summary
        if (ownerData.summary) {
            const summaryTitle = document.createElement('h4');
            summaryTitle.textContent = 'Summary:';
            companyOwnerElement.appendChild(summaryTitle);
    
            const summaryParagraph = document.createElement('p');
            summaryParagraph.textContent = ownerData.summary;
            companyOwnerElement.appendChild(summaryParagraph);
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No ownership information found.';
            companyOwnerElement.appendChild(errorMessage);
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    function displayFoundingStory(sectionContent) {
        const foundingStoryElement = document.getElementById('founding-story'); // Ensure this container exists in your HTML
        if (!foundingStoryElement) {
            console.error('Founding story element not found in the document.');
            return;
        }
    
        foundingStoryElement.innerHTML = ''; // Clear previous content
    
        // Extract the Firebase key and associated data
        const firebaseKey = Object.keys(sectionContent)[0];
        const foundingStoryData = JSON.parse(sectionContent[firebaseKey]);
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Founding Story:';
        foundingStoryElement.appendChild(sectionTitle);
    
        // Use the 'description' property from the foundingStoryData object
        if (foundingStoryData.description) {
            // Consider the description as a single paragraph or split into multiple paragraphs if necessary
            const paragraphs = foundingStoryData.description.split('\n\n').filter(Boolean); // Split by double newlines to get paragraphs, if formatted that way
    
            paragraphs.forEach(paragraphText => {
                const paragraph = document.createElement('p');
                paragraph.textContent = paragraphText.trim();
                foundingStoryElement.appendChild(paragraph);
            });
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No founding story data found.';
            foundingStoryElement.appendChild(errorMessage);
        }
    }
    
    
    
    

    function displayKeyPointsOfDifference(sectionContent) {
        const keyPointsElement = document.getElementById('key-points-of-difference');
        if (!keyPointsElement) {
            console.error('Key Points of Difference element not found in the document.');
            return;
        }
    
        keyPointsElement.innerHTML = ''; // Clear existing content
    
        // Extract the Firebase key and associated data
        const firebaseKey = Object.keys(sectionContent)[0];
        const keyPointsData = JSON.parse(sectionContent[firebaseKey]);
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Key Points of Difference:';
        keyPointsElement.appendChild(sectionTitle);
    
        // Display the description if it exists
        if (keyPointsData.description) {
            const descriptionParagraph = document.createElement('p');
            descriptionParagraph.textContent = keyPointsData.description;
            keyPointsElement.appendChild(descriptionParagraph);
        }
    
        // Display points of difference if they exist
        if (keyPointsData.points_of_difference && Array.isArray(keyPointsData.points_of_difference)) {
            const pointsList = document.createElement('ul');
            keyPointsData.points_of_difference.forEach(point => {
                const pointItem = document.createElement('li');
                pointItem.textContent = point;
                pointsList.appendChild(pointItem);
            });
            keyPointsElement.appendChild(pointsList);
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No key points of difference data found.';
            keyPointsElement.appendChild(errorMessage);
        }
    }
    
    
    

    function displayTopStrategicInitiatives(sectionContent) {
        const strategicInitiativesElement = document.getElementById('top-strategic-initiatives');
        if (!strategicInitiativesElement) {
            console.error('Top Strategic Initiatives element not found in the document.');
            return;
        }
    
        strategicInitiativesElement.innerHTML = ''; // Clear existing content
    
        // Extract the Firebase key and associated data
        const firebaseKey = Object.keys(sectionContent)[0];
        let initiativesData;
    
        try {
            initiativesData = JSON.parse(sectionContent[firebaseKey]);
        } catch (error) {
            console.error('Error parsing initiatives data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Strategic initiatives data is not available due to a parsing error.';
            strategicInitiativesElement.appendChild(errorMessage);
            return;
        }
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Top Strategic Initiatives:';
        strategicInitiativesElement.appendChild(sectionTitle);
    
        // Validate and iterate over the initiatives array
        if (initiativesData.initiatives && Array.isArray(initiativesData.initiatives)) {
            initiativesData.initiatives.forEach((initiative, index) => {
                const initiativeElement = document.createElement('div');
                initiativeElement.classList.add('initiative');
    
                // Check if the initiative has a detailed structure
                if (initiative.initiative && initiative.description) {
                    const initiativeTitle = document.createElement('h3');
                    initiativeTitle.textContent = `${initiative.initiative}`;
                    initiativeElement.appendChild(initiativeTitle);
    
                    const initiativeDescription = document.createElement('p');
                    initiativeDescription.textContent = initiative.description;
                    initiativeElement.appendChild(initiativeDescription);
    
                    if (initiative.source) {
                        const initiativeSource = document.createElement('a');
                        initiativeSource.href = initiative.source;
                        initiativeSource.textContent = 'Learn more';
                        initiativeSource.target = '_blank';
                        initiativeElement.appendChild(initiativeSource);
                    }
                } else {
                    // Handle as plain text if the detailed structure is not present
                    const initiativeDescription = document.createElement('p');
                    initiativeDescription.textContent = `Initiative ${index + 1}: ${initiative}`;
                    initiativeElement.appendChild(initiativeDescription);
                }
    
                strategicInitiativesElement.appendChild(initiativeElement);
            });
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No strategic initiatives data found.';
            strategicInitiativesElement.appendChild(errorMessage);
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    function displayWorriesRisksConcerns(data) {
        const worriesRisksConcernsElement = document.getElementById('worries-risks-concerns');
        if (!worriesRisksConcernsElement) {
            console.error('Worries, Risks, and Concerns element not found in the document.');
            return;
        }
    
        // Clear any existing content
        worriesRisksConcernsElement.innerHTML = '';
    
        // Extract the key which contains the actual worries, risks, and concerns data
        // The JSON.parse is used here assuming that the data from Firebase comes as a JSON string
        const firebaseKey = Object.keys(data)[0];
        const worriesData = JSON.parse(data[firebaseKey]);
    
        // Create and append the section title
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = worriesData.title || 'Worries, Risks, and Concerns';
        worriesRisksConcernsElement.appendChild(sectionTitle);
    
        // Display each worry, risk, and concern
        if (worriesData.risks && worriesData.risks.length > 0) {
            worriesData.risks.forEach(risk => {
                const riskElement = document.createElement('p');
                riskElement.textContent = risk;
                worriesRisksConcernsElement.appendChild(riskElement);
            });
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No worries, risks, and concerns data found.';
            worriesRisksConcernsElement.appendChild(errorMessage);
        }
    
        // Display hyperlinks if available
        if (worriesData.hyperlinks && worriesData.hyperlinks.length > 0) {
            worriesData.hyperlinks.forEach((link, index) => {
                const linkElement = document.createElement('a');
                linkElement.href = link;
                linkElement.textContent = `Source ${index + 1}`;
                linkElement.target = '_blank';
                worriesRisksConcernsElement.appendChild(linkElement);
                worriesRisksConcernsElement.appendChild(document.createElement('br')); // New line for each link
            });
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    function displayMainCompetitors(competitorsData, retailerProfile) {
        const mainCompetitorsElement = document.getElementById('main-competitors');
        if (!mainCompetitorsElement) {
            console.error('Main competitors element not found in the document.');
            return;
        }
        mainCompetitorsElement.innerHTML = '';
    
        // Assuming there is only one key under which the competitors are nested
        const firebaseKey = Object.keys(competitorsData)[0];
        let competitorsArray;
    
        // Check if the data is a string and parse it into an object
        if (typeof competitorsData[firebaseKey] === 'string') {
            try {
                const parsedData = JSON.parse(competitorsData[firebaseKey]);
                competitorsArray = parsedData.competitors;
            } catch (e) {
                console.error('An error occurred while parsing competitors data:', e);
                mainCompetitorsElement.textContent = 'Competitors data could not be parsed.';
                return;
            }
        } else {
            competitorsArray = competitorsData[firebaseKey].competitors;
        }
    
        if (!Array.isArray(competitorsArray)) {
            console.error('Competitors data is not in array format.', competitorsArray);
            mainCompetitorsElement.textContent = 'Main competitors data is not available or incorrectly structured.';
            return;
        }
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Main Competitors'; // Title changed here
        mainCompetitorsElement.appendChild(sectionTitle);
    
        competitorsArray.forEach(competitor => {
            const competitorElement = document.createElement('p');
            competitorElement.textContent = competitor;
            mainCompetitorsElement.appendChild(competitorElement);
        });
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    function displaySWOTAnalysis(swotData) {
        const swotAnalysisElement = document.getElementById('swot-analysis');
        
        if (!swotAnalysisElement) {
            console.error('SWOT analysis element not found in the document.');
            return;
        }
        
        try {
            swotAnalysisElement.innerHTML = '';
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = 'SWOT Analysis:';
            swotAnalysisElement.appendChild(sectionTitle);
            
            const firstKey = Object.keys(swotData)[0];
            // Check if the nested SWOT data is a string and parse it
            const swotItems = typeof swotData[firstKey] === 'string' ? JSON.parse(swotData[firstKey]) : swotData[firstKey];
            console.log('Is swotItems an object:', typeof swotItems === 'object' && swotItems !== null);
            
            if (typeof swotItems === 'object' && swotItems !== null) {
                ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'].forEach((category) => {
                    const categoryData = swotItems[category];
                    
                    if (categoryData && typeof categoryData === 'object') {
                        const categoryTitle = document.createElement('h3');
                        categoryTitle.textContent = category;
                        swotAnalysisElement.appendChild(categoryTitle);
                        
                        const categoryDescription = document.createElement('p');
                        categoryDescription.textContent = categoryData.description;
                        swotAnalysisElement.appendChild(categoryDescription);
                        
                        if (categoryData.link) {
                            const categoryLink = document.createElement('a');
                            categoryLink.href = categoryData.link;
                            categoryLink.textContent = 'Learn more';
                            categoryLink.target = '_blank';
                            swotAnalysisElement.appendChild(categoryLink);
                        }
                    } else {
                        console.error(`Expected an object for category ${category}, but got:`, categoryData);
                    }
                });
            } else {
                console.error('SWOT items are not in object format or the key is incorrect', swotItems);
            }
        } catch (error) {
            console.error('An error occurred while displaying SWOT analysis:', error);
            // Handle the error for the user here, perhaps show a message or a default state
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    function displayStoreDesignImages(imagesData) {
        console.log('displayStoreDesignImages called with:', imagesData);
        const storeDesignImagesElement = document.getElementById('store-design-images');
        if (!storeDesignImagesElement) {
            console.error('Store design images element not found in the document.');
            return;
        }
    
        try {
            storeDesignImagesElement.innerHTML = '';
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = 'Store Design Images:';
            storeDesignImagesElement.appendChild(sectionTitle);
    
            // Assuming there's only one key in the imagesData object, which is common with Firebase keys
            const firstKey = Object.keys(imagesData)[0];
            // Parse the stringified JSON object if it's a string
            const imagesArray = typeof imagesData[firstKey] === 'string' ? 
                                 JSON.parse(imagesData[firstKey]).images : 
                                 imagesData[firstKey].images;
            console.log('Is imagesArray an array:', Array.isArray(imagesArray));
    
            if (Array.isArray(imagesArray)) {
                imagesArray.forEach((imageUrl, index) => {
                    const imageLink = document.createElement('a');
                    imageLink.href = imageUrl;
                    imageLink.textContent = `Image ${index + 1}`;
                    imageLink.target = '_blank';
                    storeDesignImagesElement.appendChild(imageLink);
                    storeDesignImagesElement.appendChild(document.createElement('br')); // New line for each link
                    console.log(`Appended image link ${index} to the DOM`);
                });
            } else {
                console.error('Images data is not in array format or the key is incorrect.', imagesArray);
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'No store design images data available.';
                storeDesignImagesElement.appendChild(errorMessage);
            }
        } catch (error) {
            console.error('An error occurred while displaying store design images:', error);
            // Here, implement error handling for the user, perhaps show a message or a default state
        }
    }
    
    
    
    
    
    
    

    function displayStoreDesignAgency(data) {
        console.log('displayStoreDesignAgency called with:', data);
        const storeDesignAgencyElement = document.getElementById('store-design-agency');
        if (!storeDesignAgencyElement) {
            console.error('Store design agency element not found in the document.');
            return;
        }
    
        try {
            // Clear existing content
            storeDesignAgencyElement.innerHTML = '';
    
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = 'Store Design Agency:';
            storeDesignAgencyElement.appendChild(sectionTitle);
    
            // Assuming the first key in the object is the correct one and contains a stringified JSON
            const firstKey = Object.keys(data)[0];
            console.log('First key found:', firstKey);
    
            // Check if the corresponding value is a string and parse it to JSON
            let agencyData = data[firstKey];
            if (typeof agencyData === 'string') {
                console.log('Agency data is a string. Attempting to parse JSON.');
                agencyData = JSON.parse(agencyData);
            }
    
            // Log the parsed agency data
            console.log('Parsed agency data:', agencyData);
    
            // Check if agencyData is defined and has the properties we expect
            if (agencyData && agencyData.description && agencyData.website) {
                const descriptionParagraph = document.createElement('p');
                descriptionParagraph.textContent = agencyData.description;
                storeDesignAgencyElement.appendChild(descriptionParagraph);
    
                const websiteLink = document.createElement('a');
                websiteLink.href = agencyData.website;
                websiteLink.textContent = 'Learn more';
                websiteLink.target = '_blank';
                storeDesignAgencyElement.appendChild(websiteLink);
    
                console.log('Store Design Agency content appended to the DOM');
            } else {
                console.error('Agency data is not in the expected format:', agencyData);
                // Consider adding a fallback message here
            }
        } catch (error) {
            console.error('An error occurred while displaying the store design agency:', error);
            // Handle the error for the user here, perhaps show a message or a default state
        }
    }
    
    
    
    function displayRecentCompanyNews(recentNewsSection) {
        console.log('displayRecentCompanyNews called with:', recentNewsSection);
        const companyNewsElement = document.getElementById('recent-company-news');
        
        if (!companyNewsElement) {
            console.error('Recent company news element not found in the document.');
            return;
        }
        
        try {
            companyNewsElement.innerHTML = '';
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = 'Recent Company News:';
            companyNewsElement.appendChild(sectionTitle);
            
            const firstKey = Object.keys(recentNewsSection)[0];
            // Parse the stringified JSON object
            const newsItems = JSON.parse(recentNewsSection[firstKey]).news_items;
            console.log('Is newsItems an array:', Array.isArray(newsItems));
            console.log('newsItems:', newsItems);
    
            if (Array.isArray(newsItems)) {
                newsItems.forEach((newsItem, index) => {
                    console.log(`Processing news item ${index}:`, newsItem);
                    const newsSummary = document.createElement('p');
                    newsSummary.textContent = newsItem.description;
                    companyNewsElement.appendChild(newsSummary);
                    
                    if (newsItem.url) {
                        const newsLink = document.createElement('a');
                        newsLink.href = newsItem.url;
                        newsLink.textContent = 'Learn more';
                        newsLink.target = '_blank';
                        companyNewsElement.appendChild(newsLink);
                    }
                    
                    const separator = document.createElement('hr');
                    companyNewsElement.appendChild(separator);
                    console.log(`Appended news item ${index} to the DOM`);
                });
            } else {
                console.error('News items are not in array format or the key is incorrect.', newsItems);
            }
        } catch (error) {
            console.error('An error occurred while displaying recent company news:', error);
            // Handle the error for the user here, perhaps show a message or a default state
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

        

    function displayRecentExecutiveMoves(recentExecutiveMovesSection) {
        console.log('displayRecentExecutiveMoves called with:', recentExecutiveMovesSection); // Log the input data
        const recentMovesElement = document.getElementById('recent-executive-moves');
        if (!recentMovesElement) {
            console.error('Recent executive moves element not found in the document.');
            return;
        }
        console.log('Recent moves element found:', recentMovesElement); // Log the found element
    
        recentMovesElement.innerHTML = '';
    
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Recent Executive Moves:';
        recentMovesElement.appendChild(sectionTitle);
        
        try {
            // Assuming there's only one key in the object, you should confirm this is always the case.
            const firstKey = Object.keys(recentExecutiveMovesSection)[0];
            // Parse the stringified JSON object
            const movesItems = JSON.parse(recentExecutiveMovesSection[firstKey]).moves_items;
            console.log('Is movesItems an array:', Array.isArray(movesItems));
            console.log('movesItems:', movesItems);
    
            if (Array.isArray(movesItems)) {
                movesItems.forEach((move, index) => {
                    console.log(`Processing move item ${index}:`, move);
                    const moveEntry = document.createElement('div');
                    moveEntry.classList.add('move-entry');
    
                    const moveDescription = document.createElement('p');
                    moveDescription.textContent = move.description;
                    moveEntry.appendChild(moveDescription);
                    
                    if (move.url) {
                        const readMoreLink = document.createElement('a');
                        readMoreLink.href = move.url;
                        readMoreLink.textContent = 'Learn more';
                        readMoreLink.target = '_blank';
                        moveEntry.appendChild(readMoreLink);
                    }
                    
                    recentMovesElement.appendChild(moveEntry);
    
                    const separator = document.createElement('hr');
                    recentMovesElement.appendChild(separator);
                    console.log(`Appended moves item ${index} to the DOM`);
                });
            } else {
                console.error('Moves items are not in array format or the key is incorrect.', movesItems);
                // Consider some fallback or error display here.
            }
        } catch (error) {
            console.error('An error occurred while displaying recent executive moves:', error);
            // Handle the error for the user here, perhaps show a message or a default state
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    

    function displayReport(reportData) {
        console.log('displayReport called with:', reportData); // Log the input data
    
        if (!reportData) {
            console.error('No report data provided to displayReport function.');
            return;
        }

  
         displayLegalCompanyName(reportData.sections.legal_company_name);
 
   displayHeadquarters(reportData.sections.headquarters);

 
  displayYearIncorporated(reportData.sections.year_incorporated);

 
   displayBriefSynopsis(reportData.sections.brief_synopsis);
    
     displayLinesOfBusiness(reportData.sections.lines_of_business);
        displayBannerBrands(reportData.sections.banner_brands);
        displayTargetMarket(reportData.sections.target_market);
       displayRevenue(reportData.sections.revenue);
       displayFinancialPerformance(reportData.sections.financial_performance_2023);
   displayMarketCapitalization(reportData.sections.market_capitalization);
       displayCompanyOwner(reportData.sections.company_owner);
        displayFoundingStory(reportData.sections.founding_story);
        displayKeyPointsOfDifference(reportData.sections.key_points_of_difference);
      displayTopStrategicInitiatives(reportData.sections.top_5_strategic_initiatives);
    displayWorriesRisksConcerns(reportData.sections.worries_risks_and_concerns);
 
    displayMainCompetitors(reportData.sections.main_competitors);
        displaySWOTAnalysis(reportData.sections.swot_analysis);
        displayStoreDesignImages(reportData.sections.store_design_images);
        displayStoreDesignAgency(reportData.sections.design_agency);

        
        console.log('Displaying recent company news with data:', reportData.sections.recent_news); // Log the data for company news
      displayRecentCompanyNews(reportData.sections.recent_news);
    
        console.log('Displaying recent executive moves with data:', reportData.sections.recent_executive_moves); // Log the data for executive moves
        displayRecentExecutiveMoves(reportData.sections.recent_executive_moves);
    }
    


   
    
    
    

    
    // Function to handle user interactions after the initial report is generated
    function interactWithUser(message) {
        fetch('/interact', {
            method: 'POST',
            body: JSON.stringify({
                company: companyName,
                question: message,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);  // Log for debugging
            if (data.answer) {
                // Format and display the answer as needed
                addMessageToChat('ai', data.answer);
            } else {
                console.error('Answer is missing in the response.');
                addMessageToChat('ai', 'The response from the server did not include an answer.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessageToChat('ai', 'An error occurred while fetching the response.');
        })
        .finally(() => {
            chatSubmitButton.disabled = false;  // Re-enable the submit button after each interaction
        });
    }
    

});
